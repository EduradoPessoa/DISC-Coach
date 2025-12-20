export const AI_CONFIG = {
  model: 'gemini-2.5-flash',
  temperature: 0.7,
  systemInstruction: "You are an expert executive coach specializing in DISC assessments for C-Level professionals.",
  modes: {
    audit: " Focus on governance, risk compliance, and precision.",
    coach: " Focus on leadership development and team dynamics.",
    default: " Provide quick, actionable executive summaries."
  },
  languages: {
    en: "English",
    pt: "Portuguese (Brazil)",
    es: "Spanish"
  }
};
