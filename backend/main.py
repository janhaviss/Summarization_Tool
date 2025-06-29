from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from router import summarization, translator, auth,tts,auth
from fastapi import Depends

# app = FastAPI()
app = FastAPI()



# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Public endpoints   #! summarization
app.include_router(
    summarization.router,
    prefix="/api/summarize",
    tags=["Summarization"]
)

# Protected endpoints  #! translate
app.include_router(
    translator.router,
    prefix="/api/translate",
    tags=["Translation"],
    # dependencies=[Depends(auth.get_current_user)]  # Global protection
)

#! tts
app.include_router(
    tts.router,
    prefix="/api/tts",
    tags=["Text-to-Speech"]
)

# Auth endpoints
app.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)

