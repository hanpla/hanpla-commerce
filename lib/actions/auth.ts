"use server";

import { createClient } from "@/lib/supabase/server";
import { AuthActionState } from "@/types/user";

const translateLoginError = (message: string): string => {
  if (message.includes("Invalid login credentials")) {
    return "이메일 또는 비밀번호가 올바르지 않습니다.";
  }
  if (message.includes("Email not confirmed")) {
    return "이메일 인증이 아직 완료되지 않았습니다. 수신함의 인증 링크를 확인해 주세요.";
  }
  return message;
};

const translateSignupError = (message: string): string => {
  if (message.includes("User already registered")) {
    return "이미 가입되어 있는 이메일 주소입니다.";
  }
  if (
    message.toLowerCase().includes("is invalid") ||
    message.toLowerCase().includes("invalid email")
  ) {
    return "유효한 이메일 주소 형식이 아닙니다. (예: user@gmail.com, user@naver.com 등 실제 이메일 도메인을 입력해 주세요.)";
  }
  if (message.includes("at least 6 characters")) {
    return "비밀번호는 최소 6자 이상이어야 합니다.";
  }
  return message;
};

export const loginAction = async (
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, error: "이메일과 비밀번호를 모두 입력해 주세요." };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: translateLoginError(error.message) };
    }

    return { success: true };
  } catch {
    return { success: false, error: "오류가 발생했습니다. 다시 시도해 주세요." };
  }
};

export const signupAction = async (
  _prevState: AuthActionState,
  formData: FormData
): Promise<AuthActionState> => {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const agreedTerms = formData.get("agreedTerms");

  if (!name || !email || !password || !confirmPassword) {
    return { success: false, error: "모든 필드를 입력해 주세요." };
  }

  if (password.length < 6) {
    return { success: false, error: "비밀번호는 최소 6자 이상이어야 합니다." };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "비밀번호가 일치하지 않습니다." };
  }

  if (!agreedTerms) {
    return {
      success: false,
      error: "이용약관 및 개인정보 처리방침에 동의해 주세요.",
    };
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      return { success: false, error: translateSignupError(error.message) };
    }

    if (data.user) {
      const needsVerification = !data.session;
      return { success: true, needsVerification };
    }

    return { success: false, error: "회원 가입에 실패했습니다." };
  } catch {
    return { success: false, error: "오류가 발생했습니다. 다시 시도해 주세요." };
  }
};

export const logoutAction = async (): Promise<void> => {
  const supabase = await createClient();
  await supabase.auth.signOut();
};
