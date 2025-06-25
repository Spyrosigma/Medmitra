from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from routes.case import router as case_router

app = FastAPI(title="MedMitra Backend", description="Backend API for MedMitra medical case management", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],  
)

app.include_router(case_router)

@app.get("/")
def read_root():
    return {"message": "MedMitra Backend API is running!"}


if __name__ == "__main__":
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)