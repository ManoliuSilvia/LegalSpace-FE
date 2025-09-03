import { checkTokenOrRedirect } from "../utils/auth";
import type { Chat, Message } from "../utils/models";

const CHAT_API_URL = "http://localhost:4000/chats";

export async function sendMessage(chatId: string, content: string): Promise<Message | null> {
  const token = checkTokenOrRedirect();
  if (!token) return null;

  const response = await fetch(`${CHAT_API_URL}/message/${chatId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error(`Failed to send message: ${response.statusText}`);
  }

  return response.json();
}

export const getChatWithUser = async (userId: string): Promise<Chat | null> => {
  const token = checkTokenOrRedirect();
  if (!token) return null;

  const response = await fetch(`${CHAT_API_URL}/with/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch chat with user: ${response.statusText}`);
  }

  return response.json();
};

export const getChatByLawyerAndClient = async (otherId: string): Promise<Chat | null> => {
  const token = checkTokenOrRedirect();
  if (!token) return null;

  const response = await fetch(`${CHAT_API_URL}/conversation/${otherId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch chat by lawyer and client: ${response.statusText}`);
  }

  return response.json();
};

