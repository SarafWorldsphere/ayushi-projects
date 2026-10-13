import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load variables from .env file
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

# Safety check
if not DATABASE_URL:
    raise RuntimeError("DATABASE_URL is missing. Please set it in the .env file.")

# Connect to the PostgreSQL database with connection pooling
engine = create_engine(
    DATABASE_URL,
    pool_size=5,          # Maintain up to 5 active connections per process
    max_overflow=10,      # Allow up to 10 extra temporary connections during high traffic
    pool_timeout=30,      # Wait up to 30 seconds for a connection
    pool_pre_ping=True    # Check connection vitality before executing queries
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()