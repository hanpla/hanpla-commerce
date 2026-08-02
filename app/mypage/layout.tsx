import { ReactNode } from "react";
import MyPageSidebar from "@/components/mypage/mypage-sidebar";

export const metadata = {
  title: "마이페이지 | Hanpla Commerce",
  description: "Hanpla Commerce 마이페이지입니다.",
};

const MyPageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-black tracking-tight text-neutral-900 sm:text-3xl">MY PAGE</h1>
        <p className="mt-1 text-xs text-neutral-500">
          회원 정보, 배송지 및 주문 활동 내역을 관리할 수 있습니다.
        </p>
      </div>

      <div className="flex flex-col gap-8 lg:flex-row">
        <MyPageSidebar />
        <main className="flex-1 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-sm sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MyPageLayout;
