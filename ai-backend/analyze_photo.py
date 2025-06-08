import os
from typing import List
from google.cloud import vision
from google.api_core.exceptions import GoogleAPICallError, PermissionDenied

import random

cred = os.getenv("GOOGLE_APPLICATION_CREDENTIALS")
if not cred:
    raise RuntimeError("GOOGLE_APPLICATION_CREDENTIALS가 설정되어 있지 않습니다.")
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = cred

client = vision.ImageAnnotatorClient()

def analyze_photos(paths: list[str], mood_keywords: list[str]) -> list[str]:
    client = vision.ImageAnnotatorClient()
    selected = []
    for p in paths:
        with open(p, "rb") as img:
            resp = client.label_detection({"content": img.read()})
        labels = [l.description for l in resp.label_annotations]
        if any(kw in labels for kw in mood_keywords):
            selected.append(p)
    return selected

def extract_photo_keywords(
    image_paths: List[str],
    max_labels: int = 5
) -> List[List[str]]:
    
    dummy_pool = [
        ["Cloud", "Tree", "Bird", "Sky", "Nature"],
        ["Sea", "Boat", "Port", "Wave", "Beach"],
        ["Temple", "Hanbok", "Culture", "History", "Stone"],
        ["City", "Building", "Street", "Car", "People"],
        ["Flower", "Garden", "Park", "Green", "Leaf"],
    ]

    '''keywords_per_image: List[List[str]] = []
    for path in image_paths:
        try:
            with open(path, "rb") as f:
                content = f.read()
            image = vision.Image(content=content)
            response = client.label_detection(image=image)
            if response.error.message:
                raise GoogleAPICallError(response.error.message)
            labels = response.label_annotations
            descs = [label.description for label in labels[:max_labels]]
        except (GoogleAPICallError, PermissionDenied, Exception) as e:
            base = os.path.splitext(os.path.basename(path))[0]
            if "_" in base:
                base = base.split('_', 1)[1]
            descs = [base]
        keywords_per_image.append(descs)
    return keywords_per_image'''

    if len(image_paths) <= len(dummy_pool):
        selected = random.sample(dummy_pool, len(image_paths))
    else:
        selected = [random.choice(dummy_pool) for _ in image_paths]

    keywords_per_image: List[List[str]] = []
    for pool in selected:
        keywords_per_image.append(pool[:max_labels])

    return keywords_per_image