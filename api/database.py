from collections.abc import Generator
from sqlalchemy import create_engine
from sqlalchemy.engine import URL
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from api.config import get_required_env


DATABASE_URL = URL.create(
    drivername="postgresql+psycopg",
    username=get_required_env("DB_USER"),
    password=get_required_env("DB_PASSWORD"),
    host=get_required_env("DB_HOST"),
    port=int(get_required_env("DB_PORT")),
    database=get_required_env("DB_NAME"),
)

connect_args = {}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)


class Base(DeclarativeBase):
    pass


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
