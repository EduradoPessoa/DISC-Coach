export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  position: string;
  department: string;
  avatar?: string;
  plan: 'free' | 'pro';
  subscriptionStatus?: 'active' | 'past_due' | 'canceled' | null;
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
  timestamp: number;
  scores: DiscScore;
  analysis?: {
    summary: string;
    communication: string[];
    value: string[];
    blindspots: string[];
  };
}

export interface ChartDataPoint {
  subject: string;
  score: number;
  color: string;
}

export enum LayoutType {
  Centered = 'centered',
  Auth = 'auth',
  App = 'app',
  Admin = 'admin'
}

export type Language = 'en' | 'pt' | 'es';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number; // 5 to 100
}