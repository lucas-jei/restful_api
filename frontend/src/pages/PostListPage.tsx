import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { issueAccessToken } from "../api/auth";
import { listPosts } from "../api/posts";
import type { Post } from "../types/post";

const pageSize = 10;
const tokenStorageKey = "board_access_token";

function PostListPage() {
  const [accessToken, setAccessToken] = useState(() => sessionStorage.getItem(tokenStorageKey) ?? "");
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const loadPage = async (nextPage = page, token = accessToken) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      let activeToken = token;

      if (!activeToken) {
        const issued = await issueAccessToken("");
        activeToken = issued.access_token;
        setAccessToken(activeToken);
        sessionStorage.setItem(tokenStorageKey, activeToken);
      }

      const result = await listPosts(activeToken, nextPage, pageSize);
      setPosts(result.items);
      setPage(result.page);
      setTotalPages(result.total_pages);
      setTotalCount(result.total_count);
      setMessage("게시글 목록을 불러왔습니다.");
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "게시글 목록을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "게시글 목록";
    void loadPage(1);
  }, []);

  return (
    <main className="page-shell">
      <section className="board-page" aria-labelledby="posts-title">
        <div className="editor-header">
          <div>
            <p className="eyebrow">Board</p>
            <h1 id="posts-title">게시글 목록</h1>
          </div>
          <Link className="secondary-button" to="/posts/new">
            새 글 작성
          </Link>
        </div>

        <div className="list-actions">
          <button className="submit-button" type="button" onClick={() => loadPage(1)} disabled={loading}>
            조회
          </button>
        </div>

        {message && <p className="status success">{message}</p>}
        {error && <p className="status error">{error}</p>}

        <section className="content-card post-list-panel" aria-label="게시글 목록">
          <div className="panel-header">
            <h2>목록</h2>
            <p className="pagination-summary">
              총 {totalCount}개 / {totalPages}페이지
            </p>
          </div>
          <ul className="post-list">
            {posts.map((post) => (
              <li key={post.id}>
                <Link to={`/posts/${post.id}`}>
                  <strong>{post.title}</strong>
                  <span>{post.author}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="pagination">
            <button className="secondary-button" type="button" onClick={() => loadPage(page - 1)} disabled={loading || page <= 1}>
              이전
            </button>
            <span>
              {totalPages === 0 ? 0 : page} / {totalPages}
            </span>
            <button className="secondary-button" type="button" onClick={() => loadPage(page + 1)} disabled={loading || totalPages === 0 || page >= totalPages}>
              다음
            </button>
          </div>
        </section>
      </section>
    </main>
  );
}

export default PostListPage;
