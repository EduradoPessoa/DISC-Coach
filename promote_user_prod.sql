-- Atualiza o usuário Eduardo para SaaS Admin e Plano C-Level
UPDATE users 
SET role = 'saas_admin', plan = 'clevel' 
WHERE email = 'eduardo@phoenyx.com.br';
