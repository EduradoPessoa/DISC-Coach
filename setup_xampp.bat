@echo off
echo ==========================================
echo Configurando Ambiente de Teste no XAMPP
echo ==========================================

set XAMPP_DIR=C:\xampp\htdocs
set PROJECT_NAME=disc

if not exist "%XAMPP_DIR%" (
    echo [ERRO] Pasta htdocs nao encontrada em %XAMPP_DIR%
    echo Verifique se o XAMPP esta instalado no caminho padrao.
    pause
    exit /b
)

echo Criando Link Simbolico para a API...
if exist "%XAMPP_DIR%\%PROJECT_NAME%" (
    echo [AVISO] A pasta %XAMPP_DIR%\%PROJECT_NAME% ja existe.
    echo Pule esta etapa se ja for o link correto.
) else (
    mklink /J "%XAMPP_DIR%\%PROJECT_NAME%" "%CD%"
    echo Link criado com sucesso!
)

echo.
echo ==========================================
echo Instrucoes Finais:
echo 1. Inicie o Apache e MySQL no XAMPP Control Panel.
echo 2. Abra o navegador em http://localhost/phpmyadmin
echo 3. Crie um banco de dados chamado 'disc_db'
echo 4. Importe o arquivo database.sql localizado na raiz deste projeto.
echo.
echo A API estara disponivel em: http://localhost/%PROJECT_NAME%/api
echo O Frontend (Vite) usara o proxy para este endereco.
echo ==========================================
pause
