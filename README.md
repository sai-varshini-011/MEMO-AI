# LLMs Meet Speech

## Memo AI — Your Intelligent Voice Notes Assistant

A beginner-friendly project built for the LLMs Meet Speech take-home
assessment. Memo AI takes a messy, rambling voice note and turns it into
a clean summary with clear action items.

## What it does

- **Type mode:** Type out your note → LLM organizes it → Summary + Action Items
- **Speak mode:** Click "Speak Now" and talk → your speech is turned into text right in the browser → LLM organizes it → Summary + Action Items
- **Upload mode:** Upload an audio file → transcribed with Groq's Whisper model → LLM organizes it → Summary + Action Items

## Tech stack

- **Backend:** Python, FastAPI
- **Speech-to-text:** Browser's built-in Web Speech API (for live mic input) and Groq Whisper (`whisper-large-v3`) for uploaded audio files
- **LLM:** Groq API, model `openai/gpt-oss-120b`
- **Frontend:** HTML, CSS, JavaScript (vanilla, no framework)

## Run locally

1. Clone this repo and move into the folder:
   ```bash
   git clone <your-repo-url>
   cd LLMs-Meet-Speech
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Create a `.env` file in the project root and add your Groq API key:
   ```
   GROQ_API_KEY=your-real-key-here
   ```
   Get a free key at console.groq.com/keys (no credit card required).

4. Start the server:
   ```bash
   python -m uvicorn app.main:app --reload
   ```

5. Open `http://127.0.0.1:1101` in your browser and try it out.

## Approach

Kept the pipeline simple and linear: input (typed, spoken, or uploaded) →
transcript → LLM → summary + action items → displayed on screen. Groq
handles both the transcription and the summary generation, so the whole
project only needs a single free API key.

## Assumptions

- Voice notes are short and reasonably clear.
- English-language input.
- The user has their own free Groq API key.

## Known limitations

- No handling for very large audio files.
- No retry logic for API rate limits.
- Single-user tool, no login/authentication.

## AI coding assistant use

This project was built with the help of an AI coding assistant (Claude),
as permitted by the assessment's ground rules.
