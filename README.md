# Board RESTful Server

A board RESTful API server using FastAPI, SQLAlchemy, and PostgreSQL.

## Install

```bash
uv sync
```

## Run

```bash
cd api
uv run uvicorn main:app --host 127.0.0.1 --port 3080 --reload
```

The server runs at `http://127.0.0.1:3080` by default.

API docs are available at `http://127.0.0.1:3080/docs`.

Frontend REST API reference is available in [docs/board-api.md](docs/board-api.md).

## Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://127.0.0.1:5173`.

Frontend source layout:

```text
frontend/src/
  api/          HTTP request functions
  components/   Reusable UI components
  pages/        Page-level screens
  types/        Shared TypeScript types
```

## Environment

Backend environment variables are loaded from `api/.env`.

- `PORT`: server port, defaults to `3080`
- `HOST`: server host, defaults to `127.0.0.1`
- `DB_HOST`: PostgreSQL host
- `DB_PORT`: PostgreSQL port
- `DB_NAME`: PostgreSQL database name
- `DB_USER`: PostgreSQL user
- `DB_PASSWORD`: PostgreSQL password
- `API_KEY`: bearer API key used to issue an access token
- `ACCESS_TOKEN`: bearer token required for protected `/posts` requests
- `CORS_ALLOW_ORIGINS`: comma-separated origins allowed to call the API

Example:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=codex_db
DB_USER=postgres
DB_PASSWORD=postgres
API_KEY=change-api-key
ACCESS_TOKEN=change-access-token
CORS_ALLOW_ORIGINS=null,http://127.0.0.1:5173,http://localhost:5173
```

## Endpoints

### Health

```bash
curl http://127.0.0.1:3080/health
```

### Create Post

```bash
curl -X POST http://127.0.0.1:3080/posts \
  -H "Authorization: Bearer change-access-token" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"first post\",\"content\":\"hello board\",\"author\":\"lucas\"}"
```

### List Posts

```bash
curl http://127.0.0.1:3080/posts \
  -H "Authorization: Bearer change-access-token"
```

### Get Post

```bash
curl http://127.0.0.1:3080/posts/{id} \
  -H "Authorization: Bearer change-access-token"
```

### Update Post

```bash
curl -X PUT http://127.0.0.1:3080/posts/{id} \
  -H "Authorization: Bearer change-access-token" \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"updated post\",\"content\":\"updated content\",\"author\":\"lucas\"}"
```

### Delete Post

```bash
curl -X DELETE http://127.0.0.1:3080/posts/{id} \
  -H "Authorization: Bearer change-access-token"
```
