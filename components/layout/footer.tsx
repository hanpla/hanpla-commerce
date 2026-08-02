import Link from "next/link";
import { MOCK_CATEGORIES } from "@/lib/data/mock-products";

// 로컬 헬퍼: CS 센터 정보 카드
const CustomerCenterInfo = () => {
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-semibold text-neutral-900">CUSTOMER CENTER</h4>
      <p className="text-2xl font-black tracking-tight text-neutral-900">1588-0000</p>
      <p className="text-xs leading-relaxed text-neutral-500">
        운영시간: 평일 10:00 - 18:00 (점심시간 12:30 - 13:30)
        <br />
        주말 및 공휴일 휴무
      </p>
    </div>
  );
};

// 로컬 헬퍼: 풋터 링크 그룹
const FooterLinkGroup = ({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) => {
  return (
    <div className="flex flex-col gap-2.5">
      <h4 className="text-sm font-semibold tracking-wider text-neutral-900 uppercase">{title}</h4>
      <ul className="flex flex-col gap-1.5 text-xs text-neutral-500">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="transition-colors hover:text-neutral-900">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 메인 풋터 컴포넌트
const Footer = () => {
  const categoryLinks = MOCK_CATEGORIES.map((c) => ({
    label: c.name,
    href: `/products/${c.id}`,
  }));

  const companyLinks = [
    { label: "회사소개", href: "#" },
    { label: "인재채용", href: "#" },
    { label: "이용약관", href: "#" },
    { label: "개인정보처리방침", href: "#" },
  ];

  return (
    <footer className="mt-20 border-t border-neutral-200 bg-neutral-50 pt-12 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 border-b border-neutral-200 pb-12 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <span className="text-xl font-black tracking-tighter text-neutral-900">
              HANPLA<span className="text-rose-600">.</span>
            </span>
            <p className="text-xs leading-relaxed text-neutral-500">
              HANPLA Commerce는 최신 모던 룩북과 데일리 라이프스타일 큐레이션을 제공하는 프론트엔드
              포트폴리오 스토어입니다.
            </p>
          </div>

          <CustomerCenterInfo />

          <FooterLinkGroup title="CATEGORIES" links={categoryLinks} />
          <FooterLinkGroup title="COMPANY" links={companyLinks} />
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 text-xs text-neutral-400 md:flex-row">
          <p>© 2026 HANPLA COMMERCE. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Next.js 16 App Router</span>
            <span>Tailwind CSS v4</span>
            <span>TypeScript 5</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
