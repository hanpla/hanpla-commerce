"use client";

import { useActionState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import GoogleIcon from "@/components/icons/google-icon";
import KakaoIcon from "@/components/icons/kakao-icon";
import LockIcon from "@/components/icons/lock-icon";
import UserIcon from "@/components/icons/user-icon";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { loginAction, AUTH_INITIAL_STATE } from "@/lib/actions/auth";
import { useAuthStore } from "@/lib/store/use-auth-store";

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/mypage";

  const [state, formAction, pending] = useActionState(loginAction, AUTH_INITIAL_STATE);

  useEffect(() => {
    if (state.success) {
      useAuthStore.getState().fetchSession();
      router.push(redirectTo);
    }
  }, [state.success, router, redirectTo]);

  const handleSocialLogin = (provider: "google" | "kakao") => {
    alert(
      `${provider === "google" ? "구글" : "카카오"} 소셜 로그인은 추후 지원 예정입니다.\n이메일/비밀번호 로그인을 이용해 주세요.`
    );
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-neutral-200/80 bg-white/90 p-8 shadow-xl backdrop-blur-md">
      <div className="text-center">
        <h1 className="text-2xl font-black tracking-tight text-neutral-900">SIGN IN</h1>
        <p className="mt-2 text-xs font-medium text-neutral-500">
          Hanpla Commerce 회원 서비스에 로그인하세요
        </p>
      </div>

      {state.error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600">
          {state.error}
        </div>
      )}

      <form action={formAction} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-neutral-700 uppercase">
            이메일 주소
          </label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
              <UserIcon className="h-4 w-4" />
            </div>
            <Input
              type="email"
              name="email"
              required
              placeholder="example@hanpla.com"
              className="pl-10 text-sm"
            />
          </div>
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="block text-xs font-bold text-neutral-700 uppercase">비밀번호</label>
            <span className="cursor-pointer text-xs font-semibold text-neutral-400 hover:text-neutral-900">
              비밀번호 찾기
            </span>
          </div>
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

        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={pending}
          className="mt-2 w-full justify-center rounded-xl py-3 text-sm font-bold shadow-md transition-all hover:shadow-lg"
        >
          {pending ? "로그인 중..." : "로그인"}
        </Button>
      </form>

      <div className="relative my-6 text-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-200" />
        </div>
        <span className="relative bg-white px-3 text-[11px] font-semibold text-neutral-400 uppercase">
          또는 간편 로그인
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => handleSocialLogin("kakao")}
          className="flex items-center justify-center gap-2 rounded-xl bg-[#FEE500] py-2.5 text-xs font-bold text-[#3c1e1e] transition-transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <KakaoIcon className="h-4 w-4" />
          카카오 로그인
        </button>
        <button
          type="button"
          onClick={() => handleSocialLogin("google")}
          className="flex items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-2.5 text-xs font-bold text-neutral-700 transition-transform hover:scale-[1.02] hover:bg-neutral-50 active:scale-[0.98]"
        >
          <GoogleIcon className="h-4 w-4" />
          구글 로그인
        </button>
      </div>

      <div className="mt-8 text-center text-xs font-medium text-neutral-500">
        아직 회원이 아니신가요?{" "}
        <Link
          href={`/signup${redirectTo ? `?redirectTo=${redirectTo}` : ""}`}
          className="font-bold text-neutral-900 underline underline-offset-4 hover:text-neutral-600"
        >
          회원가입 하기
        </Link>
      </div>
    </div>
  );
};

export default LoginForm;
