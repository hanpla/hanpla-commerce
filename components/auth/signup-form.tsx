"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import LockIcon from "@/components/icons/lock-icon";
import UserIcon from "@/components/icons/user-icon";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import useAuth from "@/lib/hooks/use-auth";

const SignupForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/mypage";

  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreedTerms, setAgreedTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password || !confirmPassword) {
      setError("모든 필드를 입력해 주세요.");
      return;
    }

    if (password.length < 6) {
      setError("비밀번호는 최소 6자 이상이어야 합니다.");
      return;
    }

    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    if (!agreedTerms) {
      setError("이용약관 및 개인정보 처리방침에 동의해 주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await signup(name, email, password);
      if (res.success) {
        if (res.needsVerification) {
          setError(null);
          alert("회원가입 확인 이메일이 전송되었습니다. 이메일 수신함을 확인해 주세요!");
        }
        router.push(redirectTo);
      } else {
        setError(res.error || "회원가입에 실패했습니다.");
      }
    } catch {
      setError("오류가 발생했습니다. 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-3xl border border-neutral-200/80 bg-white/90 p-8 shadow-xl backdrop-blur-md">
      <div className="text-center">
        <h1 className="text-2xl font-black tracking-tight text-neutral-900">JOIN HANPLA</h1>
        <p className="mt-2 text-xs font-medium text-neutral-500">
          회원 가입 후 브랜드 혜택과 마이페이지를 이용하세요
        </p>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-neutral-700 uppercase">이름</label>
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-neutral-400">
              <UserIcon className="h-4 w-4" />
            </div>
            <Input
              type="text"
              required
              placeholder="홍길동"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            required
            placeholder="example@hanpla.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            required
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="text-sm"
          />
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="terms"
            checked={agreedTerms}
            onChange={(e) => setAgreedTerms(e.target.checked)}
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
          disabled={isSubmitting}
          className="mt-4 w-full justify-center rounded-xl py-3 text-sm font-bold shadow-md transition-all hover:shadow-lg"
        >
          {isSubmitting ? "가입 처리 중..." : "회원가입 완료"}
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
