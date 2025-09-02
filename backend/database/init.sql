-- Create database (run this manually in PostgreSQL)
-- CREATE DATABASE student_management;

-- Connect to student_management database and run the following:

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    date_of_birth DATE,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create an index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);

-- Insert some sample data
INSERT INTO students (first_name, last_name, email, phone, date_of_birth, address) VALUES
('John', 'Doe', 'john.doe@example.com', '1234567890', '2000-01-15', '123 Main St, City, State'),
('Jane', 'Smith', 'jane.smith@example.com', '1234567891', '1999-05-20', '456 Oak Ave, City, State'),
('Mike', 'Johnson', 'mike.johnson@example.com', '1234567892', '2001-03-10', '789 Pine Rd, City, State')
ON CONFLICT (email) DO NOTHING;
