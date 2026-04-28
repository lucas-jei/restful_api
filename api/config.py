from os import environ
from pathlib import Path

from dotenv import load_dotenv


ENV_PATH = Path(__file__).resolve().parent / ".env"
load_dotenv(ENV_PATH, override=True)


def get_required_env(name: str) -> str:
    value = environ.get(name)

    if value is None or not value.strip():
        raise RuntimeError(f"Missing required environment variable: {name}")

    return value.strip()


def get_csv_env(name: str, default: str = "") -> list[str]:
    value = environ.get(name, default)
    return [item.strip() for item in value.split(",") if item.strip()]
