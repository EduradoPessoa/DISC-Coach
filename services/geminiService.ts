import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY || ''; 
  if (!apiKey) {
    console.warn("API_KEY not found in environment variables.");
  }
  return new GoogleGenAI({ apiKey });
};

export const generateDiscInsights = async (
  profile: string,
  context: string,
  mode: 'suggest' | 'coach' | 'audit',
  language: 'en' | 'pt' | 'es' = 'en'
): Promise<string> => {
  const ai = getAiClient();
  
  let systemInstruction = "You are an expert executive coach specializing in DISC assessments for C-Level professionals.";
  
  if (mode === 'audit') {
    systemInstruction += " Focus on governance, risk compliance, and precision.";
  } else if (mode === 'coach') {
    systemInstruction += " Focus on leadership development and team dynamics.";
  } else {
    systemInstruction += " Provide quick, actionable executive summaries.";
  }

  // Enforce language
  const langMap = {
    en: "English",
    pt: "Portuguese (Brazil)",
    es: "Spanish"
  };
  
  systemInstruction += ` IMPORTANT: You MUST generate your response entirely in ${langMap[language]}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Profile: ${profile}. Context: ${context}. Provide insights.`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });
    
    return response.text || "Unable to generate insights at this time.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please check your API key.";
  }
};