import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

interface Answers {
  [questionId: number]: number;
}

interface AssessmentContextType {
  answers: Answers;
  saveAnswer: (questionId: number, value: number) => void;
  startAssessment: () => void;
  submitAssessment: () => void;
  startTime: number | null;
  elapsedTime: number; // in seconds
  isComplete: boolean;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [answers, setAnswers] = useState<Answers>({});
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  
  // Timer logic
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

  const submitAssessment = useCallback(() => {
    setIsComplete(true);
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
        isComplete
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
