import openai
import os
import json
from dotenv import load_dotenv
from openai.error import RateLimitError
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

load_dotenv(override=True)
openai.api_key = os.getenv("OPENAI_API_KEY")
if not openai.api_key:
    raise RuntimeError("OPENAI_API_KEY가 설정되어 있지 않습니다.")

def generate_subtitles(
    photo_keywords: list[str],
    count: int = 30,
    style: str = "default"
) -> list[str]:
    if style == "emotional":
        prompt = (
            f"사진의 키워드 {photo_keywords}를 기반으로, "
            f"감정을 자극하는 감성적이고 짧은 한글 문장 {count}개를 JSON 배열 형태로 추천해줘."
        )
    elif style == "personal":
        prompt = (
            f"사진의 키워드 {photo_keywords}를 기반으로, "
            f"1인칭 시점으로 개인적 추억을 떠올리는 듯한 짧은 한글 문장 {count}개를 JSON 배열 형태로 추천해줘."
        )
    elif style == "question":
        prompt = (
            f"사진의 키워드 {photo_keywords}를 기반으로, "
            f"이 사진을 볼 때의 기억을 묻는 짧은 질문형 한글 문장 {count}개를 JSON 배열 형태로 추천해줘."
        )
    elif style == "storytelling":
        prompt = (
            f"사진의 키워드 {photo_keywords}를 바탕으로, "
            f"이전 사진과 자연스럽게 연결되는 이야기 형식의 짧은 한글 문장 {count}개를 JSON 배열 형태로 추천해줘."
        )
    else:
        prompt = (
            f"사진의 키워드 {photo_keywords}를 기반으로, "
            f"짧고 감성적인 한글 문장 {count}개를 JSON 배열 형태로 추천해줘."
        )

    try:
        resp = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role":"system","content":"오직 JSON 배열만, 설명 금지."}, 
                      {"role": "user", "content": prompt}],
            temperature=0.8
        )
        content = resp.choices[0].message.content
        logger.debug("▶ OpenAI 응답: %r", content)
        subs = json.loads(content)
        logger.debug("▶ 파싱된 자막 리스트: %r", subs)
        if not isinstance(subs, list):
            subs = [subs]
        subs = subs[:count]
        while len(subs) < count:
            subs.append("")
        return subs
    except RateLimitError as e:
        logger.error("⚠️ RateLimitError: %s", e)
    except json.JSONDecodeError as e:
        logger.error("⚠️ JSON 파싱 실패: %s", e)
    except Exception as e:
        logger.error("⚠️ 기타 오류: %s", e)
    return photo_keywords