"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import HeartIcon from "@/components/icons/heart-icon";
import TagPinIcon from "@/components/icons/tag-pin-icon";
import { MOCK_PRODUCTS } from "@/lib/data/mock-products";
import { LookbookItem, LookbookTagSpot, Product } from "@/types/product";

// 로컬 헬퍼 1: 스마트 방향 처리 태그 상품 미니 팝오버
const TagProductPopover = ({
  product,
  spot,
  onClose,
}: {
  product: Product;
  spot: LookbookTagSpot;
  onClose: () => void;
}) => {
  const isUpperHalf = spot.y <= 50;
  const isLeftEdge = spot.x < 30;
  const isRightEdge = spot.x > 70;

  // Y축 방향 (하단 핀이면 위로 팝오버 열림)
  const yClass = isUpperHalf ? "top-full mt-3" : "bottom-full mb-3";

  // X축 위치 정렬
  let xClass = "left-1/2 -translate-x-1/2";
  if (isLeftEdge) {
    xClass = "left-0";
  } else if (isRightEdge) {
    xClass = "right-0";
  }

  return (
    <div
      className={`animate-in fade-in zoom-in-95 absolute z-50 w-60 rounded-2xl border border-neutral-200 bg-white/95 p-3 shadow-2xl backdrop-blur-md ${yClass} ${xClass}`}
    >
      <div className="flex gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase">
            {product.brand}
          </span>
          <h5 className="truncate text-xs font-bold text-neutral-900">{product.name}</h5>
          <p className="mt-1 text-xs font-extrabold text-neutral-900">
            {product.price.toLocaleString()}원
          </p>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 border-t border-neutral-100 pt-2">
        <button
          onClick={onClose}
          className="text-[11px] font-medium text-neutral-500 hover:text-neutral-900"
        >
          닫기
        </button>
        <Link
          href={`/products/detail?id=${product.id}`}
          className="rounded-full bg-neutral-900 px-3 py-1 text-[11px] font-bold text-white transition-transform hover:scale-105"
        >
          상품 보기 →
        </Link>
      </div>
    </div>
  );
};

// 로컬 헬퍼 2: 인터랙티브 핀 인디케이터
const TagSpotPin = ({
  spot,
  activeSpotId,
  onSpotClick,
}: {
  spot: LookbookTagSpot;
  activeSpotId: string | null;
  onSpotClick: (spotId: string) => void;
}) => {
  const isSelected = activeSpotId === spot.id;
  const product = MOCK_PRODUCTS.find((p) => p.id === spot.productId);

  return (
    <div
      className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
    >
      <button
        type="button"
        onClick={() => onSpotClick(isSelected ? "" : spot.id)}
        className={`group flex items-center gap-1 rounded-full p-1.5 backdrop-blur-md transition-all duration-300 ${
          isSelected
            ? "scale-125 bg-rose-500 text-white shadow-lg"
            : "bg-white/80 text-neutral-900 hover:scale-110 hover:bg-white"
        }`}
        aria-label="상품 태그 보기"
      >
        <TagPinIcon className="h-4 w-4 animate-pulse" />
      </button>

      {isSelected && product && (
        <TagProductPopover product={product} spot={spot} onClose={() => onSpotClick("")} />
      )}
    </div>
  );
};

// 메인 LookbookCard 컴포넌트
const LookbookCard = ({ lookbook }: { lookbook: LookbookItem }) => {
  const [activeSpotId, setActiveSpotId] = useState<string | null>(null);
  const [likes, setLikes] = useState(lookbook.likes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeToggle = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
    }
  };

  return (
    <article className="group relative rounded-3xl border border-neutral-200 bg-white p-4 shadow-xs transition-all hover:shadow-md">
      {/* Image Container with rounded corners */}
      <div className="relative aspect-4/5 w-full rounded-2xl bg-neutral-100">
        <div className="absolute inset-0 overflow-hidden rounded-2xl">
          <Image
            src={lookbook.imageUrl}
            alt={lookbook.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-102"
          />
        </div>

        {/* Model Tag Top-Left */}
        <div className="absolute top-3 left-3 z-20 rounded-full bg-black/60 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-md">
          Model: {lookbook.modelName}
        </div>

        {/* Interactive Tag Pins */}
        {lookbook.tagSpots.map((spot) => (
          <TagSpotPin
            key={spot.id}
            spot={spot}
            activeSpotId={activeSpotId}
            onSpotClick={(id) => setActiveSpotId(id)}
          />
        ))}
      </div>

      {/* Content */}
      <div className="mt-4 flex flex-col gap-2 px-1">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-extrabold text-neutral-900">{lookbook.title}</h3>
          <button
            onClick={handleLikeToggle}
            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold transition-all ${
              isLiked ? "bg-rose-50 text-rose-600" : "text-neutral-500 hover:text-rose-500"
            }`}
          >
            <HeartIcon className="h-4 w-4" filled={isLiked} />
            <span>{likes}</span>
          </button>
        </div>

        <p className="line-clamp-2 text-xs leading-relaxed text-neutral-600">
          {lookbook.description}
        </p>

        {/* Tags */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {lookbook.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-[10px] font-semibold text-neutral-600"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default LookbookCard;
