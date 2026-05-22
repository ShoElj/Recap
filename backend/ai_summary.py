def generate_recap(analysis: dict) -> str:

    top_songs = "\n".join(
        [f"{i+1}. {song} — {count} plays"
         for i, (song, count) in enumerate(analysis["top_songs"])]
    )

    top_artists = "\n".join(
        [f"{i+1}. {artist} — {count} plays"
         for i, (artist, count) in enumerate(analysis["top_artists"])]
    )

    most_song, most_count = analysis["most_repeated"]

    personality = "consistent replay energy"
    
    if most_count >= 10:
        personality = "obsessive replay energy"
    elif most_count >= 5:
        personality = "main character energy"

    recap = f"""
Your YouTube Music Recap

You played {analysis["total_music_items"]} music videos.

TOP SONGS
{top_songs}

TOP ARTISTS
{top_artists}

MOST REPLAYED TRACK
{most_song} — {most_count} plays

YOUR LISTENING VIBE
You have {personality} and clearly know the songs you love.

Thanks for using YouTube Music Recap.
"""

    return recap