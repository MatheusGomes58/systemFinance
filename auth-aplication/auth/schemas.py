from pydantic import BaseModel
from datetime import datetime
from typing import List


class PermissionResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class UserPermissionResponse(BaseModel):
    id: int
    user_id: int
    permission_id: int
    permission: PermissionResponse  # Inclui os detalhes da permissão

    class Config:
        from_attributes = True

class UserResponse(BaseModel):
    id: int
    username: str
    permissions: List[UserPermissionResponse]  # Inclui as permissões do usuário

    class Config:
        from_attributes = True

class UserResponseCreated(BaseModel):
    id: int
    username: str

class UserResetPassword(BaseModel):
    username: str

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
    permissions: List[UserPermissionResponse]  # Inclui as permissões do usuário

    class Config:
        from_attributes = True

class UserToken(BaseModel):
    access_token: str
    token_type: str
    expires_at: datetime

class PermissionCreate(BaseModel):
    name: str

class UserPermission(BaseModel):
    id: int
    user_id: int
    permission_id: int

    class Config:
        from_attributes = True

class TokenData(BaseModel):
    username: str
