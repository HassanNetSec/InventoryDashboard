from jose import jwt, JWTError
from datetime import datetime, timedelta
from typing import Optional
from typing import Literal
from uuid import UUID
import os
from dotenv import load_dotenv
from pydantic import BaseModel
import bcrypt

load_dotenv()

# Secret and algorithm — set these or fallback to defaults
secret_key = os.getenv('SECRET_KEY', "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7")
alg = os.getenv('ALGORITHM', "HS256")

# # Set expiry time to 30 days in minutes
# expiry_token = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', 30 * 24 * 60))  # 43200 minutes = 30 days

class userRequest(BaseModel):
    email : str

class User(BaseModel):
    email: str
    hashed_password: str
    full_name: str
    role: Literal['admin', 'staff']
    is_active: bool
    created_at: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None
    user_id: UUID

class UserInDB(User):
    hashed_password: str

def create_access_token(data: dict) -> str:
    # expire = datetime.utcnow() + timedelta(minutes=expiry_token)
    payload = {
        "user_id": data["id"],
        "email": data["email"],
        "role": data["role"],
        # "exp": expire
    }
    token = jwt.encode(payload, secret_key, algorithm=alg)
    return token
class TokenRequest(BaseModel):
    token: str
# Decode access token
def decode_access_token(token):
    try:
        payload = jwt.decode(token, secret_key, algorithms=[alg])
        return payload
    except JWTError as e:
        return {"error": "Token is invalid or has expired"}
    

def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
    return hashed_password.decode('utf-8')

class Data_from_Category(BaseModel):
    name : str
    description : str

    class config():
        orm_mode = True
    
class  delete_category(BaseModel):
    name_of_category : str

class Products(BaseModel):
    name: str
    description: str
    price: float
    stock: int
    image_url: Optional[str] = None  # str or null
    user_id: UUID
    category_id: UUID  # ✅ add this
    low_stock_threshold : int


class CategoryReq(BaseModel):
    name : str
