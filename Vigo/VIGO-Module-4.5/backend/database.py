import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load variables from .env file
load_dotenv()

# Fetch the database URL from the environment
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the engine with explicit connection pooling limits
engine = create_engine(
    DATABASE_URL,
    pool_size=5,          # Maintain up to 5 active connections per process
    max_overflow=10,      # Allow up to 10 extra temporary connections during high traffic
    pool_timeout=30,      # Wait up to 30 seconds for a connection before raising an error
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