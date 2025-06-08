"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Request {
  id: number;
  title: string;
  requesterName: string;
  description: string;
  photoUrls: string[];
  videoUrl: string;
}

export default function RequestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [request, setRequest] = useState<Request | null>(null);
  const myName = "내 이름";

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/requests/${id}`)
      .then(res => res.json())
      .then(data => {
        console.log("✅ 받은 request 데이터:", data);
        console.log("📷 photoUrls:", data.photoUrls);
        if (Array.isArray(data.photoUrls) && typeof data.photoUrls[0] === 'string') {
          try {
            const parsed = JSON.parse(data.photoUrls[0]);
            data.photoUrls = parsed;
          } catch (err) {
            console.warn('photoUrls 파싱 실패', err);
          }
        }
        setRequest(data);
      })
  }, [id]);

  const handleAccept = async () => {
  try {
   const res = await fetch(
     `http://localhost:8080/api/requests/${id}`,
     {
       method: "PATCH",
       headers: { "Content-Type": "application/json" },
       body: JSON.stringify({
        status: "ONGOING",
        assigneeName: myName,
        }),
     }
   );
    if (!res.ok) {
     const txt = await res.text();
     throw new Error(`Accept failed: ${res.status} ${res.statusText}\n${txt}`);
    }

    router.push("/mychannel");
    router.refresh();
  } catch (e) {
    console.error(e);
  }
};

  if (!request) return <div className="p-8">Loading...</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{request.title}</h1>
      <p className="text-gray-600 mb-4">의뢰인: {request.requesterName}</p>

      <hr className="my-4" />

      <h2 className="font-semibold mb-2">의뢰 내용</h2>
      <p className="mb-4 whitespace-pre-line">{request.description}</p>

      {request.photoUrls && Array.isArray(request.photoUrls) && request.photoUrls.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold mb-2">사진 미리보기</h2>
          <div className="flex gap-2 overflow-x-auto">
          {request.photoUrls.map((url, idx) => (
            <img
              key={idx}
              src={`http://localhost:8080${url}`}
              alt={`photo-${idx}`}
              width={200}
              height={120}
              style={{ borderRadius: '8px', objectFit: 'cover' }}
            />
          ))}
          </div>
        </div>
      )}

      {request.videoUrl && (
        <div>
          <h2 className="font-semibold mb-2">영상 미리보기</h2>
          <video controls className="w-full max-h-[400px] rounded">
            <source src={`http://localhost:8080${request.videoUrl}`} type="video/mp4" />
            브라우저가 video 태그를 지원하지 않습니다.
          </video>
        </div>
      )}

      <div className="flex justify-center mt-6">
        <button
          onClick={handleAccept}
          className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
        >
          의뢰받기
        </button>
      </div>

    </div>
  );
}
