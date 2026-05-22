from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Mode 1 imports
from parser import parse_takeout_file
from analyzer import analyze_history
from ai_summary import generate_recap

# Mode 2 imports
from ytmusic_service import YouTubeMusicLibraryError, fetch_library_data
from library_analyzer import generate_library_recap

# Email service (shared by both modes)
from email_service import send_recap_email

app = FastAPI(title="YouTube Music Recap MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/")
def home():
    return {"message": "YouTube Music Recap API is running"}


# Mode 1: Takeout JSON upload
@app.post("/generate-recap")
async def generate_recap_endpoint(
    email: str = Form(...),
    file: UploadFile = File(...)
):
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email address.")

    if not file.filename.endswith(".json"):
        raise HTTPException(status_code=400, detail="Please upload a JSON file.")

    try:
        content = await file.read()
        items = parse_takeout_file(content)
        analysis = analyze_history(items)
        recap = generate_recap(analysis)
        send_recap_email(email, recap)

        return {
            "success": True,
            "message": "Recap generated and sent successfully.",
            "analysis": analysis,
            "recap": recap
        }

    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")


# Mode 2: Automatic YouTube Music library recap
@app.post("/generate-library-recap")
async def generate_library_recap_endpoint(email: str = Form(...)):
    if not email or "@" not in email:
        raise HTTPException(status_code=400, detail="Invalid email address.")

    try:
        library_data = fetch_library_data(limit=50)
        recap = generate_library_recap(library_data)
        send_recap_email(email, recap)
        return {"success": True, "message": "Library recap sent successfully.", "recap": recap}

    except YouTubeMusicLibraryError as e:
        raise HTTPException(status_code=502, detail=str(e))

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
