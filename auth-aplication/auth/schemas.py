from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional

class BaseUser(BaseModel):
    id: Optional[int] = None
    username: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    hashed_password: Optional[str] = None

    class Config:
        from_attributes = True

class PermissionResponse(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None

    class Config:
        from_attributes = True

class UserPermissionResponse(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    permission_id: Optional[int] = None
    permission: Optional[PermissionResponse] = None  # Inclui os detalhes da permissão

    class Config:
        from_attributes = True

class UserResponse(BaseUser):
    permissions: Optional[List[UserPermissionResponse]] = None  # Inclui as permissões do usuário

class UserResponseCreated(BaseUser):
    pass

class UserResetPassword(BaseModel):
    username: Optional[str] = None

class UserCreate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None

class UserUpdate(BaseUser):
    pass

class UserToken(BaseModel):
    access_token: Optional[str] = None
    token_type: Optional[str] = None
    expires_at: Optional[datetime] = None

class PermissionCreate(BaseModel):
    name: Optional[str] = None

class UserPermission(BaseModel):
    id: Optional[int] = None
    user_id: Optional[int] = None
    permission_id: Optional[int] = None

    class Config:
        from_attributes = True

class TokenData(BaseModel):
    username: Optional[str] = None
