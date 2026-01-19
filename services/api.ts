
import { AssessmentResult, FocusArea, User } from '../types';

// Utilitário para simular latência de rede do Cloud Run
const delay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEYS = {
  USERS: 'dc_users',
  ASSESSMENTS: 'dc_assessments',
  FOCUS_AREAS: 'dc_focus_areas'
};

export const api = {
  // --- USERS ---
  async saveUser(user: User): Promise<void> {
    await delay();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
    users[user.id] = user;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  async getUser(userId: string): Promise<User | null> {
    await delay();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
    return users[userId] || null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    await delay();
    const users = JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '{}');
    const user = Object.values(users).find((u: any) => u.email === email) as User;
    return user || null;
  },

  // --- ASSESSMENTS ---
  async saveAssessment(result: AssessmentResult): Promise<void> {
    await delay();
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENTS) || '[]');
    all.push(result);
    localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(all));
  },

  async getAssessmentHistory(userId: string): Promise<AssessmentResult[]> {
    await delay();
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENTS) || '[]');
    return all
      .filter((r: AssessmentResult) => r.userId === userId)
      .sort((a: any, b: any) => b.timestamp - a.timestamp);
  },

  async updateAssessmentAnalysis(userId: string, resultId: string, analysis: any): Promise<void> {
    await delay();
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSESSMENTS) || '[]');
    const index = all.findIndex((r: AssessmentResult) => r.id === resultId && r.userId === userId);
    if (index !== -1) {
      all[index].analysis = analysis;
      localStorage.setItem(STORAGE_KEYS.ASSESSMENTS, JSON.stringify(all));
    }
  },

  // --- FOCUS AREAS (PDI) ---
  async saveFocusAreas(userId: string, areas: FocusArea[]): Promise<void> {
    await delay();
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.FOCUS_AREAS) || '{}');
    all[userId] = areas;
    localStorage.setItem(STORAGE_KEYS.FOCUS_AREAS, JSON.stringify(all));
  },

  async getFocusAreas(userId: string): Promise<FocusArea[]> {
    await delay();
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.FOCUS_AREAS) || '{}');
    return all[userId] || [];
  },
  
  async updateFocusArea(userId: string, areaId: string, updates: any): Promise<void> {
    await delay();
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.FOCUS_AREAS) || '{}');
    const userAreas = all[userId] || [];
    const index = userAreas.findIndex((a: FocusArea) => a.id === areaId);
    if (index !== -1) {
      userAreas[index] = { ...userAreas[index], ...updates };
      all[userId] = userAreas;
      localStorage.setItem(STORAGE_KEYS.FOCUS_AREAS, JSON.stringify(all));
    }
  },

  async removeFocusArea(userId: string, areaId: string): Promise<void> {
    await delay();
    const all = JSON.parse(localStorage.getItem(STORAGE_KEYS.FOCUS_AREAS) || '{}');
    all[userId] = (all[userId] || []).filter((a: FocusArea) => a.id !== areaId);
    localStorage.setItem(STORAGE_KEYS.FOCUS_AREAS, JSON.stringify(all));
  }
};
