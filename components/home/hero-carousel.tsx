"use client";

import { useEffect, useState, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import ChevronLeftIcon from "@/components/icons/chevron-left-icon";
import ChevronRightIcon from "@/components/icons/chevron-right-icon";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { MOCK_BANNERS } from "@/lib/data/mock-products";
import { Banner } from "@/types/product";

// 로컬 헬퍼 1: 캐러셀 슬라이드 닷 인디케이터
const CarouselIndicators = ({
  total,
  current,
  onSelect,
}: {
  total: number;
  current: number;
  onSelect: (index: number) => void;
}) => {
  return (
    <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2">
      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(idx)}
          className={`h-2 cursor-pointer rounded-full transition-all duration-300 ${
            current === idx ? "w-8 bg-white shadow-xs" : "w-2 bg-white/50 hover:bg-white/80"
          }`}
          aria-label={`Go to slide ${idx + 1}`}
        />
      ))}
    </div>
  );
};

// 로컬 헬퍼 2: 슬라이드 네비게이션 화살표 서브 버튼
const NavArrowButton = ({
  onClick,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  ariaLabel: string;
  children: ReactNode;
}) => {
  return (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="flex cursor-pointer items-center justify-center rounded-full border border-white/10 bg-black/40 p-3 text-white shadow-md backdrop-blur-md transition-colors hover:bg-black/70"
    >
      {children}
    </button>
  );
};

// 로컬 헬퍼 3: 슬라이드 이전/다음 탐색 컨트롤러
const CarouselNavButtons = ({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) => {
  return (
    <div className="absolute right-6 bottom-6 z-20 hidden items-center gap-2.5 sm:flex">
      <NavArrowButton onClick={onPrev} ariaLabel="이전 슬라이드">
        <ChevronLeftIcon className="h-5 w-5" />
      </NavArrowButton>
      <NavArrowButton onClick={onNext} ariaLabel="다음 슬라이드">
        <ChevronRightIcon className="h-5 w-5" />
      </NavArrowButton>
    </div>
  );
};

// 로컬 헬퍼 4: 단일 배너 슬라이드 뷰
const CarouselSlide = ({ banner }: { banner: Banner }) => {
  return (
    <div className="group relative h-100 w-full overflow-hidden rounded-3xl shadow-xl sm:h-120 md:h-135">
      <Image
        src={banner.imageUrl}
        alt={banner.title}
        fill
        priority
        sizes="100vw"
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/80 via-black/30 to-transparent p-8 sm:p-12 md:p-16">
        <div className="flex max-w-xl transform flex-col items-start gap-3 transition-all duration-500">
          <Badge variant="new" className="px-3 py-1 text-xs tracking-wider">
            {banner.tag}
          </Badge>
          <h2 className="text-2xl leading-tight font-black tracking-tight text-white sm:text-4xl md:text-5xl">
            {banner.title}
          </h2>
          <p className="text-sm leading-relaxed font-normal text-neutral-200 sm:text-base">
            {banner.subtitle}
          </p>
          <div className="pt-2">
            <Link href={banner.linkUrl}>
              <Button variant="primary" size="lg" className="rounded-full shadow-lg">
                컬렉션 둘러보기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// 메인 Hero Carousel 컴포넌트
const HeroCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % MOCK_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + MOCK_BANNERS.length) % MOCK_BANNERS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % MOCK_BANNERS.length);
  };

  return (
    <div className="relative w-full">
      <CarouselSlide banner={MOCK_BANNERS[currentIndex]} />
      <CarouselIndicators
        total={MOCK_BANNERS.length}
        current={currentIndex}
        onSelect={setCurrentIndex}
      />
      <CarouselNavButtons onPrev={handlePrev} onNext={handleNext} />
    </div>
  );
};

export default HeroCarousel;
