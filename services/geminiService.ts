import { GoogleGenAI } from "@google/genai";

/**
 * Generates DISC insights using the Gemini API.
 * Follows the pattern: const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
 */
export const generateDiscInsights = async (
  profile: string,
  context: string,
  mode: 'suggest' | 'coach' | 'audit',
  language: 'en' | 'pt' | 'es' = 'en'
): Promise<string> => {
  // Use a fresh instance to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let systemInstruction = "Você é um Coach Executivo sênior especializado em avaliações DISC para profissionais de C-Level.";
  
  if (mode === 'audit') {
    systemInstruction += " Foco em governança, compliance de riscos e precisão técnica.";
  } else if (mode === 'coach') {
    systemInstruction += " Foco em desenvolvimento de liderança e dinâmicas de equipe de alta performance.";
  } else {
    systemInstruction += " Forneça resumos executivos rápidos e acionáveis.";
  }

  const langMap = {
    en: "Inglês",
    pt: "Português (Brasil)",
    es: "Espanhol"
  };
  
  systemInstruction += ` IMPORTANTE: Responda obrigatoriamente em ${langMap[language]}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perfil DISC: ${profile}. Contexto Executivo: ${context}. Forneça insights estratégicos.`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.6,
      }
    });
    
    return response.text || "Não foi possível gerar insights no momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao conectar com a IA. Por favor, verifique a chave de API ou sua conexão de rede.";
  }
};
