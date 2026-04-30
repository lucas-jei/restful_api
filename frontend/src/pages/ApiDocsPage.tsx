import { useEffect } from "react";

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
    title: "2. 게시글 목록 조회",
    method: "GET",
    url: "/api/posts",
    description: "등록된 게시글 목록을 최신순으로 조회합니다.",
    params: [
      ["Authorization", "Header", "Bearer {ACCESS_TOKEN}"],
      ["page", "Query", "페이지 번호, 기본값 1"],
      ["size", "Query", "페이지 크기, 기본값 10"],
    ],
    request: `GET /api/posts?page=1&size=10 HTTP/1.1
Authorization: Bearer {ACCESS_TOKEN}`,
    response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "items": [
    {
      "id": "0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0",
      "title": "첫 번째 게시글",
      "content": "게시글 본문입니다.",
      "author": "lucas",
      "attachment_filename": "sample.pdf",
      "attachment_content_type": "application/pdf",
      "created_at": "2026-04-22T06:30:00",
      "updated_at": "2026-04-22T06:30:00"
    }
  ],
  "total_count": 42,
  "total_pages": 5,
  "page": 1,
  "size": 10
}`,
  },
  {
    title: "3. 게시글 등록",
    method: "POST",
    url: "/api/posts",
    description: "제목, 본문, 작성자와 첨부파일을 multipart/form-data 한 요청으로 등록합니다. 첨부파일은 선택값입니다.",
    params: [
      ["Authorization", "Header", "Bearer {ACCESS_TOKEN}"],
      ["title", "Form", "1-255자 문자열"],
      ["content", "Form", "1자 이상 문자열"],
      ["author", "Form", "1-100자 문자열"],
      ["attachment", "File", "선택 첨부파일"],
    ],
    request: `POST /api/posts HTTP/1.1
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: multipart/form-data

title=첫 번째 게시글
content=게시글 본문입니다.
author=lucas
attachment=@sample.pdf`,
    response: `HTTP/1.1 201 Created
Content-Type: application/json

{
  "id": "0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0",
  "title": "첫 번째 게시글",
  "content": "게시글 본문입니다.",
  "author": "lucas",
  "attachment_filename": "sample.pdf",
  "attachment_content_type": "application/pdf",
  "created_at": "2026-04-22T06:30:00",
  "updated_at": "2026-04-22T06:30:00"
}`,
  },
  {
    title: "4. 게시글 상세 조회",
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
  "attachment_filename": "sample.pdf",
  "attachment_content_type": "application/pdf",
  "created_at": "2026-04-22T06:30:00",
  "updated_at": "2026-04-22T06:30:00"
}`,
  },
  {
    title: "5. 첨부파일 다운로드",
    method: "GET",
    url: "/api/posts/{post_id}/attachment",
    description: "게시글에 저장된 첨부파일을 다운로드합니다.",
    params: [
      ["Authorization", "Header", "Bearer {ACCESS_TOKEN}"],
      ["post_id", "Path", "게시글 ID"],
    ],
    request: `GET /api/posts/0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0/attachment HTTP/1.1
Authorization: Bearer {ACCESS_TOKEN}`,
    response: `HTTP/1.1 200 OK
Content-Type: application/pdf
Content-Disposition: attachment; filename*=UTF-8''sample.pdf

<binary file body>`,
  },
  {
    title: "6. 게시글 수정",
    method: "PUT",
    url: "/api/posts/{post_id}",
    description: "게시글 ID에 해당하는 게시글의 제목, 본문, 작성자와 첨부파일을 multipart/form-data 한 요청으로 수정합니다. 새 첨부파일을 보내면 기존 첨부파일이 교체됩니다.",
    params: [
      ["Authorization", "Header", "Bearer {ACCESS_TOKEN}"],
      ["post_id", "Path", "게시글 ID"],
      ["title", "Form", "1-255자 문자열"],
      ["content", "Form", "1자 이상 문자열"],
      ["author", "Form", "1-100자 문자열"],
      ["attachment", "File", "선택 첨부파일. 전달 시 기존 파일 교체"],
    ],
    request: `PUT /api/posts/0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0 HTTP/1.1
Authorization: Bearer {ACCESS_TOKEN}
Content-Type: multipart/form-data

title=수정된 게시글
content=수정된 본문입니다.
author=lucas
attachment=@updated.pdf`,
    response: `HTTP/1.1 200 OK
Content-Type: application/json

{
  "id": "0c87c2b2-c4fb-4827-a36c-7ed3d1e4b9b0",
  "title": "수정된 게시글",
  "content": "수정된 본문입니다.",
  "author": "lucas",
  "attachment_filename": "updated.pdf",
  "attachment_content_type": "application/pdf",
  "created_at": "2026-04-22T06:30:00",
  "updated_at": "2026-04-22T06:35:00"
}`,
  },
  {
    title: "7. 게시글 삭제",
    method: "DELETE",
    url: "/api/posts/{post_id}",
    description: "게시글 ID에 해당하는 게시글을 삭제합니다. 첨부파일이 있으면 서버에 저장된 파일도 함께 삭제합니다.",
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
  const currentOrigin = window.location.origin;

  useEffect(() => {
    document.title = "Board API Reference";
  }, []);

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
            <article className="api-doc-section" key={`${endpoint.method}-${endpoint.url}-${endpoint.title}`}>
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
                      [{endpoint.method}] {currentOrigin}
                      {endpoint.url}
                    </td>
                  </tr>
                </tbody>
              </table>

              <h3>Request</h3>
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>위치</th>
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
