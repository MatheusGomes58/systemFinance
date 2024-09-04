from pydantic import BaseModel

# Modelo utilizado para criar um item
class ItemCreate(BaseModel):
    name: str
    description: str
    price: float

# Modelo utilizado para leitura (inclui o ID)
class Item(BaseModel):
    id: int
    name: str
    description: str
    price: float

    # Permite que o Pydantic converta automaticamente objetos do SQLAlchemy
    class Config:
        from_attributes = True

# Modelo utilizado para atualizar um item
class ItemUpdate(BaseModel):
    name: str
    description: str
    price: float
