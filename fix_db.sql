-- Garante que o usuário ID 1 existe para os testes
INSERT IGNORE INTO users (id, name, email, password_hash, role, plan) 
VALUES (1, 'Eduardo Pessoa', 'eduardo@phoenyx.com.br', '$2y$10$ExemploHash', 'admin', 'pro');
