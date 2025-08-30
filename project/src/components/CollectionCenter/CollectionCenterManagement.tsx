import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { CollectionCenter, User } from '../../types';
import { 
  Building2, Plus, Edit, Trash2, Users, DollarSign, 
  MapPin, Phone, Mail, Clock, Activity, TrendingUp 
} from 'lucide-react';

const CollectionCenterManagement: React.FC = () => {
  const { collectionCenters, addCollectionCenter, updateCollectionCenter, deleteCollectionCenter } = useData();
  const { users } = useAuth();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCenter, setEditingCenter] = useState<CollectionCenter | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    address: '',
    city: '',
    contact: '',
    email: '',
    managerId: '',
    openingHours: '',
    services: [] as string[],
    commissionRate: 0
  });

  const [selectedCenter, setSelectedCenter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const availableServices = [
    'Blood Collection', 'Urine Collection', 'Stool Collection', 
    'Sputum Collection', 'Swab Collection', 'Home Collection',
    'Corporate Collection', 'Emergency Collection'
  ];

  const resetForm = () => {
    setFormData({
      name: '',
      code: '',
      address: '',
      city: '',
      contact: '',
      email: '',
      managerId: '',
      openingHours: '',
      services: [],
      commissionRate: 0
    });
    setEditingCenter(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCenter) {
      updateCollectionCenter(editingCenter.id, formData);
    } else {
      addCollectionCenter({
        ...formData,
        isActive: true
      });
    }
    
    setIsModalOpen(false);
    resetForm();
  };

  const handleEdit = (center: CollectionCenter) => {
    setEditingCenter(center);
    setFormData({
      name: center.name,
      code: center.code,
      address: center.address,
      city: center.city,
      contact: center.contact,
      email: center.email || '',
      managerId: center.managerId || '',
      openingHours: center.openingHours || '',
      services: center.services || [],
      commissionRate: center.commissionRate || 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = (centerId: string) => {
    if (window.confirm('Are you sure you want to delete this collection center?')) {
      deleteCollectionCenter(centerId);
    }
  };

  const filteredCenters = collectionCenters.filter(center => {
    const matchesSearch = center.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         center.city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = selectedCenter === 'all' || center.id === selectedCenter;
    return matchesSearch && matchesFilter;
  });

  const getManagerName = (managerId: string) => {
    if (!users || !Array.isArray(users)) {
      return 'Loading...';
    }
    const manager = users.find((u: User) => u.id === managerId);
    return manager ? manager.name : 'Not Assigned';
  };

  const getCenterStats = (centerId: string) => {
    // This would be calculated from actual data in a real implementation
    return {
      totalPatients: Math.floor(Math.random() * 1000) + 100,
      totalRevenue: Math.floor(Math.random() * 500000) + 50000,
      monthlyRevenue: Math.floor(Math.random() * 50000) + 5000,
      pendingReports: Math.floor(Math.random() * 50) + 5
    };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Collection Centers</h1>
          <p className="text-gray-600">Manage multiple lab collection centers and their operations</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Center</span>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search centers by name, code, or city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCenter}
              onChange={(e) => setSelectedCenter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Centers</option>
              {collectionCenters.map(center => (
                <option key={center.id} value={center.id}>
                  {center.name} ({center.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Collection Centers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCenters.map(center => {
          const stats = getCenterStats(center.id);
          return (
            <div key={center.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Building2 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{center.name}</h3>
                      <p className="text-sm text-gray-500">{center.code}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(center)}
                      className="p-1 text-gray-400 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(center.id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Center Info */}
              <div className="p-4 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{center.address}, {center.city}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{center.contact}</span>
                </div>
                {center.email && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    <span>{center.email}</span>
                  </div>
                )}
                {center.openingHours && (
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>{center.openingHours}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  <span>Manager: {getManagerName(center.managerId || '')}</span>
                </div>
              </div>

              {/* Services */}
              {center.services && center.services.length > 0 && (
                <div className="px-4 pb-3">
                  <div className="flex flex-wrap gap-1">
                    {center.services.map((service, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="bg-gray-50 p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>Patients</span>
                    </div>
                    <p className="font-semibold text-gray-900">{stats.totalPatients.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span>Revenue</span>
                    </div>
                    <p className="font-semibold text-gray-900">PKR {stats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                      <Activity className="w-4 h-4" />
                      <span>Pending</span>
                    </div>
                    <p className="font-semibold text-gray-900">{stats.pendingReports}</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-gray-600">
                      <TrendingUp className="w-4 h-4" />
                      <span>Monthly</span>
                    </div>
                    <p className="font-semibold text-gray-900">PKR {stats.monthlyRevenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {editingCenter ? 'Edit Collection Center' : 'Add New Collection Center'}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Center Name *
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
                    Center Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({...formData, code: e.target.value})}
                    placeholder="e.g., CC001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.contact}
                    onChange={(e) => setFormData({...formData, contact: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    Manager
                  </label>
                  <select
                    value={formData.managerId}
                    onChange={(e) => setFormData({...formData, managerId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Manager</option>
                    {users && Array.isArray(users) ? users.filter((u: User) => u.role === 'center_manager' || u.role === 'manager').map((user: User) => (
                      <option key={user.id} value={user.id}>
                        {user.name} ({user.role})
                      </option>
                    )) : (
                      <option value="" disabled>Loading managers...</option>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Opening Hours
                  </label>
                  <input
                    type="text"
                    value={formData.openingHours}
                    onChange={(e) => setFormData({...formData, openingHours: e.target.value})}
                    placeholder="e.g., 8:00 AM - 6:00 PM"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Commission Rate (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.commissionRate}
                    onChange={(e) => setFormData({...formData, commissionRate: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Services Offered
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableServices.map(service => (
                    <label key={service} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.services.includes(service)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({...formData, services: [...formData.services, service]});
                          } else {
                            setFormData({...formData, services: formData.services.filter(s => s !== service)});
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{service}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingCenter ? 'Update Center' : 'Add Center'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionCenterManagement; 