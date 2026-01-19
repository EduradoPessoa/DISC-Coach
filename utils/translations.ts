import { Language } from '../types';

export const translations = {
  en: {
    common: {
      next: "Next",
      back: "Back",
      save: "Save",
      cancel: "Cancel",
      loading: "Loading...",
      dashboard: "Dashboard",
      settings: "Settings",
      logout: "Logout",
    },
    header: {
      level: "Level C",
      profile: "Profile"
    },
    assessment: {
      title: "Executive Assessment",
      question: "Question",
      of: "of",
      stronglyDisagree: "Strongly Disagree",
      disagree: "Disagree",
      neutral: "Neutral",
      agree: "Agree",
      stronglyAgree: "Strongly Agree",
      complete: "Complete Assessment",
      progress: "Progress"
    },
    results: {
      title: "Assessment Results",
      profileType: "Profile Type",
      exportPdf: "Export PDF",
      devPlan: "Development Plan",
      discDimensions: "DISC Dimensions",
      driverLabel: "Primary Driver",
      driverDesc: "You balance a drive for bottom-line results with a strict adherence to quality and protocol.",
      execSummary: "Executive Summary (AI)",
      aiPrompt: "Provide an executive summary for this DISC profile focusing on their strengths in governance and potential risks in agility.",
      descriptorsTitle: "Key Descriptors",
      descriptors: ["Precise", "Assertive", "Analytical", "Objective"],
      commStyle: {
        title: "Communication Style",
        items: [
          "Prefers written, detailed reports over impromptu meetings.",
          "Direct and fact-based; dislikes emotional appeals.",
          "Expects others to come prepared with data."
        ]
      },
      valueOrg: {
        title: "Value to Organization",
        items: [
          "Excellent at risk mitigation and quality control.",
          "Clarifies complex situations with logic.",
          "Maintains high standards for the entire team."
        ]
      },
      blindspots: {
        title: "Potential Blindspots",
        items: [
          "May appear overly critical or detached.",
          "Risk of 'analysis paralysis' when speed is required.",
          "Can struggle with ambiguity or undefined processes."
        ]
      }
    },
    settings: {
      title: "Account Settings",
      subtitle: "Manage your profile information and preferences.",
      publicProfile: "Public Profile",
      changeAvatar: "Change Avatar",
      security: "Security & Compliance",
      successMessage: "Profile saved successfully!",
      uploadLimit: "File size exceeds 1MB limit.",
      imageHelp: "JPG, GIF or PNG. Max 1MB.",
      fullName: "Full Name",
      email: "Corporate Email",
      position: "Position / Title",
      department: "Department",
      twoFactorTitle: "Two-Factor Authentication",
      twoFactorDesc: "Add an extra layer of security to your account.",
      enable: "Enable",
      visibilityTitle: "Data Visibility (RLS)",
      visibilityDesc: "Share assessment results with direct manager."
    }
  },
  pt: {
    common: {
      next: "Próxima",
      back: "Voltar",
      save: "Salvar",
      cancel: "Cancelar",
      loading: "Carregando...",
      dashboard: "Painel",
      settings: "Configurações",
      logout: "Sair",
    },
    header: {
      level: "Nível C",
      profile: "Perfil"
    },
    assessment: {
      title: "Avaliação Executiva",
      question: "Questão",
      of: "de",
      stronglyDisagree: "Discordo Totalmente",
      disagree: "Discordo",
      neutral: "Neutro",
      agree: "Concordo",
      stronglyAgree: "Concordo Totalmente",
      complete: "Concluir Avaliação",
      progress: "Progresso"
    },
    results: {
      title: "Resultados da Avaliação",
      profileType: "Tipo de Perfil",
      exportPdf: "Exportar PDF",
      devPlan: "Plano de Desenvolvimento",
      discDimensions: "Dimensões DISC",
      driverLabel: "Impulsionador Primário",
      driverDesc: "Você equilibra a busca por resultados com uma estrita adesão à qualidade e protocolo.",
      execSummary: "Sumário Executivo (IA)",
      aiPrompt: "Forneça um resumo executivo para este perfil DISC focando em seus pontos fortes em governança e riscos potenciais em agilidade.",
      descriptorsTitle: "Descritores Chave",
      descriptors: ["Preciso", "Assertivo", "Analítico", "Objetivo"],
      commStyle: {
        title: "Estilo de Comunicação",
        items: [
          "Prefere relatórios escritos e detalhados a reuniões improvisadas.",
          "Direto e baseado em fatos; não gosta de apelos emocionais.",
          "Espera que os outros venham preparados com dados."
        ]
      },
      valueOrg: {
        title: "Valor para a Organização",
        items: [
          "Excelente na mitigação de riscos e controle de qualidade.",
          "Clarifica situações complexas com lógica.",
          "Mantém altos padrões para toda a equipe."
        ]
      },
      blindspots: {
        title: "Pontos Cegos Potenciais",
        items: [
          "Pode parecer excessivamente crítico ou distante.",
          "Risco de 'paralisia por análise' quando velocidade é necessária.",
          "Pode ter dificuldades com ambiguidade ou processos indefinidos."
        ]
      }
    },
    settings: {
      title: "Configurações da Conta",
      subtitle: "Gerencie suas informações de perfil e preferências.",
      publicProfile: "Perfil Público",
      changeAvatar: "Alterar Avatar",
      security: "Segurança e Conformidade",
      successMessage: "Perfil salvo com sucesso!",
      uploadLimit: "O arquivo excede o limite de 1MB.",
      imageHelp: "JPG, GIF ou PNG. Máx 1MB.",
      fullName: "Nome Completo",
      email: "E-mail Corporativo",
      position: "Cargo / Título",
      department: "Departamento",
      twoFactorTitle: "Autenticação de Dois Fatores",
      twoFactorDesc: "Adicione uma camada extra de segurança à sua conta.",
      enable: "Habilitar",
      visibilityTitle: "Visibilidade de Dados (RLS)",
      visibilityDesc: "Compartilhar resultados da avaliação com o gestor direto."
    }
  },
  es: {
    common: {
      next: "Siguiente",
      back: "Atrás",
      save: "Guardar",
      cancel: "Cancelar",
      loading: "Cargando...",
      dashboard: "Tablero",
      settings: "Ajustes",
      logout: "Cerrar Sesión",
    },
    header: {
      level: "Nivel C",
      profile: "Perfil"
    },
    assessment: {
      title: "Evaluación Ejecutiva",
      question: "Pregunta",
      of: "de",
      stronglyDisagree: "Muy en Desacuerdo",
      disagree: "En Desacuerdo",
      neutral: "Neutral",
      agree: "De Acuerdo",
      stronglyAgree: "Muy de Acuerdo",
      complete: "Completar Evaluación",
      progress: "Progreso"
    },
    results: {
      title: "Resultados de Evaluación",
      profileType: "Tipo de Perfil",
      exportPdf: "Exportar PDF",
      devPlan: "Plan de Desarrollo",
      discDimensions: "Dimensiones DISC",
      driverLabel: "Impulsor Primario",
      driverDesc: "Equilibras el impulso por los resultados con una estricta adherencia a la calidad y el protocolo.",
      execSummary: "Resumen Ejecutivo (IA)",
      aiPrompt: "Proporcione un resumen ejecutivo para este perfil DISC centrándose en sus fortalezas en gobernanza y riesgos potenciales en agilidad.",
      descriptorsTitle: "Descriptores Clave",
      descriptors: ["Preciso", "Asertivo", "Analítico", "Objetivo"],
      commStyle: {
        title: "Estilo de Comunicación",
        items: [
          "Prefiere informes escritos y detallados a reuniones improvisadas.",
          "Directo y basado en hechos; le disgustan las apelaciones emocionales.",
          "Espera que los demás vengan preparados con datos."
        ]
      },
      valueOrg: {
        title: "Valor para la Organización",
        items: [
          "Excelente en mitigación de riesgos y control de calidad.",
          "Aclara situaciones complejas con lógica.",
          "Mantiene altos estándares para todo el equipo."
        ]
      },
      blindspots: {
        title: "Puntos Ciegos Potenciales",
        items: [
          "Puede parecer demasiado crítico o distante.",
          "Riesgo de 'parálisis por análisis' cuando se requiere velocidad.",
          "Puede tener dificultades con la ambigüedad o procesos indefinidos."
        ]
      }
    },
    settings: {
      title: "Configuración de la Cuenta",
      subtitle: "Administre su información de perfil y preferencias.",
      publicProfile: "Perfil Público",
      changeAvatar: "Cambiar Avatar",
      security: "Seguridad y Cumplimiento",
      successMessage: "¡Perfil guardado exitosamente!",
      uploadLimit: "El archivo excede el límite de 1MB.",
      imageHelp: "JPG, GIF o PNG. Máx 1MB.",
      fullName: "Nombre Completo",
      email: "Correo Corporativo",
      position: "Cargo / Título",
      department: "Departamento",
      twoFactorTitle: "Autenticación de Dos Factores",
      twoFactorDesc: "Agregue una capa adicional de seguridad a su cuenta.",
      enable: "Habilitar",
      visibilityTitle: "Visibilidad de Datos (RLS)",
      visibilityDesc: "Compartir resultados de la evaluación con el gerente directo."
    }
  }
};