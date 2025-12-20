# Plano de Migração para Hostinger (React + PHP + MySQL)

Este documento detalha as mudanças necessárias para hospedar o aplicativo na Hostinger utilizando Backend PHP e Banco de Dados MySQL.

## 1. Estrutura do Projeto

A nova estrutura separa o Frontend (React) do Backend (PHP API).

```
/
├── dist/                   # Frontend compilado (Vite build)
├── api/                    # Backend PHP
│   ├── config/             # Configurações (Banco, CORS)
│   ├── auth/               # Endpoints de Autenticação
│   ├── controllers/        # Lógica de negócio
│   └── vendor/             # Dependências PHP (Composer)
├── database.sql            # Script de criação do Banco
├── composer.json           # Dependências PHP
└── package.json            # Dependências JS
```

## 2. Banco de Dados (MySQL)

Foi criado o arquivo `database.sql` com a estrutura das tabelas:
- `users`: Usuários e credenciais.
- `assessments`: Sessões de avaliação DISC.
- `assessment_answers`: Respostas detalhadas.
- `assessment_results`: Resultados processados e resumo da IA.
- `payments`: Histórico de pagamentos.

**Ação Necessária:**
1. Criar um banco de dados no painel da Hostinger.
2. Importar o arquivo `database.sql` via phpMyAdmin.
3. Atualizar as credenciais em `api/config/database.php`.

## 3. Backend (PHP)

Implementamos uma estrutura básica de API em `api/`.

**Dependências:**
- Execute `composer install` para instalar bibliotecas como `firebase/php-jwt` (necessário para autenticação segura).

**Arquivos Criados:**
- `api/config/database.php`: Conexão PDO com o banco.
- `api/config/cors.php`: Configuração para permitir requisições do Frontend.
- `api/auth/login.php`: Endpoint de login (Exemplo).

## 4. Frontend (React)

**Alterações Realizadas:**
- `vite.config.ts`: Adicionado proxy `/api` para desenvolvimento local.
- `services/api.ts`: Criado serviço genérico para consumir a API PHP.

**Próximos Passos no Frontend:**
1. Substituir chamadas mockadas em `Login.tsx` por `apiRequest('/auth/login.php', 'POST', data)`.
2. Criar endpoints PHP para salvar e recuperar avaliações (`save_assessment.php`, `get_results.php`).

## 5. Deploy na Hostinger

1. Execute `npm run build` localmente.
2. Faça upload do conteúdo da pasta `dist` para a pasta `public_html` na Hostinger.
3. Faça upload da pasta `api` para `public_html/api`.
4. Faça upload da pasta `vendor` (após rodar composer install) ou rode `composer install` via SSH na Hostinger.
5. Certifique-se que o arquivo `.htaccess` (se houver) permita acesso à pasta `/api`.

## Exemplo de .htaccess (para React Router)

Crie um arquivo `.htaccess` na raiz `public_html`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```
*Nota: Certifique-se que as regras não bloqueiem o acesso a `/api`.*
