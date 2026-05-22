import os
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")


def send_recap_email(to_email: str, recap: str):
    from_email = os.getenv("FROM_EMAIL", "YouTube Recap <onboarding@resend.dev>")

    params = {
        "from": from_email,
        "to": [to_email],
        "subject": "Your YouTube Music Recap is Ready",
        "html": f"""
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>Your YouTube Music Recap</h2>
            <div style="white-space: pre-line;">{recap}</div>
        </div>
        """
    }

    return resend.Emails.send(params)