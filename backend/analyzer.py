from collections import Counter
from typing import List, Dict


def is_likely_music(item: Dict) -> bool:
    title = item.get("title", "").lower()
    channel = item.get("channel", "").lower()

    music_keywords = [
        "official video", "official audio", "lyrics", "lyric video",
        "music", "remix", "album", "song", "audio", "vevo",
        "performance", "live", "visualizer"
    ]

    return any(keyword in title or keyword in channel for keyword in music_keywords)


def analyze_history(items: List[Dict]) -> Dict:
    music_items = [item for item in items if is_likely_music(item)]

    if not music_items:
        music_items = items

    title_counts = Counter(item["title"] for item in music_items if item.get("title"))
    channel_counts = Counter(item["channel"] for item in music_items if item.get("channel"))

    total_items = len(items)
    total_music_items = len(music_items)

    top_songs = title_counts.most_common(10)
    top_artists = channel_counts.most_common(10)

    most_repeated = top_songs[0] if top_songs else None

    return {
        "total_history_items": total_items,
        "total_music_items": total_music_items,
        "top_songs": top_songs,
        "top_artists": top_artists,
        "most_repeated": most_repeated,
    }