
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { DiscScore, AssessmentResult, FocusArea } from '../types';
import { QUESTIONS } from '../data/questions';
import { useUser } from './UserContextSupabase';
import { calculateDiscScores } from '../utils/discCalculator';
import { api } from '../services/api';

interface Answers {
  [questionId: number]: number;
}

interface AssessmentContextType {
  answers: Answers;
  saveAnswer: (questionId: number, value: number) => void;
  startAssessment: () => void;
  submitAssessment: () => Promise<AssessmentResult>;
  startTime: number | null;
  elapsedTime: number; 
  isComplete: boolean;
  history: AssessmentResult[];
  latestResult: AssessmentResult | null;
  calculateScores: () => DiscScore;
  saveAnalysisToResult: (resultId: string, analysis: any) => Promise<void>;
  focusAreas: FocusArea[];
  addFocusArea: (area: Omit<FocusArea, 'id' | 'status'>) => Promise<void>;
  updateFocusArea: (id: string, updates: Partial<FocusArea>) => Promise<void>;
  removeFocusArea: (id: string) => Promise<void>;
  isLoading: boolean;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useUser();
  
  const [answers, setAnswers] = useState<Answers>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [focusAreas, setFocusAreas] = useState<FocusArea[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const latestResult = useMemo(() => history.length > 0 ? history[history.length - 1] : null, [history]);
  
  // Carregar dados iniciais da "API"
  useEffect(() => {
    if (isAuthenticated && user.id) {
      const loadInitialData = async () => {
        setIsLoading(true);
        try {
          const [dbHistory, dbPdi] = await Promise.all([
            api.getAssessmentHistory(user.id),
            api.getFocusAreas(user.id)
          ]);
          setHistory(dbHistory);
          setFocusAreas(dbPdi);
        } catch (err) {
          console.error("Erro ao carregar dados do banco:", err);
        } finally {
          setIsLoading(false);
        }
      };
      loadInitialData();
    }
  }, [isAuthenticated, user.id]);

  useEffect(() => {
    let interval: any;
    if (startTime && !isComplete) {
      interval = setInterval(() => {
        const now = Date.now();
        setElapsedTime(Math.floor((now - startTime) / 1000));
      }, 1000);
    }
    return () => {
        if (interval) clearInterval(interval);
    };
  }, [startTime, isComplete]);

  const startAssessment = useCallback(() => {
    setAnswers({});
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsComplete(false);
  }, []);

  const saveAnswer = useCallback((questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }, []);

  const calculateScores = useCallback((): DiscScore => {
    return calculateDiscScores(QUESTIONS, answers);
  }, [answers]);

  const submitAssessment = useCallback(async (): Promise<AssessmentResult> => {
    setIsLoading(true);
    const finalScores = calculateScores();
    const newResult: AssessmentResult = {
      id: `res_${Date.now()}`,
      userId: user.id,
      timestamp: Date.now(),
      scores: finalScores
    };
    
    await api.saveAssessment(newResult);
    const updatedHistory = await api.getAssessmentHistory(user.id);
    setHistory(updatedHistory);
    
    setIsComplete(true);
    setAnswers({}); 
    setStartTime(null);
    setIsLoading(false);
    return newResult;
  }, [calculateScores, user.id]);

  const saveAnalysisToResult = useCallback(async (resultId: string, analysis: any) => {
    await api.updateAssessmentAnalysis(user.id, resultId, analysis);
    const updatedHistory = await api.getAssessmentHistory(user.id);
    setHistory(updatedHistory);
  }, [user.id]);

  const addFocusArea = useCallback(async (area: Omit<FocusArea, 'id' | 'status'>) => {
    const newArea: FocusArea = {
      ...area,
      id: `fa_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      status: 'planned'
    };
    const updatedAreas = [...focusAreas, newArea];
    await api.saveFocusAreas(user.id, updatedAreas);
    setFocusAreas(updatedAreas);
  }, [focusAreas, user.id]);

  const updateFocusArea = useCallback(async (id: string, updates: Partial<FocusArea>) => {
    const updatedAreas = focusAreas.map(area => area.id === id ? { ...area, ...updates } : area);
    await api.saveFocusAreas(user.id, updatedAreas);
    setFocusAreas(updatedAreas);
  }, [focusAreas, user.id]);

  const removeFocusArea = useCallback(async (id: string) => {
    const updatedAreas = focusAreas.filter(area => area.id !== id);
    await api.saveFocusAreas(user.id, updatedAreas);
    setFocusAreas(updatedAreas);
  }, [focusAreas, user.id]);

  return (
    <AssessmentContext.Provider
      value={{
        answers,
        saveAnswer,
        startAssessment,
        submitAssessment,
        startTime,
        elapsedTime,
        isComplete,
        history,
        latestResult,
        calculateScores,
        saveAnalysisToResult,
        focusAreas,
        addFocusArea,
        updateFocusArea,
        removeFocusArea,
        isLoading
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};
