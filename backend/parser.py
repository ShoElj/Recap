import json
from typing import List, Dict


def parse_takeout_file(file_content: bytes) -> List[Dict]:
    try:
        data = json.loads(file_content.decode("utf-8"))
    except Exception:
        raise ValueError("Invalid JSON file. Please upload your Google Takeout watch-history.json file.")

    if not isinstance(data, list):
        raise ValueError("Invalid format. Expected a list of YouTube history items.")

    clean_items = []

    for item in data:
        title = item.get("title", "").replace("Watched ", "").strip()
        channel = ""

        subtitles = item.get("subtitles", [])
        if subtitles and isinstance(subtitles, list):
            channel = subtitles[0].get("name", "")

        clean_items.append({
            "title": title,
            "channel": channel,
            "time": item.get("time", ""),
            "url": item.get("titleUrl", "")
        })

    return clean_items