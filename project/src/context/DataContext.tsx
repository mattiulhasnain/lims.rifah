import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Patient, Doctor, Test, Invoice, InvoiceTest, Report, StockItem, Expense, AuditLog, Dashboard, PaymentRecord, ReportComment, Notification, RateList, CollectionCenter, CollectionCenterSummary } from '../types';
import Papa from 'papaparse';
// Remove the problematic CSV imports and handle them differently
import { DataCalculator } from '../utils/dataCalculator';

interface DataContextType {
  // Collection Centers
  collectionCenters: CollectionCenter[];
  addCollectionCenter: (center: Omit<CollectionCenter, 'id' | 'createdAt'>) => void;
  updateCollectionCenter: (id: string, center: Partial<CollectionCenter>) => void;
  deleteCollectionCenter: (id: string) => void;
  
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
  selectedCenterId?: string;
  setSelectedCenterId: (centerId?: string) => void;

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

// Helper: recursively convert string fields that look like dates into Date objects
function convertDatesFromStrings<T>(input: T): T {
  // Arrays: process each element
  if (Array.isArray(input)) {
    return input.map(item => convertDatesFromStrings(item)) as unknown as T;
  }

  // Objects: shallow copy and process keys
  if (input && typeof input === 'object') {
    const obj = input as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        const lower = key.toLowerCase();
        if (lower.includes('date') || lower.includes('at')) {
          const d = new Date(value);
          out[key] = isNaN(d.getTime()) ? value : d;
          continue;
        }
      }
      if (Array.isArray(value) || (value && typeof value === 'object')) {
        out[key] = convertDatesFromStrings(value as unknown);
      } else {
        out[key] = value;
      }
    }
    return out as unknown as T;
  }

  // Primitives: return as-is
  return input;
}

// Move the hook inside the component to fix Fast Refresh
const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize sample data on first load
  // (Removed) initializeSampleData();
  
  // Collection Centers
  const [collectionCenters, setCollectionCenters] = useState<CollectionCenter[]>(() => {
    const stored = localStorage.getItem('lab_collection_centers');
    if (stored) return JSON.parse(stored);
    return [];
  });

  // Selected collection center (used to filter dashboard metrics)
  const [currentCenterId, setCurrentCenterId] = useState<string | undefined>(() => {
    const fromStorage = localStorage.getItem('lab_selected_center_id');
    if (fromStorage) return fromStorage || undefined;
    const userStr = localStorage.getItem('lab_user');
    try {
      if (userStr) {
        const u = JSON.parse(userStr);
        return u?.collectionCenterId || undefined;
      }
    } catch {}
    return undefined;
  });

  const setSelectedCenterId = (centerId?: string) => {
    setCurrentCenterId(centerId);
    if (centerId) localStorage.setItem('lab_selected_center_id', centerId);
    else localStorage.removeItem('lab_selected_center_id');
  };
  
  const [patients, setPatients] = useState<Patient[]>(() => {
    const stored = localStorage.getItem('lab_patients');
    console.log('Raw stored patients from localStorage:', stored);
    if (stored) {
      try {
        const parsedPatients = JSON.parse(stored);
        console.log('Raw patients from localStorage:', parsedPatients);
        console.log('Type of parsedPatients:', typeof parsedPatients);
        console.log('Is Array?', Array.isArray(parsedPatients));
        
        // If the data is not an array, clear it and return empty array
        if (!Array.isArray(parsedPatients)) {
          console.warn('Patients data in localStorage is not an array, clearing corrupted data');
          localStorage.removeItem('lab_patients');
          return [];
        }
        
        // Convert date strings back to Date objects
        const convertedPatients = convertDatesFromStrings(parsedPatients as unknown);
        console.log('Converted patients:', convertedPatients);
        // Ensure we always return an array
        return Array.isArray(convertedPatients) ? convertedPatients : [];
      } catch (error) {
        console.error('Error parsing patients from localStorage:', error);
        // Clear corrupted data
        localStorage.removeItem('lab_patients');
        return [];
      }
    }
    return [];
  });
  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const stored = localStorage.getItem('lab_doctors');
    if (stored) {
      try {
        const parsedDoctors = JSON.parse(stored);
        if (!Array.isArray(parsedDoctors)) {
          localStorage.removeItem('lab_doctors');
          return [];
        }
        const convertedDoctors = convertDatesFromStrings(parsedDoctors as unknown);
        return Array.isArray(convertedDoctors) ? convertedDoctors : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Auto-load doctors from CSV if nothing in storage (no sample fallback)
  useEffect(() => {
    if (doctors.length > 0) return;
    (async () => {
      try {
        const response = await fetch('/consultants_camelot_all.csv');
        if (!response.ok) return;
        const csvText = await response.text();
        const results = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        const csvDoctors = (results.data as any[]).map((row, idx) => ({
          id: `D${(idx + 1).toString().padStart(4, '0')}`,
          name: (row['Consultant Name'] || '').trim(),
          contact: row['Contact No'] && row['Contact No'].trim() !== '<NA>' ? row['Contact No'].trim() : '',
          hospital: row['Hospital'] && row['Hospital'].trim() !== '<NA>' ? row['Hospital'].trim() : '',
          specialty: 'General Medicine',
          email: '',
          commissionPercent: 0,
          cnic: '',
          address: row['Hospital'] && row['Hospital'].trim() !== '<NA>' ? row['Hospital'].trim() : '',
          isActive: true,
          createdAt: new Date(),
          totalReferrals: 0,
          totalRevenue: 0
        })).filter(d => d.name);
        if (csvDoctors.length > 0) {
          setDoctors(csvDoctors);
          localStorage.setItem('lab_doctors', JSON.stringify(csvDoctors));
        }
      } catch (_e) { /* optional CSV load failed; ignore */ }
    })();
  }, [doctors]);

  const [tests, setTests] = useState<Test[]>(() => {
    const stored = localStorage.getItem('lab_tests');
    if (stored) {
      try {
        const parsedTests = JSON.parse(stored);
        const convertedTests = convertDatesFromStrings(parsedTests as unknown);
        return Array.isArray(convertedTests) ? convertedTests : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  // Auto-load tests from CSV if nothing in storage (no sample fallback)
  useEffect(() => {
    if (tests.length > 0) return;
    (async () => {
      try {
        const response = await fetch('/testlist.csv');
        if (!response.ok) return;
        const csvText = await response.text();
        const results = Papa.parse(csvText, { header: true, skipEmptyLines: true });
        const csvTests = (results.data as any[]).map((row, idx) => ({
          id: `T${(idx + 1).toString().padStart(4, '0')}`,
          name: (row['Test Name'] || '').trim(),
          category: 'General',
          price: parseInt(String(row['Rates'] || '0').replace(/[^\d]/g, '')) || 0,
          sampleType: (row['Sample Required'] || 'Blood').trim(),
          sampleRequired: (row['Sample Required'] || '').trim(),
          deliveryTime: (row['Delivery Time'] || '').trim(),
          createdAt: new Date(),
          isActive: true
        })).filter(t => t.name && t.price);
        if (csvTests.length > 0) {
          setTests(csvTests);
          localStorage.setItem('lab_tests', JSON.stringify(csvTests));
        }
      } catch (_e) { /* ignore parse error */ }
    })();
  }, [tests]);
  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const stored = localStorage.getItem('lab_invoices');
    if (stored) {
      try {
        const parsedInvoices = JSON.parse(stored);
        const convertedInvoices = convertDatesFromStrings(parsedInvoices);
        return Array.isArray(convertedInvoices) ? convertedInvoices : [];
      } catch (error) {
        console.error('Error parsing invoices from localStorage:', error);
        return [];
      }
    }
    return [];
  });
  const [reports, setReports] = useState<Report[]>(() => {
    const stored = localStorage.getItem('lab_reports');
    if (stored) {
      try {
        const parsedReports = JSON.parse(stored);
        const convertedReports = convertDatesFromStrings(parsedReports);
        return Array.isArray(convertedReports) ? convertedReports : [];
      } catch (error) {
        console.error('Error parsing reports from localStorage:', error);
        return [];
      }
    }
    return [];
  });
  const [stock, setStock] = useState<StockItem[]>(() => {
    const stored = localStorage.getItem('lab_stock');
    if (stored) {
      try {
        const parsedStock = JSON.parse(stored);
        const convertedStock = convertDatesFromStrings(parsedStock);
        return Array.isArray(convertedStock) ? convertedStock : [];
      } catch (error) {
        console.error('Error parsing stock from localStorage:', error);
        return [];
      }
    }
    return [];
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
    recentActivities: [],
    collectionCenters: []
  });

  // Calculate dashboard metrics whenever data changes
  useEffect(() => {
    // Ensure all data is arrays before calling DataCalculator
    if (Array.isArray(patients) && Array.isArray(invoices) && Array.isArray(reports) && Array.isArray(stock) && Array.isArray(auditLogs) && Array.isArray(expenses)) {
      const calculatedDashboard = DataCalculator.calculateDashboard(
        patients,
        invoices,
        reports,
        stock,
        auditLogs,
        expenses
      );
      setDashboard(calculatedDashboard);
    } else {
      console.warn('Some data is not yet loaded or is not an array:', {
        patients: Array.isArray(patients),
        invoices: Array.isArray(invoices),
        reports: Array.isArray(reports),
        stock: Array.isArray(stock),
        auditLogs: Array.isArray(auditLogs),
        expenses: Array.isArray(expenses)
      });
    }
  }, [patients, invoices, reports, stock, auditLogs, expenses]);

  // Collection Center Management
  const addCollectionCenter = (center: Omit<CollectionCenter, 'id' | 'createdAt'>) => {
    const newCenter: CollectionCenter = {
      ...center,
      id: generateId(),
      createdAt: new Date()
    };
    setCollectionCenters(prev => {
      const updated = [...prev, newCenter];
      localStorage.setItem('lab_collection_centers', JSON.stringify(updated));
      return updated;
    });
    addAuditLog({
      userId: 'System',
      action: 'CREATE',
      module: 'COLLECTION_CENTERS',
      details: `Created collection center: ${center.name}`
    });
    addNotification({
      type: 'info',
      category: 'system',
      title: 'New Collection Center',
      message: `Collection center ${center.name} was added.`,
      isRead: false,
      priority: 'medium'
    });
  };

  const updateCollectionCenter = (id: string, center: Partial<CollectionCenter>) => {
    setCollectionCenters(prev => {
      const updated = prev.map(c => c.id === id ? { ...c, ...center } : c);
      localStorage.setItem('lab_collection_centers', JSON.stringify(updated));
      return updated;
    });
    addAuditLog({
      userId: 'System',
      action: 'UPDATE',
      module: 'COLLECTION_CENTERS',
      details: `Updated collection center: ${id}`
    });
  };

  const deleteCollectionCenter = (id: string) => {
    setCollectionCenters(prev => {
      const updated = prev.filter(c => c.id !== id);
      localStorage.setItem('lab_collection_centers', JSON.stringify(updated));
      return updated;
    });
    addAuditLog({
      userId: 'System',
      action: 'DELETE',
      module: 'COLLECTION_CENTERS',
      details: `Deleted collection center: ${id}`
    });
  };

  // --- Rate List Management ---
  const [rateLists, setRateLists] = useState<RateList[]>(() => {
    const stored = localStorage.getItem('lab_rateLists');
    if (stored) {
      try {
        const parsedRateLists = JSON.parse(stored);
        const convertedRateLists = convertDatesFromStrings(parsedRateLists);
        return Array.isArray(convertedRateLists) ? convertedRateLists : [];
      } catch (error) {
        console.error('Error parsing rateLists from localStorage:', error);
        return [];
      }
    }
    return [];
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
      userId: 'System',
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

    // Cascade updates to invoices (update displayed test name only)
    const updatedTestBase = tests.find(src => src.id === id);
    const updatedTest: Test | undefined = updatedTestBase ? { ...updatedTestBase, ...test } as Test : undefined;
    if (updatedTest) {
      setInvoices((prev: Invoice[]) => prev.map((inv: Invoice) => ({
        ...inv,
        tests: inv.tests.map(line => line.testId === id ? { ...line, testName: updatedTest.name } : line)
      })));

      // Cascade updates to reports (update names, ranges, units, and parameter metadata)
      setReports((prevReports: Report[]) => prevReports.map((r: Report) => {
        const contains = r.tests.some(rt => rt.testId === id);
        if (!contains) return r;
        const parameterTemplates = updatedTest.parameterTemplates || [];
        const updatedReportTests = r.tests.map(rt => {
          if (rt.testId !== id) return rt;
          // Update test meta
          let updatedParams = rt.parameters ? [...rt.parameters] : [];
          // Update existing params' normalRange/unit by name
          updatedParams = updatedParams.map(p => {
            const tmpl = parameterTemplates.find(pt => pt.name === p.name);
            return tmpl ? { ...p, normalRange: tmpl.normalRange, unit: tmpl.unit } : p;
          });
          // Append any new params from template that don't exist yet
          parameterTemplates.forEach(pt => {
            if (!updatedParams.some(p => p.name === pt.name)) {
              updatedParams.push({ name: pt.name, result: '', normalRange: pt.normalRange, unit: pt.unit, isAbnormal: false, isCritical: false });
            }
          });
          return {
            ...rt,
            testName: updatedTest.name,
            normalRange: updatedTest.referenceRange || rt.normalRange,
            unit: updatedTest.unit || rt.unit,
            parameters: updatedParams
          };
        });
        addAuditLog({ userId: 'System', action: 'UPDATE', module: 'REPORTS', details: `Cascaded test update to reports for test ${updatedTest.name} (${id})` });
        return { ...r, tests: updatedReportTests };
      }));
    }
  };

  const deleteTest = (id: string) => {
    setTests((prev: Test[]) => prev.filter((t: Test) => t.id !== id));
    addAuditLog({
      userId: 'System',
      action: 'DELETE',
      module: 'TESTS',
      details: `Deleted test with ID: ${id}`
    });

    // Remove test lines from invoices and recalc amounts
    setInvoices((prev: Invoice[]) => prev.map((inv: Invoice) => {
      const remaining = inv.tests.filter(t => t.testId !== id);
      if (remaining.length === inv.tests.length) return inv;
      const newTotal = remaining.reduce((sum, t) => sum + t.price * t.quantity, 0);
      const newFinal = newTotal - (inv.discount || 0);
      addAuditLog({ userId: 'System', action: 'UPDATE', module: 'INVOICES', details: `Removed deleted test from invoice #${inv.invoiceNumber}` });
      return { ...inv, tests: remaining, totalAmount: newTotal, finalAmount: newFinal };
    }));

    // Remove test entries from reports
    setReports((prevReports: Report[]) => prevReports.map((r: Report) => {
      const remaining = r.tests.filter(t => t.testId !== id);
      if (remaining.length === r.tests.length) return r;
      addAuditLog({ userId: 'System', action: 'UPDATE', module: 'REPORTS', details: `Removed deleted test from report for invoice ${r.invoiceId}` });
      return { ...r, tests: remaining };
    }));

    addNotification({
      type: 'warning',
      category: 'system',
      title: 'Test Removed',
      message: 'A test was deleted and related invoices/reports were updated.',
      isRead: false,
      priority: 'medium'
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
      tests: newInvoice.tests.map(t => {
        const sourceTest = tests.find(src => src.id === t.testId);
        const parameters = (sourceTest?.parameterTemplates || []).map(pt => ({
          name: pt.name,
          result: '',
          normalRange: pt.normalRange,
          unit: pt.unit,
          isAbnormal: false,
          isCritical: false,
        }));
        return {
        testId: t.testId,
        testName: t.testName,
        result: '',
          normalRange: sourceTest?.referenceRange || '',
        isAbnormal: false,
          unit: sourceTest?.unit || '',
          parameters,
        };
      }),
      status: 'pending',
      statusHistory: [
        { status: 'pending', changedBy: newInvoice.createdBy, changedAt: new Date() }
      ],
      comments: [],
      attachments: [],
      createdAt: new Date(),
      createdBy: newInvoice.createdBy,
      interpretation: sourceTestInterpretationTemplate(tests, newInvoice.tests),
      criticalValues: false,
      collectionCenterId: newInvoice.collectionCenterId
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

  function sourceTestInterpretationTemplate(allTests: Test[], invoiceTests: InvoiceTest[]): string {
    const first = invoiceTests[0] && allTests.find(t => t.id === invoiceTests[0].testId);
    if (first?.isNarrative && first.narrativeTemplate) return first.narrativeTemplate;
    return '';
  }

  const updateInvoice = (id: string, invoice: Partial<Invoice>) => {
    setInvoices((prev: Invoice[]) => prev.map((i: Invoice) => {
      if (i.id === id) {
        // If tests provided but totals not provided, recalc amounts
        let merged: Invoice = { ...i, ...invoice } as Invoice;
        if (invoice.tests && (invoice.totalAmount === undefined || invoice.finalAmount === undefined)) {
          const totalAmount = invoice.tests.reduce((sum, t) => sum + (t.price * t.quantity), 0);
          merged = { ...merged, totalAmount, finalAmount: totalAmount - (merged.discount || 0) };
        }
        const diff = getFieldDiff(i, merged);
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
        
        // If tests were updated, also update the corresponding report
        if (invoice.tests && JSON.stringify(invoice.tests) !== JSON.stringify(i.tests)) {
          setReports((prevReports: Report[]) => prevReports.map((report: Report) => {
            if (report.invoiceId === id) {
              // Update report tests based on new invoice tests
              const updatedReportTests = invoice.tests!.map(t => {
                const sourceTest = tests.find(src => src.id === t.testId);
                const existingTest = report.tests.find(rt => rt.testId === t.testId);
                
                // If test already exists in report, preserve its data
                if (existingTest) {
                  return existingTest;
                }
                
                // If it's a new test, create it with default values
                const parameters = (sourceTest?.parameterTemplates || []).map(pt => ({
                  name: pt.name,
                  result: '',
                  normalRange: pt.normalRange,
                  unit: pt.unit,
                  isAbnormal: false,
                  isCritical: false,
                }));
                
                return {
                  testId: t.testId,
                  testName: t.testName,
                  result: '',
                  normalRange: sourceTest?.referenceRange || '',
                  isAbnormal: false,
                  unit: sourceTest?.unit || '',
                  parameters,
                };
              });
              
              // Check if any tests were removed
              const removedTests = report.tests.filter(rt => 
                !invoice.tests!.some(it => it.testId === rt.testId)
              );
              
              // Add status history entry for test list update
              const updatedStatusHistory = [
                ...report.statusHistory,
                { 
                  status: report.status, 
                  changedBy: 'System', 
                  changedAt: new Date() 
                }
              ];
              
              let auditMessage = `Updated report tests for invoice: ${id}. Tests changed from ${i.tests.length} to ${invoice.tests!.length}`;
              if (removedTests.length > 0) {
                auditMessage += `. Removed tests: ${removedTests.map(t => t.testName).join(', ')}`;
              }
              
              addAuditLog({
                userId: 'System',
                action: 'UPDATE',
                module: 'REPORTS',
                details: auditMessage
              });
              
              let notificationMessage = `Report for invoice #${i.invoiceNumber} has been updated with ${invoice.tests!.length} tests.`;
              if (removedTests.length > 0) {
                notificationMessage += ` ${removedTests.length} test(s) were removed.`;
              }
              
              addNotification({
                type: 'warning',
                category: 'system',
                title: 'Report Tests Updated',
                message: notificationMessage,
                isRead: false,
                priority: 'medium'
              });
              
              return {
                ...report,
                tests: updatedReportTests,
                statusHistory: updatedStatusHistory,
                // Reset status to pending if tests were added/removed
                status: report.status === 'completed' || report.status === 'verified' ? 'pending' : report.status
              };
            }
            return report;
          }));
        }
        
        return merged;
      }
      return i;
    }));
    // Ensure dashboard updates after invoice mutation
    refreshDashboard();
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
    // Ensure dashboard updates after payment
    refreshDashboard();
  };

  const deleteInvoice = (id: string) => {
    setInvoices((prev: Invoice[]) => prev.filter((i: Invoice) => i.id !== id));
    
    // Also delete the corresponding report
    setReports((prev: Report[]) => prev.filter((r: Report) => r.invoiceId !== id));
    
    addAuditLog({
      userId: 'System',
      action: 'DELETE',
      module: 'INVOICES',
      details: `Deleted invoice with ID: ${id}`
    });
    
    addNotification({
      type: 'warning',
      category: 'system',
      title: 'Invoice Deleted',
      message: `Invoice and its corresponding report have been deleted.`,
      isRead: false,
      priority: 'high'
    });
    // Ensure dashboard updates after deletion
    refreshDashboard();
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
      timestamp: new Date(),
      collectionCenterId: (typeof window !== 'undefined' && localStorage.getItem('lab_user'))
        ? JSON.parse(localStorage.getItem('lab_user') as string).collectionCenterId
        : undefined
    };
    setAuditLogs(prev => [...prev, newLog]);
  };

  // Dashboard
  const refreshDashboard = useCallback(() => {
    const filterByCenter = <T extends { collectionCenterId?: string }>(arr: T[]): T[] => {
      if (!currentCenterId) return arr;
      return arr.filter(x => x.collectionCenterId === currentCenterId);
    };

    const filteredPatients = filterByCenter<Patient>(patients);
    const filteredInvoices = filterByCenter<Invoice>(invoices);
    const filteredReports = filterByCenter<Report>(reports);

    const totalPatients = filteredPatients.length;
    const todayPatients = filteredPatients.filter(p => new Date(p.createdAt).toDateString() === new Date().toDateString()).length;
    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + (inv.finalAmount || 0), 0);
    const todayRevenue = filteredInvoices.filter(inv => new Date(inv.createdAt).toDateString() === new Date().toDateString()).reduce((sum, inv) => sum + (inv.finalAmount || 0), 0);
    const pendingReports = filteredReports.filter(r => r.status === 'pending').length;
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

    // Calculate collection center summaries
    const collectionCentersSummary: CollectionCenterSummary[] = collectionCenters.map(center => {
      const centerPatients = patients.filter(p => p.collectionCenterId === center.id);
      const centerInvoices = invoices.filter(inv => inv.collectionCenterId === center.id);
      const centerReports = reports.filter(r => r.collectionCenterId === center.id);
      
      const centerTotalPatients = centerPatients.length;
      const centerTodayPatients = centerPatients.filter(p => 
        new Date(p.createdAt).toDateString() === new Date().toDateString()
      ).length;
      const centerTotalRevenue = centerInvoices.reduce((sum, inv) => sum + (inv.finalAmount || 0), 0);
      const centerTodayRevenue = centerInvoices.filter(inv => 
        new Date(inv.createdAt).toDateString() === new Date().toDateString()
      ).reduce((sum, inv) => sum + (inv.finalAmount || 0), 0);
      const centerPendingReports = centerReports.filter(r => r.status === 'pending').length;
      const centerCompletedReports = centerReports.filter(r => r.status === 'completed').length;
      
      // Calculate monthly and yearly revenue
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const yearStart = new Date(now.getFullYear(), 0, 1);
      
      const centerMonthlyRevenue = centerInvoices.filter(inv => 
        new Date(inv.createdAt) >= monthStart
      ).reduce((sum, inv) => sum + (inv.finalAmount || 0), 0);
      
      const centerYearlyRevenue = centerInvoices.filter(inv => 
        new Date(inv.createdAt) >= yearStart
      ).reduce((sum, inv) => sum + (inv.finalAmount || 0), 0);

      return {
        centerId: center.id,
        centerName: center.name,
        centerCode: center.code,
        totalPatients: centerTotalPatients,
        todayPatients: centerTodayPatients,
        totalRevenue: centerTotalRevenue,
        todayRevenue: centerTodayRevenue,
        pendingReports: centerPendingReports,
        completedReports: centerCompletedReports,
        monthlyRevenue: centerMonthlyRevenue,
        yearlyRevenue: centerYearlyRevenue
      };
    });

    // Expenses do not have createdAt, so skip recentExpenses
    
    setDashboard({
      totalPatients,
      todayPatients,
      totalRevenue,
      todayRevenue,
      pendingReports,
      lowStockItems,
      recentActivities: auditLogs.slice(-5), // Use last 5 audit logs as activities
      collectionCenters: collectionCentersSummary
    });
  }, [patients, invoices, reports, stock, auditLogs, collectionCenters, currentCenterId]);

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

  // Persist core datasets to localStorage for durability and multi-tab sync
  useEffect(() => {
    try { localStorage.setItem('lab_tests', JSON.stringify(tests)); } catch {}
  }, [tests]);
  useEffect(() => {
    try { localStorage.setItem('lab_invoices', JSON.stringify(invoices)); } catch {}
  }, [invoices]);
  useEffect(() => {
    try { localStorage.setItem('lab_reports', JSON.stringify(reports)); } catch {}
  }, [reports]);

  // Cross-tab realtime sync using storage events
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      try {
        if (e.key === 'lab_tests' && e.newValue) {
          const parsed = convertDatesFromStrings(JSON.parse(e.newValue));
          if (Array.isArray(parsed)) setTests(parsed);
        }
        if (e.key === 'lab_invoices' && e.newValue) {
          const parsed = convertDatesFromStrings(JSON.parse(e.newValue));
          if (Array.isArray(parsed)) setInvoices(parsed);
        }
        if (e.key === 'lab_reports' && e.newValue) {
          const parsed = convertDatesFromStrings(JSON.parse(e.newValue));
          if (Array.isArray(parsed)) setReports(parsed);
        }
      } catch {}
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // Auto-refresh dashboard when core datasets change
  useEffect(() => {
    refreshDashboard();
  }, [patients, invoices, reports, stock, expenses, currentCenterId, refreshDashboard]);

  return (
    <DataContext.Provider value={{
      collectionCenters,
      addCollectionCenter,
      updateCollectionCenter,
      deleteCollectionCenter,
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
      notifications,
      addNotification,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      deleteNotification,
      dashboard,
      refreshDashboard,
      selectedCenterId: currentCenterId,
      setSelectedCenterId,
      rateLists,
      addRateList,
      updateRateList,
      deleteRateList
    }}>
      {children}
    </DataContext.Provider>
  );
};

// Export the hook separately to fix Fast Refresh
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export { DataProvider };