import { Suspense } from "react";
import AuthFormSkeleton from "@/components/auth/auth-form-skeleton";
import LoginForm from "@/components/auth/login-form";

export const metadata = {
  title: "로그인 | Hanpla Commerce",
  description: "Hanpla Commerce 회원 서비스 로그인 페이지입니다.",
};

const LoginPage = () => {
  return (
    <div className="flex min-h-[75vh] items-center justify-center py-12">
      <Suspense fallback={<AuthFormSkeleton />}>
        <LoginForm />
      </Suspense>
    </div>
  );
};

export default LoginPage;
