
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
  invitedBy?: string; // ID do Team Admin que convidou
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

export interface FinanceRecord {
  id: string;
  date: string;
  amount: number;
  status: 'received_stripe' | 'payout_done' | 'pending';
  customerName: string;
  type: 'subscription' | 'manual';
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  status: 'active' | 'expired';
  usedCount: number;
}

export interface Affiliate {
  id: string;
  name: string;
  email: string;
  totalSales: number;
  commissionEarned: number;
}

// Fix: Added missing types Language, NotificationType and AppNotification
export type Language = 'en' | 'pt' | 'es';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
}
