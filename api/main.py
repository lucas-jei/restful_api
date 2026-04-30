from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from config import get_csv_env, get_env
from database import Base, engine
from models import Post
from routers import auth, posts


app = FastAPI(title="Board RESTful Server", version="1.0.0", root_path=get_env("ROOT_PATH"))
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_csv_env(
        "CORS_ALLOW_ORIGINS",
        "null,http://127.0.0.1:5173,http://localhost:5173",
    ),
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(auth.router)
app.include_router(posts.router)


@app.on_event("startup")
def on_startup() -> None:
    Base.metadata.create_all(bind=engine)
    with engine.begin() as connection:
        connection.execute(text("ALTER TABLE posts ADD COLUMN IF NOT EXISTS attachment_filename VARCHAR(255)"))
        connection.execute(text("ALTER TABLE posts ADD COLUMN IF NOT EXISTS attachment_content_type VARCHAR(255)"))
        connection.execute(text("ALTER TABLE posts ADD COLUMN IF NOT EXISTS attachment_path VARCHAR(500)"))


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
