import { parseErrorMessage } from "./client";
import type { CreatePostPayload, Post, PostPage, UpdatePostPayload } from "../types/post";

function authHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

function postFormData(payload: CreatePostPayload, attachment?: File | null) {
  const formData = new FormData();
  formData.set("title", payload.title);
  formData.set("author", payload.author);
  formData.set("content", payload.content);
  if (attachment) {
    formData.set("attachment", attachment);
  }
  return formData;
}

export async function listPosts(accessToken: string, page = 1, size = 10) {
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const response = await fetch(`/api/posts?${params.toString()}`, {
    headers: authHeaders(accessToken),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "게시글 목록을 불러오지 못했습니다."));
  }

  return (await response.json()) as PostPage;
}

export async function getPost(accessToken: string, postId: string) {
  const response = await fetch(`/api/posts/${postId}`, {
    headers: authHeaders(accessToken),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "게시글을 불러오지 못했습니다."));
  }

  return (await response.json()) as Post;
}

export async function createPost(accessToken: string, payload: CreatePostPayload, attachment?: File | null) {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: authHeaders(accessToken),
    body: postFormData(payload, attachment),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "게시글 등록에 실패했습니다."));
  }

  return (await response.json()) as Post;
}

export async function updatePost(accessToken: string, postId: string, payload: UpdatePostPayload, attachment?: File | null) {
  const response = await fetch(`/api/posts/${postId}`, {
    method: "PUT",
    headers: authHeaders(accessToken),
    body: postFormData(payload, attachment),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "게시글 수정에 실패했습니다."));
  }

  return (await response.json()) as Post;
}

export async function downloadAttachment(accessToken: string, postId: string) {
  const response = await fetch(`/api/posts/${postId}/attachment`, {
    headers: authHeaders(accessToken),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "첨부파일을 다운로드하지 못했습니다."));
  }

  return response.blob();
}

export async function deletePost(accessToken: string, postId: string) {
  const response = await fetch(`/api/posts/${postId}`, {
    method: "DELETE",
    headers: authHeaders(accessToken),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "게시글 삭제에 실패했습니다."));
  }
}
