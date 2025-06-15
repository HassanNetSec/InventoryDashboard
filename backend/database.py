import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

postgrsSQL_url = os.getenv("POSTGRES_SQL_CONNECTION_STRING")

# Create engine
postgres_engine = create_engine(postgrsSQL_url)

# Create session
SessionLocal = sessionmaker(autoflush=False, autocommit=False, bind=postgres_engine)

# ✅ FIXED: Call declarative_base()
Base = declarative_base()

# Dependency for FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
