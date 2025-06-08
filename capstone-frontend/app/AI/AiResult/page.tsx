'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AiResultPage() {
  const params = useSearchParams()
  const videoUrlParam = params.get('video_url')
  const [videoSrc, setVideoSrc] = useState<string | null>(null)

  useEffect(() => {
    if (!videoUrlParam) return;
    const base = 'http://localhost:8000';
    const path = videoUrlParam.startsWith('/')
    ? videoUrlParam
    : `/${videoUrlParam}`;
    setVideoSrc(`${base}${path}`);
  }, [videoUrlParam]);

  if (!videoUrlParam) {
    return <p className="p-8 text-center text-red-500">영상 URL이 없습니다.</p>
  }
  if (!videoSrc) {
    return <p className="p-8 text-center">로딩 중...</p>
  }

  return (
    <div className="p-8 mx-auto max-w-2xl bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">AI 생성 영상</h1>
      <video
        controls
        preload="metadata"
        className="w-full rounded shadow mb-4"
      >
        <source src={videoSrc} type="video/mp4" />
        브라우저가 video 태그를 지원하지 않습니다.
      </video>
      <a
        href={videoSrc}
        download
        className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        영상 다운로드
      </a>
    </div>
  )
}
