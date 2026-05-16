from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    database_url: str = "sqlite:////data/roboarm.db"
    cors_origins: str = "http://localhost:3000"
    motion_hz: int = 20
    max_deg_per_tick: float = 5.0
    history_limit: int = 100


settings = Settings()
