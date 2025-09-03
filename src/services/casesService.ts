import { checkTokenOrRedirect } from "../utils/auth";
import type { Case, CaseData } from "../utils/models";

const CASES_API_URL = "http://localhost:4000/cases";

export async function getCases(): Promise<Case[]> {
  const token = checkTokenOrRedirect();
  if (!token) return [];

  const response = await fetch(CASES_API_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch cases: ${response.statusText}`);
  }

  return response.json();
}

export async function getCase(caseId: string): Promise<Case | null> {
  const token = checkTokenOrRedirect();
  if (!token) return null;

  const response = await fetch(`${CASES_API_URL}/${caseId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch case: ${response.statusText}`);
  }

  return response.json();
}

export async function createCase(caseData: CaseData): Promise<Case | null> {
  const token = checkTokenOrRedirect();
  if (!token) return null;

  const response = await fetch(CASES_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(caseData),
  });

  if (!response.ok) {
    throw new Error(`Failed to create case: ${response.statusText}`);
  }

  return response.json();
}

export async function updateCase(caseId: string, caseData: Partial<Case>): Promise<Case | null> {
  const token = checkTokenOrRedirect();
  if (!token) return null;

  const response = await fetch(`${CASES_API_URL}/${caseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(caseData),
  });

  if (!response.ok) {
    throw new Error(`Failed to update case: ${response.statusText}`);
  }

  return response.json();
}

export async function deleteCase(caseId: string): Promise<boolean> {
  const token = checkTokenOrRedirect();
  if (!token) return false;

  const response = await fetch(`${CASES_API_URL}/${caseId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to delete case: ${response.statusText}`);
  }

  return true;
}

export async function getMyCases(): Promise<Case[]> {
  const token = checkTokenOrRedirect();
  if (!token) return [];

  const response = await fetch(`${CASES_API_URL}/my-cases`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch my cases: ${response.statusText}`);
  }

  return response.json();
}

export async function getAvailableCases(): Promise<Case[]> {
  const token = checkTokenOrRedirect();
  if (!token) return [];

  const response = await fetch(`${CASES_API_URL}/available`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch available cases: ${response.statusText}`);
  }

  return response.json();
}

export async function takeCase(caseId: string): Promise<Case | null> {
  const token = checkTokenOrRedirect();
  if (!token) return null;

  const response = await fetch(`${CASES_API_URL}/take/${caseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to take case: ${response.statusText}`);
  }

  return response.json();
}

export async function completeCase(caseId: string): Promise<Case | null> {
  const token = checkTokenOrRedirect();
  if (!token) return null;

  const response = await fetch(`${CASES_API_URL}/complete/${caseId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to take case: ${response.statusText}`);
  }

  return response.json();
}