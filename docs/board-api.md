# Board API Reference

프론트엔드 게시판 기능 연동을 위한 REST API 참조 문서입니다.

## Base URL

개발 서버 기본 주소:

```text
http://127.0.0.1:3080
```

## Common Headers

먼저 API 키로 액세스 토큰을 발급받습니다.

```http
Authorization: Bearer {API_KEY}
```

발급받은 액세스 토큰으로 `/posts` 하위 API를 호출합니다.

```http
Authorization: Bearer {ACCESS_TOKEN}
```

`POST`, `PUT` 요청은 JSON 요청 본문을 사용합니다.

```http
Content-Type: application/json
```

## Common Error Responses

### 401 Invalid API Key

API 키가 없거나 올바르지 않을 때 반환됩니다.

```json
{
  "detail": "Invalid API key."
}
```

### 401 Invalid Access Token

액세스 토큰이 없거나 올바르지 않을 때 반환됩니다.

```json
{
  "detail": "Invalid access token."
}
```

### 404 Not Found

요청한 게시글이 없을 때 반환됩니다.

```json
{
  "detail": "Post not found."
}
```

### 422 Validation Error

요청 본문이 스키마를 만족하지 않을 때 반환됩니다.

대표 원인:

- `title` 누락 또는 빈 문자열
- `content` 누락 또는 빈 문자열
- `author` 누락 또는 빈 문자열
- `title` 255자 초과
- `author` 100자 초과

## Issue Access Token

게시글 API 호출에 사용할 액세스 토큰을 발급받습니다.

```http
POST /auth/access-token
```

### Request Example

```bash
curl -X POST http://127.0.0.1:3080/auth/access-token \
  -H "Authorization: Bearer {API_KEY}"
```

### Success Response

```http
200 OK
```

```json
{
  "access_token": "issued-access-token",
  "token_type": "Bearer"
}
```

## Data Model

### Post

| Field | Type | Description |
| --- | --- | --- |
| `id` | `string` | 게시글 ID |
| `title` | `string` | 게시글 제목 |
| `content` | `string` | 게시글 본문 |
| `author` | `string` | 작성자 |
| `created_at` | `string` | 생성 일시, ISO 8601 |
| `updated_at` | `string` | 수정 일시, ISO 8601 |

응답 예시:

```json
{
  "id": "0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0",
  "title": "첫 번째 게시글",
  "content": "게시글 본문입니다.",
  "author": "lucas",
  "created_at": "2026-04-22T06:30:00.000000",
  "updated_at": "2026-04-22T06:30:00.000000"
}
```

## Create Post

게시글을 생성합니다.

```http
POST /posts
```

### Request Body

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `title` | `string` | Yes | 1-255자, 공백만 입력 불가 |
| `content` | `string` | Yes | 1자 이상, 공백만 입력 불가 |
| `author` | `string` | Yes | 1-100자, 공백만 입력 불가 |

### Request Example

```bash
curl -X POST http://127.0.0.1:3080/posts \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"첫 번째 게시글\",\"content\":\"게시글 본문입니다.\",\"author\":\"lucas\"}"
```

### Success Response

```http
201 Created
```

```json
{
  "id": "0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0",
  "title": "첫 번째 게시글",
  "content": "게시글 본문입니다.",
  "author": "lucas",
  "created_at": "2026-04-22T06:30:00.000000",
  "updated_at": "2026-04-22T06:30:00.000000"
}
```

## List Posts

게시글 목록을 조회합니다. 최신 생성 순으로 정렬됩니다.

```http
GET /posts
```

### Request Example

```bash
curl http://127.0.0.1:3080/posts \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

### Success Response

```http
200 OK
```

```json
[
  {
    "id": "0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0",
    "title": "첫 번째 게시글",
    "content": "게시글 본문입니다.",
    "author": "lucas",
    "created_at": "2026-04-22T06:30:00.000000",
    "updated_at": "2026-04-22T06:30:00.000000"
  }
]
```

게시글이 없으면 빈 배열을 반환합니다.

```json
[]
```

## Get Post

게시글 하나를 조회합니다.

```http
GET /posts/{post_id}
```

### Path Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `post_id` | `string` | Yes | 게시글 ID |

### Request Example

```bash
curl http://127.0.0.1:3080/posts/0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0 \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

### Success Response

```http
200 OK
```

```json
{
  "id": "0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0",
  "title": "첫 번째 게시글",
  "content": "게시글 본문입니다.",
  "author": "lucas",
  "created_at": "2026-04-22T06:30:00.000000",
  "updated_at": "2026-04-22T06:30:00.000000"
}
```

## Update Post

게시글을 수정합니다. 현재 API는 전체 수정 방식이므로 `title`, `content`, `author`를 모두 전달해야 합니다.

```http
PUT /posts/{post_id}
```

### Path Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `post_id` | `string` | Yes | 게시글 ID |

### Request Body

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `title` | `string` | Yes | 1-255자, 공백만 입력 불가 |
| `content` | `string` | Yes | 1자 이상, 공백만 입력 불가 |
| `author` | `string` | Yes | 1-100자, 공백만 입력 불가 |

### Request Example

```bash
curl -X PUT http://127.0.0.1:3080/posts/0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0 \
  -H "Authorization: Bearer {ACCESS_TOKEN}" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"수정된 게시글\",\"content\":\"수정된 본문입니다.\",\"author\":\"lucas\"}"
```

### Success Response

```http
200 OK
```

```json
{
  "id": "0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0",
  "title": "수정된 게시글",
  "content": "수정된 본문입니다.",
  "author": "lucas",
  "created_at": "2026-04-22T06:30:00.000000",
  "updated_at": "2026-04-22T06:35:00.000000"
}
```

## Delete Post

게시글을 삭제합니다.

```http
DELETE /posts/{post_id}
```

### Path Parameters

| Name | Type | Required | Description |
| --- | --- | --- | --- |
| `post_id` | `string` | Yes | 게시글 ID |

### Request Example

```bash
curl -X DELETE http://127.0.0.1:3080/posts/0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0 \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

### Success Response

```http
204 No Content
```

응답 본문은 없습니다.

## Frontend Integration Notes

- 모든 `/posts` 요청에 `Authorization: Bearer {ACCESS_TOKEN}` 헤더를 포함해야 합니다.
- 목록 조회 응답은 배열입니다.
- 생성, 단건 조회, 수정 응답은 단일 `Post` 객체입니다.
- 삭제 성공 응답은 `204`이며 JSON 본문이 없습니다.
- `PUT /posts/{post_id}`는 부분 수정이 아니라 전체 수정입니다.
- 프론트에서 표시할 게시글 상세 URL은 API의 `id` 값을 기준으로 구성하면 됩니다.
