from database import engine
from sqlalchemy import text

conn = engine.connect()

# Add every potentially missing column that mock_data.py needs
queries = [
    "ALTER TABLE users_master ADD COLUMN IF NOT EXISTS login_id VARCHAR;",
    "ALTER TABLE users_master ADD COLUMN IF NOT EXISTS username VARCHAR;",
    "ALTER TABLE users_master ADD COLUMN IF NOT EXISTS email VARCHAR;",
    "ALTER TABLE users_master ADD COLUMN IF NOT EXISTS password_hash VARCHAR;",
    "ALTER TABLE users_master ADD COLUMN IF NOT EXISTS role VARCHAR;",
    "ALTER TABLE users_master ADD COLUMN IF NOT EXISTS is_active BOOLEAN;",
    "ALTER TABLE users_master ADD COLUMN IF NOT EXISTS mobile_no VARCHAR;",
    "ALTER TABLE users_master ADD COLUMN IF NOT EXISTS created_at TIMESTAMP;",
    "ALTER TABLE users_master ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;",
    "ALTER TABLE users_master ADD COLUMN IF NOT EXISTS registration_complete BOOLEAN DEFAULT TRUE;"
]

for q in queries:
    conn.execute(text(q))

try:
    conn.commit()
except Exception:
    pass 

conn.close()
print("All missing columns (including registration_complete) added successfully!")