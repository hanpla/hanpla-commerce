"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import LockIcon from "@/components/icons/lock-icon";
import UserIcon from "@/components/icons/user-icon";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { signupAction, AUTH_INITIAL_STATE } from "@/lib/actions/auth";
import { useAuthStore } from "@/lib/store/use-auth-store";

const SignupForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/mypage";

  const [state, formAction, pending] = useActionState(signupAction, AUTH_INITIAL_STATE);

  useEffect(() => {
    if (state.success) {
      if (state.needsVerification) {
        alert("회원가입 확인 이메일이 전송되었습니다. 이메일 수신함을 확인해 주세요!");
      }
      useAuthStore.getState().fetchSession();
      router.push(redirectTo);
    }
  }, [state.success, state.needsVerification, router, redirectTo]);

  return (
    <div className="w-full max-w-md rounded-3xl border border-neutral-200/80 bg-white/90 p-8 shadow-xl backdrop-blur-md">
      <div className="text-center">
        <h1 className="text-2xl font-black tracking-tight text-neutral-900">JOIN HANPLA</h1>
        <p className="mt-2 text-xs font-medium text-neutral-500">
          회원 가입 후 브랜드 혜택과 마이페이지를 이용하세요
        </p>
      </div>

      {state.error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600">
          {state.error}
        </div>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-neutral-700 uppercase">이름</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
              <UserIcon className="h-4 w-4" />
            </div>
            <Input
              type="text"
              name="name"
              required
              placeholder="홍길동"
              className="pl-10 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-neutral-700 uppercase">
            이메일 주소
          </label>
          <Input
            type="email"
            name="email"
            required
            placeholder="example@hanpla.com"
            className="text-sm"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-neutral-700 uppercase">
            비밀번호 (6자 이상)
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
              <LockIcon className="h-4 w-4" />
            </div>
            <Input
              type="password"
              name="password"
              required
              placeholder="••••••••"
              className="pl-10 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-bold text-neutral-700 uppercase">
            비밀번호 확인
          </label>
          <Input
            type="password"
            name="confirmPassword"
            required
            placeholder="••••••••"
            className="text-sm"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="terms"
            name="agreedTerms"
            value="true"
            className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
          />
          <label htmlFor="terms" className="text-xs text-neutral-600">
            [필수] 이용약관 및 개인정보 처리방침에 동의합니다.
          </label>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={pending}
          className="mt-4 w-full justify-center rounded-xl py-3 text-sm font-bold shadow-md transition-all hover:shadow-lg"
        >
          {pending ? "가입 처리 중..." : "회원가입 완료"}
        </Button>
      </form>

      <div className="mt-6 text-center text-xs font-medium text-neutral-500">
        이미 계정이 있으신가요?{" "}
        <Link
          href={`/login${redirectTo ? `?redirectTo=${redirectTo}` : ""}`}
          className="font-bold text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
        >
          로그인 하기
        </Link>
      </div>
    </div>
  );
};

export default SignupForm;
