import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { issueAccessToken } from "../api/auth";
import { createPost } from "../api/posts";

const tokenStorageKey = "board_access_token";

function PostCreatePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [content, setContent] = useState("");
  const [attachment, setAttachment] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return title.trim() && author.trim() && content.trim() && !loading;
  }, [title, author, content, loading]);

  useEffect(() => {
    document.title = "게시글 새로 작성";
  }, []);

  const submitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      let accessToken = sessionStorage.getItem(tokenStorageKey) ?? "";

      if (!accessToken) {
        const issued = await issueAccessToken("");
        accessToken = issued.access_token;
        sessionStorage.setItem(tokenStorageKey, accessToken);
      }

      const post = await createPost(
        accessToken,
        {
          title: title.trim(),
          author: author.trim(),
          content: content.trim(),
        },
        attachment,
      );

      setMessage("게시글이 등록되었습니다.");
      navigate(`/posts/${post.id}`);
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "게시글 등록에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="board-page" aria-labelledby="create-title">
        <div className="editor-header">
          <div>
            <p className="eyebrow">Board</p>
            <h1 id="create-title">게시글 새로 작성</h1>
          </div>
          <Link className="secondary-button" to="/posts">
            목록
          </Link>
        </div>

        <form className="content-card post-form" onSubmit={submitPost}>
          <div className="form-grid">
            <label className="field">
              <span>제목</span>
              <input value={title} onChange={(event) => setTitle(event.target.value)} maxLength={255} />
            </label>
            <label className="field">
              <span>작성자</span>
              <input value={author} onChange={(event) => setAuthor(event.target.value)} maxLength={100} />
            </label>
          </div>
          <label className="field">
            <span>본문</span>
            <textarea value={content} onChange={(event) => setContent(event.target.value)} rows={10} />
          </label>
          <label className="field">
            <span>첨부파일</span>
            <input type="file" onChange={(event) => setAttachment(event.target.files?.[0] ?? null)} />
          </label>
          <div className="actions">
            <button className="submit-button" type="submit" disabled={!canSubmit}>
              등록
            </button>
          </div>
        </form>

        {message && <p className="status success">{message}</p>}
        {error && <p className="status error">{error}</p>}
      </section>
    </main>
  );
}

export default PostCreatePage;
