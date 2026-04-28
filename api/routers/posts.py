from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session

from database import get_db
from dependencies.auth import verify_access_token
from models import Post
from schemas import PostCreate, PostRead, PostUpdate


router = APIRouter(prefix="/posts", tags=["posts"], dependencies=[Depends(verify_access_token)])


@router.post("", response_model=PostRead, status_code=status.HTTP_201_CREATED)
def create_post(payload: PostCreate, db: Session = Depends(get_db)) -> Post:
    post = Post(title=payload.title, content=payload.content, author=payload.author)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.get("", response_model=list[PostRead])
def list_posts(db: Session = Depends(get_db)) -> list[Post]:
    return db.query(Post).order_by(Post.created_at.desc()).all()


@router.get("/{post_id}", response_model=PostRead)
def get_post(post_id: str, db: Session = Depends(get_db)) -> Post:
    post = db.get(Post, post_id)

    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

    return post


@router.put("/{post_id}", response_model=PostRead)
def update_post(post_id: str, payload: PostUpdate, db: Session = Depends(get_db)) -> Post:
    post = db.get(Post, post_id)

    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

    post.title = payload.title
    post.content = payload.content
    post.author = payload.author
    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_post(post_id: str, db: Session = Depends(get_db)) -> Response:
    post = db.get(Post, post_id)

    if post is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Post not found.")

    db.delete(post)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)
