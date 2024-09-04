from fastapi import FastAPI
from auth.database import Base, engine
from auth.routers import user, permission, auth

# Inicializar a aplicação FastAPI
app = FastAPI()

# Criar as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Incluir as rotas
app.include_router(user.router)
app.include_router(permission.router)
app.include_router(auth.router)
