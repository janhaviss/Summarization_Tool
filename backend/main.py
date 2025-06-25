from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
<<<<<<< HEAD
from fastapi import FastAPI
from router import  summarization ,translator,tt

# 🧩 Import your user router and DB setup
# from users.router import router as user_router
# from users import models
from database import engine

# Auto-create tables
# models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Allow frontend dev server (adjust port if needed)
origins = [
    "http://localhost:5173",  # Vite default
    "http://127.0.0.1:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
=======

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000","http://localhost:5173"],  # React's default port
>>>>>>> b63f7ed5cd7b7303d11e64ee410ea69beebfc54d
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

<<<<<<< HEAD
# Default test route
@app.get("/api/hello")
def read_root():
    return {"message": "Hello from FastAPI! Mrunali is the best"}

# 🧩 Include users router
# app.include_router(user_router)

app.include_router(summarization.router)
app.include_router(translator.router)
app.include_router(tt.router)

@app.get("/")
def home():
    return {"message": "Summarization Tool API"}
=======
@app.get("/")
async def root():
    return {"message": "Welcome to the FastAPI backend!"}

@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI!"}
>>>>>>> b63f7ed5cd7b7303d11e64ee410ea69beebfc54d
