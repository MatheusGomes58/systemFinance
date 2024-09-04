from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from auth.database import Base

class UserToken(Base):
    __tablename__ = "user_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    access_token = Column(String, index=True)
    expires_at = Column(DateTime)

    # Relacionamento com User
    user = relationship("User", back_populates="tokens")

    def __repr__(self):
        return f"<UserToken(id={self.id}, access_token={self.access_token})>"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String, nullable=False)

    # Relacionamento com UserPermission
    permissions = relationship("UserPermission", back_populates="user")
    tokens = relationship("UserToken", back_populates="user")

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username})>"

class Permission(Base):
    __tablename__ = "permissions"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True)

    # Relacionamento com UserPermission
    users = relationship("UserPermission", back_populates="permission")

    def __repr__(self):
        return f"<Permission(id={self.id}, name={self.name})>"

class UserPermission(Base):
    __tablename__ = "user_permissions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    permission_id = Column(Integer, ForeignKey("permissions.id"))

    # Relacionamento com User e Permission
    user = relationship("User", back_populates="permissions")
    permission = relationship("Permission", back_populates="users")

    def __repr__(self):
        return f"<UserPermission(id={self.id}, user_id={self.user_id}, permission_id={self.permission_id})>"
