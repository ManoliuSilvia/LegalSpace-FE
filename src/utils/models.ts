export enum CaseUrgency {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export enum CaseStatuses {
  PENDING = "PENDING",
  TAKEN = "TAKEN",
  COMPLETED = "COMPLETED",
}

export const statusOptions = [
  { value: "all", label: "All Cases" },
  { value: CaseStatuses.PENDING, label: "Pending" },
  { value: CaseStatuses.TAKEN, label: "Taken" },
  { value: CaseStatuses.COMPLETED, label: "Completed" },
];

export enum Roles {
  CLIENT = "CLIENT",
  LAWYER = "LAWYER",
  ADMIN = "ADMIN",
}

export interface User {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: Roles;
  lawyerData?: LawyerData; // Only for lawyers
  averageRating?: number; // Average rating for lawyers
  createdAt?: string;
  disabled?: boolean;
}

export interface LawyerData {
  specialty: string[];
  experience: number; // in years
  price: number; // hourly rate
}

export interface Case {
  id: string;
  title: string;
  description: string;
  category: string;
  status: CaseStatuses;
  urgency: CaseUrgency;
  lawyerId?: string;
  lawyer?: User;
  clientId: string;
  createdAt: string;
}

export interface CaseData {
  id?: string;
  title: string;
  description: string;
  category: string;
  urgency: CaseUrgency;
  status: CaseStatuses;
  lawyerId?: string;
  lawyer?: User;
  createdAt: string;
}

export interface Rating {
  caseId: string;
  lawyerId: string;
  rate: number;
  comment?: string;
}

export const EMPTY_RATING: Rating = {
  caseId: "",
  lawyerId: "",
  rate: 0,
  comment: "",
};

export const categoryOptions = [
  { value: "Dreptul Familiei", label: "Dreptul Familiei" },
  { value: "Dreptul Muncii", label: "Dreptul Muncii" },
  { value: "Locațiune", label: "Locațiune" },
  { value: "Răspundere Civilă", label: "Răspundere Civilă" },
  { value: "Drept Penal", label: "Drept Penal" },
  { value: "Drept Comercial", label: "Drept Comercial" },
  { value: "Dreptul Imigrației", label: "Dreptul Imigrației" },
  { value: "Drept Fiscal", label: "Drept Fiscal" },
  { value: "Malpraxis", label: "Malpraxis" },
  { value: "Necunoscut", label: "Necunoscut" },
];

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
  senderName?: string; // Optional for display purposes
}

export interface Chat {
  id: string;
  senderId: string;
  receiverId: string;
  sender: User;
  receiver: User;
  messages: Message[];
  createdAt: string;
}
