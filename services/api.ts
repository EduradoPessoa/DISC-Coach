
import { AssessmentResult, FocusArea, User, Invitation } from '../types';

const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

const STORAGE_KEYS = {
  USERS: 'dc_users',
  ASSESSMENTS: 'dc_assessments',
  FOCUS_AREAS: 'dc_focus_areas',
  INVITATIONS: 'dc_invitations'
};

// Semente de dados para o administrador padrão
const SEED_ADMIN: User = {
  id: 'usr_admin_root',
  name: 'Eduardo (Admin)',
  email: 'eduardo@phoenyx.com.br',
  role: 'saas-admin',
  position: 'Founder',
  department: 'Executive',
  plan: 'pro'
};

export const api = {
  // --- USERS ---
  async _getUsersMap(): Promise<Record<string, User>> {
    const data = localStorage.getItem(STORAGE_KEYS.USERS);
    if (!data) {
      // Se não houver dados, inicializa com o admin padrão
      const initialMap = { [SEED_ADMIN.id]: SEED_ADMIN };
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialMap));
      return initialMap;
    }
    return JSON.parse(data);
  },

  async saveUser(user: User): Promise<void> {
    await delay();
    const users = await this._getUsersMap();
    users[user.id] = user;
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  async getUser(userId: string): Promise<User | null> {
    await delay();
    const users = await this._getUsersMap();
    return users[userId] || null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    await delay();
    const users = await this._getUsersMap();
    const normalizedSearch = email.toLowerCase().trim();
    
    const user = Object.values(users).find((u: any) => 
      u.email.toLowerCase().trim() === normalizedSearch
    ) as User;
    
    return user || null;
  },

  // --- INVITATIONS ---
  async saveInvitation(invite: Invitation): Promise<void> {
    await delay();
    const invites = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVITATIONS) || '[]');
    invites.push(invite);
    localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(invites));
  },

  async getInvitationByToken(token: string): Promise<Invitation | null> {
    await delay();
    const invites = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVITATIONS) || '[]');
    return invites.find((i: Invitation) => i.token === token && !i.used) || null;
  },

  async markInvitationAsUsed(token: string): Promise<void> {
    await delay();
    const invites = JSON.parse(localStorage.getItem(STORAGE_KEYS.INVITATIONS) || '[]');
    const index = invites.findIndex((i: Invitation) => i.token === token);
    if (index !== -1) {
      invites[index].used = true;
      localStorage.setItem(STORAGE_KEYS.INVITATIONS, JSON.stringify(invites));
    }
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

  // --- FOCUS AREAS ---
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
