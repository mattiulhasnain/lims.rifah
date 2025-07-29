import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, Search, Filter, Edit, Trash2, 
  CheckCircle, XCircle, Loader2
} from 'lucide-react';
import { Patient } from '../../types';

// Toast component for feedback
const Toast: React.FC<{ type: 'success' | 'error'; message: string; onClose: () => void }> = ({ type, message, onClose }) => (
  <div className={`fixed top-6 right-6 z-[9999] px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-pop-in ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}
    role="alert"
    tabIndex={0}
    onClick={onClose}
    onKeyDown={e => (e.key === 'Escape' ? onClose() : undefined)}
    style={{ cursor: 'pointer', minWidth: 240 }}
  >
    {type === 'success' ? <CheckCircle className="w-6 h-6" /> : <XCircle className="w-6 h-6" />}
    <span className="font-semibold">{message}</span>
  </div>
);

const PatientManagement: React.FC = () => {
  const { patients, addPatient, updatePatient, deletePatient } = useData();
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [formData, setFormData] = useState({
    patientId: '',
    // Remove phcrNumber and mrNumber from manual entry
    name: '',
    age: '',
    gender: 'male',
    contact: '',
    email: '',
    address: '',
    cnic: '',
    bloodGroup: '',
    allergies: '',
    medicalHistory: '',
    referredBy: '',
    sampleType: ''
  });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'patientId'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [showAddResults, setShowAddResults] = useState<{ open: boolean; patient: Patient | null }>({ open: false, patient: null });
  const { tests, reports, updateReport } = useData();
  const [selectedTestId, setSelectedTestId] = useState<string>('');
  const [resultValues, setResultValues] = useState<{ [param: string]: string }>({});
  const [validationError, setValidationError] = useState<string>('');
  const [criticalComment, setCriticalComment] = useState<string>('');
  const [acknowledgeCritical, setAcknowledgeCritical] = useState(false);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm)
  );

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  const paginatedPatients = sortedPatients.slice((page - 1) * pageSize, page * pageSize);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) < 0) errors.age = 'Valid age required';
    if (!formData.contact.trim()) errors.contact = 'Contact is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
    if (editingPatient) {
      updatePatient(editingPatient.id, {
        ...formData,
          age: parseInt(formData.age),
          gender: formData.gender as 'male' | 'female' | 'other',
      });
        setToast({ type: 'success', message: 'Patient updated successfully!' });
      setEditingPatient(null);
    } else {
        const nextMrNumber = `MR-${(patients.length + 1).toString().padStart(4, '0')}`;
      addPatient({
        ...formData,
        age: parseInt(formData.age),
          gender: formData.gender as 'male' | 'female' | 'other',
        patientId: `P${(patients.length + 1).toString().padStart(3, '0')}`,
          mrNumber: nextMrNumber,
          phcrNumber: 'PHCR# R-34889',
        createdBy: user?.id || ''
      });
        setToast({ type: 'success', message: 'Patient added successfully!' });
    }
    setShowAddForm(false);
    setFormData({
        name: '', age: '', gender: 'male', contact: '', email: '', address: '', cnic: '', bloodGroup: '', allergies: '', medicalHistory: '',
        patientId: '', referredBy: '', sampleType: ''
      });
      setFormErrors({});
    } catch {
      setToast({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      patientId: patient.patientId,
      phcrNumber: patient.phcrNumber || '',
      mrNumber: patient.mrNumber || '',
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender as 'male' | 'female' | 'other',
      contact: patient.contact,
      email: patient.email || '',
      address: patient.address,
      cnic: patient.cnic || '',
      bloodGroup: patient.bloodGroup || '',
      allergies: patient.allergies || '',
      medicalHistory: patient.medicalHistory || '',
      referredBy: patient.referredBy || '',
      sampleType: patient.sampleType || ''
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      try {
      deletePatient(id);
        setToast({ type: 'success', message: 'Patient deleted.' });
      } catch {
        setToast({ type: 'error', message: 'Failed to delete patient.' });
      }
    }
  };

  // Modal close on Escape or click outside
  React.useEffect(() => {
    if (!showAddForm) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setShowAddForm(false); };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [showAddForm]);

  const handleSubmitResults = async () => {
    setValidationError('');
    if (!showAddResults.patient || !selectedTestId) return;
    const patient = showAddResults.patient;
    const test = tests.find(t => t.id === selectedTestId);
    if (!test) return;
    // Find the patient's report (assume one report per patient for simplicity)
    const report = reports.find(r => r.patientId === patient.id);
    if (!report) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let newTestResult: any;
    let abnormalParams: string[] = [];
    let criticalParams: string[] = [];
    let isCritical = false;
    if (test && Array.isArray((test as any).parameters) && (test as any).parameters.length > 0) {
      // Structured test
      const params = (test as any).parameters;
      // Validation: all fields required
      for (const param of params) {
        if (!resultValues[param.name] || resultValues[param.name].trim() === '') {
          setValidationError('All result fields are required.');
          return;
        }
      }
      // Abnormal/critical flagging
      const abnormalMap: { [key: string]: boolean } = {};
      const criticalMap: { [key: string]: boolean } = {};
      for (const param of params) {
        const value = parseFloat(resultValues[param.name]);
        let isAbn = false, isCrit = false;
        if (param.normalRange) {
          // Parse normal range (e.g., '4.0 - 10.0')
          const match = param.normalRange.match(/([\d.]+)\s*-\s*([\d.]+)/);
          if (match) {
            const low = parseFloat(match[1]);
            const high = parseFloat(match[2]);
            if (value < low || value > high) {
              isAbn = true;
              abnormalParams.push(param.name);
            }
            // Critical: >2x outside normal range
            if (value < low / 2 || value > high * 2) {
              isCrit = true;
              criticalParams.push(param.name);
              isCritical = true;
            }
          }
        }
        abnormalMap[param.name] = isAbn;
        criticalMap[param.name] = isCrit;
      }
      if (isCritical && (!acknowledgeCritical || !criticalComment.trim())) {
        setValidationError('Critical results detected. Please acknowledge and add a comment.');
        return;
      }
      newTestResult = {
        testId: test.id,
        testName: test.name,
        result: JSON.stringify(resultValues),
        normalRange: '',
        isAbnormal: abnormalParams.length > 0,
        isCritical,
        abnormalParams,
        criticalParams,
        unit: '',
        criticalComment: isCritical ? criticalComment : undefined
      };
    } else {
      // Narrative test
      if (!resultValues['result'] || resultValues['result'].trim() === '') {
        setValidationError('Result is required.');
        return;
      }
      newTestResult = {
        testId: test.id,
        testName: test.name,
        result: resultValues['result'] || '',
        normalRange: '',
        isAbnormal: false,
        isCritical: false,
        abnormalParams: [],
        criticalParams: [],
        unit: ''
      };
    }
    // Add or update the test result in the report
    const updatedTests = [...(report.tests || [])];
    const idx = updatedTests.findIndex(t => t.testId === test.id);
    if (idx >= 0) {
      updatedTests[idx] = newTestResult;
    } else {
      updatedTests.push(newTestResult);
    }
    // Mark report as completed automatically once all ordered tests have results
    const allResultsEntered = updatedTests.every(t => t.result && t.result.toString().trim() !== '');
    updateReport(report.id, {
      tests: updatedTests,
      ...(allResultsEntered ? { status: 'completed', userId: user?.id || 'system' } : {})
    });
    setShowAddResults({ open: false, patient: null });
    setSelectedTestId('');
    setResultValues({});
    setCriticalComment('');
    setAcknowledgeCritical(false);
    setValidationError('');
    setToast({ type: 'success', message: 'Results saved successfully.' });
  };

  return (
    <div className="p-6 space-y-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
          <p className="text-gray-600">Manage patient records and information</p>
        </div>
        {hasPermission('patients', 'create') && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Patient</span>
          </button>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search patients by name, ID, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Add/Edit Patient Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in-up" onClick={() => setShowAddForm(false)}>
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-pop-in relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors" onClick={() => setShowAddForm(false)} aria-label="Close">
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingPatient ? 'Edit Patient' : 'Add New Patient'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Lab # *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.patientId}
                    onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.patientId ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.patientId && <span className="text-error text-xs animate-fade-in-up">{formErrors.patientId}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.name && <span className="text-error text-xs animate-fade-in-up">{formErrors.name}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.age}
                    onChange={(e) => setFormData({...formData, age: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.age ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.age && <span className="text-error text-xs animate-fade-in-up">{formErrors.age}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender *
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value as 'male' | 'female' | 'other'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.contact ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.contact && <span className="text-error text-xs animate-fade-in-up">{formErrors.contact}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.email && <span className="text-error text-xs animate-fade-in-up">{formErrors.email}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNIC
                  </label>
                  <input
                    type="text"
                    value={formData.cnic}
                    onChange={(e) => setFormData({...formData, cnic: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.cnic ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.cnic && <span className="text-error text-xs animate-fade-in-up">{formErrors.cnic}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referred By
                  </label>
                  <input
                    type="text"
                    value={formData.referredBy}
                    onChange={(e) => setFormData({...formData, referredBy: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.referredBy ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.referredBy && <span className="text-error text-xs animate-fade-in-up">{formErrors.referredBy}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sample Type
                  </label>
                  <select
                    value={formData.sampleType}
                    onChange={(e) => setFormData({...formData, sampleType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Sample Type</option>
                    <option value="Urine">Urine</option>
                    <option value="Blood">Blood</option>
                    <option value="Stool">Stool</option>
                    <option value="CSF">CSF</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PHCR#</label>
                  <input type="text" value={editingPatient ? (editingPatient.phcrNumber || 'PHCR# R-34889') : 'PHCR# R-34889'} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MR No</label>
                  <input type="text" value={editingPatient ? (editingPatient.mrNumber || '') : `MR-${(patients.length + 1).toString().padStart(4, '0')}`} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address *
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.address ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.address && <span className="text-error text-xs animate-fade-in-up">{formErrors.address}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Allergies
                </label>
                <textarea
                  value={formData.allergies}
                  onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                  rows={2}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.allergies ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.allergies && <span className="text-error text-xs animate-fade-in-up">{formErrors.allergies}</span>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical History
                </label>
                <textarea
                  value={formData.medicalHistory}
                  onChange={(e) => setFormData({...formData, medicalHistory: e.target.value})}
                  rows={3}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.medicalHistory ? 'border-red-500' : 'border-gray-300'}`}
                />
                {formErrors.medicalHistory && <span className="text-error text-xs animate-fade-in-up">{formErrors.medicalHistory}</span>}
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" className="btn-primary bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />} {editingPatient ? 'Update' : 'Add'} Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patients Table/List with sorting and pagination */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mt-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2">
            <button onClick={() => { setSortBy('name'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }} className="text-sm font-semibold text-gray-700 hover:text-blue-600">Name</button>
            <button onClick={() => { setSortBy('age'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }} className="text-sm font-semibold text-gray-700 hover:text-blue-600">Age</button>
            <button onClick={() => { setSortBy('patientId'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }} className="text-sm font-semibold text-gray-700 hover:text-blue-600">ID</button>
          </div>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Prev</button>
            <span className="text-sm">Page {page}</span>
            <button disabled={page * pageSize >= sortedPatients.length} onClick={() => setPage(page + 1)} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Next</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gender</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedPatients.map(patient => (
                <tr key={patient.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-2 font-mono text-xs">{patient.patientId}</td>
                  <td className="px-4 py-2">{patient.name}</td>
                  <td className="px-4 py-2">{patient.age}</td>
                  <td className="px-4 py-2 capitalize">{patient.gender}</td>
                  <td className="px-4 py-2">{patient.contact}</td>
                  <td className="px-4 py-2 truncate max-w-xs">{patient.address}</td>
                  <td className="px-4 py-2 flex gap-2">
                    <button onClick={() => handleEdit(patient)} className="text-blue-600 hover:text-blue-800 transition-colors" aria-label="Edit"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(patient.id)} className="text-red-600 hover:text-red-800 transition-colors" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                    <button onClick={() => setShowAddResults({ open: true, patient })} className="text-green-600 hover:text-green-800 transition-colors" aria-label="Add Results"><CheckCircle className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-8">
          <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No patients found</p>
        </div>
      )}

      {showAddResults.open && showAddResults.patient && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Add Results for {showAddResults.patient.name}</h2>
            <div className="mb-4">
              <label className="block mb-1 font-medium">Select Test</label>
              <select
                className="w-full border rounded px-3 py-2"
                value={selectedTestId}
                onChange={e => {
                  setSelectedTestId(e.target.value);
                  setResultValues({});
                }}
              >
                <option value="">-- Select Test --</option>
                {tests.map(test => (
                  <option key={test.id} value={test.id}>{test.name}</option>
                ))}
              </select>
            </div>
            {validationError && <div className="text-red-600 mb-2">{validationError}</div>}
            {selectedTestId && (() => {
              const test = tests.find(t => t.id === selectedTestId);
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              if (test && Array.isArray((test as any).parameters) && (test as any).parameters.length > 0) {
                const params = (test as any).parameters;
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const abnormalMap: { [key: string]: boolean } = {};
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const criticalMap: { [key: string]: boolean } = {};
                for (const param of params) {
                  const value = parseFloat(resultValues[param.name]);
                  if (param.normalRange) {
                    const match = param.normalRange.match(/([\d.]+)\s*-\s*([\d.]+)/);
                    if (match) {
                      const low = parseFloat(match[1]);
                      const high = parseFloat(match[2]);
                      abnormalMap[param.name] = value < low || value > high;
                      criticalMap[param.name] = value < low / 2 || value > high * 2;
                    }
                  }
                }
                return (
                  <>
                    <table className="w-full mb-4 border">
                      <thead>
                        <tr className="bg-blue-100">
                          <th className="px-2 py-1 text-left">Parameter</th>
                          <th className="px-2 py-1 text-left">Result</th>
                          <th className="px-2 py-1 text-left">Unit</th>
                          <th className="px-2 py-1 text-left">Normal Range</th>
                          <th className="px-2 py-1 text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {params.map((param: any, idx: number) => (
                          <tr key={idx}>
                            <td className="px-2 py-1">{param.name}</td>
                            <td className="px-2 py-1">
                              <input
                                type="text"
                                className={`border rounded px-2 py-1 w-24 ${criticalMap[param.name] ? 'bg-red-200' : abnormalMap[param.name] ? 'bg-yellow-100' : ''}`}
                                value={resultValues[param.name] || ''}
                                onChange={e => setResultValues(v => ({ ...v, [param.name]: e.target.value }))}
                              />
                            </td>
                            <td className="px-2 py-1">{param.unit}</td>
                            <td className="px-2 py-1">{param.normalRange}</td>
                            <td className="px-2 py-1">
                              {criticalMap[param.name] ? <span className="text-red-600 font-bold">Critical</span> : abnormalMap[param.name] ? <span className="text-yellow-700 font-bold">Abnormal</span> : <span className="text-green-700">Normal</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {/* Summary of abnormal/critical params */}
                    {(Object.values(criticalMap).some(Boolean) || Object.values(abnormalMap).some(Boolean)) && (
                      <div className="mb-2">
                        {Object.values(criticalMap).some(Boolean) && (
                          <div className="text-red-700 font-semibold mb-1">Critical results detected! Please acknowledge and add a comment before saving.</div>
                        )}
                        {Object.values(abnormalMap).some(Boolean) && !Object.values(criticalMap).some(Boolean) && (
                          <div className="text-yellow-700 font-semibold mb-1">Abnormal results detected.</div>
                        )}
                      </div>
                    )}
                    {Object.values(criticalMap).some(Boolean) && (
                      <div className="mb-2">
                        <label className="block font-medium mb-1">Acknowledge Critical Results</label>
                        <input type="checkbox" checked={acknowledgeCritical} onChange={e => setAcknowledgeCritical(e.target.checked)} className="mr-2" />
                        <span className="text-sm">I acknowledge the presence of critical results and have reviewed them.</span>
                        <textarea
                          className="w-full border rounded px-3 py-2 mt-2"
                          rows={2}
                          placeholder="Add a comment about the critical results..."
                          value={criticalComment}
                          onChange={e => setCriticalComment(e.target.value)}
                        />
                      </div>
                    )}
                  </>
                );
              } else if (test) {
                // Non-structured test (narrative)
                return (
                  <div className="mb-4">
                    <label className="block mb-1 font-medium">Result</label>
                    <textarea
                      className="w-full border rounded px-3 py-2"
                      rows={4}
                      value={resultValues['result'] || ''}
                      onChange={e => setResultValues(v => ({ ...v, result: e.target.value }))}
                    />
                  </div>
                );
              }
              return null;
            })()}
            <div className="flex justify-end gap-2">
              <button onClick={() => setShowAddResults({ open: false, patient: null })} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
              <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={handleSubmitResults}>Submit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement;