import os
import uvicorn

# Configurando os parâmetros do banco de dados
os.environ["DATABASE_USER"] = "autenticatordb_user"
os.environ["DATABASE_PASSWORD"] = "autenticatordb_pwd"
os.environ["DATABASE_HOST"] = "localhost"
os.environ["DATABASE_PORT"] = "5031"  
os.environ["DATABASE_NAME"] = "autenticatordb"
os.environ["SECRET_KEY"] = "your-secret-key"
os.environ["ALGORITHM"] = "HS256"
os.environ["ACCESS_TOKEN_EXPIRE_MINUTES"] = "30"

if __name__ == "__main__":
    # Rodando o servidor Uvicorn com reload utilizando uma string de importação
    uvicorn.run("auth.main:app", host="0.0.0.0", port=8000, reload=True)
