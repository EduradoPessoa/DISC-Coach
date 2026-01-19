import { GoogleGenAI, Type } from "@google/genai";

export const generateDiscInsights = async (
  profile: string,
  context: string,
  mode: 'suggest' | 'coach' | 'audit',
  language: 'en' | 'pt' | 'es' = 'en'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  let systemInstruction = "Você é um Coach Executivo sênior especializado em avaliações DISC para profissionais de C-Level.";
  
  if (mode === 'audit') {
    systemInstruction += " Foco em governança, compliance de riscos e precisão técnica.";
  } else if (mode === 'coach') {
    systemInstruction += " Foco em desenvolvimento de liderança e dinâmicas de equipe de alta performance.";
  }

  const langMap = {
    en: "Inglês",
    pt: "Português (Brasil)",
    es: "Espanhol"
  };
  
  systemInstruction += ` Responda em Markdown. Idioma: ${langMap[language]}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Perfil DISC: ${profile}. Contexto: ${context}.`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });
    
    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Erro ao gerar análise.";
  }
};

export const generateDevelopmentSuggestions = async (
  scores: { D: number, I: number, S: number, C: number },
  language: 'pt' | 'en' | 'es' = 'pt'
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Gere 4 sugestões de ações de desenvolvimento para um executivo com scores DISC D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}.`,
      config: {
        systemInstruction: `Você é um Coach Executivo. Gere um JSON contendo uma lista de sugestões de ações práticas. Cada sugestão deve ter 'title', 'description' e 'category' (D, I, S ou C). Idioma: ${language}.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  category: { type: Type.STRING, enum: ["D", "I", "S", "C"] }
                },
                required: ["title", "description", "category"]
              }
            }
          },
          required: ["suggestions"]
        }
      }
    });

    return JSON.parse(response.text).suggestions;
  } catch (error) {
    console.error("Suggestions Error:", error);
    return [];
  }
};

/**
 * Gera um relatório completo e estruturado baseado nos resultados do assessment.
 */
export const generateFullDiscReport = async (
  scores: { D: number, I: number, S: number, C: number },
  userContext: string,
  language: 'en' | 'pt' | 'es' = 'pt'
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Analise os seguintes scores DISC de um executivo C-Level: D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}. 
  Contexto adicional: ${userContext}.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: `Você é um consultor de capital humano para CEOs. 
        Gere um relatório estruturado em JSON com as chaves: 
        'summary' (string em Markdown), 
        'communication' (array de strings), 
        'value' (array de strings), 
        'blindspots' (array de strings).
        Idioma: ${language === 'pt' ? 'Português do Brasil' : language}.`,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "Sumário executivo em Markdown" },
            communication: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 itens sobre estilo de comunicação" },
            value: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 itens sobre valor para organização" },
            blindspots: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3 pontos cegos ou riscos" },
          },
          required: ["summary", "communication", "value", "blindspots"]
        }
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Full Report Error:", error);
    throw error;
  }
};