"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

interface RequestDetail {
  id: number;
  title: string;
  description: string;
  status: "ONGOING" | "COMPLETE" | "DONE";
  videoUrl: string;
  photoUrls: string[];
  resultVideoUrl?: string;
}

export default function ChannelRequestDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [req, setReq] = useState<RequestDetail | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    fetch(`http://localhost:8080/api/requests/${id}`)
      .then(res => res.json())
      .then(data => setReq(data));
  }, [id]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setFile(e.target.files[0]);
  };

  const handleComplete = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append("files", file);
    const up = await fetch("http://localhost:8080/api/files/upload", { method: "POST", body: fd });
    if (!up.ok) return;
    const [url] = await up.json();

    const res = await fetch(`http://localhost:8080/api/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "DONE", resultVideoUrl: url }),
    });
    if (res.ok) {
      router.push("/mychannel");
    } else {
      console.error("Complete failed:", res.statusText);
    }
  };

  if (!req) return <div className="p-8">Loading…</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">{req.title}</h1>
      <p className="mb-6 whitespace-pre-line">{req.description}</p>

      {/* 사진/참고영상 */}
      {req.photoUrls.length > 0 && (
        <div className="mb-4 flex gap-2 overflow-x-auto">
          {req.photoUrls.map((u,i) => (
            <img key={i} src={`http://localhost:8080${u}`} className="w-40 h-24 object-cover rounded" />
          ))}
        </div>
      )}
      {req.videoUrl && (
        <video controls className="w-full mb-6">
          <source src={`http://localhost:8080${req.videoUrl}`} type="video/mp4" />
        </video>
      )}

      {req.status === "ONGOING" && (
        <div className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold">결과 영상 업로드</label>
            <input type="file" accept="video/*" onChange={handleFileChange} />
          </div>
          <button
            onClick={handleComplete}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            의뢰수행
          </button>
        </div>
      )}

      {(req.status === "DONE" || req.status === "COMPLETE") && req.resultVideoUrl && (
        <div>
          <h2 className="font-semibold mb-2">완료된 영상</h2>
          <video controls className="w-full rounded">
            <source src={`http://localhost:8080${req.resultVideoUrl}`} type="video/mp4" />
          </video>
        </div>
      )}
    </div>
  );
}
