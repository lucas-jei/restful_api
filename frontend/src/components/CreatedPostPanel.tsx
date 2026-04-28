import type { Post } from "../types/post";

type CreatedPostPanelProps = {
  post: Post;
};

function CreatedPostPanel({ post }: CreatedPostPanelProps) {
  return (
    <section className="result-panel" aria-labelledby="result-title">
      <div>
        <p className="eyebrow">Created</p>
        <h2 id="result-title">{post.title}</h2>
      </div>
      <dl>
        <div>
          <dt>ID</dt>
          <dd>{post.id}</dd>
        </div>
        <div>
          <dt>작성자</dt>
          <dd>{post.author}</dd>
        </div>
        <div>
          <dt>생성일</dt>
          <dd>{new Date(post.created_at).toLocaleString("ko-KR")}</dd>
        </div>
      </dl>
    </section>
  );
}

export default CreatedPostPanel;
