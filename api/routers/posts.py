from math import ceil
from pathlib import Path
from urllib.parse import quote
from uuid import uuid4

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Response, UploadFile, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies.auth import verify_access_token
from models import Post
from schemas import PostPage, PostRead


router = APIRouter(prefix="/posts", tags=["posts"], dependencies=[Depends(verify_access_token)])
UPLOAD_DIR = Path(__file__).resolve().parents[1] / "uploads"


def require_text(value: str, name: str, max_length: int | None = None) -> str:
    stripped = value.strip()
    if not stripped:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"{name} must not be blank.")
    if max_length is not None and len(stripped) > max_length:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"{name} is too long.")
    return stripped


def get_attachment_path(post: Post) -> Path | None:
    if not post.attachment_path:
        return None

    path = (UPLOAD_DIR / post.attachment_path).resolve()
    if not path.is_relative_to(UPLOAD_DIR.resolve()):
        return None

    return path


def delete_attachment_file(post: Post) -> None:
    path = get_attachment_path(post)
    if path and path.exists():
        path.unlink()


async def save_attachment_file(post: Post, attachment: UploadFile) -> None:
    if not attachment.filename:
        return

    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
    safe_name = Path(attachment.filename).name
    stored_name = f"{post.id}-{uuid4().hex}-{safe_name}"
    target_path = (UPLOAD_DIR / stored_name).resolve()

    if not target_path.is_relative_to(UPLOAD_DIR.resolve()):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid attachment filename.")

    size = 0
    with target_path.open("wb") as file:
        while chunk := await attachment.read(1024 * 1024):
            size += len(chunk)
            file.write(chunk)

    if size == 0:
        target_path.unlink(missing_ok=True)
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Attachment is empty.")

    delete_attachment_file(post)
    post.attachment_filename = safe_name
    post.attachment_content_type = attachment.content_type or "application/octet-stream"
    post.attachment_path = stored_name


@router.post("", response_model=PostRead, status_code=status.HTTP_201_CREATED)
async def create_post(
    title: str = Form(...),
    content: str = Form(...),
    author: str = Form(...),
    attachment: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
) -> Post:
    post = Post(
        title=require_text(title, "title", 255),
        content=require_text(content, "content"),
        author=require_text(author, "author", 100),
    )
    db.add(post)
    db.flush()

    if attachment is not None:
        await save_attachment_file(post, attachment)

    db.commit()
    db.refresh(post)
    return post


@router.get("/{post_id}/attachment")
def download_attachment(post_id: str, db: Session = Depends(get_db)) -> Response:
    post = db.get(Post, post_id)

    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

    path = get_attachment_path(post)
    if not post.attachment_filename or path is None or not path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Attachment not found.")

    encoded_filename = quote(post.attachment_filename)
    return Response(
        content=path.read_bytes(),
        media_type=post.attachment_content_type or "application/octet-stream",
        headers={"Content-Disposition": f"attachment; filename*=UTF-8''{encoded_filename}"},
    )


@router.get("", response_model=PostPage)
def list_posts(
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
) -> PostPage:
    query = db.query(Post)
    total_count = query.count()
    total_pages = ceil(total_count / size) if total_count else 0
    items = (
        query.order_by(Post.created_at.desc())
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

    return PostPage(
        items=items,
        total_count=total_count,
        total_pages=total_pages,
        page=page,
        size=size,
    )


@router.get("/{post_id}", response_model=PostRead)
def get_post(post_id: str, db: Session = Depends(get_db)) -> Post:
    post = db.get(Post, post_id)

    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

    return post


@router.put("/{post_id}", response_model=PostRead)
async def update_post(
    post_id: str,
    title: str = Form(...),
    content: str = Form(...),
    author: str = Form(...),
    attachment: UploadFile | None = File(default=None),
    db: Session = Depends(get_db),
) -> Post:
    post = db.get(Post, post_id)

    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

    post.title = require_text(title, "title", 255)
    post.content = require_text(content, "content")
    post.author = require_text(author, "author", 100)

    if attachment is not None:
        await save_attachment_file(post, attachment)

    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: str, db: Session = Depends(get_db)) -> Response:
    post = db.get(Post, post_id)

    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

    delete_attachment_file(post)
    db.delete(post)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
