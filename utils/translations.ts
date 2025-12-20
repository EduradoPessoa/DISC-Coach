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
      // Default / Fallback
      descriptors: ["Precise", "Assertive", "Analytical", "Objective"],
      
      // Dynamic Profiles
      profiles: {
        D: {
            descriptors: ["Decisive", "Competitive", "Results-oriented", "Direct"],
            commStyle: {
                title: "Communication Style",
                items: [
                    "Direct and to the point; focuses on 'what'.",
                    "Prefers brevity and efficiency.",
                    "May interrupt if the conversation moves too slowly."
                ]
            },
            valueOrg: {
                title: "Value to Organization",
                items: [
                    "Drives results and bottom-line success.",
                    "Takes charge in chaotic situations.",
                    "Challenges the status quo for improvement."
                ]
            },
            blindspots: {
                title: "Potential Blindspots",
                items: [
                    "May be perceived as aggressive or impatient.",
                    "Can overlook risks in pursuit of goals.",
                    "Might not listen fully to others' opinions."
                ]
            }
        },
        I: {
            descriptors: ["Enthusiastic", "Persuasive", "Sociable", "Optimistic"],
            commStyle: {
                title: "Communication Style",
                items: [
                    "Friendly and energetic; focuses on 'who'.",
                    "Uses stories and emotional appeals.",
                    "Can be disorganized or jump between topics."
                ]
            },
            valueOrg: {
                title: "Value to Organization",
                items: [
                    "Great at motivating and influencing others.",
                    "Brings energy and optimism to the team.",
                    "Excellent at networking and building relationships."
                ]
            },
            blindspots: {
                title: "Potential Blindspots",
                items: [
                    "May overpromise and underdeliver.",
                    "Can be impulsive or lack attention to detail.",
                    "Might talk more than listen."
                ]
            }
        },
        S: {
            descriptors: ["Patient", "Reliable", "Supportive", "Consistent"],
            commStyle: {
                title: "Communication Style",
                items: [
                    "Calm and steady; focuses on 'how'.",
                    "Good listener; prefers one-on-one interactions.",
                    "May hesitate to share negative feedback."
                ]
            },
            valueOrg: {
                title: "Value to Organization",
                items: [
                    "Dependable and consistent performer.",
                    "Great team player; promotes harmony.",
                    "Excellent at executing established processes."
                ]
            },
            blindspots: {
                title: "Potential Blindspots",
                items: [
                    "Resistant to sudden change.",
                    "May prioritize harmony over necessary conflict.",
                    "Can be slow to make decisions."
                ]
            }
        },
        C: {
            descriptors: ["Analytical", "Precise", "Compliant", "Objective"],
            commStyle: {
                title: "Communication Style",
                items: [
                    "Detailed and fact-based; focuses on 'why'.",
                    "Prefers written communication and data.",
                    "May ask many questions to ensure accuracy."
                ]
            },
            valueOrg: {
                title: "Value to Organization",
                items: [
                    "Ensures quality and accuracy.",
                    "Great at problem-solving and analysis.",
                    "Creates and maintains standards and procedures."
                ]
            },
            blindspots: {
                title: "Potential Blindspots",
                items: [
                    "Can be overly critical of self and others.",
                    "May get bogged down in details (analysis paralysis).",
                    "Can be rigid or inflexible with rules."
                ]
            }
        }
      },

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
    onboarding: {
      title: "Configurar Perfil",
      subtitle: "Ajude-nos a personalizar sua experiência",
      fullName: "Nome Completo",
      fullNamePlaceholder: "ex: João Silva",
      position: "Cargo / Título",
      positionPlaceholder: "ex: Gerente de Operações",
      department: "Departamento",
      selectDepartment: "Selecione o Departamento",
      departments: {
        compliance: "Compliance",
        finance: "Finanças",
        legal: "Jurídico",
        operations: "Operações",
        technology: "Tecnologia",
        sales: "Vendas",
        hr: "Recursos Humanos"
      },
      shareResults: "Compartilhar resultados com o gestor",
      completeSetup: "Concluir Configuração"
    },
    pricing: {
      hero: {
        title: "Escolha o plano ideal para evoluir pessoas, equipes e resultados",
        subtitle: "Avaliações comportamentais, insights práticos e gestão inteligente — no seu ritmo.",
        cta: "Começar agora"
      },
      toggle: {
        monthly: "Mensal",
        annual: "Anual",
        save: "economize 5%"
      },
      plans: {
        free: {
          name: "Free",
          subtitle: "Ideal para experimentar",
          price: "R$ 0,00",
          period: "/mês",
          cta: "Testar grátis",
          features: [
            "7 dias de acesso",
            "1 usuário",
            "Cobrança simbólica: R$ 0,00",
            "Sem renovação automática"
          ]
        },
        unit: {
          name: "Unit",
          subtitle: "Para profissionais individuais",
          price: "R$ 29,90",
          annualPrice: "R$ 340,86",
          period: "/mês",
          cta: "Assinar agora",
          features: [
            "1 usuário",
            "Acesso completo",
            "Renovação mensal",
            "Enviar como presente"
          ]
        },
        clevel: {
          name: "C-Level",
          subtitle: "Para líderes e pequenas equipes",
          price: "R$ 97,90",
          annualPrice: "R$ 1.116,06",
          period: "/mês",
          cta: "Assinar para equipe",
          features: [
            "Até 5 usuários",
            "Gestão de equipe",
            "Relatórios consolidados",
            "Renovação mensal"
          ]
        }
      },
      affiliates: {
        title: "Programa de Afiliados",
        desc: "Indique e ganhe: A cada 5 indicações pagas, você ganha 1 mensalidade gratuita.",
        cta: "Saber mais"
      },
      coupons: {
        label: "Possui um cupom?",
        placeholder: "Digite seu código",
        apply: "Aplicar"
      },
      gift: {
        title: "Enviar como Presente",
        label: "E-mail do presenteado",
        send: "Enviar Convite"
      }
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