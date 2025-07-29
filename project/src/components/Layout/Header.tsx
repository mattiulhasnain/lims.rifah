import React, { useState } from 'react';
import { Search, Bell, User, Settings, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import { useSidebar } from '../../context/SidebarContext';

const Header: React.FC = () => {
  const { user } = useAuth();
  const { toggleSidebar } = useSidebar();
  const { patients, doctors, tests, invoices, reports } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  // removed unused 'focused' state

  // Aggregate all searchable items
  const allResults = [
    ...patients.map(p => ({
      type: 'Patient',
      id: p.id,
      label: p.name,
      sub: p.patientId,
      route: '#patients',
    })),
    ...doctors.map(d => ({
      type: 'Doctor',
      id: d.id,
      label: d.name,
      sub: d.specialty,
      route: '#doctors',
    })),
    ...tests.map(t => ({
      type: 'Test',
      id: t.id,
      label: t.name,
      sub: t.category,
      route: '#tests',
    })),
    ...invoices.map(i => ({
      type: 'Invoice',
      id: i.id,
      label: i.invoiceNumber,
      sub: i.patientId,
      route: '#invoices',
    })),
    ...reports.map(r => ({
      type: 'Report',
      id: r.id,
      label: r.id,
      sub: r.patientId,
      route: '#reports',
    })),
  ];

  const filteredResults = searchTerm.length > 1
    ? allResults.filter(item =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.sub && item.sub.toLowerCase().includes(searchTerm.toLowerCase()))
      ).slice(0, 8)
    : [];

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Sidebar Toggle Button */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 lg:hidden"
            title="Toggle Sidebar"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            Laboratory Management System
          </h2>
          <div className="hidden md:flex items-center space-x-2">
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 dark:text-green-300 text-green-800 text-xs rounded-full">
              Online
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-300">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => { setSearchTerm(e.target.value); setShowResults(true); }}
              onFocus={() => { setShowResults(true); }}
              onBlur={() => setTimeout(() => { setShowResults(false); }, 200)}
              placeholder="Search patients, doctors, tests..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              autoComplete="off"
            />
            {showResults && filteredResults.length > 0 && (
              <div className="absolute left-0 mt-2 w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50 animate-fade-in">
                {filteredResults.map(item => (
                  <button
                    key={item.type + '-' + item.id}
                    onClick={() => { window.location.hash = item.route; setSearchTerm(''); setShowResults(false); }}
                    className="w-full text-left px-4 py-2 hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors flex items-center space-x-2"
                  >
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-300 uppercase">{item.type}</span>
                    <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
                    {item.sub && <span className="text-xs text-gray-500 dark:text-gray-300">{item.sub}</span>}
                  </button>
                ))}
                {filteredResults.length === 8 && (
                  <div className="px-4 py-2 text-xs text-gray-400">More results available...</div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 ml-4">
              <div className="w-8 h-8 bg-blue-600 dark:bg-blue-800 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-300 capitalize">{user?.role?.replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;