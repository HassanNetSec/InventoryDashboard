from fastapi import FastAPI
import model
from database import postgres_engine
from api import router 
from fastapi.middleware.cors import CORSMiddleware

# Create all tables
model.Base.metadata.create_all(bind=postgres_engine)

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware, 
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# You can later add routers and endpoints here
app.include_router(router)