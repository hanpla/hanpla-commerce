"use client";

import { useState, useActionState, useEffect } from "react";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import useAuth from "@/lib/hooks/use-auth";
import { useAuthStore } from "@/lib/store/use-auth-store";

import { formatPhoneNumber } from "@/lib/utils/format";
import { updateProfileAction } from "@/lib/actions/user";
import { AuthActionState } from "@/types/user";

const initialState: AuthActionState = {
  success: false,
};

const ProfilePage = () => {
  const { user } = useAuth();
  const fetchSession = useAuthStore((state) => state.fetchSession);

  const [nameInput, setNameInput] = useState<string | null>(null);
  const [phoneInput, setPhoneInput] = useState<string | null>(null);

  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);

  useEffect(() => {
    if (state.success) {
      fetchSession();
    }
  }, [state.success, fetchSession]);

  const name = nameInput ?? (user?.name || "");
  const phone = phoneInput ?? (user?.phone || "");

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h2 className="text-xl font-black text-neutral-900">프로필 및 회원정보</h2>
        <p className="mt-1 text-xs text-neutral-500">회원 가입 정보 및 개인 연락처를 관리합니다.</p>
      </div>

      {state.success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
          회원정보가 성공적으로 업데이트되었습니다.
        </div>
      )}

      {state.error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600">
          {state.error}
        </div>
      )}

      <form action={formAction} className="space-y-4 rounded-2xl border border-neutral-200 p-6">
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
            name="name"
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
            name="phone"
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
            disabled={pending}
            className="rounded-xl font-bold"
          >
            {pending ? "저장 중..." : "저장하기"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
