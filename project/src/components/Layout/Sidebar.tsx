import React, { useRef, useEffect, useState } from 'react';
import { 
  Home, 
  Users, 
  FileText, 
  Calendar, 
  Settings, 
  BarChart3, 
  Bell, 
  LogOut,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  User,
  Stethoscope,
  FileSpreadsheet,
  Receipt,
  Package,
  Archive,
  Users2,
  Info,
  HelpCircle,
  MessageSquare,
  BookOpen,
  Shield,
  FileCheck,
  FolderOpen,
  DollarSign,
  FileCode,
  Activity,
  ClipboardList
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSidebar } from '../../context/SidebarContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const { user, logout, hasPermission } = useAuth();
  const { isCollapsed, toggleSidebar } = useSidebar();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const updateScrollPosition = () => {
      if (scrollContainerRef.current) {
        setScrollPosition(scrollContainerRef.current.scrollTop);
      }
    };

    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', updateScrollPosition);
      updateScrollPosition(); // Set initial position
    }

    return () => {
      if (container) {
        container.removeEventListener('scroll', updateScrollPosition);
      }
    };
  }, []);

  const scrollUp = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollTop - 100,
        behavior: 'smooth'
      });
    }
  };

  const scrollDown = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollTop + 100,
        behavior: 'smooth'
      });
    }
  };

  const canScrollUp = scrollPosition > 0;
  const canScrollDown = scrollContainerRef.current && 
    scrollPosition < (scrollContainerRef.current.scrollHeight - scrollContainerRef.current.clientHeight);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home, permission: 'dashboard' },
    { id: 'patients', label: 'Patient Management', icon: Users, permission: 'patients' },
    { id: 'tests', label: 'Test Management', icon: FileText, permission: 'tests' },
    { id: 'test-reporting', label: 'Test Reporting', icon: FileCheck, permission: 'test-reporting' },
    { id: 'appointments', label: 'Appointments', icon: Calendar, permission: 'appointments' },
    { id: 'doctors', label: 'Doctor Management', icon: Stethoscope, permission: 'doctors' },
    { id: 'invoices', label: 'Invoice Management', icon: Receipt, permission: 'invoices' },
    { id: 'expenses', label: 'Expense Management', icon: DollarSign, permission: 'expenses' },
    { id: 'reports', label: 'Reports', icon: FileSpreadsheet, permission: 'reports' },
    { id: 'report-verification', label: 'Report Verification', icon: ClipboardList, permission: 'report-verification' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, permission: 'analytics' },
    { id: 'quality-control', label: 'Quality Control', icon: Shield, permission: 'quality-control' },
    { id: 'stock', label: 'Stock Management', icon: Package, permission: 'stock' },
    { id: 'rate-list', label: 'Rate List', icon: FileCode, permission: 'rate-list' },
    { id: 'templates', label: 'Templates', icon: FileCode, permission: 'templates' },
    { id: 'file-manager', label: 'File Manager', icon: FolderOpen, permission: 'file-manager' },
    { id: 'knowledge-hub', label: 'Knowledge Hub', icon: BookOpen, permission: 'knowledge-hub' },
    { id: 'diagnostic-knowledge-hub', label: 'Diagnostic Knowledge Hub', icon: BookOpen, permission: 'diagnostic-knowledge-hub' },
    { id: 'audit-logs', label: 'Audit Logs', icon: Activity, permission: 'audit-logs' },
    { id: 'notifications', label: 'Notifications', icon: Bell, permission: 'notifications' },
    { id: 'staff', label: 'Staff Management', icon: Users2, permission: 'staff' },
    { id: 'backup', label: 'Backup & Restore', icon: Archive, permission: 'backup' },
    { id: 'settings', label: 'Settings', icon: Settings, permission: 'settings' },
    { id: 'about', label: 'About LIMS', icon: Info, permission: 'about' },
    { id: 'help', label: 'Help & Support', icon: HelpCircle, permission: 'help' },
    { id: 'feedback', label: 'Feedback', icon: MessageSquare, permission: 'feedback' }
  ];

  const visibleItems = menuItems.filter(item => 
    hasPermission(item.permission, 'view') || user?.role === 'admin'
  );

  return (
    <div className={`bg-white dark:bg-gray-900 shadow-lg h-full border-r border-gray-200 dark:border-gray-800 flex flex-col transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Header with Logo and Toggle Button */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <img src="/rifah-logo.png" alt="Rifah Logo" className="w-8 h-8 rounded" />
            <span className="font-bold text-lg text-gray-800 dark:text-white">Rifah LIMS</span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 ${isCollapsed ? 'mx-auto' : ''}`}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Scrollable Navigation Area */}
      <div className={`flex-1 p-4 overflow-hidden relative sidebar-scroll-area ${isCollapsed ? 'px-2' : ''}`}>
        {/* Scroll Up Button - Only show when not collapsed */}
        {!isCollapsed && canScrollUp && (
          <button
            onClick={scrollUp}
            className="absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 z-20 border-2 border-white dark:border-gray-800 sidebar-scroll-button"
            title="Scroll up"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
        )}

        {/* Scrollable Content */}
        <div 
          className="overflow-y-auto scrollbar-none h-full pr-2"
          ref={scrollContainerRef}
        >
        <nav className="space-y-2">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200 hover:scale-[1.02] sidebar-item ${
                  activeTab === item.id
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-r-2 border-blue-600 dark:border-blue-400 shadow-sm'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-sm'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`}
                  title={isCollapsed ? item.label : undefined}
              >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium truncate">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>

        {/* Scroll Down Button - Only show when not collapsed */}
        {!isCollapsed && canScrollDown && (
          <button
            onClick={scrollDown}
            className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 z-20 border-2 border-white dark:border-gray-800 sidebar-scroll-button"
            title="Scroll down"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        )}

        {/* Scroll Indicator - Only show when not collapsed */}
        {!isCollapsed && (canScrollUp || canScrollDown) && (
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex flex-col space-y-2">
            <div className={`w-3 h-3 rounded-full transition-all duration-200 scroll-indicator-dot ${canScrollUp ? 'bg-blue-600 active' : 'bg-gray-300'}`}></div>
            <div className={`w-3 h-3 rounded-full transition-all duration-200 scroll-indicator-dot ${canScrollDown ? 'bg-blue-600 active' : 'bg-gray-300'}`}></div>
          </div>
        )}
      </div>

      {/* User Info and Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {!isCollapsed ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.role || 'Role'}
              </p>
            </div>
            <button
              onClick={logout}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
        </div>
        <button
          onClick={logout}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors duration-200"
              title="Logout"
        >
              <LogOut className="w-4 h-4" />
        </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;