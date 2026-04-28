export async function parseErrorMessage(response: Response, fallback: string) {
  const errorBody = await response.json().catch(() => null);
  const detail = errorBody?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  return fallback;
}
