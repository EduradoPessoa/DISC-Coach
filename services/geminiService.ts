import { GoogleGenAI, Type } from "@google/genai";

// Use gemini-3-pro-preview for complex reasoning tasks like executive coaching
export const generateDiscInsights = async (
  profile: string,
  context: string,
  mode: 'suggest' | 'coach' | 'audit',
  language: 'en' | 'pt' | 'es' = 'en'
): Promise<string> => {
  const apiKey = import.meta.env.VITE_API_KEY || process.env.VITE_API_KEY;
  
  if (!apiKey) {
    console.warn("Google AI API Key não configurada. Usando resposta mockada.");
    return getMockResponse(mode, language);
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
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
    // Fix: Using gemini-3-pro-preview for complex reasoning task (executive coaching)
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Perfil DISC: ${profile}. Contexto: ${context}.`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });
    
    // Access response.text property directly
    return response.text || "";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return getMockResponse(mode, language);
  }
};

function getMockResponse(mode: string, language: string): string {
  const responses = {
    pt: {
      suggest: "Com base no seu perfil DISC, sugiro focar em melhorar a comunicação assertiva e desenvolver habilidades de delegação efetiva.",
      coach: "Como seu coach executivo, recomendo trabalhar na construção de relacionamentos mais fortes com sua equipe através de feedback regular e reconhecimento.",
      audit: "Análise de governança: Seu perfil indica necessidade de maior atenção aos detalhes em processos críticos e documentação adequada."
    },
    en: {
      suggest: "Based on your DISC profile, I suggest focusing on improving assertive communication and developing effective delegation skills.",
      coach: "As your executive coach, I recommend working on building stronger relationships with your team through regular feedback and recognition.",
      audit: "Governance analysis: Your profile indicates a need for greater attention to detail in critical processes and proper documentation."
    },
    es: {
      suggest: "Basado en su perfil DISC, sugiero enfocarse en mejorar la comunicación asertiva y desarrollar habilidades de delegación efectiva.",
      coach: "Como su coach ejecutivo, recomiendo trabajar en construir relaciones más fuertes con su equipo a través de retroalimentación regular y reconocimiento.",
      audit: "Análisis de gobernanza: Su perfil indica necesidad de mayor atención al detalle en procesos críticos y documentación adecuada."
    }
  };
  
  return responses[language as keyof typeof responses]?.[mode as keyof typeof responses.pt] || responses.en.suggest;
}

export const generateDevelopmentSuggestions = async (
  scores: { D: number, I: number, S: number, C: number },
  language: 'pt' | 'en' | 'es' = 'pt'
) => {
  const apiKey = import.meta.env.VITE_API_KEY || process.env.VITE_API_KEY;
  
  if (!apiKey) {
    console.warn("Google AI API Key não configurada. Usando sugestões mockadas.");
    return getMockSuggestions(scores, language);
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    // Fix: Using gemini-3-pro-preview for complex reasoning task (strategy development)
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
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

    // Access response.text property directly and parse JSON
    return JSON.parse(response.text || "{}").suggestions || [];
  } catch (error) {
    console.error("Suggestions Error:", error);
    return getMockSuggestions(scores, language);
  }
};

function getMockSuggestions(scores: { D: number, I: number, S: number, C: number }, language: string) {
  const suggestions = {
    pt: [
      { title: "Liderança Decisiva", description: "Pratique tomar decisões rápidas em situações de alta pressão", category: "D" as const },
      { title: "Comunicação Persuasiva", description: "Desenvolva habilidades de apresentação e influência", category: "I" as const },
      { title: "Gestão de Equipes", description: "Construa relacionamentos mais fortes com sua equipe", category: "S" as const },
      { title: "Análise Estratégica", description: "Aprimore sua capacidade de análise de dados e processos", category: "C" as const }
    ],
    en: [
      { title: "Decisive Leadership", description: "Practice making quick decisions in high-pressure situations", category: "D" as const },
      { title: "Persuasive Communication", description: "Develop presentation and influence skills", category: "I" as const },
      { title: "Team Management", description: "Build stronger relationships with your team", category: "S" as const },
      { title: "Strategic Analysis", description: "Improve your data and process analysis capabilities", category: "C" as const }
    ],
    es: [
      { title: "Liderazgo Decisivo", description: "Practique tomar decisiones rápidas en situaciones de alta presión", category: "D" as const },
      { title: "Comunicación Persuasiva", description: "Desarrolle habilidades de presentación e influencia", category: "I" as const },
      { title: "Gestión de Equipos", description: "Construya relaciones más fuertes con su equipo", category: "S" as const },
      { title: "Análisis Estratégico", description: "Mejore su capacidad de análisis de datos y procesos", category: "C" as const }
    ]
  };
  
  return suggestions[language as keyof typeof suggestions] || suggestions.en;
}

/**
 * Gera um relatório completo e estruturado baseado nos resultados do assessment.
 */
export const generateFullDiscReport = async (
  scores: { D: number, I: number, S: number, C: number },
  userContext: string,
  language: 'en' | 'pt' | 'es' = 'pt'
) => {
  const apiKey = import.meta.env.VITE_API_KEY || process.env.VITE_API_KEY;
  
  if (!apiKey) {
    console.warn("Google AI API Key não configurada. Usando relatório mockado.");
    return getMockReport(scores, userContext, language);
  }
  
  const ai = new GoogleGenAI({ apiKey });
  
  const prompt = `Analise os seguintes scores DISC de um executivo C-Level: D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}. 
  Contexto adicional: ${userContext}.`;

  try {
    // Fix: Using gemini-3-pro-preview for complex reasoning task (human capital consulting)
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
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

    // Access response.text property directly and parse JSON
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Full Report Error:", error);
    return getMockReport(scores, userContext, language);
  }
};

function getMockReport(scores: { D: number, I: number, S: number, C: number }, userContext: string, language: string) {
  const reports = {
    pt: {
      summary: `# Análise DISC Executiva\n\nSeu perfil demonstra uma combinação única de características que o tornam um líder eficaz. Com scores D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}, você possui uma abordagem equilibrada para liderança e tomada de decisão.`,
      communication: [
        "Comunicação direta e objetiva, focada em resultados",
        "Capacidade de adaptar a mensagem ao público-alvo",
        "Estilo de comunicação que inspira confiança e credibilidade"
      ],
      value: [
        "Liderança estratégica e visão de longo prazo",
        "Capacidade de construir e manter relacionamentos profissionais",
        "Excelência na execução de projetos complexos"
      ],
      blindspots: [
        "Tendência a ser perfeccionista em situações que requerem agilidade",
        "Pode ser excessivamente cauteloso em decisões de risco calculado",
        "Às vezes prioriza a harmonia sobre a confrontação necessária"
      ]
    },
    en: {
      summary: `# Executive DISC Analysis\n\nYour profile demonstrates a unique combination of characteristics that make you an effective leader. With scores D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}, you have a balanced approach to leadership and decision-making.`,
      communication: [
        "Direct and objective communication, focused on results",
        "Ability to adapt the message to the target audience",
        "Communication style that inspires confidence and credibility"
      ],
      value: [
        "Strategic leadership and long-term vision",
        "Ability to build and maintain professional relationships",
        "Excellence in executing complex projects"
      ],
      blindspots: [
        "Tendency to be perfectionistic in situations requiring agility",
        "Can be overly cautious in calculated risk decisions",
        "Sometimes prioritizes harmony over necessary confrontation"
      ]
    },
    es: {
      summary: `# Análisis DISC Ejecutivo\n\nSu perfil demuestra una combinación única de características que lo hacen un líder eficaz. Con puntajes D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}, tiene un enfoque equilibrado para el liderazgo y la toma de decisiones.`,
      communication: [
        "Comunicación directa y objetiva, enfocada en resultados",
        "Capacidad de adaptar el mensaje al público objetivo",
        "Estilo de comunicación que inspira confianza y credibilidad"
      ],
      value: [
        "Liderazgo estratégico y visión a largo plazo",
        "Capacidad para construir y mantener relaciones profesionales",
        "Excelencia en la ejecución de proyectos complejos"
      ],
      blindspots: [
        "Tendencia a ser perfeccionista en situaciones que requieren agilidad",
        "Puede ser excesivamente cauteloso en decisiones de riesgo calculado",
        "A veces prioriza la armonía sobre la confrontación necesaria"
      ]
    }
  };
  
  return reports[language as keyof typeof reports] || reports.en;
}