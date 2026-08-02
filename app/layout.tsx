import { ReactNode } from "react";
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Footer from "@/components/layout/footer";
import Header from "@/components/layout/header";
import "./globals.css";

const CartDrawer = dynamic(() => import("@/components/layout/cart-drawer"));

export const metadata: Metadata = {
  title: "Hanpla Commerce | Premium Fashion Store",
  description:
    "모던 룩북과 데일리 라이프스타일 큐레이션을 제공하는 신입 프론트엔드 포트폴리오 스토어",
};

const RootLayout = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="flex min-h-screen flex-col bg-white font-sans text-neutral-900 antialiased selection:bg-neutral-900 selection:text-white">
        <Header />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
        <Footer />
        <CartDrawer />
      </body>
    </html>
  );
};

export default RootLayout;
