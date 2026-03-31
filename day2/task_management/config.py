from pydantic_settings import BaseSettings
from pydantic import Field
from functools import lru_cache


class Settings(BaseSettings):
    app_name: str = Field(default="TaskManagementAPI", alias="APP_NAME")
    app_version: str = Field(default="1.0.0", alias="APP_VERSION")
    debug: bool = Field(default=False, alias="DEBUG")
    host: str = Field(default="0.0.0.0", alias="HOST")
    port: int = Field(default=8000, alias="PORT")
    tasks_file: str = Field(default="data/tasks.json", alias="TASKS_FILE")
    users_file: str = Field(default="data/users.json", alias="USERS_FILE")
    log_file: str = Field(default="logs/app.log", alias="LOG_FILE")
    log_level: str = Field(default="INFO", alias="LOG_LEVEL")
    DATABASE_URL: str
    model_config = {"env_file": ".env", "populate_by_name": True}


@lru_cache()
def get_settings() -> Settings:
    return Settings()
