export type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  created_at: string;
  updated_at: string;
};

export type CreatePostPayload = {
  title: string;
  author: string;
  content: string;
};

export type UpdatePostPayload = CreatePostPayload;
