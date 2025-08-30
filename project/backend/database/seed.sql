-- Seed data for LIMS system

-- Insert default admin user
INSERT INTO users (username, email, password_hash, role) VALUES 
('admin', 'admin@rifah.com', '$2a$10$rQZ8K9LmN2PqR3S4T5U6V7W8X9Y0Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P', 'admin');

-- Insert sample doctors
INSERT INTO doctors (name, specialty, contact, email, hospital) VALUES 
('Dr. Ahmed Khan', 'Cardiology', '+92-300-1234567', 'ahmed.khan@hospital.com', 'City General Hospital'),
('Dr. Fatima Ali', 'Dermatology', '+92-300-2345678', 'fatima.ali@hospital.com', 'Medical Center'),
('Dr. Muhammad Hassan', 'Orthopedics', '+92-300-3456789', 'muhammad.hassan@hospital.com', 'Orthopedic Institute');

-- Insert sample tests
INSERT INTO tests (name, category, price, sample_type, turnaround_time) VALUES 
('Complete Blood Count', 'Hematology', 1500.00, 'Blood', '24 hours'),
('Blood Glucose', 'Biochemistry', 800.00, 'Blood', '4 hours'),
('Urine Analysis', 'Urinalysis', 600.00, 'Urine', '2 hours'),
('X-Ray Chest', 'Radiology', 2500.00, 'N/A', '1 hour'),
('ECG', 'Cardiology', 1200.00, 'N/A', '30 minutes');

-- Insert sample patients
INSERT INTO patients (patient_id, name, age, gender, contact, email, address) VALUES 
('P001', 'Ali Ahmed', 35, 'Male', '+92-300-1111111', 'ali.ahmed@email.com', '123 Main St, Karachi'),
('P002', 'Aisha Khan', 28, 'Female', '+92-300-2222222', 'aisha.khan@email.com', '456 Park Ave, Lahore'),
('P003', 'Omar Hassan', 42, 'Male', '+92-300-3333333', 'omar.hassan@email.com', '789 Oak Rd, Islamabad');

-- Insert sample stock items
INSERT INTO stock (item_name, category, quantity, unit, unit_price, supplier) VALUES 
('Syringes 5ml', 'Disposables', 500, 'pieces', 15.00, 'Medical Supplies Co'),
('Test Tubes', 'Labware', 1000, 'pieces', 8.00, 'Lab Equipment Ltd'),
('Gloves L', 'PPE', 200, 'pairs', 25.00, 'Safety Gear Inc'),
('Antibiotics', 'Medications', 50, 'boxes', 1200.00, 'Pharma Corp'); 