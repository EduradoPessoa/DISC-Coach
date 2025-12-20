<div align="center">

# 🚀 DISC Coach Platform
### Descubra seu Potencial com Inteligência Comportamental e AI

![Badge em Desenvolvimento](https://img.shields.io/badge/Status-Em%20Desenvolvimento-green?style=for-the-badge&logo=appveyor)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-8E75B2?style=for-the-badge&logo=googlebard&logoColor=white)

<br />

**Uma plataforma SaaS completa para análise comportamental DISC, turbinada por Inteligência Artificial para gerar planos de desenvolvimento personalizados.**

[Começar Agora](#-como-rodar-localmente) • [Funcionalidades](#-funcionalidades) • [Deploy](#-deploy)

</div>

---

## 💡 Sobre o Projeto

O **DISC Coach** não é apenas mais um teste de personalidade. É uma ferramenta poderosa que combina a metodologia clássica DISC com o poder da **Google Gemini AI** para oferecer insights profundos e acionáveis.

Seja para RHs, coaches ou autoconhecimento, o sistema entrega:
- 📊 **Gráficos Precisos:** Visualização clara dos perfis Dominante, Influente, Estável e Conforme.
- 🤖 **AI Coach:** Um assistente virtual que interpreta os resultados e sugere planos de ação.
- 💼 **Gestão Corporativa:** Painel administrativo para empresas gerenciarem seus colaboradores.
- 💰 **SaaS Ready:** Integração com AbacatePay para planos e assinaturas.

## ✨ Funcionalidades

- **Teste DISC Interativo:** Interface moderna e responsiva para realização do assessment.
- **Relatórios Detalhados:** Geração automática de relatórios em PDF.
- **Dashboard Executivo:** Visão geral de métricas e status dos usuários.
- **Autenticação Segura:** Sistema de login robusto com JWT e Refresh Tokens.
- **Gamificação (Onboarding):** Fluxo de entrada engajador para novos usuários.
- **Multi-Tenant:** Estrutura preparada para atender múltiplas empresas/clientes.

## 🛠️ Tech Stack

O projeto foi construído utilizando as melhores práticas do mercado:

### Frontend
- **React 18** + **Vite**: Performance extrema.
- **TypeScript**: Segurança e tipagem estática.
- **Tailwind CSS**: Design system moderno e customizável.
- **Framer Motion**: Animações fluidas.

### Backend
- **PHP 8+ (Vanilla API):** Leve, rápido e fácil de hospedar em qualquer lugar (ex: Hostinger).
- **MySQL:** Banco de dados relacional sólido.
- **JWT:** Autenticação stateless segura.

## 🚀 Como Rodar Localmente

Siga os passos abaixo para levantar o ambiente de desenvolvimento:

### Pré-requisitos
- Node.js (v18+)
- Servidor PHP (XAMPP, Laragon ou Docker)
- MySQL

### 1. Clone o Repositório
```bash
git clone https://github.com/EduradoPessoa/DISC-Coach.git
cd DISC-Coach
```

### 2. Configure o Backend (API)
1. Crie um banco de dados MySQL chamado `disc_db`.
2. Importe o arquivo `database.sql` (na raiz do projeto).
3. Configure o arquivo `api/config/env.php`:
   - Se estiver local (XAMPP), as credenciais padrão já devem funcionar.

### 3. Configure o Frontend
1. Instale as dependências:
```bash
npm install
```
2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

Acesse `http://localhost:5173` e aproveite! 🎉

## 🚢 Deploy (CI/CD)

O projeto conta com um pipeline automatizado via **GitHub Actions** para deploy na Hostinger.

- **Push na main:** O GitHub Actions automaticamente:
  1. Instala dependências.
  2. Gera o build de produção (`npm run build`).
  3. Envia os arquivos estáticos e a API via FTP para o servidor.

*Configuração manual (caso necessário):* Basta copiar a pasta `dist` para o `public_html` e a pasta `api` para `public_html/api`.

## 🤝 Contribuição

Curtiu o projeto? Sinta-se à vontade para contribuir!
1. Faça um Fork.
2. Crie uma Branch (`git checkout -b feature/NovaFeature`).
3. Commit suas mudanças (`git commit -m 'Add: Nova Feature incrível'`).
4. Push para a Branch (`git push origin feature/NovaFeature`).
5. Abra um Pull Request.

---

<div align="center">
Desenvolvido com 💙 por Eduardo Pessoa
</div>
