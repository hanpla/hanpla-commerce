"use client";

import { ReactNode, useEffect } from "react";
import CloseIcon from "@/components/icons/close-icon";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
};

// 로컬 헬퍼: 오버레이 백드롭
const Backdrop = ({ onClick }: { onClick: () => void }) => {
  return (
    <div
      onClick={onClick}
      className="animate-in fade-in fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity duration-200"
    />
  );
};

// 로컬 헬퍼: 헤더 컴포넌트
const ModalHeader = ({ title, onClose }: { title?: string; onClose: () => void }) => {
  return (
    <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
      {title ? <h3 className="text-lg font-semibold text-neutral-900">{title}</h3> : <div />}
      <button
        onClick={onClose}
        className="rounded-md p-1 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-900"
        aria-label="닫기"
      >
        <CloseIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

// 메인 모달 컴포넌트 (최하단 선언)
const Modal = ({ isOpen, onClose, title, children, className = "" }: ModalProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <Backdrop onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`animate-in zoom-in-95 z-50 max-h-[90vh] w-full max-w-lg transform overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl transition-all duration-200 ${className}`}
        >
          <ModalHeader title={title} onClose={onClose} />
          <div className="pt-4">{children}</div>
        </div>
      </div>
    </>
  );
};

export default Modal;
