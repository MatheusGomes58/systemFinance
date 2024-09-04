# auth/schemas.py
from pydantic import BaseModel
from datetime import datetime
from typing import List

class PermissionResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    username: str
    permissions: List[PermissionResponse]  # Inclua permissões se necessário

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    username: str
    password: str

class UserUpdate(BaseModel):
    username: str
    password: str

class User(BaseModel):
    id: int
    username: str
    hashed_password: str

    class Config:
        from_attributes = True

class UserToken(BaseModel):
    access_token: str
    token_type: str
    expires_at: datetime

class PermissionCreate(BaseModel):
    name: str

class TokenData(BaseModel):
    username: str
