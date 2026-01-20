import Groq from "groq-sdk";

// Initialize Groq client
// Note: dangerouslyAllowBrowser is needed because we are calling from the client side.
// Ideally, this should be done via a backend proxy to protect the API key.
const getGroqClient = (apiKey: string) => new Groq({ 
  apiKey,
  dangerouslyAllowBrowser: true 
});

const MODEL = "llama-3.3-70b-versatile";

/**
 * Gera insights sobre o perfil DISC usando Groq Cloud
 */
export const generateDiscInsights = async (
  profile: string,
  context: string,
  mode: 'suggest' | 'coach' | 'audit',
  language: 'en' | 'pt' | 'es' = 'en'
): Promise<string> => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    console.warn("Groq API Key não configurada. Usando resposta mockada.");
    return getMockResponse(mode, language);
  }
  
  const groq = getGroqClient(apiKey);
  
  let systemInstruction = "Você é um Coach Executivo sênior especializado em avaliações DISC para profissionais de C-Level.";
  
  if (mode === 'audit') {
    systemInstruction += " Foco em governança, compliance de riscos e precisão técnica.";
  } else if (mode === 'coach') {
    systemInstruction += " Foco em desenvolvimento de liderança. IMPORTANTE: Sua análise DEVE cobrir explicitamente os 4 fatores DISC (Dominância, Influência, Estabilidade e Conformidade), avaliando como o perfil do usuário impacta cada um deles no contexto das ações planejadas.";
  }

  const langMap = {
    en: "Inglês",
    pt: "Português (Brasil)",
    es: "Espanhol"
  };
  
  systemInstruction += ` Responda em Markdown. Idioma: ${langMap[language]}.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemInstruction },
        { role: "user", content: `Perfil DISC: ${profile}. Contexto: ${context}.` }
      ],
      model: MODEL,
      temperature: 0.7,
    });
    
    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API Error:", error);
    return getMockResponse(mode, language);
  }
};

function getMockResponse(mode: string, language: string): string {
  const responses = {
    pt: {
      suggest: "Com base no seu perfil DISC, sugiro focar em melhorar a comunicação assertiva e desenvolver habilidades de delegação efetiva.",
      coach: `**Análise do Coach Executivo:**\n\n*   **Dominância (D):** Seu foco em resultados é alto, mas certifique-se de ouvir sua equipe antes de decidir.\n*   **Influência (I):** Utilize seu carisma para engajar, mas mantenha o foco nos prazos.\n*   **Estabilidade (S):** Sua paciência é uma virtude, mas não evite conflitos necessários.\n*   **Conformidade (C):** Sua precisão é excelente, mas cuidado com o perfeccionismo que pode travar o progresso.`,
      audit: "Análise de governança: Seu perfil indica necessidade de maior atenção aos detalhes em processos críticos e documentação adequada."
    },
    en: {
      suggest: "Based on your DISC profile, I suggest focusing on improving assertive communication and developing effective delegation skills.",
      coach: `**Executive Coach Analysis:**\n\n*   **Dominance (D):** Your focus on results is high, but ensure you listen to your team before deciding.\n*   **Influence (I):** Use your charisma to engage, but keep focus on deadlines.\n*   **Steadiness (S):** Your patience is a virtue, but do not avoid necessary conflicts.\n*   **Compliance (C):** Your precision is excellent, but beware of perfectionism stalling progress.`,
      audit: "Governance analysis: Your profile indicates a need for greater attention to detail in critical processes and proper documentation."
    },
    es: {
      suggest: "Basado en su perfil DISC, sugiero enfocarse en mejorar la comunicación asertiva y desarrollar habilidades de delegación efectiva.",
      coach: `**Análisis del Coach Ejecutivo:**\n\n*   **Dominancia (D):** Su enfoque en resultados es alto, pero asegúrese de escuchar a su equipo antes de decidir.\n*   **Influencia (I):** Utilice su carisma para involucrar, pero mantenga el enfoque en los plazos.\n*   **Estabilidad (S):** Su paciencia es una virtud, pero no evite conflictos necesarios.\n*   **Cumplimiento (C):** Su precisión es excelente, pero cuidado con el perfeccionismo que puede frenar el progreso.`,
      audit: "Análisis de gobernanza: Su perfil indica necesidad de mayor atención al detalle en procesos críticos y documentación adecuada."
    }
  };
  
  return responses[language as keyof typeof responses]?.[mode as keyof typeof responses.pt] || responses.en.suggest;
}

/**
 * Gera sugestões de desenvolvimento usando Groq Cloud (JSON Mode)
 */
export const generateDevelopmentSuggestions = async (
  scores: { D: number, I: number, S: number, C: number },
  currentFocusAreas: string[] = [],
  language: 'pt' | 'en' | 'es' = 'pt'
) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    console.warn("Groq API Key não configurada. Usando sugestões mockadas.");
    return getMockSuggestions(scores, language, currentFocusAreas);
  }
  
  const groq = getGroqClient(apiKey);
  
  const existingAreasText = currentFocusAreas.length > 0 
    ? `\nEVITE gerar sugestões que sejam similares às seguintes áreas de foco que o usuário já possui: ${currentFocusAreas.join(", ")}.`
    : "";

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Você é um Coach Executivo. Gere um JSON contendo uma lista de sugestões de ações práticas. 
          O JSON deve ter a estrutura: { "suggestions": [{ "title": "...", "description": "...", "category": "D|I|S|C" }] }.
          Idioma: ${language}. Responda APENAS com o JSON válido.${existingAreasText}`
        },
        {
          role: "user",
          content: `Gere 4 sugestões de ações de desenvolvimento para um executivo com scores DISC D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}.`
        }
      ],
      model: MODEL,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(content).suggestions || [];
  } catch (error) {
    console.error("Groq API Suggestions Error:", error);
    return getMockSuggestions(scores, language, currentFocusAreas);
  }
};

function getMockSuggestions(scores: { D: number, I: number, S: number, C: number }, language: string, currentFocusAreas: string[] = []) {
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
  
  const allSuggestions = suggestions[language as keyof typeof suggestions] || suggestions.en;
  return allSuggestions.filter(s => !currentFocusAreas.includes(s.title));
}

/**
 * Gera um relatório completo e estruturado baseado nos resultados do assessment.
 */
export const generateFullDiscReport = async (
  scores: { D: number, I: number, S: number, C: number },
  userContext: string,
  language: 'en' | 'pt' | 'es' = 'pt'
) => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey) {
    console.warn("Groq API Key não configurada. Usando relatório mockado.");
    return getMockReport(scores, userContext, language);
  }
  
  const groq = getGroqClient(apiKey);
  
  const prompt = `Analise os seguintes scores DISC de um executivo C-Level: D:${scores.D}, I:${scores.I}, S:${scores.S}, C:${scores.C}. 
  Contexto adicional: ${userContext}.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `Você é um consultor de capital humano para CEOs. 
          Gere um relatório estruturado em JSON com as chaves: 
          'summary' (string em Markdown), 
          'communication' (array de strings), 
          'value' (array de strings), 
          'blindspots' (array de strings).
          Idioma: ${language === 'pt' ? 'Português do Brasil' : language}.
          Responda APENAS com o JSON válido.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: MODEL,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const content = completion.choices[0]?.message?.content || "{}";
    return JSON.parse(content);
  } catch (error) {
    console.error("Groq API Report Error:", error);
    return getMockReport(scores, userContext, language);
  }
};

function getMockReport(scores: { D: number, I: number, S: number, C: number }, userContext: string, language: string) {
  const reports = {
    pt: {
      summary: "## Sumário Executivo\n\nEste executivo demonstra um forte equilíbrio entre resultados e processos.",
      communication: [
        "Direto e objetivo",
        "Baseado em dados",
        "Formal em situações profissionais"
      ],
      value: [
        "Alta capacidade analítica",
        "Foco em qualidade",
        "Gestão de riscos"
      ],
      blindspots: [
        "Pode parecer distante",
        "Excesso de análise",
        "Resistência a mudanças rápidas sem dados"
      ]
    },
    en: {
      summary: "## Executive Summary\n\nThis executive demonstrates a strong balance between results and processes.",
      communication: [
        "Direct and objective",
        "Data-driven",
        "Formal in professional situations"
      ],
      value: [
        "High analytical capacity",
        "Focus on quality",
        "Risk management"
      ],
      blindspots: [
        "May appear distant",
        "Analysis paralysis",
        "Resistance to rapid changes without data"
      ]
    },
    es: {
      summary: "## Resumen Ejecutivo\n\nEste ejecutivo demuestra un fuerte equilibrio entre resultados y procesos.",
      communication: [
        "Directo y objetivo",
        "Basado en datos",
        "Formal en situaciones profesionales"
      ],
      value: [
        "Alta capacidad analítica",
        "Enfoque en calidad",
        "Gestión de riesgos"
      ],
      blindspots: [
        "Puede parecer distante",
        "Parálisis por análisis",
        "Resistencia a cambios rápidos sin datos"
      ]
    }
  };

  return reports[language as keyof typeof reports] || reports.en;
}
