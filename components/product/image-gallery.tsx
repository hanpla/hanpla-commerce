"use client";

import { useState } from "react";
import Image from "next/image";
import { getBlurDataURL } from "@/lib/utils/image";

type ImageGalleryProps = {
  images: string[];
  productName: string;
};

// 로컬 헬퍼: 썸네일 버튼
const ThumbnailButton = ({
  img,
  altText,
  isSelected,
  onClick,
}: {
  img: string;
  altText: string;
  isSelected: boolean;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative aspect-3/4 w-20 cursor-pointer overflow-hidden rounded-xl border-2 transition-all ${
        isSelected
          ? "scale-95 border-neutral-900 shadow-sm"
          : "border-transparent opacity-70 hover:opacity-100"
      }`}
    >
      <Image
        src={img}
        alt={altText}
        fill
        sizes="80px"
        placeholder="blur"
        blurDataURL={getBlurDataURL(80, 100)}
        className="object-cover"
      />
    </button>
  );
};

// 메인 ImageGallery 컴포넌트
const ImageGallery = ({ images, productName }: ImageGalleryProps) => {
  const [selectedImg, setSelectedImg] = useState(images[0] || "");

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-3xl bg-neutral-100 shadow-md">
        <Image
          src={selectedImg}
          alt={productName}
          fill
          priority
          placeholder="blur"
          blurDataURL={getBlurDataURL(600, 800)}
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-all duration-300"
        />
      </div>
      {images.length > 1 ? (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((img, idx) => (
            <ThumbnailButton
              key={idx}
              img={img}
              altText={`${productName} 썸네일 ${idx + 1}`}
              isSelected={selectedImg === img}
              onClick={() => setSelectedImg(img)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ImageGallery;
