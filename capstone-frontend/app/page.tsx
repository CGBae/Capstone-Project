import Link from 'next/link';
import { Search, Compass, FileText, PlusCircle, MessageCircle, User, Video } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex h-screen">

      {/* 왼쪽 메뉴 */}
      <aside className="w-[250px] p-4 border-r flex flex-col gap-6">

        {/* 검색창 */}
        <div className="flex items-center">
          <input
            type="text"
            placeholder="검색"
            className="border border-blue-500 rounded px-2 py-1 w-full"
          />
          <button className="ml-1 bg-blue-500 text-white rounded px-2 py-1">
            <Search size={20} />
          </button>
        </div>

        {/* 메뉴 버튼들 */}
        <nav className="flex flex-col gap-4">
          <Link href="/search">
            <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded">
              <Compass size={20} /> 탐색
            </button>
          </Link>

          <Link href="/request">
            <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded">
              <FileText size={20} /> 의뢰
            </button>
          </Link>

          <Link href="/subscribe">
            <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded">
              <PlusCircle size={20} /> 구독
            </button>
          </Link>

          <Link href="/message">
            <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded">
              <MessageCircle size={20} /> 메시지
            </button>
          </Link>

          <Link href="/mychannel">
            <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded">
              <User size={20} /> 내 채널
            </button>
          </Link>

          <Link href="/AI">
            <button className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded">
              <Video size={20} /> AI영상제작
            </button>
          </Link>
        </nav>
      </aside>

      {/* 오른쪽 메인 영상 영역 */}
      <main className="flex-1 flex justify-center items-center bg-gray-50">
        <video
          controls
          src="https://www.w3schools.com/html/mov_bbb.mp4" // 테스트용 영상 소스
          className="w-[800px] shadow-xl rounded"
        />
      </main>
    </div>
  );
}