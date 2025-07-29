import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Patient, Doctor, Test, Invoice, Report, StockItem, Expense, AuditLog, Dashboard, PaymentRecord, ReportComment, Notification, RateList } from '../types';
import Papa from 'papaparse';
import testListCsv from '../../testlist.csv?raw';
import consultantsCsv from '../../consultants_camelot_all.csv?raw';

interface DataContextType {
  // Patients
  patients: Patient[];
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'visitCount' | 'totalBilled' | 'pendingDues'>) => void;
  updatePatient: (id: string, patient: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  
  // Doctors
  doctors: Doctor[];
  addDoctor: (doctor: Omit<Doctor, 'id' | 'createdAt' | 'totalReferrals' | 'totalRevenue'>) => void;
  updateDoctor: (id: string, doctor: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
  
  // Tests
  tests: Test[];
  addTest: (test: Omit<Test, 'id' | 'createdAt'>) => void;
  updateTest: (id: string, test: Partial<Test>) => void;
  deleteTest: (id: string) => void;
  
  // Invoices
  invoices: Invoice[];
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  recordPayment: (invoiceId: string, payment: PaymentRecord) => void;
  
  // Reports
  reports: Report[];
  addReport: (report: Omit<Report, 'id' | 'createdAt' | 'statusHistory' | 'comments' | 'attachments'>) => void;
  updateReport: (id: string, report: Partial<Report> & { status?: Report['status'], userId?: string }) => void;
  addReportComment: (reportId: string, comment: ReportComment) => void;
  addReportAttachment: (reportId: string, fileId: string) => void;
  
  // Stock
  stock: StockItem[];
  addStockItem: (item: Omit<StockItem, 'id' | 'createdAt'>) => void;
  updateStockItem: (id: string, item: Partial<StockItem>) => void;
  
  // Expenses
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  
  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (log: Omit<AuditLog, 'id' | 'timestamp'>) => void;
  
  // Dashboard
  dashboard: Dashboard;
  refreshDashboard: () => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (id: string) => void;

  // Rate Lists
  rateLists: RateList[];
  addRateList: (rateList: Omit<RateList, 'id' | 'createdAt'>) => void;
  updateRateList: (id: string, rateList: Partial<RateList>) => void;
  deleteRateList: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

interface DataProviderProps {
  children: ReactNode;
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [patients, setPatients] = useState<Patient[]>(() => {
    const stored = localStorage.getItem('lab_patients');
    if (stored) return JSON.parse(stored);
    // Add a dummy patient if no patients exist
    const dummyPatient = {
      id: 'P0001',
      patientId: 'P0001',
      phcrNumber: 'PHCR# R-34889',
      mrNumber: 'MR-0001',
      name: 'Demo Patient',
      age: 35,
      gender: 'male',
      contact: '0300-0000000',
      email: 'demo@rifahlabs.com',
      address: '123 Demo Street, City',
      cnic: '35202-1234567-1',
      bloodGroup: 'A+',
      allergies: 'None',
      medicalHistory: 'Healthy',
      referredBy: 'Dr. Demo',
      sampleType: 'Blood',
      createdAt: new Date(),
      createdBy: 'system',
      visitCount: 1,
      totalBilled: 0,
      pendingDues: 0
    };
    localStorage.setItem('lab_patients', JSON.stringify([dummyPatient]));
    return [dummyPatient];
  });
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const stored = localStorage.getItem('lab_doctors');
    if (stored) return JSON.parse(stored);
    // Import from consultants_camelot_all.csv if present
    if (consultantsCsv) {
      const results = Papa.parse(consultantsCsv, { header: true, skipEmptyLines: true });
      const csvDoctors = (results.data as any[]).map((row, idx) => ({
        id: `D${(idx + 1).toString().padStart(4, '0')}`,
        name: row['Consultant Name']?.trim() || '',
        contact: row['Contact No']?.trim() || '',
        hospital: row['Hospital']?.trim() || '',
        specialty: row['Hospital']?.trim() || '',
        email: '',
        commissionPercent: 0,
        cnic: '',
        address: row['Hospital']?.trim() || '',
        isActive: true,
        createdAt: new Date(),
        totalReferrals: 0,
        totalRevenue: 0,
        username: row['Username']?.trim() || '',
        password: row['Password']?.trim() || '',
      })).filter(d => d.name);
      localStorage.setItem('lab_doctors', JSON.stringify(csvDoctors));
      return csvDoctors;
    }
    return [];
  });
  const [tests, setTests] = useState<Test[]>(() => {
    const stored = localStorage.getItem('lab_tests');
    if (stored) return JSON.parse(stored);
    // If no tests in localStorage, parse from CSV
    const results = Papa.parse(testListCsv, { header: true, skipEmptyLines: true });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const csvTests = (results.data as any[]).map((row, idx) => ({
      id: `T${(idx + 1).toString().padStart(4, '0')}`,
      name: row['Test Name']?.trim() || '',
      price: parseInt((row['Rates'] || '0').replace(/[^\d]/g, '')),
      sampleRequired: row['Sample Required']?.trim() || '',
      deliveryTime: row['Delivery Time']?.trim() || '',
      createdAt: new Date(),
      isActive: true
    })).filter(t => t.name && t.price);
    localStorage.setItem('lab_tests', JSON.stringify(csvTests));
    return csvTests;
  });
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const stored = localStorage.getItem('lab_invoices');
    if (stored) return JSON.parse(stored);
    // Add a demo invoice for the dummy patient with CBC and Biopsy tests
    const demoInvoice = {
      id: 'INV0001',
      invoiceNumber: 'INV0001',
      patientId: 'P0001',
      phcrNumber: 'PHCR# R-34889',
      mrNumber: 'MR-0001',
      doctorId: '',
      tests: [
        { testId: 'T0001', testName: 'Complete Blood Count (CBC)', price: 500, quantity: 1 },
        { testId: 'T0002', testName: 'Biopsy For H/P(Large Specimen)', price: 4500, quantity: 1 }
      ],
      totalAmount: 5000,
      discount: 0,
      finalAmount: 5000,
      status: 'due',
      amountPaid: 0,
      dueDate: new Date(),
      paymentHistory: [],
      createdAt: new Date(),
      createdBy: 'system',
      isLocked: false,
      sampleType: 'Blood',
      cnic: '35202-1234567-1'
    };
    localStorage.setItem('lab_invoices', JSON.stringify([demoInvoice]));
    return [demoInvoice];
  });
  const [reports, setReports] = useState<Report[]>(() => {
    const stored = localStorage.getItem('lab_reports');
    if (stored) return JSON.parse(stored);
    // Add a dummy report for the dummy patient and demo invoice
    const dummyReport = {
      id: 'R0001',
      invoiceId: 'INV0001',
      patientId: 'P0001',
      doctorId: '',
      tests: [
        { testId: 'T0001', testName: 'Complete Blood Count (CBC)', result: '', normalRange: '', isAbnormal: false, unit: '' },
        { testId: 'T0002', testName: 'Biopsy For H/P(Large Specimen)', result: '', normalRange: '', isAbnormal: false, unit: '' }
      ],
      status: 'pending',
      statusHistory: [{ status: 'pending', changedBy: 'system', changedAt: new Date() }],
      comments: [],
      attachments: [],
      createdAt: new Date(),
      createdBy: 'system',
      interpretation: '',
      criticalValues: false
    };
    localStorage.setItem('lab_reports', JSON.stringify([dummyReport]));
    return [dummyReport];
  });
  const [stock, setStock] = useState<StockItem[]>(() => {
    const stored = localStorage.getItem('lab_stock');
    return stored ? JSON.parse(stored) : [];
  });
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard>({
    totalPatients: 0,
    todayPatients: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    pendingReports: 0,
    lowStockItems: 0,
    recentActivities: []
  });

  // --- Rate List Management ---
  const [rateLists, setRateLists] = useState<RateList[]>(() => {
    const stored = localStorage.getItem('lab_rateLists');
    return stored ? JSON.parse(stored) : [];
  });

  const addRateList = (rateList: Omit<RateList, 'id' | 'createdAt'>) => {
    const newRateList: RateList = {
      ...rateList,
      id: generateId(),
      createdAt: new Date(),
      isActive: true
    };
    setRateLists(prev => {
      const updated = [...prev, newRateList];
      localStorage.setItem('lab_rateLists', JSON.stringify(updated));
      // Immediately export all tests to the new rate list
      setTimeout(exportTestsToRateList, 0);
      return updated;
    });
    addAuditLog({
      userId: 'System',
      action: 'CREATE',
      module: 'RATELISTS',
      details: `Created rate list: ${rateList.name}`
    });
    addNotification({
      type: 'info',
      category: 'system',
      title: 'New Rate List',
      message: `Rate list ${rateList.name} was added.`,
      isRead: false,
      priority: 'medium'
    });
  };

  const updateRateList = (id: string, rateList: Partial<RateList>) => {
    setRateLists(prev => {
      const updated = prev.map(rl => rl.id === id ? { ...rl, ...rateList } : rl);
      localStorage.setItem('lab_rateLists', JSON.stringify(updated));
      return updated;
    });
    addAuditLog({
      userId: 'System',
      action: 'UPDATE',
      module: 'RATELISTS',
      details: `Updated rate list: ${id}`
    });
    addNotification({
      type: 'info',
      category: 'system',
      title: 'Rate List Updated',
      message: `Rate list was updated.`,
      isRead: false,
      priority: 'medium'
    });
  };

  const deleteRateList = (id: string) => {
    setRateLists(prev => {
      const updated = prev.filter(rl => rl.id !== id);
      localStorage.setItem('lab_rateLists', JSON.stringify(updated));
      return updated;
    });
    addAuditLog({
      userId: 'System',
      action: 'DELETE',
      module: 'RATELISTS',
      details: `Deleted rate list: ${id}`
    });
    addNotification({
      type: 'warning',
      category: 'system',
      title: 'Rate List Deleted',
      message: `A rate list was deleted.`,
      isRead: false,
      priority: 'medium'
    });
  };

  const generateId = () => Math.random().toString(36).substr(2, 9);

  function getFieldDiff<T = unknown>(before: T, after: Partial<T>): string {
    const changes: string[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const b: any = before;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const a: any = after;
    for (const key in a) {
      if (Object.prototype.hasOwnProperty.call(b, key) && b[key] !== a[key]) {
        changes.push(`${key}: '${b[key]}' → '${a[key]}'`);
      }
    }
    return changes.join(', ');
  }

  // Patient methods
  const addPatient = (patient: Omit<Patient, 'id' | 'createdAt' | 'visitCount' | 'totalBilled' | 'pendingDues'>) => {
    const newPatient: Patient = {
      ...patient,
      id: generateId(),
      createdAt: new Date(),
      visitCount: 0,
      totalBilled: 0,
      pendingDues: 0
    };
    setPatients((prev: Patient[]) => [...prev, newPatient]);
    addAuditLog({
      userId: patient.createdBy,
      action: 'CREATE',
      module: 'PATIENTS',
      details: `Created patient: ${patient.name}`
    });
    addNotification({
      type: 'success',
      category: 'system',
      title: 'New Patient Added',
      message: `Patient ${patient.name} was added.`,
      isRead: false,
      priority: 'medium'
    });
    // Automatically create a placeholder report for the new patient
    addReport({
      invoiceId: '',
      patientId: newPatient.id,
      doctorId: '',
      tests: [],
      status: 'pending',
      createdBy: patient.createdBy,
      interpretation: '',
      criticalValues: false
    });
  };

  const updatePatient = (id: string, patient: Partial<Patient>) => {
    setPatients((prev: Patient[]) => prev.map((p: Patient) => {
      if (p.id === id) {
        const diff = getFieldDiff(p, patient);
        addAuditLog({
          userId: 'System',
          action: 'UPDATE',
          module: 'PATIENTS',
          details: `Updated patient with ID: ${id}. Changes: ${diff}`
        });
        addNotification({
          type: diff.includes('contact') || diff.includes('address') ? 'warning' : 'info',
          category: 'system',
          title: 'Patient Updated',
          message: `Patient ${p.name} updated. ${diff}`,
          isRead: false,
          priority: 'medium'
        });
        return { ...p, ...patient };
      }
      return p;
    }));
  };

  const deletePatient = (id: string) => {
    setPatients((prev: Patient[]) => prev.filter((p: Patient) => p.id !== id));
    addAuditLog({
      userId: 'System',
      action: 'DELETE',
      module: 'PATIENTS',
      details: `Deleted patient with ID: ${id}`
    });
  };

  // Doctor methods
  const addDoctor = (doctor: Omit<Doctor, 'id' | 'createdAt' | 'totalReferrals' | 'totalRevenue'>) => {
    const newDoctor: Doctor = {
      ...doctor,
      id: generateId(),
      createdAt: new Date(),
      totalReferrals: 0,
      totalRevenue: 0
    };
    setDoctors((prev: Doctor[]) => [...prev, newDoctor]);
    addAuditLog({
      userId: doctor.createdBy,
      action: 'CREATE',
      module: 'DOCTORS',
      details: `Created doctor: ${doctor.name}`
    });
    addNotification({
      type: 'info',
      category: 'system',
      title: 'New Doctor Added',
      message: `Doctor ${doctor.name} was added.`,
      isRead: false,
      priority: 'medium'
    });
  };

  const updateDoctor = (id: string, doctor: Partial<Doctor>) => {
    setDoctors((prev: Doctor[]) => prev.map((d: Doctor) => {
      if (d.id === id) {
        const diff = getFieldDiff(d, doctor);
        addAuditLog({
          userId: 'System',
          action: 'UPDATE',
          module: 'DOCTORS',
          details: `Updated doctor with ID: ${id}. Changes: ${diff}`
        });
        addNotification({
          type: diff.includes('commissionPercent') ? 'warning' : 'info',
          category: 'system',
          title: 'Doctor Updated',
          message: `Doctor ${d.name} updated. ${diff}`,
          isRead: false,
          priority: 'medium'
        });
        return { ...d, ...doctor };
      }
      return d;
    }));
  };

  const deleteDoctor = (id: string) => {
    setDoctors((prev: Doctor[]) => prev.filter((d: Doctor) => d.id !== id));
    addAuditLog({
      userId: 'System',
      action: 'DELETE',
      module: 'DOCTORS',
      details: `Deleted doctor with ID: ${id}`
    });
  };

  // Test methods
  const addTest = (test: Omit<Test, 'id' | 'createdAt'>) => {
    const newTest: Test = {
      ...test,
      id: generateId(),
      createdAt: new Date()
    };
    setTests((prev: Test[]) => [...prev, newTest]);
    addAuditLog({
      userId: 'System',
      action: 'CREATE',
      module: 'TESTS',
      details: `Created test: ${test.name}`
    });
    addNotification({
      type: 'info',
      category: 'system',
      title: 'New Test Added',
      message: `Test ${test.name} was added.`,
      isRead: false,
      priority: 'medium'
    });
  };

  const updateTest = (id: string, test: Partial<Test>) => {
    setTests((prev: Test[]) => prev.map((t: Test) => {
      if (t.id === id) {
        const diff = getFieldDiff(t, test);
        addAuditLog({
          userId: 'System',
          action: 'UPDATE',
          module: 'TESTS',
          details: `Updated test with ID: ${id}. Changes: ${diff}`
        });
        addNotification({
          type: diff.includes('price') ? 'warning' : 'info',
          category: 'system',
          title: 'Test Updated',
          message: `Test ${t.name} updated. ${diff}`,
          isRead: false,
          priority: 'medium'
        });
        return { ...t, ...test };
      }
      return t;
    }));
  };

  const deleteTest = (id: string) => {
    setTests((prev: Test[]) => prev.filter((t: Test) => t.id !== id));
    addAuditLog({
      userId: 'System',
      action: 'DELETE',
      module: 'TESTS',
      details: `Deleted test with ID: ${id}`
    });
  };

  // Invoice methods
  const addInvoice = (invoice: Omit<Invoice, 'id' | 'createdAt'>) => {
    const newInvoice: Invoice = {
      ...invoice,
      id: generateId(),
      createdAt: new Date(),
      amountPaid: invoice.amountPaid ?? 0,
      dueDate: invoice.dueDate ?? new Date(),
      paymentHistory: invoice.paymentHistory ?? [],
      status: invoice.status ?? 'due',
    };
    const newReport: Report = {
      id: generateId(),
      invoiceId: newInvoice.id,
      patientId: newInvoice.patientId,
      doctorId: newInvoice.doctorId,
      tests: newInvoice.tests.map(t => ({
        testId: t.testId,
        testName: t.testName,
        result: '',
        normalRange: '',
        isAbnormal: false,
        unit: ''
      })),
      status: 'pending',
      statusHistory: [
        { status: 'pending', changedBy: newInvoice.createdBy, changedAt: new Date() }
      ],
      comments: [],
      attachments: [],
      createdAt: new Date(),
      createdBy: newInvoice.createdBy,
      interpretation: '',
      criticalValues: false
    };
    setInvoices(prev => {
      setReports(prevReports => [...prevReports, newReport]);
      return [...prev, newInvoice];
    });
    addNotification({
      type: 'info',
      category: 'system',
      title: 'New Invoice',
      message: `Invoice #${newInvoice.invoiceNumber} for patient ${newInvoice.patientId} created.`,
      isRead: false,
      priority: 'medium'
    });
    refreshDashboard();
  };

  const updateInvoice = (id: string, invoice: Partial<Invoice>) => {
    setInvoices((prev: Invoice[]) => prev.map((i: Invoice) => {
      if (i.id === id) {
        const diff = getFieldDiff(i, invoice);
        addAuditLog({
          userId: 'System',
          action: 'UPDATE',
          module: 'INVOICES',
          details: `Updated invoice with ID: ${id}. Changes: ${diff}`
        });
        addNotification({
          type: diff.match(/finalAmount|status|amountPaid/) ? 'error' : 'info',
          category: 'system',
          title: 'Invoice Updated',
          message: `Invoice #${i.invoiceNumber} updated. ${diff}`,
          isRead: false,
          priority: 'medium'
        });
        return { ...i, ...invoice };
      }
      return i;
    }));
  };

  const recordPayment = (invoiceId: string, payment: PaymentRecord) => {
    setInvoices((prev: Invoice[]) => prev.map((inv: Invoice) => {
      if (inv.id !== invoiceId) return inv;
      const newAmountPaid = (inv.amountPaid || 0) + payment.amount;
      const newPaymentHistory = [...(inv.paymentHistory || []), payment];
      let newStatus = inv.status;
      if (newAmountPaid >= inv.finalAmount) {
        newStatus = 'paid';
      } else if (newAmountPaid > 0 && newAmountPaid < inv.finalAmount) {
        newStatus = 'partial';
      } else if (newAmountPaid === 0) {
        // Check due/overdue
        const now = new Date();
        if (inv.dueDate && now > new Date(inv.dueDate)) {
          newStatus = 'overdue';
        } else {
          newStatus = 'due';
        }
      }
      return {
        ...inv,
        amountPaid: newAmountPaid,
        paymentHistory: newPaymentHistory,
        status: newStatus,
      };
    }));
    addNotification({
      type: 'success',
      category: 'payment',
      title: 'Payment Received',
      message: `Payment of ${payment.amount} received for invoice #${invoiceId}.`,
      isRead: false,
      priority: 'medium'
    });
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev: Invoice[]) => prev.filter((i: Invoice) => i.id !== id));
    addAuditLog({
      userId: 'System',
      action: 'DELETE',
      module: 'INVOICES',
      details: `Deleted invoice with ID: ${id}`
    });
  };

  // Report methods
  const addReport = (report: Omit<Report, 'id' | 'createdAt' | 'statusHistory' | 'comments' | 'attachments'>) => {
    const newReport: Report = {
      ...report,
      id: generateId(),
      createdAt: new Date(),
      statusHistory: [{ status: report.status, changedBy: report.createdBy, changedAt: new Date() }],
      comments: [],
      attachments: []
    };
    setReports((prev: Report[]) => [...prev, newReport]);
    addAuditLog({
      userId: 'System',
      action: 'CREATE',
      module: 'REPORTS',
      details: `Created report for invoice: ${newReport.invoiceId}`
    });
  };

  const updateReport = (id: string, report: Partial<Report> & { status?: Report['status'], userId?: string }) => {
    setReports((prev: Report[]) => prev.map((r: Report) => {
      if (r.id === id) {
        const diff = getFieldDiff(r, report);
        let updatedStatusHistory = r.statusHistory;
        if (report.status && report.status !== r.status && report.userId) {
          updatedStatusHistory = [
            ...r.statusHistory,
            { status: report.status, changedBy: report.userId, changedAt: new Date() }
          ];
        }
        addAuditLog({
          userId: 'System',
          action: 'UPDATE',
          module: 'REPORTS',
          details: `Updated report with ID: ${id}. Changes: ${diff}`
        });
        addNotification({
          type: diff.includes('status') ? 'warning' : 'info',
          category: 'report',
          title: 'Report Updated',
          message: `Report for invoice ${r.invoiceId} updated. ${diff}`,
          isRead: false,
          priority: 'medium'
        });
        return {
          ...r,
          ...report,
          statusHistory: updatedStatusHistory
        };
      }
      return r;
    }));
  };

  const addReportComment = (reportId: string, comment: ReportComment) => {
    setReports((prev: Report[]) => prev.map((r: Report) =>
      r.id === reportId ? { ...r, comments: [...(r.comments || []), comment] } : r
    ));
    addAuditLog({
      userId: 'System',
      action: 'COMMENT',
      module: 'REPORTS',
      details: `Added comment to report with ID: ${reportId}`
    });
  };

  const addReportAttachment = (reportId: string, fileId: string) => {
    setReports((prev: Report[]) => prev.map((r: Report) =>
      r.id === reportId ? { ...r, attachments: [...(r.attachments || []), fileId] } : r
    ));
    addAuditLog({
      userId: 'System',
      action: 'ATTACHMENT',
      module: 'REPORTS',
      details: `Added attachment to report with ID: ${reportId}`
    });
  };

  // Stock methods
  const addStockItem = (item: Omit<StockItem, 'id' | 'createdAt'>) => {
    const newItem: StockItem = {
      ...item,
      id: generateId(),
      createdAt: new Date()
    };
    setStock((prev: StockItem[]) => [...prev, newItem]);
    addAuditLog({
      userId: 'System',
      action: 'CREATE',
      module: 'STOCK',
      details: `Created stock item: ${item.name}`
    });
    addNotification({
      type: 'info',
      category: 'system',
      title: 'New Stock Item Added',
      message: `Stock item ${item.name} was added.`,
      isRead: false,
      priority: 'medium'
    });
  };

  const updateStockItem = (id: string, item: Partial<StockItem>) => {
    setStock((prev: StockItem[]) => prev.map((s: StockItem) => {
      if (s.id === id) {
        const diff = getFieldDiff(s, item);
        addAuditLog({
          userId: 'System',
          action: 'UPDATE',
          module: 'STOCK',
          details: `Updated stock item with ID: ${id}. Changes: ${diff}`
        });
        addNotification({
          type: diff.includes('currentStock') ? 'warning' : 'info',
          category: 'stock',
          title: 'Stock Item Updated',
          message: `Stock item ${s.name} updated. ${diff}`,
          isRead: false,
          priority: 'medium'
        });
        return { ...s, ...item };
      }
      return s;
    }));
  };

  // Expense methods
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: generateId()
    };
    setExpenses((prev: Expense[]) => [...prev, newExpense]);
    addAuditLog({
      userId: 'System',
      action: 'CREATE',
      module: 'EXPENSES',
      details: `Created expense: ${expense.description}`
    });
    addNotification({
      type: 'info',
      category: 'system',
      title: 'New Expense Added',
      message: `Expense ${expense.description} was added.`,
      isRead: false,
      priority: 'medium'
    });
  };

  const updateExpense = (id: string, expense: Partial<Expense>) => {
    setExpenses((prev: Expense[]) => prev.map((e: Expense) => {
      if (e.id === id) {
        const diff = getFieldDiff(e, expense);
        addAuditLog({
          userId: 'System',
          action: 'UPDATE',
          module: 'EXPENSES',
          details: `Updated expense with ID: ${id}. Changes: ${diff}`
        });
        addNotification({
          type: diff.includes('amount') ? 'warning' : 'info',
          category: 'system',
          title: 'Expense Updated',
          message: `Expense ${e.description} updated. ${diff}`,
          isRead: false,
          priority: 'medium'
        });
        return { ...e, ...expense };
      }
      return e;
    }));
  };

  // Audit Logs
  const addAuditLog = (log: Omit<AuditLog, 'id' | 'timestamp'>) => {
    const newLog: AuditLog = {
      ...log,
      id: generateId(),
      timestamp: new Date()
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  // Dashboard
  const refreshDashboard = () => {
    const totalPatients = patients.length;
    const todayPatients = patients.filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString()).length;
    const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.finalAmount || 0), 0);
    const todayRevenue = invoices.filter(inv => new Date(inv.createdAt).toDateString() === new Date().toDateString()).reduce((sum, inv) => sum + (inv.finalAmount || 0), 0);
    const pendingReports = reports.filter(r => r.status === 'pending').length;
    const lowStockItems = stock.filter(s => s.currentStock < s.reorderLevel).length;
    const recentActivities: string[] = [];

    // Add recent patient additions
    const recentPatients = patients.filter(p => new Date(p.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
    if (recentPatients.length > 0) {
      recentActivities.push(`${recentPatients.length} new patients added.`);
    }

    // Add recent invoice creations
    const recentInvoices = invoices.filter(inv => new Date(inv.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (recentInvoices.length > 0) {
      recentActivities.push(`${recentInvoices.length} new invoices created.`);
    }

    // Add recent report creations
    const recentReports = reports.filter(r => new Date(r.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (recentReports.length > 0) {
      recentActivities.push(`${recentReports.length} new reports created.`);
    }

    // Add recent stock item additions
    const recentStockItems = stock.filter(s => new Date(s.createdAt).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (recentStockItems.length > 0) {
      recentActivities.push(`${recentStockItems.length} new stock items added.`);
    }

    // Expenses do not have createdAt, so skip recentExpenses
    
    setDashboard({
      totalPatients,
      todayPatients,
      totalRevenue,
      todayRevenue,
      pendingReports,
      lowStockItems,
      recentActivities: auditLogs.slice(-5) // Use last 5 audit logs as activities
    });
  };

  // Notifications
  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: generateId(),
      createdAt: new Date()
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  // Utility: Export all tests to the active rate list
  const exportTestsToRateList = () => {
    if (rateLists.length === 0) return;
    const activeIdx = rateLists.findIndex(rl => rl.isActive);
    if (activeIdx === -1) return;
    const updatedRates = tests.map(test => ({
      testId: test.id,
      testName: test.name,
      price: test.price,
      category: test.category,
      sampleType: test.sampleType
    }));
    const updatedRateList = { ...rateLists[activeIdx], rates: updatedRates };
    const newRateLists = [...rateLists];
    newRateLists[activeIdx] = updatedRateList;
    setRateLists(newRateLists);
    localStorage.setItem('lab_rateLists', JSON.stringify(newRateLists));
  };
  // Call exportTestsToRateList on startup if a rate list exists
  React.useEffect(() => {
    if (rateLists.length > 0 && tests.length > 0) {
      exportTestsToRateList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DataContext.Provider value={{
      patients,
      addPatient,
      updatePatient,
      deletePatient,
      doctors,
      addDoctor,
      updateDoctor,
      deleteDoctor,
      tests,
      addTest,
      updateTest,
      deleteTest,
      invoices,
      addInvoice,
      updateInvoice,
      deleteInvoice,
      recordPayment,
      reports,
      addReport,
      updateReport,
      addReportComment,
      addReportAttachment,
      stock,
      addStockItem,
      updateStockItem,
      expenses,
      addExpense,
      updateExpense,
      auditLogs,
      addAuditLog,
      dashboard,
      refreshDashboard,
      notifications,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      deleteNotification,
      rateLists,
      addRateList,
      updateRateList,
      deleteRateList
    }}>
      {children}
    </DataContext.Provider>
  );
};