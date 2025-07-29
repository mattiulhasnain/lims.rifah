import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, Search, Filter, Edit, Trash2, 
  CheckCircle, XCircle, Loader2
} from 'lucide-react';
import { Doctor } from '../../types';

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

const DoctorManagement: React.FC = () => {
  const { doctors, addDoctor, updateDoctor, deleteDoctor } = useData();
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    specialty: '',
    contact: '',
    email: '',
    hospital: '',
    commissionPercent: '',
    cnic: '',
    address: '',
    isActive: true
  });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sortBy, setSortBy] = useState<'name' | 'specialty' | 'commissionPercent'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const specialties = [
    'Internal Medicine',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Gynecology',
    'Dermatology',
    'Psychiatry',
    'Radiology',
    'Pathology',
    'General Surgery',
    'Emergency Medicine'
  ];

  const filteredDoctors = doctors.filter(doctor =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.hospital?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDoctors = [...filteredDoctors].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  const paginatedDoctors = sortedDoctors.slice((page - 1) * pageSize, page * pageSize);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.specialty.trim()) errors.specialty = 'Specialty is required';
    if (!formData.contact.trim()) errors.contact = 'Contact is required';
    if (!formData.commissionPercent || isNaN(Number(formData.commissionPercent))) errors.commissionPercent = 'Valid commission % required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (editingDoctor) {
        updateDoctor(editingDoctor.id, {
          ...formData,
          commissionPercent: parseFloat(formData.commissionPercent)
        });
        setToast({ type: 'success', message: 'Doctor updated successfully!' });
        setEditingDoctor(null);
      } else {
        addDoctor({
          ...formData,
          commissionPercent: parseFloat(formData.commissionPercent)
        });
        setToast({ type: 'success', message: 'Doctor added successfully!' });
      }
      setShowAddForm(false);
      setFormData({
        name: '', specialty: '', contact: '', email: '', hospital: '', commissionPercent: '', cnic: '', address: '', isActive: true
      });
      setFormErrors({});
    } catch {
      setToast({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialty: doctor.specialty,
      contact: doctor.contact,
      email: doctor.email || '',
      hospital: doctor.hospital || '',
      commissionPercent: doctor.commissionPercent.toString(),
      cnic: doctor.cnic || '',
      address: doctor.address || '',
      isActive: doctor.isActive
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        deleteDoctor(id);
        setToast({ type: 'success', message: 'Doctor deleted.' });
      } catch {
        setToast({ type: 'error', message: 'Failed to delete doctor.' });
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

  return (
    <div className="p-6 space-y-6">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Management</h1>
          <p className="text-gray-600">Manage doctor profiles and referral tracking</p>
        </div>
        {hasPermission('doctors', 'create') && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Doctor</span>
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
              placeholder="Search doctors by name, specialty, or hospital..."
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

      {/* Add/Edit Doctor Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in-up" onClick={() => setShowAddForm(false)}>
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-pop-in relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors" onClick={() => setShowAddForm(false)} aria-label="Close">
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Specialty *
                  </label>
                  <select
                    required
                    value={formData.specialty}
                    onChange={(e) => setFormData({...formData, specialty: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.specialty ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Specialty</option>
                    {specialties.map(specialty => (
                      <option key={specialty} value={specialty}>{specialty}</option>
                    ))}
                  </select>
                  {formErrors.specialty && <span className="text-error text-xs animate-fade-in-up">{formErrors.specialty}</span>}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Hospital/Clinic
                  </label>
                  <input
                    type="text"
                    value={formData.hospital}
                    onChange={(e) => setFormData({...formData, hospital: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commission % *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.commissionPercent}
                    onChange={(e) => setFormData({...formData, commissionPercent: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.commissionPercent ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.commissionPercent && <span className="text-error text-xs animate-fade-in-up">{formErrors.commissionPercent}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CNIC
                  </label>
                  <input
                    type="text"
                    value={formData.cnic}
                    onChange={(e) => setFormData({...formData, cnic: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                    className="mr-2"
                  />
                  <label className="text-sm font-medium text-gray-700">
                    Active
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" className="btn-primary bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />} {editingDoctor ? 'Update' : 'Add'} Doctor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctors Table/List with sorting and pagination */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mt-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2">
            <button onClick={() => { setSortBy('name'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }} className="text-sm font-semibold text-gray-700 hover:text-blue-600">Name</button>
            <button onClick={() => { setSortBy('specialty'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }} className="text-sm font-semibold text-gray-700 hover:text-blue-600">Specialty</button>
            <button onClick={() => { setSortBy('commissionPercent'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }} className="text-sm font-semibold text-gray-700 hover:text-blue-600">Commission %</button>
          </div>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Prev</button>
            <span className="text-sm">Page {page}</span>
            <button disabled={page * pageSize >= sortedDoctors.length} onClick={() => setPage(page + 1)} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Next</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Specialty</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hospital</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission %</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedDoctors.map(doctor => (
                <tr key={doctor.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-2">{doctor.name}</td>
                  <td className="px-4 py-2">{doctor.specialty}</td>
                  <td className="px-4 py-2">{doctor.contact}</td>
                  <td className="px-4 py-2">{doctor.hospital}</td>
                  <td className="px-4 py-2">{doctor.commissionPercent}%</td>
                  <td className="px-4 py-2">
                    {doctor.isActive ? <span className="text-success font-semibold">Active</span> : <span className="text-error font-semibold">Inactive</span>}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button onClick={() => handleEdit(doctor)} className="text-blue-600 hover:text-blue-800 transition-colors" aria-label="Edit"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(doctor.id)} className="text-red-600 hover:text-red-800 transition-colors" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredDoctors.length === 0 && (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No doctors found</p>
        </div>
      )}
    </div>
  );
};

export default DoctorManagement;