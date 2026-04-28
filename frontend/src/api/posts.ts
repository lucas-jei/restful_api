import { parseErrorMessage } from "./client";
import type { CreatePostPayload, Post } from "../types/post";

export async function createPost(accessToken: string, payload: CreatePostPayload) {
  const response = await fetch("/api/posts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "게시글 등록에 실패했습니다."));
  }

  return (await response.json()) as Post;
}
