from pydantic import BaseModel
from sqlalchemy import Column, Integer, String, Float
from .db import Base

class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    description = Column(String, index=True)
    price = Column(Float)

class ItemCreate(BaseModel):
    name: str
    description: str
    price: float

class ItemInDB(ItemCreate):
    id: int

class ItemUpdate(BaseModel):
    name: str
    description: str
    price: float
