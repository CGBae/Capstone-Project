'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FileText, Search } from 'lucide-react';

interface Request {
  id: number;
  title: string;
  requesterName: string;
}

interface Props {
  requests: Request[];
}

export default function RequestList({ requests }: Props) {
  const router = useRouter();
  return (
    <div className="p-8">
      <div className="flex items-center gap-2 mb-4">
        <FileText size={24} />
        <h1 className="text-xl font-bold">의뢰 게시판</h1>
      </div>

      <table className="w-full border-t border-b mb-8">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2">의뢰 내용</th>
            <th className="text-right py-2">의뢰인</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.id} className="border-b">
              <td className="py-2">
                <Link href={`/request/${req.id}`} className="text-blue-500 hover:underline">
                  {req.title}
                </Link>
              </td>
              <td className="text-right py-2">{req.requesterName}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <input type="text" placeholder="검색" className="border border-blue-500 rounded px-2 py-1" />
          <button className="bg-blue-500 text-white rounded p-1">
            <Search size={20} />
          </button>
        </div>

        <button
          onClick={() => router.push('/request/requesting')}
          className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-blue-700"
        >
          의뢰하기
        </button>
      </div>

      <div className="text-center mt-6">&lt;이전 1 2 3 4 5 6 7 8 9 10 ... 다음&gt;</div>
    </div>
  );
}
