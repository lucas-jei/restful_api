import { parseErrorMessage } from "./client";
import type { AccessTokenResponse } from "../types/auth";

export async function issueAccessToken(apiKey: string) {
  const response = await fetch("/api/auth/access-token", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!response.ok) {
    throw new Error(await parseErrorMessage(response, "액세스 토큰 발급에 실패했습니다."));
  }

  return (await response.json()) as AccessTokenResponse;
}
