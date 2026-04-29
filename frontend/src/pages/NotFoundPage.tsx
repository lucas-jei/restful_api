import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <main className="page-shell">
      <section className="empty-state" aria-labelledby="not-found-title">
        <p className="eyebrow">404</p>
        <h1 id="not-found-title">페이지를 찾을 수 없습니다</h1>
        <Link className="text-link" to="/posts/new">
          게시글 등록으로 이동
        </Link>
      </section>
    </main>
  );
}

export default NotFoundPage;
