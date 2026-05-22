def generate_library_recap(library_data):
    top_songs = [f"{i+1}. {t['title']} — {t['artists'][0]['name']}" 
                 for i, t in enumerate(library_data['liked_songs'][:10])]
    top_artists = sorted(library_data['artists'].items(), key=lambda x: x[1], reverse=True)
    top_artists_text = [f"{i+1}. {name} — {count} likes" 
                        for i, (name, count) in enumerate(top_artists[:10])]

    recap = f"""
Your YouTube Music Library Recap

Top Songs:
{chr(10).join(top_songs)}

Top Artists:
{chr(10).join(top_artists_text)}

Total Liked Songs: {len(library_data['liked_songs'])}
Total Playlists: {len(library_data['playlists'])}

Enjoy your music!
"""
    return recap