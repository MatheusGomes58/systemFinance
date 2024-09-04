from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import auth, items

app = FastAPI()

# Configurar CORS
origins = [
    "http://localhost:3000",  # Adicione aqui as origens permitidas
    "https://example.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Permite origens específicas
    allow_credentials=True,
    allow_methods=["*"],  # Permite todos os métodos HTTP
    allow_headers=["*"],  # Permite todos os cabeçalhos
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(items.router, prefix="/items", tags=["Items"])
