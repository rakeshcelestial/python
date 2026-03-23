from fastapi import FastAPI
from contextlib import asynccontextmanager
from pydantic_settings import BaseSettings, SettingsConfigDict


#  Settings class (loads from .env)
class Settings(BaseSettings):
    APP_NAME: str
    DEBUG: bool
    JSON_DB_PATH: str
    LOG_LEVEL: str

    # load from .env file
    model_config = SettingsConfigDict(env_file=".env")


#  Singleton instance
settings = Settings()


# Startup event (lifespan)
@asynccontextmanager
async def lifespan(app: FastAPI):
    print(f"App: {settings.APP_NAME} | Debug: {settings.DEBUG} | DB: {settings.JSON_DB_PATH}")
    yield


# FastAPI app
app = FastAPI(lifespan=lifespan)


# Sample endpoint
@app.get("/")
def home():
    return {"message": "API is running"}