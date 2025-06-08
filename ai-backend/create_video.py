from moviepy.editor import (
    ImageClip,
    TextClip,
    CompositeVideoClip,
    concatenate_videoclips,
    AudioFileClip
)
import os

from moviepy.config import change_settings
from moviepy.editor import ColorClip

change_settings({
    "IMAGEMAGICK_BINARY": r"C:\Program Files\ImageMagick-7.1.1-Q16-HDRI\magick.exe"
})

def create_video(
    image_paths: list[str],
    subtitles: list[str],
    music_path: str,
    output_path: str
):
    """
    이미지 리스트와 자막 리스트를 받아 3초씩 재생되는 비디오를 생성합니다.
    MoviePy의 TextClip을 사용해 자막을 입힙니다.
    """
    # 자막과 이미지 개수 정합성
    if len(subtitles) < len(image_paths):
        repeats = (len(image_paths) // len(subtitles)) + 1
        subtitles = (subtitles * repeats)[:len(image_paths)]
    else:
        subtitles = subtitles[:len(image_paths)]

    clips = []
    duration = 3  # 각 이미지 재생 시간
    video_w, video_h = 1280, 720

    for img_path, txt in zip(image_paths, subtitles):
        # 1) 이미지 클립 생성 및 크기 조정
        ic = ImageClip(img_path).set_duration(duration).resize(height=video_h)

        background = ColorClip(size=(video_w, video_h), color=(0, 0, 0)).set_duration(duration)
        ic = ic.set_position(("center", "center"))

        # 2) TextClip으로 자막 생성
        tc = (
            TextClip(
                txt,
                fontsize=48,
                color="white",
                stroke_color="black",
                stroke_width=2,
                font="Malgun-Gothic",
                size=(video_w - 40, None),
                method="caption"
            )
            .set_duration(duration)
            .set_position(("center", "bottom"))
        )

        # 3) 이미지와 자막 합성
        clip = CompositeVideoClip([background, ic, tc], size=(video_w, video_h))
        clips.append(clip)

    # 4) 클립 이어붙이기
    video = concatenate_videoclips(clips, method="compose")

    # 5) 배경음악 추가
    if music_path:
        candidate = music_path if os.path.exists(music_path) else os.path.join("music", music_path)
        if os.path.exists(candidate):
            audio = AudioFileClip(candidate).subclip(0, video.duration)
            video = video.set_audio(audio)
        else:
            print(f"⚠️ 음악 파일을 찾을 수 없습니다: {candidate}. 배경음악 없이 진행합니다.")

    # 6) 비디오 파일 출력
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    video.write_videofile(output_path, fps=24)
