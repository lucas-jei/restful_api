export type Post = {
  id: string;
  title: string;
  content: string;
  author: string;
  attachment_filename: string | null;
  attachment_content_type: string | null;
  created_at: string;
  updated_at: string;
};

export type CreatePostPayload = {
  title: string;
  author: string;
  content: string;
};

export type UpdatePostPayload = CreatePostPayload;

export type PostPage = {
  items: Post[];
  total_count: number;
  total_pages: number;
  page: number;
  size: number;
};
