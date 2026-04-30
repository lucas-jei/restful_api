from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator


class PostCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1)
    author: str = Field(min_length=1, max_length=100)

    @field_validator("title", "content", "author")
    @classmethod
    def value_must_not_be_blank(cls, value: str) -> str:
        stripped = value.strip()

        if not stripped:
            raise ValueError("value must not be blank")

        return stripped


class PostUpdate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    content: str = Field(min_length=1)
    author: str = Field(min_length=1, max_length=100)

    @field_validator("title", "content", "author")
    @classmethod
    def value_must_not_be_blank(cls, value: str) -> str:
        stripped = value.strip()

        if not stripped:
            raise ValueError("value must not be blank")

        return stripped


class PostRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: str
    title: str
    content: str
    author: str
    attachment_filename: str | None
    attachment_content_type: str | None
    created_at: datetime
    updated_at: datetime


class PostPage(BaseModel):
    items: list[PostRead]
    total_count: int
    total_pages: int
    page: int
    size: int
