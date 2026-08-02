"use client";

import { useState } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import useAuth from "@/lib/hooks/use-auth";

import { formatPhoneNumber } from "@/lib/utils/format";

import { updateProfileServerAction } from "@/lib/actions/user";

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [nameInput, setNameInput] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const name = nameInput ?? (user?.name || "");
  const phone = phoneInput ?? (user?.phone || "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await updateProfileServerAction({ name, phone });
      if (result.success) {
        updateProfile({ name, phone });
        setIsSuccess(true);
        setTimeout(() => setIsSuccess(false), 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-xl font-black text-neutral-900">프로필 및 회원정보</h2>
        <p className="mt-1 text-xs text-neutral-500">회원 가입 정보 및 개인 연락처를 관리합니다.</p>
      </div>

      {isSuccess && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
          회원정보가 성공적으로 업데이트되었습니다.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-neutral-200 p-6">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-neutral-700 uppercase">
            이메일 주소 (변경 불가)
          </label>
          <Input
            type="email"
            disabled
            value={user?.email || ""}
            className="cursor-not-allowed bg-neutral-100 text-neutral-500"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-neutral-700 uppercase">
            이름 / 닉네임
          </label>
          <Input
            type="text"
            required
            value={name}
            onChange={(e) => setNameInput(e.target.value)}
            className="text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-neutral-700 uppercase">
            휴대폰 번호
          </label>
          <Input
            type="tel"
            placeholder="010-0000-0000"
            value={phone}
            onChange={(e) => setPhoneInput(formatPhoneNumber(e.target.value))}
            className="text-sm"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="md"
            disabled={isSubmitting}
            className="rounded-xl font-bold"
          >
            {isSubmitting ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
