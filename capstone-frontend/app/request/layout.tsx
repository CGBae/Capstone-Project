import { ReactNode } from 'react';

export default function RequestLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* 요청 관련 페이지 레이아웃 */}
      {children}
    </div>
  );
}
