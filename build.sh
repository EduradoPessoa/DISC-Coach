#!/bin/bash

# Script de build para Vercel
echo "🔧 Iniciando build do DISC Coach..."

# Instala dependências
echo "📦 Instalando dependências..."
npm install

# Build da aplicação
echo "🏗️  Construindo aplicação..."
npm run build

# Verifica se o build foi bem-sucedido
if [ $? -eq 0 ]; then
  echo "✅ Build concluído com sucesso!"
else
  echo "❌ Erro no build"
  exit 1
fi