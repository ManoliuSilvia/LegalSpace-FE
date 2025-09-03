import { userStore } from "../stores/userStore";

export function isTokenExpired(token: string): boolean {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(window.atob(base64));

    if (!payload.exp) {
      return false;
    }

    const exp = payload.exp * 1000;
    return Date.now() >= exp;
  } catch (error) {
    console.error("Error checking token expiration:", error);
    return true;
  }
}

export async function handleAuthResponse(
  response: Response,
  authenticate: (user: any, token: string) => void
): Promise<any> {
  const data = await response.json();

  if (response.ok) {
    if (data.user && data.token) {
      authenticate(data.user, data.token);
      return data;
    }
    return data;
  }

  throw {
    message: data.message || "Authentication failed",
    status: response.status,
    data,
  };
}

export const checkTokenOrRedirect = (): string | null => {
  const { token } = userStore.getState();
  
  if (!token) {
    window.location.href = '/login';
    return null;
  }
  
  return token;
};