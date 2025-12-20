export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'saas_admin';
  position: string;
  department: string;
  avatar?: string;
  plan: 'free' | 'unit' | 'pro' | 'clevel';
  subscriptionStatus?: 'active' | 'past_due' | 'canceled' | null;
}

export interface PlanConfig {
  id: string;
  name: string;
  price: number;
  annualDiscountPercent: number;
  features: string[];
}

export interface Transaction {
  id: string;
  user: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed';
  plan: string;
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

export interface ChartDataPoint {
  subject: string;
  A: number;
  fullMark: number;
}

export enum LayoutType {
  Centered = 'centered',
  Auth = 'auth',
  App = 'app',
  Admin = 'admin'
}

export type Language = 'en' | 'pt' | 'es';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
}

export interface Coupon {
  code: string;
  discountPercentage: number; // 5 to 100
}
