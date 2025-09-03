import { checkTokenOrRedirect } from "../utils/auth";
import type { LawyerData, User } from "../utils/models";

const USERS_API_URL = "http://localhost:4000/users";

export interface DashboardData {
  totalCases: number;
  activeCases: number;
  matchedUsers: number;
  successRate: number;
  recentCases: {
    id: string;
    title: string;
    category: string;
    status: string;
  }[];
  recommendedUsers: {
    id: string;
    firstName: string;
    lastName: string;
    lawyerData?: LawyerData;
  }[];
}

export async function getDashboardData(): Promise<DashboardData> {
  const token = checkTokenOrRedirect();
  if (!token)
    return {
      totalCases: 0,
      activeCases: 0,
      matchedUsers: 0,
      successRate: 0,
      recentCases: [],
      recommendedUsers: [],
    };

  const response = await fetch(`${USERS_API_URL}/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch dashboard data: ${response.statusText}`);
  }

  return response.json();
}

export const getAllLawyers = async (): Promise<any[]> => {
  const token = checkTokenOrRedirect();
  if (!token) return [];

  const response = await fetch(`${USERS_API_URL}/lawyers`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch lawyers: ${response.statusText}`);
  }

  return response.json();
};

export const updateMyProfile = async (userId: string, userData: any): Promise<User> => {
  const token = checkTokenOrRedirect();
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${USERS_API_URL}/profile/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update user info: ${response.statusText}`);
  }

  return response.json();
};

export const updateMyLawyerData = async (userId: string, lawyerData: LawyerData): Promise<any> => {
  const token = checkTokenOrRedirect();
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${USERS_API_URL}/lawyer-profile/${userId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(lawyerData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update lawyer data: ${response.statusText}`);
  }

  return response.json();
};

export const getAllUsers = async (): Promise<User[]> => {
  const token = checkTokenOrRedirect();
  if (!token) return [];

  const response = await fetch(`${USERS_API_URL}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch users: ${response.statusText}`);
  }

  return response.json();
};

export const deleteUser = async (userId: string): Promise<void> => {
  const token = checkTokenOrRedirect();
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${USERS_API_URL}/${userId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete user: ${response.statusText}`);
  }
};

export const getRecommendedUsers = async (): Promise<User[]> => {
  const token = checkTokenOrRedirect();
  if (!token) return [];

  const response = await fetch(`${USERS_API_URL}/recommended`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch recommended users: ${response.statusText}`);
  }
  return response.json();
};

// Chat API functions
const CHAT_API_URL = "http://localhost:4000/chats";

export const getChatWithUser = async (userId: string) => {
  const token = checkTokenOrRedirect();
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${CHAT_API_URL}/with/${userId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get chat: ${response.statusText}`);
  }

  return response.json();
};

export const sendChatMessage = async (chatId: string, content: string) => {
  const token = checkTokenOrRedirect();
  if (!token) throw new Error("Unauthorized");

  const response = await fetch(`${CHAT_API_URL}/${chatId}/messages`, {
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
};
