"use client";
import { useState, useRef } from "react";
import imageCompression from "browser-image-compression";
import { InView } from "react-intersection-observer";
import { FileText, Upload, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function RequestingPage() {
  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [previews, setPreviews] = useState<string[]>([]);
  const [photos, setPhotos] = useState<string[]>([]);

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const scrollRef = useRef<HTMLDivElement>(null);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const previewUrls = await Promise.all(
      files.map(async (file) => {
        const compressed = await imageCompression(file, {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 800,
        });
        return URL.createObjectURL(compressed);
      })
    );
    setPreviews((prev) => [...prev, ...previewUrls]);

    const formData = new FormData();
    files.forEach((f) => formData.append("files", f));
    const res = await fetch("http://localhost:8080/api/files/upload", { method: "POST", body: formData });
    if (res.ok) {
      const uploaded: string[] = await res.json();
      setPhotos((prev) => [...prev, ...uploaded]);
    } else {
      console.error("Photo upload failed:", res.statusText);
    }
  };

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    setVideoPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("files", file);
    const res = await fetch("http://localhost:8080/api/files/upload", { method: "POST", body: formData });
    if (res.ok) {
      const [url] = await res.json();
      setVideoUrl(url);
    } else {
      console.error("Video upload failed:", res.statusText);
    }
  };

  const deletePhoto = (idx: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
    setPhotos((prev) => prev.filter((_, i) => i !== idx));
  };
  const deleteVideo = () => {
    setVideoPreview(null);
    setVideoUrl("");
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (scrollRef.current) scrollRef.current.scrollLeft += e.deltaY;
  };

  const handleSubmit = async () => {
    const payload = {
      title,
      description,
      status: "ONGOING",
      videoUrl,
      photoUrls: photos,
    };
    try {
      const res = await fetch("http://localhost:8080/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        router.push("/request");
      } else {
        console.error("Request failed:", res.statusText);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto">
      {/* 제목 */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">의뢰 제목</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-1"
          placeholder="제목 입력"
        />
      </div>

      {/* 사진 첨부 */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">사진 첨부</label>
        <div
          ref={scrollRef}
          onWheel={handleWheel}
          className="relative border rounded-lg h-48 bg-white overflow-x-auto flex gap-2 p-2"
        >
          <input
            type="file"
            accept="image/*"
            multiple
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handlePhotoChange}
          />
          {previews.length > 0 ? (
            previews.map((url, idx) => (
              <InView key={idx} rootMargin="100px" triggerOnce>
                {({ inView, ref }) => (
                  <div
                    ref={ref}
                    className="relative flex-shrink-0 w-40 h-full rounded overflow-hidden"
                  >
                    {inView ? (
                      <img src={url} alt={`preview-${idx}`} className="object-cover w-full h-full" />
                    ) : (
                      <div className="w-full h-full bg-gray-200 animate-pulse" />
                    )}
                    <button
                      onClick={() => deletePhoto(idx)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </InView>
            ))
          ) : (
            <div className="w-full flex justify-center items-center">
              <Upload size={28} />
            </div>
          )}
        </div>
      </div>

      {/* 참고 영상 */}
      <div className="mb-4">
        <label className="block mb-1 font-semibold">참고 영상</label>
        <div className="border rounded flex justify-between items-center px-3 py-2 bg-white relative">
          <input
            type="file"
            accept="video/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleVideoChange}
          />
          {videoPreview ? (
            <div className="relative w-full">
              <video controls src={videoPreview} className="w-full h-auto rounded" />
              <button
                onClick={deleteVideo}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ) : (
            <>
              <span className="text-gray-400">영상 업로드</span>
              <Upload size={24} />
            </>
          )}
        </div>
      </div>

      {/* 추가 요청사항 */}
      <div className="mb-6">
        <label className="block mb-1 font-semibold">추가 요청사항</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded px-3 py-1"
          placeholder="요청사항 입력"
        />
      </div>

      {/* 의뢰하기 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          className="border border-gray-500 rounded-full px-4 py-1 hover:bg-gray-200"
        >
          의뢰 하기
        </button>
      </div>
    </div>
  );
}
