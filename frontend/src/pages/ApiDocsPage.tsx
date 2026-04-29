const endpoints = [
  {
    title: "1. 액세스 토큰 발급",
    method: "POST",
    url: "/api/auth/access-token",
    description: "API 키를 검증하고 게시글 API 호출에 사용할 액세스 토큰을 발급합니다.",
    params: [["Authorization", "Header", "Bearer {API_KEY}"]],
    request: `POST /api/auth/access-token HTTP/1.1
Authorization: Bearer {API_KEY}`,
    response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "access_token": "issued-access-token",
  "token_type": "Bearer"
}`,
  },
  {
    title: "2. 게시글 리스트",
    method: "GET",
    url: "/api/posts",
    description: "등록된 게시글 목록을 최신순으로 조회합니다.",
    params: [["Authorization", "Header", "Bearer {ACCESS_TOKEN}"]],
    request: `GET /api/posts HTTP/1.1
Authorization: Bearer {ACCESS_TOKEN}`,
    response: `HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": "0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0",
    "title": "첫 번째 게시글",
    "content": "게시글 본문입니다.",
    "author": "lucas",
    "created_at": "2026-04-22T06:30:00",
    "updated_at": "2026-04-22T06:30:00"
  }
]`,
  },
  {
    title: "3. 게시글 등록",
    method: "POST",
    url: "/api/posts",
    description: "제목, 본문, 작성자를 입력해 새 게시글을 생성합니다.",
    params: [
      ["Authorization", "Header", "Bearer {ACCESS_TOKEN}"],
      ["title", "Body", "1-255자 문자열"],
      ["content", "Body", "1자 이상 문자열"],
      ["author", "Body", "1-100자 문자열"],
    ],
    request: `POST /api/posts HTTP/1.1
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json

{
  "title": "첫 번째 게시글",
  "content": "게시글 본문입니다.",
  "author": "lucas"
}`,
    response: `HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0",
  "title": "첫 번째 게시글",
  "content": "게시글 본문입니다.",
  "author": "lucas",
  "created_at": "2026-04-22T06:30:00",
  "updated_at": "2026-04-22T06:30:00"
}`,
  },
  {
    title: "4. 게시글 열기",
    method: "GET",
    url: "/api/posts/{post_id}",
    description: "게시글 ID로 단일 게시글 상세 정보를 조회합니다.",
    params: [
      ["Authorization", "Header", "Bearer {ACCESS_TOKEN}"],
      ["post_id", "Path", "게시글 ID"],
    ],
    request: `GET /api/posts/0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0 HTTP/1.1
Authorization: Bearer {ACCESS_TOKEN}`,
    response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0",
  "title": "첫 번째 게시글",
  "content": "게시글 본문입니다.",
  "author": "lucas",
  "created_at": "2026-04-22T06:30:00",
  "updated_at": "2026-04-22T06:30:00"
}`,
  },
  {
    title: "5. 게시글 업데이트",
    method: "PUT",
    url: "/api/posts/{post_id}",
    description: "게시글 ID에 해당하는 게시글의 제목, 본문, 작성자를 전체 수정합니다.",
    params: [
      ["Authorization", "Header", "Bearer {ACCESS_TOKEN}"],
      ["post_id", "Path", "게시글 ID"],
      ["title", "Body", "1-255자 문자열"],
      ["content", "Body", "1자 이상 문자열"],
      ["author", "Body", "1-100자 문자열"],
    ],
    request: `PUT /api/posts/0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0 HTTP/1.1
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: application/json

{
  "title": "수정된 게시글",
  "content": "수정된 본문입니다.",
  "author": "lucas"
}`,
    response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0",
  "title": "수정된 게시글",
  "content": "수정된 본문입니다.",
  "author": "lucas",
  "created_at": "2026-04-22T06:30:00",
  "updated_at": "2026-04-22T06:35:00"
}`,
  },
  {
    title: "6. 게시글 삭제",
    method: "DELETE",
    url: "/api/posts/{post_id}",
    description: "게시글 ID에 해당하는 게시글을 삭제합니다.",
    params: [
      ["Authorization", "Header", "Bearer {ACCESS_TOKEN}"],
      ["post_id", "Path", "게시글 ID"],
    ],
    request: `DELETE /api/posts/0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0 HTTP/1.1
Authorization: Bearer {ACCESS_TOKEN}`,
    response: `HTTP/1.1 204 No Content`,
  },
];

function ApiDocsPage() {
  return (
    <main className="page-shell">
      <section className="docs-viewer" aria-labelledby="docs-title">
        <div className="editor-header">
          <div>
            <p className="eyebrow">Docs</p>
            <h1 id="docs-title">Board API Reference</h1>
          </div>
          <span className="api-chip">/api</span>
        </div>

        <div className="docs-stack">
          {endpoints.map((endpoint) => (
            <article className="api-doc-section" key={`${endpoint.method}-${endpoint.url}`}>
              <div className="doc-title-row">
                <h2>{endpoint.title}</h2>
                <span className={`method-badge ${endpoint.method.toLowerCase()}`}>{endpoint.method}</span>
              </div>

              <h3>Parameter Description</h3>
              <table className="doc-table">
                <tbody>
                  <tr>
                    <th>설명</th>
                    <td>{endpoint.description}</td>
                  </tr>
                  <tr>
                    <th>URL</th>
                    <td>
                      [{endpoint.method}] {endpoint.url}
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3>Request</h3>
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>키</th>
                    <th>타입</th>
                    <th>설명</th>
                  </tr>
                </thead>
                <tbody>
                  {endpoint.params.map(([key, type, description]) => (
                    <tr key={`${endpoint.title}-${key}`}>
                      <td>{key}</td>
                      <td>{type}</td>
                      <td>{description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <pre className="doc-code">{endpoint.request}</pre>

              <h3>Response</h3>
              <pre className="doc-code">{endpoint.response}</pre>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}

export default ApiDocsPage;
