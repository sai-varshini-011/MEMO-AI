from fastapi import FastAPI, UploadFile, File
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from dotenv import load_dotenv
from app.services.gemini_client import get_action_items, transcribe_audio
import os

load_dotenv()

app = FastAPI(title="Voice Notes App")

class AudioTranscript(BaseModel):
    text: str

@app.post("/api/organize")
async def organize_notes(transcript: AudioTranscript):
    ai_response = get_action_items(transcript.text)
    return {"action_items": ai_response}

@app.post("/api/transcribe")
async def transcribe(file: UploadFile = File(...)):
    audio_bytes = await file.read()
    text = transcribe_audio(audio_bytes, file.filename)
    return {"text": text}

app.mount("/static", StaticFiles(directory="app/static"), name="static")

@app.get("/")
async def serve_frontend():
    return FileResponse("app/static/index.html")