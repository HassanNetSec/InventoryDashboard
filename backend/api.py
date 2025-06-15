from fastapi import APIRouter,Depends,HTTPException,status,Query
from database import get_db
from model import User as User_db,AdminData,Category,Product
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
import bcrypt
import uuid
from auth_utils import User,create_access_token,decode_access_token,TokenData,hash_password,Data_from_Category,Products,TokenRequest,CategoryReq,userRequest

router = APIRouter()

mySalt = bcrypt.gensalt()

unique_id = uuid.uuid4()



@router.post("/creat_token")
def creat_token(data : User):
    token= create_access_token(data)
    return token
 
@router.post("/decode_token",response_model=TokenData)
def decode_token(token : TokenRequest) -> TokenData:
    data = decode_access_token(token.token)
    return data

@router.post("/register_user")
def register_user(user_detail: User, db: Session = Depends(get_db)):
    if user_detail.role == 'admin':
        existing_admin = db.query(AdminData).filter(AdminData.email == user_detail.email).first()
        if existing_admin:
            raise HTTPException(status_code=400, detail="Admin with this email already exists.")
        
        # Allow only one admin in the system
        if db.query(AdminData).count() > 0:
            raise HTTPException(status_code=400, detail="Admin account already registered. Only one admin allowed.") 
        
        new_admin = AdminData(
            id=uuid.uuid4(),
            fullname=user_detail.full_name,
            email=user_detail.email,
            password=hash_password(user_detail.hashed_password)
        )
        db.add(new_admin)
        db.commit()
        db.refresh(new_admin)

        token = create_access_token({
            "id": str(new_admin.id),
            "email": new_admin.email,
            "role": "admin"
        })

        return {"message": "Admin created successfully", "token": token}

    elif user_detail.role == 'staff':
        existing_user = db.query(User_db).filter(User_db.email == user_detail.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="User with this email already exists.")

        new_user = User_db(
            id=uuid.uuid4(),
            full_name=user_detail.full_name,
            email=user_detail.email,
            hashed_password=hash_password(user_detail.hashed_password),
            role="staff",
            is_active=True
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        token = create_access_token({
            "id": str(new_user.id),
            "email": new_user.email,
            "role": "staff"
        })

        return {"message": "User created successfully", "token": token}
    
    else:
        raise HTTPException(status_code=400, detail="Invalid role")


@router.get("/api/categories")
def get_list_category(db : Session= Depends(get_db)):
    categ = db.query(Category).all()
    return categ

@router.post("/api/categories_by_name")
def get_list_category(payload: CategoryReq, db: Session = Depends(get_db)):
    existing = db.query(Category).filter(Category.name == payload.name).first()
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found"
        )
    return {"id": existing.id}

@router.post("/api/addcategories")
def add_category(data: Data_from_Category, db: Session = Depends(get_db)):
    try:
        # Optional: check if category with same name already exists
        existing = db.query(Category).filter(Category.name == data.name).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category with this name already exists"
            )

        category_data = Category(
            name=data.name,
            description=data.description
        )
        db.add(category_data)
        db.commit()
        db.refresh(category_data)

        return {"message": "Category added successfully"}

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Database integrity error (e.g. duplicate or null value)"
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An unexpected database error occurred"
        )
    
from pydantic import BaseModel

class CategoryEditRequest(BaseModel):
    category_old_name: str
    category_new_name: str

@router.post("/api/editcategories")
def edit_category(data: CategoryEditRequest, db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.name == data.category_old_name).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")

    # Check if new_name is already taken
    existing = db.query(Category).filter(Category.name == data.category_new_name).first()
    if existing and existing.name != data.category_old_name:
        raise HTTPException(status_code=400, detail="New category name already exists")

    category.name = data.category_new_name
    db.commit()
    db.refresh(category)
    return {"message": "Category updated successfully", "category": category}

@router.delete("/api/deletecategories")
def delete_category(name_of_category: str = Query(...), db: Session = Depends(get_db)):
    category = db.query(Category).filter(Category.name == name_of_category).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    try:
        db.delete(category)
        db.commit()
        return {"detail": f"Category '{name_of_category}' deleted successfully"}
    except IntegrityError as err:
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete category due to related products or integrity constraint: {err.orig}"
        )

@router.get("/api/products")
def get_product_from_db(db:Session = Depends(get_db)):
    product =  db.query(Product).all()
    return product

@router.post("/api/addProduct", status_code=status.HTTP_201_CREATED)
def add_products(payload: Products, db: Session = Depends(get_db)):
    try:

        # Create a new Product instance
        data = Product(
            id=unique_id,
            name=payload.name,
            description=payload.description,
            price=payload.price,
            stock=payload.stock,
            low_stock_threshold= payload.low_stock_threshold,
            image_url=payload.image_url,
            category_id=payload.category_id,
            user_id=payload.user_id
        )

        db.add(data)
        db.commit()
        db.refresh(data)

        return {
            "message": "Product added successfully",
            "product_id": data.id
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to add product: {str(e)}"
        )

class UpdateProfileContent(BaseModel):
    email: str
    password: str  # Password should be string

@router.post("/api/findUserByEmail")
def findUserByEmail(payload: userRequest, db: Session = Depends(get_db)):
    user = db.query(User_db).filter(User_db.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="User with this email not found")
    return user  # returning a single user object (FastAPI handles JSON serialization)

@router.post("/api/updateProfile")
def updateUserProfile(payload: UpdateProfileContent, db: Session = Depends(get_db)):
    user = db.query(User_db).filter(User_db.email == payload.email).first()
    if not user:
        raise HTTPException(status_code=400, detail="User with this email not found")
    
    user.password = hash_password(payload.password)  # update password hashed
    db.commit()
    db.refresh(user)  # refresh to get updated state from DB
    return {"detail": "Profile updated successfully"}