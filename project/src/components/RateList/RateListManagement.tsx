import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, Search, Edit, Trash2, Download, Upload,
  DollarSign, Calendar, CheckCircle, Clock
} from 'lucide-react';
import { sampleTypes } from '../../types/sampleTypes';
import { createRateListPDF } from '../../utils/pdfGenerator';

interface RateList {
  id: string;
  name: string;
  description?: string;
  effectiveDate: Date;
  expiryDate?: Date;
  isActive: boolean;
  createdBy: string;
  createdAt: Date;
  rates: TestRate[];
}

interface TestRate {
  testId: string;
  testName: string;
  price: number;
  category: string;
  sampleType: string;
}

const RateListManagement: React.FC = () => {
  const { rateLists, addRateList, updateRateList, deleteRateList, tests } = useData();
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingRateList, setEditingRateList] = useState<RateList | null>(null);
  const [viewingRates, setViewingRates] = useState<RateList | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    rates: [] as TestRate[],
    isActive: true,
    createdBy: 'System',
  });

  const filteredRateLists = rateLists.filter(rateList =>
    rateList.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rateList.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      ...formData,
      effectiveDate: new Date(formData.effectiveDate),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
    };
    if (editingRateList) {
      updateRateList(editingRateList.id, data);
    } else {
      addRateList(data);
    }
    setShowCreateForm(false);
    setEditingRateList(null);
    setFormData({
      name: '',
      description: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      rates: [],
      isActive: true,
      createdBy: 'System',
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      effectiveDate: new Date().toISOString().split('T')[0],
      expiryDate: '',
      rates: [],
      isActive: true,
      createdBy: 'System',
    });
    setEditingRateList(null);
  };

  const handleEdit = (rateList: RateList) => {
    setEditingRateList(rateList);
    setFormData({
      name: rateList.name,
      description: rateList.description || '',
      effectiveDate: rateList.effectiveDate ? new Date(rateList.effectiveDate).toISOString().split('T')[0] : '',
      expiryDate: rateList.expiryDate ? new Date(rateList.expiryDate).toISOString().split('T')[0] : '',
      rates: rateList.rates || [],
      isActive: rateList.isActive,
      createdBy: rateList.createdBy,
    });
    setShowCreateForm(true);
  };

  const toggleActive = (id: string) => {
    updateRateList(id, { isActive: !rateLists.find(rl => rl.id === id)?.isActive });
  };

  const handleDelete = (id: string) => {
    deleteRateList(id);
  };

  const updateTestRate = (testId: string, newPrice: number) => {
    setFormData(prev => ({
      ...prev,
      rates: prev.rates.map(rate => 
        rate.testId === testId ? { ...rate, price: newPrice } : rate
      )
    }));
  };

  const addAllTests = () => {
    const newRates = tests.map(test => ({
      testId: test.id,
      testName: test.name,
      price: test.price,
      category: test.category,
      sampleType: test.sampleType || ''
    }));
    setFormData(prev => ({ ...prev, rates: newRates }));
  };

  const exportRateList = (rateList: RateList) => {
    // Export functionality would be implemented here
    console.log('Exporting rate list:', rateList.name);
    alert(`Exporting ${rateList.name} to CSV`);
  };

  const importRateList = () => {
    // Import functionality would be implemented here
    alert('Import functionality would open file dialog');
  };

  const activeRateList = rateLists.find(rl => rl.isActive) || rateLists[0];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rate List Management</h1>
          <p className="text-gray-600">Manage test pricing and rate lists</p>
        </div>
        <div className="flex items-center space-x-3">
          {activeRateList && (
            <button
              onClick={() => createRateListPDF(activeRateList)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Print Rate List</span>
            </button>
          )}
          {hasPermission('rates', 'import') && (
            <button
              onClick={importRateList}
              className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 flex items-center space-x-2"
            >
              <Upload className="w-4 h-4" />
              <span>Import</span>
            </button>
          )}
          {hasPermission('rates', 'create') && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Create Rate List</span>
            </button>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search rate lists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingRateList ? 'Edit Rate List' : 'Create New Rate List'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate List Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Effective Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.effectiveDate}
                    onChange={(e) => setFormData({...formData, effectiveDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiry Date (Optional)
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({...formData, expiryDate: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Test Rates */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Test Rates</h3>
                  <button
                    type="button"
                    onClick={addAllTests}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Add All Tests
                  </button>
                </div>
                
                <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Test Name</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Price (PKR)</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Sample Type</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Category</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.rates.map((rate, idx) => (
                        <tr key={rate.testId}>
                          <td>{rate.testName}</td>
                          <td>
                            <input
                              type="number"
                              value={rate.price}
                              onChange={e => {
                                const newRates = [...formData.rates];
                                newRates[idx].price = parseFloat(e.target.value);
                                setFormData({ ...formData, rates: newRates });
                              }}
                              className="w-24 px-2 py-1 border rounded"
                            />
                          </td>
                          <td>
                            <select
                              value={rate.sampleType || ''}
                              onChange={e => {
                                const newRates = [...formData.rates];
                                newRates[idx].sampleType = e.target.value;
                                setFormData({ ...formData, rates: newRates });
                              }}
                              className="w-32 px-2 py-1 border rounded"
                            >
                              <option value="">Select</option>
                              {sampleTypes.map(type => (
                                <option key={type} value={type}>{type}</option>
                              ))}
                            </select>
                          </td>
                          <td>{rate.category}</td>
                          <td>
                            <button type="button" onClick={() => {
                              const newRates = formData.rates.filter((_, i) => i !== idx);
                              setFormData({ ...formData, rates: newRates });
                            }} className="text-red-500 hover:text-red-700">Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingRateList ? 'Update' : 'Create'} Rate List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Rates Modal */}
      {viewingRates && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">{viewingRates.name} - Rates</h2>
              <button
                onClick={() => setViewingRates(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Test Name</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingRates.rates.map((rate) => (
                    <tr key={rate.testId} className="border-b border-gray-200">
                      <td className="py-3 px-4">{rate.testName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {rate.category}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">PKR {rate.price.toLocaleString()}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Rate Lists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRateLists.map((rateList) => (
          <div key={rateList.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium text-gray-900">{rateList.name}</h3>
                {rateList.description && (
                  <p className="text-sm text-gray-600 mt-1">{rateList.description}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                {rateList.isActive ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <Clock className="w-5 h-5 text-gray-400" />
                )}
              </div>
            </div>

            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Effective: {new Date(rateList.effectiveDate).toLocaleDateString()}</span>
              </div>
              {rateList.expiryDate && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>Expires: {new Date(rateList.expiryDate).toLocaleDateString()}</span>
                </div>
              )}
              <p>Tests: {rateList.rates.length}</p>
              <p>Created by: {rateList.createdBy}</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewingRates(rateList)}
                className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700"
              >
                View Rates
              </button>
              <button
                onClick={() => exportRateList(rateList)}
                className="p-2 text-green-600 hover:text-green-800"
                title="Export"
              >
                <Download className="w-4 h-4" />
              </button>
              {hasPermission('rates', 'edit') && (
                <button
                  onClick={() => handleEdit(rateList)}
                  className="p-2 text-blue-600 hover:text-blue-800"
                  title="Edit"
                >
                  <Edit className="w-4 h-4" />
                </button>
              )}
              {hasPermission('rates', 'delete') && (
                <button
                  onClick={() => handleDelete(rateList.id)}
                  className="p-2 text-red-600 hover:text-red-800"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => toggleActive(rateList.id)}
                className={`w-full px-3 py-2 rounded text-sm font-medium ${
                  rateList.isActive
                    ? 'bg-red-100 text-red-800 hover:bg-red-200'
                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                }`}
              >
                {rateList.isActive ? 'Deactivate' : 'Activate'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredRateLists.length === 0 && (
        <div className="text-center py-8">
          <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No rate lists found</p>
        </div>
      )}
    </div>
  );
};

export default RateListManagement;