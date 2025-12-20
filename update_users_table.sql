
-- Update users table to add subscription_status if it doesn't exist
-- Run this in your database manager (phpMyAdmin, etc)

ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'active';

-- Optional: Update existing users to have 'active' status if NULL
UPDATE users SET subscription_status = 'active' WHERE subscription_status IS NULL;
