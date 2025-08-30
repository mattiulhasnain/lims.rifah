import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, Search, Filter, Edit, Trash2, 
  User, Phone, MapPin, Calendar, FileText,
  Eye, Save, X, CheckCircle, AlertCircle
} from 'lucide-react';
import { Patient } from '../../types';

interface PatientFormData {
  name: string;
  age: string;
  gender: 'male' | 'female' | 'other';
  contact: string;
  email: string;
  address: string;
  cnic: string;
  bloodGroup: string;
  allergies: string;
  medicalHistory: string;
  referredBy: string;
  sampleType: string;
}

const PatientManagement: React.FC = () => {
  const { patients, addPatient, updatePatient, deletePatient } = useData();
  const { user, hasPermission } = useAuth();
  
  // UI State
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState<Patient | null>(null);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState<PatientFormData>({
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
  
  // Form validation
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filter and pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [patientsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState<'name' | 'age' | 'patientId' | 'createdAt'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filtered and sorted patients
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm) ||
    (patient.cnic && patient.cnic.includes(searchTerm))
  );

  const sortedPatients = [...filteredPatients].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (typeof aValue === 'string') aValue = aValue.toLowerCase();
    if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    
    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  // Pagination
  const indexOfLastPatient = currentPage * patientsPerPage;
  const indexOfFirstPatient = indexOfLastPatient - patientsPerPage;
  const currentPatients = sortedPatients.slice(indexOfFirstPatient, indexOfLastPatient);
  const totalPages = Math.ceil(sortedPatients.length / patientsPerPage);

  // Form validation
  const validateForm = (): boolean => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.age || isNaN(Number(formData.age)) || Number(formData.age) < 0) {
      errors.age = 'Valid age is required';
    }
    if (!formData.contact.trim()) errors.contact = 'Contact number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    
    // CNIC validation (optional but if provided should be valid)
    if (formData.cnic && !/^\d{5}-\d{7}-\d{1}$/.test(formData.cnic)) {
      errors.cnic = 'CNIC format should be 12345-1234567-1';
    }
    
    // Email validation (optional but if provided should be valid)
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Valid email address is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const patientData = {
        ...formData,
        age: parseInt(formData.age),
        createdBy: user?.id || '',
        patientId: editingPatient ? editingPatient.patientId : `P${(patients.length + 1).toString().padStart(4, '0')}`,
        mrNumber: editingPatient ? editingPatient.mrNumber : `MR-${(patients.length + 1).toString().padStart(4, '0')}`,
        phcrNumber: editingPatient ? editingPatient.phcrNumber : 'PHCR# R-34889',
        visitCount: editingPatient ? editingPatient.visitCount : 0,
        totalBilled: editingPatient ? editingPatient.totalBilled : 0,
        pendingDues: editingPatient ? editingPatient.pendingDues : 0
      };

      if (editingPatient) {
        updatePatient(editingPatient.id, patientData);
        setToast({ type: 'success', message: 'Patient updated successfully!' });
      } else {
        addPatient(patientData);
        setToast({ type: 'success', message: 'Patient added successfully!' });
      }
      
      resetForm();
      setShowAddForm(false);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to save patient. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
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
    setFormErrors({});
    setEditingPatient(null);
  };

  // Handle edit
  const handleEdit = (patient: Patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
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

  // Handle delete
  const handleDelete = (patient: Patient) => {
    if (window.confirm(`Are you sure you want to delete patient ${patient.name}?`)) {
      try {
        deletePatient(patient.id);
        setToast({ type: 'success', message: 'Patient deleted successfully!' });
      } catch (error) {
        setToast({ type: 'error', message: 'Failed to delete patient.' });
      }
    }
  };

  // Handle sort
  const handleSort = (field: 'name' | 'age' | 'patientId' | 'createdAt') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  // Auto-hide toast
  React.useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-down ${
          toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
          <button onClick={() => setToast(null)} className="text-white hover:text-gray-200">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600 mt-1">Manage patient records and information</p>
          </div>
          {hasPermission('patients', 'create') && (
            <button
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-colors shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Add Patient
            </button>
          )}
        </div>
      </div>

      {/* Search and Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search patients by name, ID, contact, or CNIC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
              <div className="text-gray-600">Total Patients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{filteredPatients.length}</div>
              <div className="text-gray-600">Filtered Results</div>
            </div>
          </div>
        </div>
      </div>

      {/* Patients Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  <button
                    onClick={() => handleSort('patientId')}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    Patient ID
                    {sortBy === 'patientId' && (
                      <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  <button
                    onClick={() => handleSort('name')}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    Patient Details
                    {sortBy === 'name' && (
                      <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Contact Info</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">
                  <button
                    onClick={() => handleSort('createdAt')}
                    className="flex items-center gap-2 hover:text-blue-600"
                  >
                    Registration
                    {sortBy === 'createdAt' && (
                      <span className="text-blue-600">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </button>
                </th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentPatients.map((patient) => (
                <tr key={patient.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6">
                    <div className="font-mono text-sm font-semibold text-blue-600">
                      {patient.patientId}
                    </div>
                    <div className="text-xs text-gray-500">
                      MR: {patient.mrNumber}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{patient.name}</div>
                        <div className="text-sm text-gray-600">
                          {patient.age} years • {patient.gender.charAt(0).toUpperCase() + patient.gender.slice(1)}
                        </div>
                        {patient.bloodGroup && (
                          <div className="text-xs text-red-600 font-medium">
                            Blood Group: {patient.bloodGroup}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{patient.contact}</span>
                      </div>
                      {patient.email && (
                        <div className="text-sm text-blue-600">{patient.email}</div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate max-w-xs">{patient.address}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>{patient.createdAt.toLocaleDateString()}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      Visits: {patient.visitCount || 0}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowPatientDetails(patient)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {hasPermission('patients', 'edit') && (
                        <button
                          onClick={() => handleEdit(patient)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit Patient"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                      )}
                      {hasPermission('patients', 'delete') && (
                        <button
                          onClick={() => handleDelete(patient)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Patient"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {currentPatients.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">No patients found</h3>
            <p className="text-gray-500">
              {searchTerm ? 'Try adjusting your search criteria' : 'Add your first patient to get started'}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstPatient + 1} to {Math.min(indexOfLastPatient, sortedPatients.length)} of {sortedPatients.length} patients
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Previous
                </button>
                <span className="px-3 py-2 text-sm">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Patient Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {editingPatient ? 'Edit Patient' : 'Add New Patient'}
                </h2>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.name ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter patient's full name"
                    />
                    {formErrors.name && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age *
                    </label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.age ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter age"
                      min="0"
                      max="150"
                    />
                    {formErrors.age && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.age}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender *
                    </label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'other' })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Blood Group
                    </label>
                    <select
                      value={formData.bloodGroup}
                      onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
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
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.contact}
                      onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.contact ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter contact number"
                    />
                    {formErrors.contact && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.contact}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter email address (optional)"
                    />
                    {formErrors.email && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CNIC
                    </label>
                    <input
                      type="text"
                      value={formData.cnic}
                      onChange={(e) => setFormData({ ...formData, cnic: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.cnic ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="12345-1234567-1"
                    />
                    {formErrors.cnic && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.cnic}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address *
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.address ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter complete address"
                      rows={3}
                    />
                    {formErrors.address && (
                      <p className="text-red-500 text-sm mt-1">{formErrors.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referred By
                    </label>
                    <input
                      type="text"
                      value={formData.referredBy}
                      onChange={(e) => setFormData({ ...formData, referredBy: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter referring doctor/clinic"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sample Type
                    </label>
                    <select
                      value={formData.sampleType}
                      onChange={(e) => setFormData({ ...formData, sampleType: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Sample Type</option>
                      <option value="Blood">Blood</option>
                      <option value="Urine">Urine</option>
                      <option value="Stool">Stool</option>
                      <option value="Sputum">Sputum</option>
                      <option value="CSF">CSF</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Allergies
                    </label>
                    <textarea
                      value={formData.allergies}
                      onChange={(e) => setFormData({ ...formData, allergies: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="List any known allergies"
                      rows={2}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Medical History
                    </label>
                    <textarea
                      value={formData.medicalHistory}
                      onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter relevant medical history"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    resetForm();
                  }}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  <Save className="w-4 h-4" />
                  {editingPatient ? 'Update Patient' : 'Add Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Details Modal */}
      {showPatientDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Patient Details</h2>
                <button
                  onClick={() => setShowPatientDetails(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Patient Header */}
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{showPatientDetails.name}</h3>
                  <p className="text-gray-600">Patient ID: {showPatientDetails.patientId}</p>
                  <p className="text-sm text-gray-500">MR Number: {showPatientDetails.mrNumber}</p>
                </div>
              </div>

              {/* Patient Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Basic Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Age:</span>
                      <span className="font-medium">{showPatientDetails.age} years</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gender:</span>
                      <span className="font-medium capitalize">{showPatientDetails.gender}</span>
                    </div>
                    {showPatientDetails.bloodGroup && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Blood Group:</span>
                        <span className="font-medium text-red-600">{showPatientDetails.bloodGroup}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Contact Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Contact:</span>
                      <span className="font-medium">{showPatientDetails.contact}</span>
                    </div>
                    {showPatientDetails.email && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium text-blue-600">{showPatientDetails.email}</span>
                      </div>
                    )}
                    {showPatientDetails.cnic && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">CNIC:</span>
                        <span className="font-medium">{showPatientDetails.cnic}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Medical Info */}
                <div className="md:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Medical Information</h4>
                  <div className="space-y-3">
                    <div>
                      <span className="text-gray-600 font-medium">Address:</span>
                      <p className="text-gray-900 mt-1">{showPatientDetails.address}</p>
                    </div>
                    {showPatientDetails.referredBy && (
                      <div>
                        <span className="text-gray-600 font-medium">Referred By:</span>
                        <p className="text-gray-900 mt-1">{showPatientDetails.referredBy}</p>
                      </div>
                    )}
                    {showPatientDetails.allergies && (
                      <div>
                        <span className="text-gray-600 font-medium">Allergies:</span>
                        <p className="text-red-600 mt-1">{showPatientDetails.allergies}</p>
                      </div>
                    )}
                    {showPatientDetails.medicalHistory && (
                      <div>
                        <span className="text-gray-600 font-medium">Medical History:</span>
                        <p className="text-gray-900 mt-1">{showPatientDetails.medicalHistory}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Registration Info */}
                <div className="md:col-span-2">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Registration Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{showPatientDetails.visitCount || 0}</div>
                      <div className="text-sm text-gray-600">Total Visits</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        PKR {(showPatientDetails.totalBilled || 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Total Billed</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600">
                        PKR {(showPatientDetails.pendingDues || 0).toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">Pending Dues</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Registered on {showPatientDetails.createdAt.toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                {hasPermission('patients', 'edit') && (
                  <button
                    onClick={() => {
                      setShowPatientDetails(null);
                      handleEdit(showPatientDetails);
                    }}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit Patient
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientManagement; 