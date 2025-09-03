import { checkTokenOrRedirect } from "../utils/auth";
import type { Rating } from "../utils/models";

const RATING_API_URL = "http://localhost:4000/rating";

export async function rateLawyer(lawyerId: string, rate: number, comment: string): Promise<Rating | null> {
  const token = checkTokenOrRedirect();
  if (!token) return null;

  const response = await fetch(`${RATING_API_URL}/lawyer`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ lawyerId, rate, comment }),
  });

  if (!response.ok) {
    throw new Error(`Failed to rate lawyer: ${response.statusText}`);
  }

  return response.json();
}

export async function getMyRateByLawyerId(lawyerId: string): Promise<Rating | null> {
  const token = checkTokenOrRedirect();
  if (!token) return null;

  const response = await fetch(`${RATING_API_URL}/myRateByLawyerId/${lawyerId}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    method: "GET",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch rating for lawyer: ${response.statusText}`);
  }

  return response.json();
}
