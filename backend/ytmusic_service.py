import json
import os
from pathlib import Path

from dotenv import load_dotenv
from requests.exceptions import RequestException
from ytmusicapi import YTMusic
from ytmusicapi.auth.oauth import OAuthCredentials
from ytmusicapi.exceptions import YTMusicError


OAUTH_FILE = Path(__file__).with_name("oauth.json")
BROWSER_AUTH_FILE = Path(__file__).with_name("browser.json")
ENV_FILE = Path(__file__).with_name(".env")

load_dotenv(ENV_FILE)


class YouTubeMusicLibraryError(Exception):
    """Raised when YouTube Music library data cannot be fetched."""


def _get_ytmusic_client():
    if BROWSER_AUTH_FILE.exists():
        return YTMusic(auth=str(BROWSER_AUTH_FILE))

    if not OAUTH_FILE.exists():
        raise YouTubeMusicLibraryError(
            f"YouTube Music auth file not found at {OAUTH_FILE}."
        )

    return YTMusic(auth=str(OAUTH_FILE), oauth_credentials=_get_oauth_credentials())


def _get_oauth_credentials():
    with OAUTH_FILE.open(encoding="utf-8") as auth_file:
        auth_data = json.load(auth_file)

    if "refresh_token" not in auth_data:
        return None

    client_id = os.getenv("YTMUSIC_CLIENT_ID") or os.getenv("GOOGLE_CLIENT_ID")
    client_secret = os.getenv("YTMUSIC_CLIENT_SECRET") or os.getenv("GOOGLE_CLIENT_SECRET")

    if not client_id or not client_secret:
        raise YouTubeMusicLibraryError(
            "oauth.json uses OAuth token auth, but the matching OAuth client "
            "credentials are missing. Add YTMUSIC_CLIENT_ID and "
            "YTMUSIC_CLIENT_SECRET to backend/.env, then restart the server."
        )

    return OAuthCredentials(client_id=client_id, client_secret=client_secret)


def fetch_library_data(limit=50):
    """
    Fetch user's library content from YouTube Music.
    Returns liked songs, artists, and playlists.
    """
    try:
        yt = _get_ytmusic_client()
        liked_songs = yt.get_liked_songs(limit=limit)
        playlists = yt.get_library_playlists(limit=limit)
    except YTMusicError as e:
        raise _library_error_from_ytmusic_error(e) from e
    except RequestException as e:
        raise YouTubeMusicLibraryError(
            f"Could not connect to YouTube Music: {e}"
        ) from e

    artists = {}
    for item in liked_songs.get("tracks", []):
        for artist in item.get("artists", []):
            name = artist.get("name")
            if name:
                artists[name] = artists.get(name, 0) + 1

    return {
        "liked_songs": liked_songs.get("tracks", []),
        "artists": artists,
        "playlists": playlists,
    }


def _library_error_from_ytmusic_error(error):
    message = str(error)
    if "Request contains an invalid argument" in message and not BROWSER_AUTH_FILE.exists():
        return YouTubeMusicLibraryError(
            "YouTube Music rejected the OAuth request with HTTP 400. "
            "This is a known ytmusicapi OAuth failure for authenticated "
            "library endpoints. Create backend/browser.json from your logged-in "
            "YouTube Music browser session, then restart the server."
        )

    return YouTubeMusicLibraryError(
        f"Could not fetch YouTube Music library: {message}"
    )
