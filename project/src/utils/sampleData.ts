// Sample data utility for LIMS system

import { Patient, Doctor, Test, Invoice, Report, StockItem, Expense, AuditLog, InvoiceTest } from '../types';

export const samplePatients: Omit<Patient, 'id' | 'createdAt' | 'visitCount' | 'totalBilled' | 'pendingDues'>[] = [
  {
    patientId: 'P001',
    name: 'Ahmed Khan',
    age: 35,
    gender: 'male',
    contact: '0300-1234567',
    email: 'ahmed.khan@email.com',
    address: 'House 123, Street 5, Gulberg III, Lahore',
    cnic: '35202-1234567-8',
    bloodGroup: 'B+',
    allergies: 'None',
    medicalHistory: 'Hypertension',
    referredBy: 'Dr. Sarah Ahmed',
    sampleType: 'Blood',
    createdBy: 'admin',
    collectionCenterId: 'CC001'
  },
  {
    patientId: 'P002',
    name: 'Fatima Ali',
    age: 28,
    gender: 'female',
    contact: '0300-2345678',
    email: 'fatima.ali@email.com',
    address: 'Apartment 45, Block 7, DHA Phase 6, Karachi',
    cnic: '42101-2345678-9',
    bloodGroup: 'O+',
    allergies: 'Penicillin',
    medicalHistory: 'Diabetes Type 2',
    referredBy: 'Dr. Muhammad Hassan',
    sampleType: 'Blood',
    createdBy: 'admin',
    collectionCenterId: 'CC002'
  },
  {
    patientId: 'P003',
    name: 'Usman Malik',
    age: 42,
    gender: 'male',
    contact: '0300-3456789',
    email: 'usman.malik@email.com',
    address: 'House 67, Street 12, F-8/1, Islamabad',
    cnic: '51101-3456789-0',
    bloodGroup: 'A+',
    allergies: 'None',
    medicalHistory: 'Heart disease',
    referredBy: 'Dr. Ayesha Khan',
    sampleType: 'Blood',
    createdBy: 'admin',
    collectionCenterId: 'CC003'
  }
];

export const sampleDoctors: Omit<Doctor, 'id' | 'createdAt' | 'totalReferrals' | 'totalRevenue'>[] = [
  {
    name: 'Dr. Sarah Ahmed',
    specialty: 'Cardiology',
    contact: '0300-1111111',
    email: 'sarah.ahmed@hospital.com',
    hospital: 'Shifa International Hospital',
    commissionPercent: 15,
    cnic: '35202-1111111-1',
    address: 'House 1, Street 1, F-8/1, Islamabad',
    isActive: true
  },
  {
    name: 'Dr. Muhammad Hassan',
    specialty: 'Endocrinology',
    contact: '0300-2222222',
    email: 'muhammad.hassan@hospital.com',
    hospital: 'Aga Khan University Hospital',
    commissionPercent: 12,
    cnic: '42101-2222222-2',
    address: 'Apartment 2, Block 2, DHA Phase 6, Karachi',
    isActive: true
  },
  {
    name: 'Dr. Ayesha Khan',
    specialty: 'Internal Medicine',
    contact: '0300-3333333',
    email: 'ayesha.khan@hospital.com',
    hospital: 'Services Hospital',
    commissionPercent: 10,
    cnic: '35202-3333333-3',
    address: 'House 3, Street 3, Gulberg III, Lahore',
    isActive: true
  }
];

export const sampleTests: Omit<Test, 'id' | 'createdAt'>[] = [
  {
    name: 'Complete Blood Count (CBC)',
    category: 'Hematology',
    price: 1500,
    sampleType: 'Blood',
    referenceRange: 'WBC: 4.5-11.0 x10^9/L, RBC: 4.5-5.9 x10^12/L, Hb: 13.5-17.5 g/dL',
    unit: 'Various',
    isActive: true,
    sampleRequired: '3ml EDTA Blood',
    deliveryTime: 'Same Day',
    parameterTemplates: [
      { name: 'White Blood Cells', normalRange: '4.5-11.0', unit: 'x10^9/L' },
      { name: 'Red Blood Cells', normalRange: '4.5-5.9', unit: 'x10^12/L' },
      { name: 'Hemoglobin', normalRange: '13.5-17.5', unit: 'g/dL' },
      { name: 'Platelets', normalRange: '150-450', unit: 'x10^9/L' }
    ]
  },
  {
    name: 'Blood Glucose (Fasting)',
    category: 'Biochemistry',
    price: 800,
    sampleType: 'Blood',
    referenceRange: '70-100 mg/dL',
    unit: 'mg/dL',
    isActive: true,
    sampleRequired: '2ml Serum',
    deliveryTime: 'Same Day'
  },
  {
    name: 'Lipid Profile',
    category: 'Biochemistry',
    price: 1200,
    sampleType: 'Blood',
    referenceRange: 'Cholesterol: <200 mg/dL, Triglycerides: <150 mg/dL',
    unit: 'mg/dL',
    isActive: true,
    sampleRequired: '3ml Serum',
    deliveryTime: 'Same Day',
    parameterTemplates: [
      { name: 'Total Cholesterol', normalRange: '<200', unit: 'mg/dL' },
      { name: 'HDL Cholesterol', normalRange: '>40', unit: 'mg/dL' },
      { name: 'LDL Cholesterol', normalRange: '<100', unit: 'mg/dL' },
      { name: 'Triglycerides', normalRange: '<150', unit: 'mg/dL' }
    ]
  },
  {
    name: 'Liver Function Tests (LFT)',
    category: 'Biochemistry',
    price: 1800,
    sampleType: 'Blood',
    referenceRange: 'ALT: 7-55 U/L, AST: 8-48 U/L, Bilirubin: 0.3-1.2 mg/dL',
    unit: 'Various',
    isActive: true,
    sampleRequired: '3ml Serum',
    deliveryTime: 'Same Day',
    parameterTemplates: [
      { name: 'ALT', normalRange: '7-55', unit: 'U/L' },
      { name: 'AST', normalRange: '8-48', unit: 'U/L' },
      { name: 'Total Bilirubin', normalRange: '0.3-1.2', unit: 'mg/dL' },
      { name: 'Alkaline Phosphatase', normalRange: '44-147', unit: 'U/L' }
    ]
  }
];

export const sampleStockItems: Omit<StockItem, 'id' | 'createdAt'>[] = [
  {
    name: 'EDTA Tubes (3ml)',
    category: 'Consumables',
    currentStock: 500,
    reorderLevel: 100,
    unit: 'pieces',
    costPerUnit: 25,
    vendor: 'MediSupply Co.',
    expiryDate: new Date('2025-12-31'),
    batchNumber: 'EDTA-2024-001',
    isActive: true
  },
  {
    name: 'Serum Separator Tubes',
    category: 'Consumables',
    currentStock: 300,
    reorderLevel: 50,
    unit: 'pieces',
    costPerUnit: 35,
    vendor: 'LabEquip Ltd.',
    expiryDate: new Date('2025-06-30'),
    batchNumber: 'SST-2024-002',
    isActive: true
  },
  {
    name: 'CBC Reagent Kit',
    category: 'Reagents',
    currentStock: 20,
    reorderLevel: 10,
    unit: 'kits',
    costPerUnit: 5000,
    vendor: 'Roche Diagnostics',
    expiryDate: new Date('2024-12-31'),
    batchNumber: 'CBC-2024-003',
    isActive: true
  },
  {
    name: 'Glucose Reagent',
    category: 'Reagents',
    currentStock: 15,
    reorderLevel: 5,
    unit: 'bottles',
    costPerUnit: 2500,
    vendor: 'Siemens Healthineers',
    expiryDate: new Date('2024-10-31'),
    batchNumber: 'GLU-2024-004',
    isActive: true
  }
];

export const sampleExpenses: Omit<Expense, 'id'>[] = [
  {
    category: 'Utilities',
    amount: 15000,
    description: 'Monthly electricity bill',
    paymentMethod: 'Bank Transfer',
    date: new Date('2024-08-01'),
    createdBy: 'admin',
    isRecurring: true,
    tags: ['utilities', 'monthly']
  },
  {
    category: 'Equipment',
    amount: 500000,
    description: 'New centrifuge machine',
    paymentMethod: 'Bank Transfer',
    date: new Date('2024-07-15'),
    createdBy: 'admin',
    isRecurring: false,
    tags: ['equipment', 'capital']
  },
  {
    category: 'Supplies',
    amount: 25000,
    description: 'Monthly laboratory supplies',
    paymentMethod: 'Cash',
    date: new Date('2024-08-05'),
    createdBy: 'admin',
    isRecurring: true,
    tags: ['supplies', 'monthly']
  }
];

// Function to generate sample invoices based on patients and tests
export const generateSampleInvoices = (
  patients: Patient[],
  tests: Test[],
  doctors: Doctor[]
): Omit<Invoice, 'id' | 'createdAt'>[] => {
  if (patients.length === 0 || tests.length === 0 || doctors.length === 0) {
    return [];
  }

  const invoices: Omit<Invoice, 'id' | 'createdAt'>[] = [];
  const now = new Date();

  // Generate invoices for the last 30 days
  for (let i = 0; i < 20; i++) {
    const patient = patients[Math.floor(Math.random() * patients.length)];
    const doctor = doctors[Math.floor(Math.random() * doctors.length)];
    const selectedTests = tests.slice(0, Math.floor(Math.random() * 3) + 1); // 1-3 tests

    const invoiceTests: InvoiceTest[] = selectedTests.map(test => ({
      testId: test.id,
      testName: test.name,
      price: test.price,
      quantity: 1
    }));

    const totalAmount = invoiceTests.reduce((sum, test) => sum + test.price, 0);
    const discount = Math.random() > 0.8 ? totalAmount * 0.1 : 0; // 10% discount for 20% of invoices
    const finalAmount = totalAmount - discount;

    const invoiceDate = new Date(now.getTime() - Math.random() * 30 * 24 * 60 * 60 * 1000);

    invoices.push({
      invoiceNumber: `INV${String(i + 1).padStart(4, '0')}`,
      patientId: patient.id,
      doctorId: doctor.id,
      tests: invoiceTests,
      totalAmount,
      discount,
      finalAmount,
      status: Math.random() > 0.3 ? 'paid' : 'due',
      amountPaid: Math.random() > 0.3 ? finalAmount : 0,
      dueDate: new Date(invoiceDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from invoice date
      paymentHistory: Math.random() > 0.3 ? [{
        amount: finalAmount,
        date: invoiceDate,
        method: 'Cash',
        receivedBy: 'admin'
      }] : [],
      createdBy: 'admin',
      notes: Math.random() > 0.7 ? 'Urgent test required' : '',
      paymentMethod: Math.random() > 0.3 ? 'Cash' : 'Pending',
      isLocked: false,
      sampleType: 'Blood',
      cnic: patient.cnic,
      collectionCenterId: patient.collectionCenterId
    });
  }

  return invoices;
};

// Function to generate sample reports based on invoices
export const generateSampleReports = (
  invoices: Invoice[],
  tests: Test[]
): Omit<Report, 'id' | 'createdAt' | 'statusHistory' | 'comments' | 'attachments'>[] => {
  if (invoices.length === 0) {
    return [];
  }

  const reports: Omit<Report, 'id' | 'createdAt' | 'statusHistory' | 'comments' | 'attachments'>[] = [];
  const now = new Date();

  invoices.forEach((invoice, index) => {
    const reportTests = invoice.tests.map(test => {
      const testInfo = tests.find(t => t.id === test.testId);
      const isAbnormal = Math.random() > 0.8; // 20% chance of abnormal result
      
      return {
        testId: test.testId,
        testName: test.testName,
        result: isAbnormal ? 'Abnormal' : 'Normal',
        normalRange: testInfo?.referenceRange || 'N/A',
        isAbnormal,
        unit: testInfo?.unit || '',
        isCritical: isAbnormal && Math.random() > 0.7, // 30% of abnormal results are critical
        abnormalParams: isAbnormal ? ['Result outside normal range'] : [],
        criticalParams: isAbnormal && Math.random() > 0.7 ? ['Critical value detected'] : [],
        criticalComment: isAbnormal && Math.random() > 0.7 ? 'Please contact physician immediately' : ''
      };
    });

    const reportDate = new Date(invoice.createdAt.getTime() + Math.random() * 24 * 60 * 60 * 1000); // Within 24 hours of invoice

    reports.push({
      invoiceId: invoice.id,
      patientId: invoice.patientId,
      doctorId: invoice.doctorId,
      tests: reportTests,
      status: Math.random() > 0.2 ? 'completed' : 'pending',
      createdBy: 'admin',
      verifiedBy: Math.random() > 0.3 ? 'admin' : undefined,
      verifiedAt: Math.random() > 0.3 ? reportDate : undefined,
      templateId: undefined,
      interpretation: Math.random() > 0.5 ? 'Results are within normal limits' : '',
      criticalValues: reportTests.some(test => test.isCritical),
      collectionCenterId: invoice.collectionCenterId
    });
  });

  return reports;
};

// Function to generate sample audit logs
export const generateSampleAuditLogs = (): Omit<AuditLog, 'id' | 'timestamp'>[] => {
  const actions = ['CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LOGIN', 'LOGOUT'];
  const modules = ['PATIENTS', 'INVOICES', 'REPORTS', 'TESTS', 'STOCK', 'USERS'];
  const users = ['admin', 'receptionist', 'technician'];
  
  const logs: Omit<AuditLog, 'id' | 'timestamp'>[] = [];
  const now = new Date();

  // Generate logs for the last 7 days
  for (let i = 0; i < 50; i++) {
    const logDate = new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000);
    
    logs.push({
      userId: users[Math.floor(Math.random() * users.length)],
      action: actions[Math.floor(Math.random() * actions.length)],
      module: modules[Math.floor(Math.random() * modules.length)],
      details: `Sample audit log entry ${i + 1}`,
      ipAddress: `192.168.1.${Math.floor(Math.random() * 255)}`,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    });
  }

  return logs;
};

// Function to initialize sample data
export const initializeSampleData = () => {
  const hasSampleData = localStorage.getItem('lab_sample_data_initialized');
  
  if (hasSampleData) {
    return; // Already initialized
  }

  // Store sample data in localStorage
  localStorage.setItem('lab_patients', JSON.stringify(samplePatients.map((patient, index) => ({
    ...patient,
    id: `P${String(index + 1).padStart(4, '0')}`,
    createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    visitCount: Math.floor(Math.random() * 5) + 1,
    totalBilled: Math.floor(Math.random() * 10000) + 1000,
    pendingDues: Math.random() > 0.7 ? Math.floor(Math.random() * 2000) : 0
  }))));

  localStorage.setItem('lab_doctors', JSON.stringify(sampleDoctors.map((doctor, index) => ({
    ...doctor,
    id: `D${String(index + 1).padStart(4, '0')}`,
    createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000),
    totalReferrals: Math.floor(Math.random() * 100) + 10,
    totalRevenue: Math.floor(Math.random() * 500000) + 50000
  }))));

  localStorage.setItem('lab_tests', JSON.stringify(sampleTests.map((test, index) => ({
    ...test,
    id: `T${String(index + 1).padStart(4, '0')}`,
    createdAt: new Date(Date.now() - Math.random() * 180 * 24 * 60 * 60 * 1000)
  }))));

  localStorage.setItem('lab_stock', JSON.stringify(sampleStockItems.map((item, index) => ({
    ...item,
    id: `S${String(index + 1).padStart(4, '0')}`,
    createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
  }))));

  localStorage.setItem('lab_expenses', JSON.stringify(sampleExpenses.map((expense, index) => ({
    ...expense,
    id: `E${String(index + 1).padStart(4, '0')}`
  }))));

  localStorage.setItem('lab_sample_data_initialized', 'true');
}; 