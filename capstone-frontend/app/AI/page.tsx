'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import imageCompression from 'browser-image-compression'
import { InView } from 'react-intersection-observer'
import { Upload } from 'lucide-react'  // 예시 아이콘

export default function AIPage() {
  const router = useRouter()
  const [mood, setMood] = useState('')
  const [style, setStyle] = useState('default')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const handleFilesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)
    setFiles(f => [...f, ...selected])

    // 압축 & 미리보기
    const previewUrls = await Promise.all(
      selected.map(file =>
        imageCompression(file, { maxSizeMB: 0.5, maxWidthOrHeight: 800 })
          .then(c => URL.createObjectURL(c))
      )
    )
    setPreviews(p => [...p, ...previewUrls])
  }

  const handleSubmit = async () => {
    if (!mood || files.length === 0) {
      alert('분위기와 사진을 모두 입력해주세요.')
      return
    }
    const formData = new FormData()
    formData.append('mood', mood)
    formData.append('style', style)
    files.forEach(f => formData.append('files', f))

    try {
      const res = await fetch('http://localhost:8000/generate-video', {
        method: 'POST',
        body: formData,
      })
      if (!res.ok) throw new Error('AI 요청 실패')
      const { video_url } = await res.json()
      router.push(`/AI/AiResult?video_url=${video_url}`)
    } catch (err) {
      console.error(err)
      alert('AI 요청 중 오류가 발생했습니다.')
    }
  }

  return (
    <div className="p-8 bg-white rounded shadow max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI 영상 제작</h1>

      <label className="block mb-2">원하는 분위기</label>
      <input
        type="text"
        value={mood}
        onChange={e => setMood(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
        placeholder="예) 따뜻하고 정겨운 분위기"
      />

      <label className="block mb-2">스타일 선택</label>
      <select
        value={style}
        onChange={e => setStyle(e.target.value)}
        className="w-full border rounded px-3 py-2 mb-4"
      >
        <option value="default">기본</option>
        <option value="emotional">감성</option>
        <option value="personal">1인칭</option>
        <option value="question">질문형</option>
        <option value="storytelling">스토리</option>
      </select>

      <label className="block mb-2">사진 첨부</label>
      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        accept="image/*"
        multiple
        ref={inputRef}
        className="hidden"
        onChange={handleFilesChange}
      />

      {/* 보이는 첨부 박스: 클릭 시 파일창 오픈 */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.click()}
        className="flex gap-2 overflow-x-auto border-2 border-dashed border-gray-300 p-4 rounded mb-6 cursor-pointer"
        style={{ minHeight: 120 }}
      >
        {previews.length > 0 ? (
          previews.map((url, i) => (
            <InView key={i} rootMargin="100px" triggerOnce>
              {({ inView, ref }) => (
                <div
                  ref={ref}
                  className="relative flex-shrink-0 w-32 h-32 rounded overflow-hidden"
                >
                  {inView ? (
                    <img
                      src={url}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 animate-pulse" />
                  )}
                </div>
              )}
            </InView>
          ))
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
            <Upload size={32} className="mb-2" />
            <span>여기를 클릭해 사진을 첨부하세요</span>
          </div>
        )}
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
      >
        AI 영상 요청
      </button>
    </div>
  )
}
