import multiprocessing, sys
multiprocessing.set_executable(sys.executable)
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os
import pathlib
import shutil
import uuid
import traceback

from dotenv import load_dotenv
load_dotenv(override=True)

OPENAI_KEY = os.getenv("OPENAI_API_KEY")

from analyze_mood import analyze_mood
from analyze_photo import analyze_photos, extract_photo_keywords
from generate_subtitle import generate_subtitles
from recommand_music import recommend_music
from create_video import create_video

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR    = pathlib.Path(__file__).parent.resolve()
UPLOAD_DIR  = BASE_DIR / "uploads"
RESULT_DIR  = BASE_DIR / "results"

UPLOAD_DIR.mkdir(exist_ok=True)
RESULT_DIR.mkdir(exist_ok=True)

app.mount(
    "/results",
    StaticFiles(directory=str(RESULT_DIR)),
    name="results"
)

@app.post("/generate-video")
async def generate_video(
    mood: str = Form(...),
    style: str = Form(...),
    files: list[UploadFile] = File(...)
):
    try:
        print("▶ [STEP 1] generate_video 시작:", mood, len(files), "files")
        saved_files = []
        for f in files:
            orig_name = os.path.basename(f.filename)
            ext = os.path.splitext(orig_name)[1] or ""
            unique_name = f"{uuid.uuid4()}{ext}"
            save_path = UPLOAD_DIR / unique_name
            with open(save_path, "wb") as buf:
                shutil.copyfileobj(f.file, buf)
            saved_files.append(str(save_path))
        print("→ 파일 저장 완료:", saved_files)

        mood_keywords = analyze_mood(mood)
        print("→ mood_keywords:", mood_keywords)

        #selected = analyze_photos(saved_files, mood_keywords)
        #print("→ 선택된 사진:", selected)

        try:
            photo_keywords: list[list[str]] = extract_photo_keywords(saved_files)
        except Exception as e:
            print("⚠️ Vision API 에러, 파일명 기반 키워드 대체:", e)
            photo_keywords = []
            for p in saved_files:
                base = os.path.splitext(os.path.basename(p))[0]
                if '_' in base:
                    base = base.split('_', 1)[1]
                photo_keywords.append([base])
        print("→ photo_keywords:", photo_keywords)

        flat_keywords = [kw for kws in photo_keywords for kw in kws]
        print("→ flat_keywords:", flat_keywords)

        subtitles: list[str] = []
        for idx, kws in enumerate(photo_keywords):
            sub_list = generate_subtitles(kws, count=1, style=style)
            if not isinstance(sub_list, list):
                print(f"⚠️ generate_subtitles 반환 타입 오류 (idx={idx}):", sub_list)
                sub_list = []
            if len(sub_list) < 1:
                print(f"⚠️ 자막 생성 실패 (idx={idx}), 키워드:", kws)
                subtitles.append("")
            else:
                subtitles.append(sub_list[0])
                if len(sub_list) > 1:
                    print(f"⚠️ 예상 외 자막 개수 (idx={idx}): {len(sub_list)} → 첫 번째만 적용")
        if len(subtitles) != len(saved_files):
            diff = len(saved_files) - len(subtitles)
            print(f"⚠️ 자막/이미지 개수 불일치: images={len(saved_files)}, subs={len(subtitles)}, pad={diff}")
            subtitles.extend([""] * diff)
        print("→ subtitles:", subtitles)

        music_path = recommend_music(mood_keywords)
        print("→ music_path:", music_path)

        result_name = f"{uuid.uuid4()}.mp4"
        result_path = str(RESULT_DIR / result_name)
        print("→ 최종비디오경로:", result_path)
        create_video(saved_files, subtitles, music_path, result_path)
        print("→ 비디오 생성 완료")

        return {"video_url": f"/results/{result_name}"}

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(500, detail=str(e))

@app.get("/results/{filename}")
async def download_result_video(filename: str):
    filepath = str(RESULT_DIR / filename)
    return FileResponse(filepath, media_type="video/mp4", filename=filename)
