
CREATE TABLE IF NOT EXISTS settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    setting_key VARCHAR(50) NOT NULL UNIQUE,
    setting_value TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT IGNORE INTO settings (setting_key, setting_value) VALUES 
('abacatepay_api_key', ''),
('unit_plan_price', '29.90'),
('clevel_plan_price', '97.90'),
('annual_discount', '5');
