/**
 * 안전한 내부 리다이렉트 경로를 반환합니다. (Open Redirect 보안 취약점 방지)
 * 외부 URL(https://, http://, // 등)이 포함된 경로를 차단하고 안전한 내부 경로만 허용합니다.
 */
export const getSafeRedirectPath = (path: string | null | undefined, fallback = "/"): string => {
  if (!path) return fallback;

  try {
    const decodedPath = decodeURIComponent(path);
    if (decodedPath.startsWith("/") && !decodedPath.startsWith("//")) {
      return decodedPath;
    }
  } catch {
    return fallback;
  }

  return fallback;
};

/**
 * 현재 라우트 경로와 searchParams를 결합하여 로그인/회원가입 이동 URL을 생성합니다.
 */
export const buildAuthUrl = (
  authPath: "/login" | "/signup",
  pathname: string,
  searchParamsString?: string
): string => {
  const currentPath = pathname + (searchParamsString ? `?${searchParamsString}` : "");

  if (!currentPath || currentPath === "/login" || currentPath === "/signup") {
    return authPath;
  }

  return `${authPath}?redirectTo=${encodeURIComponent(currentPath)}`;
};
