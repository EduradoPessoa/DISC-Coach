# Guia de Configuração Local com XAMPP

Este guia ajuda a configurar o ambiente de desenvolvimento para usar o Apache e MySQL do XAMPP.

## 1. Pré-requisitos
- XAMPP instalado em `C:\xampp` (caminho padrão).
- Node.js instalado.

## 2. Configuração Automática (Recomendada)
Execute o script `setup_xampp.bat` (clique duas vezes ou rode no terminal).
Ele criará um "atalho" (Link Simbólico) da pasta do projeto dentro do `htdocs` do XAMPP.

## 3. Configuração do Banco de Dados
1. Abra o **XAMPP Control Panel** e inicie **Apache** e **MySQL**.
2. Acesse [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Crie um novo banco de dados chamado `disc_db`.
4. Clique no banco criado e vá na aba **Importar**.
5. Selecione o arquivo `database.sql` que está na raiz do projeto (`C:\DEV\disc\database.sql`).

## 4. Rodando o Projeto
Abra o terminal na pasta do projeto e rode:

```bash
npm run dev
```

O Frontend abrirá em `http://localhost:5173`.
As requisições para `/api` serão redirecionadas automaticamente para `http://localhost/disc/api` (no XAMPP).

## Solução de Problemas

**Erro de Conexão com Banco:**
Verifique se o usuário do MySQL é `root` e a senha é vazia (padrão XAMPP).
Se for diferente, edite o arquivo `api/config/env.php`.

**Erro 404 na API:**
Verifique se a pasta `disc` existe dentro de `C:\xampp\htdocs`.
Verifique se você consegue acessar `http://localhost/disc/api/auth/login.php` diretamente no navegador.
