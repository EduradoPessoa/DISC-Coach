import { AI_CONFIG } from "../config/ai";
import { apiRequest } from "./api"; // Usando nosso helper de API

export const generateDiscInsights = async (
  profile: string,
  context: string,
  mode: 'suggest' | 'coach' | 'audit',
  language: 'en' | 'pt' | 'es' = 'en'
): Promise<string> => {
  
  let systemInstruction = AI_CONFIG.systemInstruction;
  
  if (mode === 'audit') {
    systemInstruction += AI_CONFIG.modes.audit;
  } else if (mode === 'coach') {
    systemInstruction += AI_CONFIG.modes.coach;
  } else {
    systemInstruction += AI_CONFIG.modes.default;
  }

  // Enforce language
  systemInstruction += ` IMPORTANT: You MUST generate your response entirely in ${AI_CONFIG.languages[language]}.`;

  try {
    // Agora chamamos nosso Backend PHP em vez da API do Google diretamente
    const response = await apiRequest('/ai/generate.php', 'POST', {
      prompt: `Profile: ${profile}. Context: ${context}. Provide insights.`,
      systemInstruction: systemInstruction
    });
    
    return response.text || "Unable to generate insights at this time.";
  } catch (error: any) {
    console.error("AI Service Error:", error);
    // Retorna a mensagem exata do erro se disponível
    return error.message || "Error connecting to AI service. Please check server logs.";
  }
};
