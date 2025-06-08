'use client';

import { useEffect, useState } from 'react';
import RequestList from './components/RequestList';

interface Request {
  id: number;
  title: string;
  requesterName: string;
  // 필요한 필드 더 추가 가능
}

export default function RequestPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:8080/api/requests/list')
      .then(res => {
        if (!res.ok) throw new Error('데이터 요청 실패');
        return res.json();
      })
      .then(data => setRequests(data))
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p className="text-red-500">에러: {error}</p>;

  return <RequestList requests={requests} />;
}
