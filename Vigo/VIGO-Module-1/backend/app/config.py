"""SWAIS standard: the ONLY place environment variables are read.

Never hardcode URLs/ports/credentials elsewhere. Never log secret values.
"""

import os

from dotenv import load_dotenv

load_dotenv()


class Settings:
    def __init__(self) -> None:
        self.app_name: str = os.getenv("APP_NAME", "CHANGE-ME-project-role-backend")
        self.port: int = int(os.getenv("PORT", "8000"))
        self.database_url: str = self._require("DATABASE_URL")
        self.cors_origins: list[str] = [
            origin.strip()
            for origin in os.getenv("CORS_ORIGINS", "").split(",")
            if origin.strip()
        ]

    @staticmethod
    def _require(name: str) -> str:
        value = os.getenv(name)
        if not value:
            # Fail loudly at startup — silent fallbacks cost debugging rounds.
            raise RuntimeError(
                f"Required environment variable {name} is not set. "
                f"Copy .env.example to .env and fill it in."
            )
        return value


settings = Settings()
