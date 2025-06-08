import random
import random, os

MUSIC_DIR = "music"

_music_db = {
    "따뜻한": ["lofi-lofi-song-345371.mp3", "Lullaby.mp3", "Sun.mp3"],
    "감성적": ["relaxing-piano-music-345081.mp3", "momentum-345083.mp3", "Nostelgia.mp3"],
    "정겨운": ["Cheek To Cheek.mp3","jazz-happy-110855.mp3"],
    "활기찬": ["BLACK BOX - Dimension!.mp3", "catch-it-117676.mp3", "funny-running-129223.mp3"]
}

def recommend_music(mood_keywords: list[str]) -> str:
    for mood in random.sample(mood_keywords, len(mood_keywords)):
        if mood in _music_db:
            filename = random.choice(_music_db[mood])
            path = os.path.join(MUSIC_DIR, filename)
            return path if os.path.exists(path) else filename
        
    default_list = next(iter(_music_db.values()))
    default_file = default_list[0]
    default_path = os.path.join(MUSIC_DIR, default_file)
    return default_path if os.path.exists(default_path) else default_file
