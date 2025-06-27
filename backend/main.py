from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import os
import json

app = FastAPI()

# Allow frontend requests from all origins (development only)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Folder to store resumes
SAVE_DIR = "saved_resumes"
os.makedirs(SAVE_DIR, exist_ok=True)

class EnhanceRequest(BaseModel):
    section: str
    content: str

class ResumeData(BaseModel):
    name: str
    summary: str
    education: list[str]
    skills: list[str]

@app.post("/ai-enhance")
async def enhance_section(request: EnhanceRequest):
    # Just prepend "Enhanced:" to simulate AI output
    enhanced = f"Enhanced: {request.content}"
    return {"enhanced": enhanced}

@app.post("/save-resume")
async def save_resume(user: Optional[str] = "default", request: Request = None):
    data = await request.json()
    with open(os.path.join(SAVE_DIR, f"{user}.json"), "w") as f:
        json.dump(data, f, indent=2)
    return {"message": f"Resume saved for user: {user}"}

@app.get("/get-resume")
async def get_resume(user: Optional[str] = "default"):
    path = os.path.join(SAVE_DIR, f"{user}.json")
    if os.path.exists(path):
        with open(path, "r") as f:
            data = json.load(f)
        return data
    else:
        return {"message": "No resume found"}
