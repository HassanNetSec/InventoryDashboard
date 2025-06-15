from sqlalchemy import Column, String, Integer, Text, Float, Boolean, ForeignKey, Date, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from database import Base
import uuid
from datetime import date


class User(Base):
    __tablename__ = 'users'
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default="staff")  # "admin", "staff"
    is_active = Column(Boolean, default=True)
    created_at = Column(Date, default=date.today)

    products = relationship("Product", back_populates="user")


class Product(Base):
    __tablename__ = "products"
    
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    name = Column(String, index=True)
    description = Column(Text)
    price = Column(Float)
    stock = Column(Integer)
    low_stock_threshold = Column(Integer, default=5)
    image_url = Column(String, nullable=True)
    category_id = Column(UUID(as_uuid=True), ForeignKey("categories.id"))
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))

    user = relationship("User", back_populates="products")
    category = relationship("Category", back_populates="products")


class Category(Base):
    __tablename__ = "categories"
    
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    name = Column(String, unique=True)
    description = Column(String, nullable=True)

    products = relationship("Product", back_populates="category")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    action = Column(String)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    product_id = Column(UUID(as_uuid=True), ForeignKey("products.id"), nullable=True)
    timestamp = Column(Date, default=date.today)
    details = Column(JSON)

    user = relationship("User", backref="audit_logs")
    product = relationship("Product", backref="audit_logs")


class AdminData(Base):
    __tablename__ = 'admin'
    id = Column(UUID(as_uuid=True), primary_key=True, index=True, default=uuid.uuid4)
    fullname = Column(String)
    email = Column(String, unique=True)
    password = Column(String)
