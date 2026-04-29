import { parseErrorMessage } from "./client";
import type { CreatePostPayload, Post, UpdatePostPayload } from "../types/post";

function authHeaders(accessToken: string) {
  return {
    Authorization: `Bearer ${accessToken}`,
  };
}

export async function listPosts(accessToken: string) {
  const response = await fetch("/api/posts", {
    headers: authHeaders(accessToken),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "게시글 목록을 불러오지 못했습니다."));
  }

  return (await response.json()) as Post[];
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

export async function createPost(accessToken: string, payload: CreatePostPayload) {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      ...authHeaders(accessToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "게시글 등록에 실패했습니다."));
  }

  return (await response.json()) as Post;
}

export async function updatePost(accessToken: string, postId: string, payload: UpdatePostPayload) {
  const response = await fetch(`/api/posts/${postId}`, {
    method: "PUT",
    headers: {
      ...authHeaders(accessToken),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "게시글 수정에 실패했습니다."));
  }

  return (await response.json()) as Post;
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
