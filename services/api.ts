
import { db } from './firebaseConfig';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { AssessmentResult, FocusArea, User } from '../types';

export const api = {
  // --- USERS ---
  async saveUser(user: User): Promise<void> {
    const userRef = doc(db, "users", user.id);
    await setDoc(userRef, user, { merge: true });
  },

  async getUser(userId: string): Promise<User | null> {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? userSnap.data() as User : null;
  },

  // --- ASSESSMENTS ---
  async saveAssessment(result: AssessmentResult): Promise<void> {
    // Salvamos no sub-coleção para segurança RLS facilitada
    const resRef = doc(db, "users", result.userId, "assessments", result.id);
    await setDoc(resRef, result);
  },

  async getAssessmentHistory(userId: string): Promise<AssessmentResult[]> {
    const collRef = collection(db, "users", userId, "assessments");
    const q = query(collRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as AssessmentResult);
  },

  async updateAssessmentAnalysis(userId: string, resultId: string, analysis: any): Promise<void> {
    const resRef = doc(db, "users", userId, "assessments", resultId);
    await updateDoc(resRef, { analysis });
  },

  // --- FOCUS AREAS (PDI) ---
  async saveFocusAreas(userId: string, areas: FocusArea[]): Promise<void> {
    // Por simplicidade em PDI, podemos salvar um array ou gerenciar como coleção.
    // Coleção é melhor para escala:
    for (const area of areas) {
      const areaRef = doc(db, "users", userId, "focusAreas", area.id);
      await setDoc(areaRef, area, { merge: true });
    }
  },

  async getFocusAreas(userId: string): Promise<FocusArea[]> {
    const collRef = collection(db, "users", userId, "focusAreas");
    const querySnapshot = await getDocs(collRef);
    return querySnapshot.docs.map(doc => doc.data() as FocusArea);
  },
  
  async updateFocusArea(userId: string, areaId: string, updates: any): Promise<void> {
    const areaRef = doc(db, "users", userId, "focusAreas", areaId);
    await updateDoc(areaRef, updates);
  },

  async removeFocusArea(userId: string, areaId: string): Promise<void> {
    const areaRef = doc(db, "users", userId, "focusAreas", areaId);
    await deleteDoc(areaRef);
  }
};
