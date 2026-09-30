import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# 1. Direct connection to your new dem_prod database on AWS using your endpoint
SQLALCHEMY_DATABASE_URL = "postgresql://swais_app_user:Swaisuser007@swais-db-test-env.cri2kcc26kxg.ap-south-2.rds.amazonaws.com:5432/dem_prod"

print(f"Using database URL: {SQLALCHEMY_DATABASE_URL}")                    

# 2. Engine setup with AWS timeout protections
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,   # test connections before reuse
    pool_recycle=300,     # recycle after 5 min
    pool_size=5,
    max_overflow=10
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 3. THIS FIXES THE IMPORT ERROR IN STARTUP_CHECK.PY AND MAIN.PY
DB_PREFIX = "dem_"

# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()