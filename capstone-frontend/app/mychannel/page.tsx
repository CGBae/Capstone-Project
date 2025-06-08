"use client";
import { useEffect, useState } from "react";
import { UserCircle2 } from "lucide-react";
import Link from "next/link";

interface ReqSummary {
  id: number;
  title: string;
  status: "ONGOING" | "COMPLETE" | "DONE";
  isRequester: boolean;
}

export default function MyChannelPage() {
  const [activeTab, setActiveTab] = useState<"videos"|"ongoing"|"completed">("ongoing");
  const [list, setList] = useState<ReqSummary[]>([]);
  const myName = "내 이름";

  useEffect(() => {
  const fetchRequests = async () => {
    const [mineRes, assignedRes] = await Promise.all([
      fetch(`http://localhost:8080/api/requests/my-requests?requesterName=${encodeURIComponent(myName)}`),
      fetch(`http://localhost:8080/api/requests/assigned?assigneeName=${encodeURIComponent(myName)}`)
    ]);

    if (mineRes.ok && assignedRes.ok) {
      const mine = await mineRes.json();
      const assigned = await assignedRes.json();

      const combined: ReqSummary[] = [
        ...mine.map((r: any) => ({ ...r, isRequester: true })),
        ...assigned.map((r: any) => ({ ...r, isRequester: false })),
      ];
      setList(combined);
    } else {
      console.error('내 요청 or 받은 요청 조회 실패');
      setList([]);
    }
  };
  fetchRequests();
}, [myName]);

  const ongoingReqs = list.filter(r => r.status === "ONGOING");
  const completeReqs = list.filter(r => r.status === "COMPLETE");
  const doneReqs     = list.filter(r => r.status === "DONE");

  const renderOngoing = () => (
    <div className="p-4">
      <h3 className="font-semibold mb-2">의뢰중</h3>
      {ongoingReqs.filter(r => r.isRequester).map(r => (
        <Link key={r.id} href={`/mychannel/${r.id}`} className="flex justify-between py-2 border-b">
          <span>{r.title}</span>
          <span>의뢰중</span>
        </Link>
      ))}

      <h3 className="font-semibold mt-4 mb-2">받은 의뢰</h3>
      {ongoingReqs.filter(r => !r.isRequester).map(r => (
        <Link key={r.id} href={`/mychannel/${r.id}`} className="flex justify-between py-2 border-b">
          <span>{r.title}</span>
          <span>받은의뢰</span>
        </Link>
      ))}
    </div>
  );

  const renderCompleted = () => (
    <div className="p-4">
      <h3 className="font-semibold mb-2">의뢰 완료</h3>
      {completeReqs.map(r => (
        <Link key={r.id} href={`/mychannel/${r.id}`} className="flex justify-between py-2 border-b">
          <span>{r.title}</span>
          <span>의뢰완료</span>
        </Link>
      ))}

      <h3 className="font-semibold mt-4 mb-2">수행 완료</h3>
      {doneReqs.map(r => (
        <Link key={r.id} href={`/mychannel/${r.id}`} className="flex justify-between py-2 border-b">
          <span>{r.title}</span>
          <span>수행완료</span>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="p-8 bg-gray-100 rounded-lg shadow-md max-w-2xl mx-auto">
      {/* 사용자 프로필 */}
      <div className="flex items-center gap-4 mb-6">
        <UserCircle2 size={64} className="text-green-300" />
        <span className="text-xl font-bold">{myName}</span>
      </div>

      {/* 탭 메뉴 */}
      <div className="flex gap-6 border-b">
        <button
          className={`pb-2 ${activeTab === "videos" ? "border-b-2 border-black" : ""}`}
          onClick={() => setActiveTab("videos")}
        >
          동영상
        </button>
        <button
          className={`pb-2 ${activeTab === "ongoing" ? "border-b-2 border-black" : ""}`}
          onClick={() => setActiveTab("ongoing")}
        >
          진행중인 의뢰
        </button>
        <button
          className={`pb-2 ${activeTab === "completed" ? "border-b-2 border-black" : ""}`}
          onClick={() => setActiveTab("completed")}
        >
          완료된 의뢰
        </button>
      </div>

      {/* 콘텐츠 영역 */}
      <div className="overflow-y-auto h-60 mt-4 border rounded bg-white">
        {activeTab === "videos"    && <div className="p-4">동영상 콘텐츠 목록</div>}
        {activeTab === "ongoing"   && renderOngoing()}
        {activeTab === "completed" && renderCompleted()}
      </div>
    </div>
  );
}