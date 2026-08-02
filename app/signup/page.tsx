import { Suspense } from "react";
import AuthFormSkeleton from "@/components/auth/auth-form-skeleton";
import SignupForm from "@/components/auth/signup-form";

export const metadata = {
  title: "회원가입 | Hanpla Commerce",
  description: "Hanpla Commerce 신규 회원가입 페이지입니다.",
};

const SignupPage = () => {
  return (
    <div className="flex min-h-[75vh] items-center justify-center py-12">
      <Suspense fallback={<AuthFormSkeleton />}>
        <SignupForm />
      </Suspense>
    </div>
  );
};

export default SignupPage;
