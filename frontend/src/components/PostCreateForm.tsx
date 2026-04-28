import type { FormEvent } from "react";

export type PostCreateFormState = {
  apiKey: string;
  title: string;
  author: string;
  content: string;
};

type PostCreateFormProps = {
  form: PostCreateFormState;
  canSubmit: boolean;
  isSubmitting: boolean;
  onChange: (field: keyof PostCreateFormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

function PostCreateForm({ form, canSubmit, isSubmitting, onChange, onSubmit }: PostCreateFormProps) {
  return (
    <form className="post-form" onSubmit={onSubmit}>
      <label className="field">
        <span>API 키</span>
        <input
          type="password"
          value={form.apiKey}
          onChange={(event) => onChange("apiKey", event.target.value)}
          placeholder="Authorization: Bearer API_KEY"
          autoComplete="off"
        />
      </label>

      <div className="form-grid">
        <label className="field">
          <span>제목</span>
          <input
            type="text"
            value={form.title}
            onChange={(event) => onChange("title", event.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={255}
          />
        </label>

        <label className="field">
          <span>작성자</span>
          <input
            type="text"
            value={form.author}
            onChange={(event) => onChange("author", event.target.value)}
            placeholder="작성자"
            maxLength={100}
          />
        </label>
      </div>

      <label className="field">
        <span>본문</span>
        <textarea
          value={form.content}
          onChange={(event) => onChange("content", event.target.value)}
          placeholder="본문을 입력하세요"
          rows={10}
        />
      </label>

      <div className="actions">
        <button type="submit" className="submit-button" disabled={!canSubmit}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M11 5h2v6h6v2h-6v6h-2v-6H5v-2h6V5Z" />
          </svg>
          {isSubmitting ? "등록 중" : "등록"}
        </button>
      </div>
    </form>
  );
}

export default PostCreateForm;
