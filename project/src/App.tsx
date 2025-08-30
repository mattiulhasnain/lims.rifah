import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { SecurityProvider } from './context/SecurityContext';
import { NotificationProvider } from './context/NotificationContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import Login from './components/Auth/Login';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import PatientManagement from './components/Patients/PatientManagement';
import DoctorManagement from './components/Doctors/DoctorManagement';
import TestManagement from './components/Tests/TestManagement';
import InvoiceManagement from './components/Invoices/InvoiceManagement';
import ReportManagement from './components/Reports/ReportManagement';
import TestReporting from './components/Tests/TestReporting';
import StockManagement from './components/Stock/StockManagement';
import ExpenseManagement from './components/Expenses/ExpenseManagement';
import Analytics from './components/Analytics/Analytics';
import StaffManagement from './components/Staff/StaffManagement';
import AuditLogs from './components/Audit/AuditLogs';
import Settings from './components/Settings/Settings';
import TemplateManagement from './components/Templates/TemplateManagement';
import AppointmentManagement from './components/Appointments/AppointmentManagement';
import QualityControl from './components/QualityControl/QualityControl';
import BackupManagement from './components/Backup/BackupManagement';
import FileManager from './components/FileManager/FileManager';
import NotificationCenter from './components/Notifications/NotificationCenter';
import RateListManagement from './components/RateList/RateListManagement';
import ReportVerification from './components/Reports/ReportVerification';
import KnowledgeHub from './components/KnowledgeHub/KnowledgeHub';
import DiagnosticKnowledgeHub from './components/KnowledgeHub/DiagnosticKnowledgeHub';
import AboutLIMS from './components/About/AboutLIMS';
import HelpSupport from './components/Help/HelpSupport';
import CollectionCenterManagement from './components/CollectionCenter/CollectionCenterManagement';
import AIFeedback from './components/AI/AIFeedback';

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();
  const { isCollapsed } = useSidebar();
  const [activeTab, setActiveTab] = useState('dashboard');

  const getTabFromHash = () => {
    const hash = window.location.hash.slice(1);
    return hash || 'dashboard';
  };

  useEffect(() => {
    setActiveTab(getTabFromHash());
    const onHashChange = () => {
      setActiveTab(getTabFromHash());
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // Check session timeout
  useEffect(() => {
    if (!user) return;

    const checkSessionTimeout = () => {
      const securitySettings = localStorage.getItem('lab_security_settings');
      if (securitySettings) {
        try {
          const parsedSettings = JSON.parse(securitySettings);
          const lastActivity = localStorage.getItem('lab_last_activity');
          if (lastActivity) {
            const lastActivityTime = new Date(lastActivity).getTime();
            const currentTime = new Date().getTime();
            const timeoutMs = parsedSettings.sessionTimeout * 60 * 1000; // Convert minutes to milliseconds

            if ((currentTime - lastActivityTime) > timeoutMs) {
              alert('Session expired due to inactivity. Please log in again.');
              logout();
            }
          }
        } catch {
          // If security settings can't be parsed, ignore
        }
      }
    };

    // Check every minute
    const interval = setInterval(checkSessionTimeout, 60000);
    
    // Update last activity on user interaction
    const updateActivity = () => {
      localStorage.setItem('lab_last_activity', new Date().toISOString());
    };

    window.addEventListener('mousedown', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('scroll', updateActivity);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('scroll', updateActivity);
    };
  }, [user, logout]);

  if (!user) {
    return <Login />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <PatientManagement />;
      case 'doctors':
        return <DoctorManagement />;
      case 'tests':
        return <TestManagement />;
      case 'test-reporting':
        return <TestReporting />;
      case 'appointments':
        return <AppointmentManagement />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'expenses':
        return <ExpenseManagement />;
      case 'reports':
        return <ReportManagement />;
      case 'report-verification':
        return <ReportVerification />;
      case 'ai-feedback':
        return <AIFeedback />;
      case 'analytics':
        return <Analytics />;
      case 'quality-control':
        return <QualityControl />;
      case 'stock':
        return <StockManagement />;
      case 'rate-list':
        return <RateListManagement />;
      case 'templates':
        return <TemplateManagement />;
      case 'file-manager':
        return <FileManager />;
      case 'knowledge-hub':
        return <KnowledgeHub />;
      case 'diagnostic-knowledge-hub':
        return <DiagnosticKnowledgeHub />;
      case 'audit-logs':
        return <AuditLogs />;
      case 'notifications':
        return <NotificationCenter />;
      case 'staff':
        return <StaffManagement />;
      case 'backup':
        return <BackupManagement />;
      case 'settings':
        return <Settings />;
      case 'about':
        return <AboutLIMS />;
      case 'collection-centers':
        return <CollectionCenterManagement />;
      case 'help':
        return <HelpSupport />;
      case 'feedback':
        return <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Feedback</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Share Your Feedback</h2>
            <p className="text-gray-600 mb-4">We value your input to improve our system.</p>
            <div className="space-y-2">
              <p><strong>Email:</strong> feedback@rifah.com</p>
              <p><strong>Online Form:</strong> Coming Soon</p>
            </div>
          </div>
        </div>;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={tab => {
        setActiveTab(tab);
        window.location.hash = '#' + tab;
      }} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'ml-0' : ''}`}>
        <Header />
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <SecurityProvider>
            <NotificationProvider>
              <DatabaseProvider>
                <SidebarProvider>
          <AppContent />
                </SidebarProvider>
              </DatabaseProvider>
            </NotificationProvider>
          </SecurityProvider>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;