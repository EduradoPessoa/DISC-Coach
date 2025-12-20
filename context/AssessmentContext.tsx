import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiRequest } from '../services/api';
import { useUser } from './UserContext';
import { QUESTIONS } from '../data/questions';

interface Answers {
  [questionId: number]: number;
}

interface DiscScores {
  D: number;
  I: number;
  S: number;
  C: number;
}

interface AssessmentContextType {
  answers: Answers;
  saveAnswer: (questionId: number, value: number) => void;
  startAssessment: () => void;
  submitAssessment: () => Promise<void>;
  startTime: number | null;
  elapsedTime: number; // in seconds
  isComplete: boolean;
  scores: DiscScores | null;
  loadLatestResults: () => Promise<void>;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<Answers>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [scores, setScores] = useState<DiscScores | null>(null);
  const { user } = useUser();
  
  // Timer logic
  useEffect(() => {
    let interval: number;
    if (startTime && !isComplete) {
      interval = window.setInterval(() => {
        const now = Date.now();
        setElapsedTime(Math.floor((now - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isComplete]);

  const startAssessment = useCallback(() => {
    setAnswers({});
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsComplete(false);
    setScores(null);
  }, []);

  const saveAnswer = useCallback((questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  }, []);

  const calculateScores = (finalAnswers: Answers): DiscScores => {
    const newScores = { D: 0, I: 0, S: 0, C: 0 };
    
    // Simple calculation logic based on questions metadata
    // This assumes we have access to question traits. 
    // For now, we iterate through questions and map them.
    // In a real app, questions would have a 'trait' property (D, I, S, or C)
    
    QUESTIONS.forEach((q) => {
       const val = finalAnswers[q.id] || 3; // Default to neutral if missing
       // This is a MOCK calculation logic. 
       // You need to replace this with your actual scoring algorithm based on question types.
       // Distributing randomly for demo if no trait is defined on question
       const traits: Array<keyof DiscScores> = ['D', 'I', 'S', 'C'];
       const trait = traits[q.id % 4]; 
       
       // Normalize value (1-5) to score contribution
       // e.g. 5 = high score, 1 = low score
       newScores[trait] += val; 
    });

    // Normalize to 0-100 scale approximately
    // Max score per trait = (Total Questions / 4) * 5
    const maxPerTrait = (QUESTIONS.length / 4) * 5;
    
    return {
        D: Math.round((newScores.D / maxPerTrait) * 100),
        I: Math.round((newScores.I / maxPerTrait) * 100),
        S: Math.round((newScores.S / maxPerTrait) * 100),
        C: Math.round((newScores.C / maxPerTrait) * 100),
    };
  };

  const submitAssessment = useCallback(async () => {
    setIsComplete(true);
    const calculatedScores = calculateScores(answers);
    setScores(calculatedScores);

    // Prepare data for backend
    const payload = {
        user_id: user.id, // Use actual user ID from context
        scores: calculatedScores,
        answers: Object.entries(answers).map(([qid, val]) => ({ questionId: parseInt(qid), value: val }))
    };

    try {
        await apiRequest('/assessment/save.php', 'POST', payload);
        console.log("Assessment saved successfully");
    } catch (error) {
        console.error("Failed to save assessment", error);
        // Optionally handle offline storage here
    }

  }, [answers, user]);

  const loadLatestResults = useCallback(async () => {
      try {
          if (!user || !user.id) return;
          const data = await apiRequest(`/assessment/get_latest.php?user_id=${user.id}`, 'GET');
          if (data && data.scores) {
              setScores(data.scores);
              setIsComplete(true); // Mark as complete so UI shows results
          }
      } catch (error) {
          console.log("No previous results found or error loading.");
      }
  }, [user]);

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
        scores,
        loadLatestResults
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