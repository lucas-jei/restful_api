from fastapi import APIRouter, Depends

from api.config import get_required_env
from api.dependencies.auth import verify_api_key
from api.schemas import AccessTokenRead


router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/access-token", response_model=AccessTokenRead, dependencies=[Depends(verify_api_key)])
def issue_access_token() -> AccessTokenRead:
    return AccessTokenRead(access_token=get_required_env("ACCESS_TOKEN"))
