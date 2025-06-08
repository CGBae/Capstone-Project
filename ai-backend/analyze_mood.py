import os
import httpx
import time
from typing import List

API_URL = "https://api.openai.com/v1/chat/completions"
OPENAI_KEY = os.getenv("OPENAI_API_KEY")
MODEL    = "gpt-3.5-turbo"

if not OPENAI_KEY:
    raise RuntimeError("환경변수 OPENAI_API_KEY 가 설정되지 않았습니다.")

SUPPORTED_MOODS = {"따뜻한", "감성적", "정겨운", "활기찬"}

def analyze_mood(text: str) -> List[str]:
    headers = {
        "Authorization": f"Bearer {OPENAI_KEY}",
        "Content-Type":  "application/json",
    }
    payload = {
        "model": MODEL,
        "messages": [
            {
              "role":    "system",
              "content": (
                  "당신은 한국어 텍스트에서 분위기를 분류하는 전문가입니다. "
                  "다음 네 가지 카테고리 중 해당하는 것을 쉼표로 구분하여 출력하세요: "
                  "따뜻한, 감성적, 정겨운, 활기찬."
              )
            },
            {
              "role":    "user",
              "content": f"문장의 분위기를 분석하여 출력해주세요: 「{text}」"
            }
        ],
        "temperature": 0.0,
        "max_tokens": 30
    }

    backoff = 1 
    for attempt in range(5):
        with httpx.Client(timeout=30.0) as client:
            resp = client.post(API_URL, headers=headers, json=payload)
        if resp.status_code == 429:
            time.sleep(backoff)
            backoff *= 2
            continue
        resp.raise_for_status()
        data = resp.json()
        break
    else:
        raise RuntimeError("OpenAI API rate limit 초과: 재시도 5회 모두 실패")

    content = data["choices"][0]["message"]["content"]
    free_keywords = [kw.strip() for kw in content.split(",") if kw.strip()]
    mood_keywords = [kw for kw in free_keywords if kw in SUPPORTED_MOODS]
    return mood_keywords