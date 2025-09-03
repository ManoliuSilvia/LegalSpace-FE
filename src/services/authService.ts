import { userStore } from "../stores/userStore";
import { handleAuthResponse } from "../utils/auth";

export async function register(userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  [key: string]: any;
}): Promise<void> {
  const { authenticate } = userStore.getState();

  const response = await fetch("http://localhost:4000/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  return handleAuthResponse(response, authenticate);
}

export async function login(credentials: { email: string; password: string }): Promise<void> {
  const { authenticate } = userStore.getState();

  const response = await fetch("http://localhost:4000/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  return handleAuthResponse(response, authenticate);
}
