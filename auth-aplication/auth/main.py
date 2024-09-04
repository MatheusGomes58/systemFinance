from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth.database import Base, engine
from auth.routers import user, permission, auth, user_permission

# Inicializar a aplicação FastAPI
app = FastAPI()

# Configurar CORS
origins = [
    "http://localhost:3000",  # Adicione o endereço do seu frontend aqui
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Criar as tabelas no banco de dados
Base.metadata.create_all(bind=engine)

# Incluir as rotas
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(permission.router)
app.include_router(user_permission.router)
