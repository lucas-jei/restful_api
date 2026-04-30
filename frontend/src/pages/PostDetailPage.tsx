import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { issueAccessToken } from "../api/auth";
import { deletePost, downloadAttachment, getPost, updatePost } from "../api/posts";
import type { Post } from "../types/post";

const tokenStorageKey = "board_access_token";

function PostDetailPage() {
  const { postId = "" } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const getToken = async () => {
    const storedToken = sessionStorage.getItem(tokenStorageKey);
    if (storedToken) return storedToken;

    const issued = await issueAccessToken("");
    sessionStorage.setItem(tokenStorageKey, issued.access_token);
    return issued.access_token;
  };

  const loadPost = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const loadedPost = await getPost(await getToken(), postId);
      setPost(loadedPost);
      setTitle(loadedPost.title);
      setAuthor(loadedPost.author);
      setContent(loadedPost.content);
      setAttachment(null);
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "게시글을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const savePost = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const savedPost = await updatePost(
        await getToken(),
        postId,
        {
          title: title.trim(),
          author: author.trim(),
          content: content.trim(),
        },
        attachment,
      );

      setPost(savedPost);
      setAttachment(null);
      setIsEditing(false);
      setMessage("게시글이 수정되었습니다.");
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "게시글 수정에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const removePost = async () => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await deletePost(await getToken(), postId);
      navigate("/posts");
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "게시글 삭제에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const saveAttachment = async () => {
    if (!post?.attachment_filename) return;

    try {
      const blob = await downloadAttachment(await getToken(), post.id);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = post.attachment_filename;
      link.click();
      URL.revokeObjectURL(url);
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "첨부파일을 다운로드하지 못했습니다.");
    }
  };

  const cancelEdit = () => {
    if (post) {
      setTitle(post.title);
      setAuthor(post.author);
      setContent(post.content);
    }
    setAttachment(null);
    setIsEditing(false);
  };

  useEffect(() => {
    void loadPost();
  }, [postId]);

  useEffect(() => {
    document.title = post ? `${post.title} - 게시글 상세보기` : "게시글 상세보기";
  }, [post]);

  return (
    <main className="page-shell">
      <section className="board-page" aria-labelledby="detail-title">
        <div className="editor-header">
          <div>
            <p className="eyebrow">Board</p>
            <h1 id="detail-title">게시글 상세보기</h1>
          </div>
          <Link className="secondary-button" to="/posts">
            목록
          </Link>
        </div>

        {message && <p className="status success">{message}</p>}
        {error && <p className="status error">{error}</p>}

        {post && (
          <section className="content-card result-panel">
            {isEditing ? (
              <>
                <label className="field">
                  <span>제목</span>
                  <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={255} />
                </label>
                <label className="field">
                  <span>작성자</span>
                  <input value={author} onChange={(event) => setAuthor(event.target.value)} maxLength={100} />
                </label>
                <label className="field">
                  <span>본문</span>
                  <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={10} />
                </label>
                <label className="field">
                  <span>첨부파일</span>
                  <input type="file" onChange={(event) => setAttachment(event.target.files?.[0] ?? null)} />
                </label>
                {post.attachment_filename && !attachment && <p className="field-note">현재 첨부파일: {post.attachment_filename}</p>}
                {attachment && <p className="field-note">새 첨부파일: {attachment.name}</p>}
                <div className="actions compact">
                  <button className="secondary-button" type="button" onClick={cancelEdit}>
                    취소
                  </button>
                  <button className="submit-button" type="button" onClick={savePost} disabled={loading}>
                    저장
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="panel-header">
                  <div>
                    <p className="eyebrow">Detail</p>
                    <h2>{post.title}</h2>
                  </div>
                  <div className="actions compact">
                    <button className="secondary-button" type="button" onClick={() => setIsEditing(true)}>
                      수정
                    </button>
                    <button className="danger-button" type="button" onClick={removePost} disabled={loading}>
                      삭제
                    </button>
                  </div>
                </div>
                <p className="post-content">{post.content}</p>
                <dl>
                  <div>
                    <dt>ID</dt>
                    <dd>{post.id}</dd>
                  </div>
                  <div>
                    <dt>작성자</dt>
                    <dd>{post.author}</dd>
                  </div>
                  {post.attachment_filename && (
                    <div>
                      <dt>첨부파일</dt>
                      <dd>
                        <button className="file-link" type="button" onClick={saveAttachment}>
                          {post.attachment_filename}
                        </button>
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt>수정일</dt>
                    <dd>{new Date(post.updated_at).toLocaleString("ko-KR")}</dd>
                  </div>
                </dl>
              </>
            )}
          </section>
        )}
      </section>
    </main>
  );
}

export default PostDetailPage;
