export type UserRole = 'saas-admin' | 'team-admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  position: string;
  department: string;
  avatar?: string;
  plan: 'free' | 'pro';
  subscriptionStatus?: 'active' | 'past_due' | 'canceled' | null;
  invitedBy?: string; 
}

export interface Invitation {
  id: string;
  email: string;
  role: UserRole;
  discount: number;
  token: string;
  used: boolean;
  invitedBy: string;
  createdAt: number;
  usedAt?: number;
}

export interface Question {
  id: number;
  text: {
    en: string;
    pt: string;
    es: string;
  };
  category: 'D' | 'I' | 'S' | 'C';
}

export interface DiscScore {
  D: number;
  I: number;
  S: number;
  C: number;
}

export interface FocusArea {
  id: string;
  title: string;
  description: string;
  category: 'D' | 'I' | 'S' | 'C' | 'Leadership';
  status: 'planned' | 'in_progress' | 'completed';
  dueDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AssessmentResult {
  id: string;
  userId: string;
  timestamp: number;
  scores: DiscScore;
  analysis?: {
    summary: string;
    communication: string[];
    value: string[];
    blindspots: string[];
  };
}

export type Language = 'en' | 'pt' | 'es';
export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
}