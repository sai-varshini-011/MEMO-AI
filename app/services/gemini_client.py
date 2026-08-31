import os
import io
from groq import Groq

def transcribe_audio(audio_bytes: bytes, filename: str) -> str:
    """Transcribes an uploaded audio file using Groq's Whisper model."""
    try:
        api_key = os.getenv("GROQ_API_KEY")
        client = Groq(api_key=api_key)

        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = filename or "audio.wav"  # Groq needs a filename with extension

        transcription = client.audio.transcriptions.create(
            file=audio_file,
            model="whisper-large-v3",
        )
        return transcription.text
    except Exception as e:
        return f"Transcription Error: {str(e)}"

def get_action_items(transcript_text: str):
    try:
        api_key = os.getenv("GROQ_API_KEY")
        client = Groq(api_key=api_key)
        
        prompt = f"""You are a highly intelligent AI assistant.
        1. If the user says hello, greet them politely.
        2. Provide a clean 'Summary' paragraph fixing any broken words.
        3. Provide a clear 'Action Items' numbered list.
        Do NOT use markdown symbols like * or #.
        
        Transcript: {transcript_text}"""
        
        # Groq's fast inference chip running OpenAI's open model
        chat_completion = client.chat.completions.create(
            messages=[{"role": "user", "content": prompt}],
            model="openai/gpt-oss-120b", 
        )
        return chat_completion.choices[0].message.content

    except Exception as e:
        return f"Groq API Error: {str(e)}"