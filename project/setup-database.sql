-- LIMS Database Setup Script
-- Run this script to create the database and user

-- Create database (run as superuser)
CREATE DATABASE lims_db;

-- Create user (optional - for production)
-- CREATE USER lims_user WITH PASSWORD 'your_secure_password';

-- Grant privileges (if using separate user)
-- GRANT ALL PRIVILEGES ON DATABASE lims_db TO lims_user;

-- Connect to the database
\c lims_db;

-- Run the schema
\i backend/database/schema.sql

-- Run the seed data (optional)
\i backend/database/seed.sql

-- Verify tables were created
\dt

-- Check sample data
SELECT COUNT(*) as users_count FROM users;
SELECT COUNT(*) as patients_count FROM patients;
SELECT COUNT(*) as doctors_count FROM doctors;
SELECT COUNT(*) as tests_count FROM tests;

-- Success message
SELECT 'LIMS Database setup completed successfully!' as status; 