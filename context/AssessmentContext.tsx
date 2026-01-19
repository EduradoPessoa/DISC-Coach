import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { DiscScore, AssessmentResult, FocusArea } from '../types';
import { QUESTIONS } from '../data/questions';

interface Answers {
  [questionId: number]: number;
}

interface AssessmentContextType {
  answers: Answers;
  saveAnswer: (questionId: number, value: number) => void;
  startAssessment: () => void;
  submitAssessment: () => AssessmentResult;
  startTime: number | null;
  elapsedTime: number; 
  isComplete: boolean;
  history: AssessmentResult[];
  latestResult: AssessmentResult | null;
  calculateScores: () => DiscScore;
  saveAnalysisToResult: (resultId: string, analysis: any) => void;
  focusAreas: FocusArea[];
  addFocusArea: (area: Omit<FocusArea, 'id' | 'status'>) => void;
  updateFocusArea: (id: string, updates: Partial<FocusArea>) => void;
  removeFocusArea: (id: string) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<Answers>(() => {
    const saved = localStorage.getItem('disc_current_answers');
    return saved ? JSON.parse(saved) : {};
  });
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  const [history, setHistory] = useState<AssessmentResult[]>(() => {
    const saved = localStorage.getItem('disc_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [focusAreas, setFocusAreas] = useState<FocusArea[]>(() => {
    const saved = localStorage.getItem('disc_focus_areas');
    return saved ? JSON.parse(saved) : [];
  });

  const latestResult = history.length > 0 ? history[history.length - 1] : null;
  
  useEffect(() => {
    localStorage.setItem('disc_current_answers', JSON.stringify(answers));
  }, [answers]);

  useEffect(() => {
    localStorage.setItem('disc_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('disc_focus_areas', JSON.stringify(focusAreas));
  }, [focusAreas]);

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
    const scores: DiscScore = { D: 0, I: 0, S: 0, C: 0 };
    const counts: DiscScore = { D: 0, I: 0, S: 0, C: 0 };

    QUESTIONS.forEach(q => {
      const val = answers[q.id];
      if (val !== undefined) {
        scores[q.category] += val;
        counts[q.category]++;
      }
    });

    return {
      D: counts.D ? Math.round(((scores.D - counts.D) / (counts.D * 4)) * 100) : 0,
      I: counts.I ? Math.round(((scores.I - counts.I) / (counts.I * 4)) * 100) : 0,
      S: counts.S ? Math.round(((scores.S - counts.S) / (counts.S * 4)) * 100) : 0,
      C: counts.C ? Math.round(((scores.C - counts.C) / (counts.C * 4)) * 100) : 0,
    };
  }, [answers]);

  const submitAssessment = useCallback(() => {
    const finalScores = calculateScores();
    const newResult: AssessmentResult = {
      id: `res_${Date.now()}`,
      timestamp: Date.now(),
      scores: finalScores
    };
    
    setHistory(prev => [...prev, newResult]);
    setIsComplete(true);
    setAnswers({}); 
    return newResult;
  }, [calculateScores]);

  const saveAnalysisToResult = useCallback((resultId: string, analysis: any) => {
    setHistory(prev => {
      const updated = prev.map(res => 
        res.id === resultId ? { ...res, analysis } : res
      );
      return updated;
    });
  }, []);

  const addFocusArea = useCallback((area: Omit<FocusArea, 'id' | 'status'>) => {
    const newArea: FocusArea = {
      ...area,
      id: `fa_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      status: 'planned'
    };
    setFocusAreas(prev => [...prev, newArea]);
  }, []);

  const updateFocusArea = useCallback((id: string, updates: Partial<FocusArea>) => {
    setFocusAreas(prev => prev.map(area => area.id === id ? { ...area, ...updates } : area));
  }, []);

  const removeFocusArea = useCallback((id: string) => {
    setFocusAreas(prev => prev.filter(area => area.id !== id));
  }, []);

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
        removeFocusArea
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