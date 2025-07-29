import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, Search, Filter, Edit, Trash2, 
  TestTube, CheckCircle, XCircle, Loader2
} from 'lucide-react';
import { Test } from '../../types';
import { sampleTypes } from '../../types/sampleTypes';

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

const TestManagement: React.FC = () => {
  const { tests, addTest, updateTest, deleteTest } = useData();
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTest, setEditingTest] = useState<Test | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    sampleType: '',
    referenceRange: '',
    unit: '',
    isActive: true
  });
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [sortBy, setSortBy] = useState<'name' | 'category' | 'price'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const categories = [
    'Hematology',
    'Biochemistry',
    'Microbiology',
    'Immunology',
    'Hormones',
    'Pathology',
    'Genetics',
    'Molecular Biology',
    'Serology',
    'Toxicology'
  ];

  const filteredTests = tests.filter(test =>
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedTests = [...filteredTests].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();
    if (valA < valB) return sortDir === 'asc' ? -1 : 1;
    if (valA > valB) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });
  const paginatedTests = sortedTests.slice((page - 1) * pageSize, page * pageSize);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.name.trim()) errors.name = 'Test name is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.price || isNaN(Number(formData.price))) errors.price = 'Valid price required';
    if (!formData.sampleType.trim()) errors.sampleType = 'Sample type is required';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      if (editingTest) {
        updateTest(editingTest.id, {
          ...formData,
          price: parseFloat(formData.price)
        });
        setToast({ type: 'success', message: 'Test updated successfully!' });
        setEditingTest(null);
      } else {
        addTest({
          ...formData,
          price: parseFloat(formData.price)
        });
        setToast({ type: 'success', message: 'Test added successfully!' });
      }
      setShowAddForm(false);
      setFormData({
        name: '', category: '', price: '', sampleType: '', referenceRange: '', unit: '', isActive: true
      });
      setFormErrors({});
    } catch {
      setToast({ type: 'error', message: 'An error occurred. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (test: Test) => {
    setEditingTest(test);
    setFormData({
      name: test.name,
      category: test.category,
      price: test.price.toString(),
      sampleType: test.sampleType,
      referenceRange: test.referenceRange || '',
      unit: test.unit || '',
      isActive: test.isActive
    });
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      try {
        deleteTest(id);
        setToast({ type: 'success', message: 'Test deleted.' });
      } catch {
        setToast({ type: 'error', message: 'Failed to delete test.' });
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
          <h1 className="text-2xl font-bold text-gray-900">Test Management</h1>
          <p className="text-gray-600">Manage laboratory tests and pricing</p>
        </div>
        {hasPermission('tests', 'create') && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Test</span>
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
              placeholder="Search tests by name or category..."
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

      {/* Add/Edit Test Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in-up" onClick={() => setShowAddForm(false)}>
          <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-pop-in relative" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors" onClick={() => setShowAddForm(false)} aria-label="Close">
              <XCircle className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingTest ? 'Edit Test' : 'Add New Test'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Test Name *
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
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.category ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {formErrors.category && <span className="text-error text-xs animate-fade-in-up">{formErrors.category}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.price ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {formErrors.price && <span className="text-error text-xs animate-fade-in-up">{formErrors.price}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sample Type *
                  </label>
                  <select
                    required
                    value={formData.sampleType}
                    onChange={(e) => setFormData({...formData, sampleType: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${formErrors.sampleType ? 'border-red-500' : 'border-gray-300'}`}
                  >
                    <option value="">Select Sample Type</option>
                    {sampleTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {formErrors.sampleType && <span className="text-error text-xs animate-fade-in-up">{formErrors.sampleType}</span>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., mg/dL, g/L"
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
                  Reference Range
                </label>
                <textarea
                  value={formData.referenceRange}
                  onChange={(e) => setFormData({...formData, referenceRange: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Normal: 10-50 mg/dL"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" className="btn-primary bg-gray-200 text-gray-700 hover:bg-gray-300" onClick={() => setShowAddForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary flex items-center gap-2" disabled={loading}>
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />} {editingTest ? 'Update' : 'Add'} Test
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tests Table/List with sorting and pagination */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200 mt-4">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2">
            <button onClick={() => { setSortBy('name'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }} className="text-sm font-semibold text-gray-700 hover:text-blue-600">Name</button>
            <button onClick={() => { setSortBy('category'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }} className="text-sm font-semibold text-gray-700 hover:text-blue-600">Category</button>
            <button onClick={() => { setSortBy('price'); setSortDir(sortDir === 'asc' ? 'desc' : 'asc'); }} className="text-sm font-semibold text-gray-700 hover:text-blue-600">Price</button>
          </div>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Prev</button>
            <span className="text-sm">Page {page}</span>
            <button disabled={page * pageSize >= sortedTests.length} onClick={() => setPage(page + 1)} className="px-2 py-1 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50">Next</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sample Type</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Active</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedTests.map(test => (
                <tr key={test.id} className="hover:bg-blue-50 transition-colors">
                  <td className="px-4 py-2">{test.name}</td>
                  <td className="px-4 py-2">{test.category}</td>
                  <td className="px-4 py-2">PKR {test.price.toLocaleString()}</td>
                  <td className="px-4 py-2">{test.sampleType}</td>
                  <td className="px-4 py-2">{test.unit}</td>
                  <td className="px-4 py-2">
                    {test.isActive ? <span className="text-success font-semibold">Active</span> : <span className="text-error font-semibold">Inactive</span>}
                  </td>
                  <td className="px-4 py-2 flex gap-2">
                    <button onClick={() => handleEdit(test)} className="text-blue-600 hover:text-blue-800 transition-colors" aria-label="Edit"><Edit className="w-4 h-4" /></button>
                    <button onClick={() => handleDelete(test.id)} className="text-red-600 hover:text-red-800 transition-colors" aria-label="Delete"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredTests.length === 0 && (
        <div className="text-center py-8">
          <TestTube className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No tests found</p>
        </div>
      )}
    </div>
  );
};

export default TestManagement;