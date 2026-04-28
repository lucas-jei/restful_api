import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import { issueAccessToken } from "../api/auth";
import { createPost } from "../api/posts";
import CreatedPostPanel from "../components/CreatedPostPanel";
import PostCreateForm, { type PostCreateFormState } from "../components/PostCreateForm";
import StatusMessage from "../components/StatusMessage";
import type { Post } from "../types/post";

const initialForm: PostCreateFormState = {
  apiKey: "",
  title: "",
  author: "",
  content: "",
};

function CreatePostPage() {
  const [form, setForm] = useState<PostCreateFormState>(initialForm);
  const [createdPost, setCreatedPost] = useState<Post | null>(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      form.apiKey.trim().length > 0 &&
      form.title.trim().length > 0 &&
      form.author.trim().length > 0 &&
      form.content.trim().length > 0 &&
      !isSubmitting
    );
  }, [form, isSubmitting]);

  const updateField = (field: keyof PostCreateFormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submitPost = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreatedPost(null);
    setStatusMessage("");
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      const { access_token } = await issueAccessToken(form.apiKey.trim());
      const post = await createPost(access_token, {
        title: form.title.trim(),
        author: form.author.trim(),
        content: form.content.trim(),
      });

      setCreatedPost(post);
      setStatusMessage("게시글이 등록되었습니다.");
      setForm((current) => ({
        ...current,
        title: "",
        content: "",
      }));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <section className="board-editor" aria-labelledby="page-title">
        <div className="editor-header">
          <div>
            <p className="eyebrow">Board</p>
            <h1 id="page-title">게시글 등록</h1>
          </div>
          <span className="api-chip">POST /posts</span>
        </div>

        <PostCreateForm
          form={form}
          canSubmit={canSubmit}
          isSubmitting={isSubmitting}
          onChange={updateField}
          onSubmit={submitPost}
        />

        {statusMessage && <StatusMessage type="success" message={statusMessage} />}
        {errorMessage && <StatusMessage type="error" message={errorMessage} />}
        {createdPost && <CreatedPostPanel post={createdPost} />}
      </section>
    </main>
  );
}

export default CreatePostPage;
