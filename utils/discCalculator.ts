import { Question, DiscScore } from '../types';

/**
 * Calcula os scores DISC baseados nas respostas do usuário (escala 1-5).
 * Normaliza para uma escala de 0 a 100%.
 */
export const calculateDiscScores = (
  questions: Question[],
  answers: Record<number, number>
): DiscScore => {
  const totals: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 };
  const counts: Record<string, number> = { D: 0, I: 0, S: 0, C: 0 };

  questions.forEach((question) => {
    const answer = answers[question.id];
    if (answer !== undefined) {
      totals[question.category] += answer;
      counts[question.category]++;
    }
  });

  const calculatePercentage = (category: string): number => {
    const count = counts[category];
    const total = totals[category];
    
    if (count === 0) return 0;
    
    // Normalização: (Soma - MinPossivel) / (MaxPossivel - MinPossivel)
    // MinPossível = count * 1
    // MaxPossível = count * 5
    // Range = count * 4
    const normalizedScore = ((total - count) / (count * 4)) * 100;
    
    return Math.round(normalizedScore);
  };

  return {
    D: calculatePercentage('D'),
    I: calculatePercentage('I'),
    S: calculatePercentage('S'),
    C: calculatePercentage('C'),
  };
};

/**
 * Identifica o perfil dominante.
 */
export const getDominantProfile = (scores: DiscScore): keyof DiscScore => {
  return (Object.keys(scores) as Array<keyof DiscScore>).reduce((a, b) => 
    scores[a] > scores[b] ? a : b
  );
};