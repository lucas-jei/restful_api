from secrets import compare_digest

from fastapi import Header, HTTPException, status

from api.config import get_required_env


def parse_bearer_token(authorization: str | None) -> str:
    if authorization is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing bearer token.",
        )

    scheme, _, token = authorization.partition(" ")

    if scheme.lower() != "bearer" or not token.strip():
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header.",
        )

    return token.strip()


def verify_api_key(authorization: str | None = Header(default=None)) -> None:
    api_key = parse_bearer_token(authorization)
    expected_api_key = get_required_env("API_KEY")

    if not compare_digest(api_key, expected_api_key):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key.",
        )


def verify_access_token(authorization: str | None = Header(default=None)) -> None:
    access_token = parse_bearer_token(authorization)
    expected_access_token = get_required_env("ACCESS_TOKEN")

    if not compare_digest(access_token, expected_access_token):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access token.",
        )
