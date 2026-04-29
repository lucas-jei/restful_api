import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { issueAccessToken } from "../api/auth";
import { createPost, deletePost, getPost, listPosts, updatePost } from "../api/posts";
import type { Post } from "../types/post";

type PostForm = {
  title: string;
  author: string;
  content: string;
};

const emptyForm: PostForm = {
  title: "",
  author: "",
  content: "",
};

function PostsPage() {
  const [apiKey, setApiKey] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState<PostForm>(emptyForm);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      accessToken.length > 0 &&
      form.title.trim().length > 0 &&
      form.author.trim().length > 0 &&
      form.content.trim().length > 0 &&
      !loading
    );
  }, [accessToken, form, loading]);

  const run = async (task: () => Promise<void>, successMessage?: string) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await task();
      if (successMessage) setMessage(successMessage);
    } catch (unknownError) {
      setError(unknownError instanceof Error ? unknownError.message : "요청 처리에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = async (token = accessToken) => {
    setPosts(await listPosts(token));
  };

  const connectApi = async () => {
    await run(async () => {
      const issued = await issueAccessToken(apiKey.trim());
      setAccessToken(issued.access_token);
      await refreshPosts(issued.access_token);
    }, "API 연결이 완료되었습니다.");
  };

  const submitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await run(async () => {
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        content: form.content.trim(),
      };
      const savedPost = editingId
        ? await updatePost(accessToken, editingId, payload)
        : await createPost(accessToken, payload);

      setSelectedPost(savedPost);
      setEditingId("");
      setForm(emptyForm);
      await refreshPosts();
    }, editingId ? "게시글을 수정했습니다." : "게시글을 등록했습니다.");
  };

  const selectPost = async (postId: string) => {
    await run(async () => {
      setSelectedPost(await getPost(accessToken, postId));
      setEditingId("");
    });
  };

  const startEdit = (post: Post) => {
    setSelectedPost(post);
    setEditingId(post.id);
    setForm({ title: post.title, author: post.author, content: post.content });
  };

  const removePost = async (postId: string) => {
    await run(async () => {
      await deletePost(accessToken, postId);
      if (selectedPost?.id === postId) setSelectedPost(null);
      if (editingId === postId) {
        setEditingId("");
        setForm(emptyForm);
      }
      await refreshPosts();
    }, "게시글을 삭제했습니다.");
  };

  return (
    <main className="page-shell">
      <section className="board-workspace" aria-labelledby="posts-title">
        <div className="editor-header">
          <div>
            <p className="eyebrow">Board</p>
            <h1 id="posts-title">게시글 관리</h1>
          </div>
          <span className="api-chip">/api/posts</span>
        </div>

        <div className="auth-bar">
          <label className="field">
            <span>API 키</span>
            <input
              type="password"
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
              placeholder="API_KEY"
              autoComplete="off"
            />
          </label>
          <button className="submit-button" type="button" onClick={connectApi} disabled={!apiKey || loading}>
            연결
          </button>
        </div>

        {message && <p className="status success">{message}</p>}
        {error && <p className="status error">{error}</p>}

        <div className="posts-layout">
          <form className="post-form" onSubmit={submitPost}>
            <div className="form-grid">
              <label className="field">
                <span>제목</span>
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  maxLength={255}
                />
              </label>
              <label className="field">
                <span>작성자</span>
                <input
                  value={form.author}
                  onChange={(event) => setForm((current) => ({ ...current, author: event.target.value }))}
                  maxLength={100}
                />
              </label>
            </div>
            <label className="field">
              <span>본문</span>
              <textarea
                value={form.content}
                onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
                rows={10}
              />
            </label>
            <div className="actions">
              {editingId && (
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => {
                    setEditingId("");
                    setForm(emptyForm);
                  }}
                >
                  취소
                </button>
              )}
              <button className="submit-button" type="submit" disabled={!canSubmit}>
                {editingId ? "수정" : "등록"}
              </button>
            </div>
          </form>

          <section className="post-list-panel" aria-label="게시글 목록">
            <div className="panel-header">
              <h2>목록</h2>
              <button className="secondary-button" type="button" onClick={() => run(() => refreshPosts())} disabled={!accessToken || loading}>
                새로고침
              </button>
            </div>
            <ul className="post-list">
              {posts.map((post) => (
                <li key={post.id}>
                  <button type="button" onClick={() => selectPost(post.id)}>
                    <strong>{post.title}</strong>
                    <span>{post.author}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {selectedPost && (
          <section className="result-panel" aria-labelledby="selected-post-title">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Detail</p>
                <h2 id="selected-post-title">{selectedPost.title}</h2>
              </div>
              <div className="actions compact">
                <button className="secondary-button" type="button" onClick={() => startEdit(selectedPost)}>
                  수정
                </button>
                <button className="danger-button" type="button" onClick={() => removePost(selectedPost.id)}>
                  삭제
                </button>
              </div>
            </div>
            <p className="post-content">{selectedPost.content}</p>
            <dl>
              <div>
                <dt>ID</dt>
                <dd>{selectedPost.id}</dd>
              </div>
              <div>
                <dt>작성자</dt>
                <dd>{selectedPost.author}</dd>
              </div>
              <div>
                <dt>수정일</dt>
                <dd>{new Date(selectedPost.updated_at).toLocaleString("ko-KR")}</dd>
              </div>
            </dl>
          </section>
        )}
      </section>
    </main>
  );
}

export default PostsPage;
