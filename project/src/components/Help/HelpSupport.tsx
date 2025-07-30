import React, { useState, useEffect } from 'react';
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  FileText, 
  Video, 
  Search, 
  ChevronDown, 
  ChevronUp,
  Download,
  BookOpen,
  HelpCircle,
  Clock,
  MapPin,
  CheckCircle,
  AlertCircle,
  Info,
  Play,
  X,
  Plus,
  Edit
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
  helpful: number;
  notHelpful: number;
}

interface SupportTicket {
  id: string;
  title: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  createdAt: string;
  updatedAt: string;
  assignedTo?: string;
  attachments?: string[];
  comments?: TicketComment[];
}

interface TicketComment {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  isStaff: boolean;
}

interface UserGuide {
  id: string;
  title: string;
  description: string;
  category: string;
  fileUrl: string;
  videoUrl?: string;
  lastUpdated: string;
  downloadCount: number;
}

const HelpSupport: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [showTicketDetail, setShowTicketDetail] = useState<string | null>(null);
  const [ticketForm, setTicketForm] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
    category: 'general'
  });
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [guides, setGuides] = useState<UserGuide[]>([]);

  const [showVideoModal, setShowVideoModal] = useState(false);
  const [currentVideo, setCurrentVideo] = useState('');

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTickets = localStorage.getItem('rifah_support_tickets');
    if (savedTickets) {
      setTickets(JSON.parse(savedTickets));
    }

    const savedGuides = localStorage.getItem('rifah_user_guides');
    if (savedGuides) {
      setGuides(JSON.parse(savedGuides));
    } else {
      // Initialize with default guides
      const defaultGuides: UserGuide[] = [
        {
          id: 'guide-1',
          title: 'Getting Started with Rifah LIMS',
          description: 'Complete guide for new users to set up and start using the LIMS system',
          category: 'Getting Started',
          fileUrl: '/guides/getting-started.pdf',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          lastUpdated: '2024-01-15',
          downloadCount: 245
        },
        {
          id: 'guide-2',
          title: 'Patient Management Complete Guide',
          description: 'Learn how to add, edit, and manage patient information effectively',
          category: 'Patient Management',
          fileUrl: '/guides/patient-management.pdf',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          lastUpdated: '2024-01-10',
          downloadCount: 189
        },
        {
          id: 'guide-3',
          title: 'Test Management & Reporting',
          description: 'Comprehensive guide for managing tests and generating reports',
          category: 'Test Management',
          fileUrl: '/guides/test-management.pdf',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          lastUpdated: '2024-01-12',
          downloadCount: 156
        },
        {
          id: 'guide-4',
          title: 'Quality Control Procedures',
          description: 'Standard operating procedures for quality control and assurance',
          category: 'Quality Control',
          fileUrl: '/guides/quality-control.pdf',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          lastUpdated: '2024-01-08',
          downloadCount: 98
        },
        {
          id: 'guide-5',
          title: 'System Administration Guide',
          description: 'Advanced guide for system administrators and IT staff',
          category: 'Administration',
          fileUrl: '/guides/system-admin.pdf',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          lastUpdated: '2024-01-05',
          downloadCount: 67
        },
        {
          id: 'guide-6',
          title: 'Billing & Invoice Management',
          description: 'Complete guide for managing billing, rates, and invoice generation',
          category: 'Billing',
          fileUrl: '/guides/billing-guide.pdf',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          lastUpdated: '2024-01-03',
          downloadCount: 134
        }
      ];
      setGuides(defaultGuides);
      localStorage.setItem('rifah_user_guides', JSON.stringify(defaultGuides));
    }
  }, []);

  const faqData: FAQItem[] = [
    {
      id: 'faq-1',
      question: "How do I add a new patient to the system?",
      answer: "Navigate to Patient Management → Click 'Add New Patient' → Fill in the required information including name, contact details, and medical history → Click 'Save'. All patient data will be securely stored and encrypted in the system. You can also import patient data from CSV files for bulk additions.",
      category: "patients",
      tags: ["patient", "add", "import"],
      helpful: 45,
      notHelpful: 2
    },
    {
      id: 'faq-2',
      question: "How can I generate and export test reports?",
      answer: "Go to Test Management → Select the specific test → Click 'Generate Report' → Choose your preferred format (PDF, Excel, or Word) → Customize the report template if needed → Click 'Export'. Reports can be automatically emailed to patients or doctors, and you can schedule regular report generation.",
      category: "reports",
      tags: ["report", "export", "pdf", "email"],
      helpful: 67,
      notHelpful: 1
    },
    {
      id: 'faq-3',
      question: "How do I schedule and manage appointments?",
      answer: "Access the Appointments section → Click 'Schedule Appointment' → Select patient and doctor → Choose date and time from the calendar → Add any special notes or requirements → Confirm booking. You can also set up recurring appointments and send automated reminders via SMS or email.",
      category: "appointments",
      tags: ["appointment", "schedule", "calendar", "reminder"],
      helpful: 34,
      notHelpful: 3
    },
    {
      id: 'faq-4',
      question: "How to update test rates and pricing?",
      answer: "Navigate to Rate List Management → Select the specific test → Click 'Edit' → Update the price and any additional charges → Set effective dates → Save changes. You can also bulk update rates for multiple tests and set up seasonal pricing or discounts for regular patients.",
      category: "rates",
      tags: ["rates", "pricing", "bulk", "discount"],
      helpful: 28,
      notHelpful: 4
    },
    {
      id: 'faq-5',
      question: "How do I backup and restore my data?",
      answer: "Go to Backup & Restore → Click 'Create Backup' → Choose backup location (local or cloud) → Select data to include → Set encryption password → Confirm backup. For restoration, select the backup file → Choose restore options → Confirm. Regular automated backups are recommended for data safety.",
      category: "backup",
      tags: ["backup", "restore", "cloud", "encryption"],
      helpful: 56,
      notHelpful: 2
    },
    {
      id: 'faq-6',
      question: "How to access and use the Knowledge Hub?",
      answer: "Click on Knowledge Hub in the sidebar → Browse diagnostic information by category → Use the search function to find specific topics → Access clinical guidelines and protocols → Download reference materials. The Knowledge Hub is regularly updated with the latest medical information and best practices.",
      category: "knowledge",
      tags: ["knowledge", "diagnostic", "guidelines", "reference"],
      helpful: 23,
      notHelpful: 1
    },
    {
      id: 'faq-7',
      question: "How do I set up and monitor quality control?",
      answer: "Navigate to Quality Control → Set up QC parameters for each test → Define acceptable ranges → Schedule regular QC testing → Monitor QC charts and trends → Review QC reports → Take corrective actions when QC fails. The system will automatically alert you to any QC issues.",
      category: "quality",
      tags: ["quality", "qc", "monitoring", "alerts"],
      helpful: 41,
      notHelpful: 3
    },
    {
      id: 'faq-8',
      question: "How to generate and manage invoices?",
      answer: "Go to Invoice Management → Click 'Create Invoice' → Select patient and tests performed → Add any additional charges or discounts → Review the invoice → Generate and send via email or print. You can also set up automatic invoice generation and payment tracking.",
      category: "invoices",
      tags: ["invoice", "billing", "payment", "email"],
      helpful: 39,
      notHelpful: 2
    },
    {
      id: 'faq-9',
      question: "How do I manage user permissions and roles?",
      answer: "Access Staff Management → Select the user → Click 'Edit Permissions' → Assign appropriate roles (Admin, Doctor, Technician, Receptionist) → Set specific permissions for each module → Save changes. You can also create custom roles with specific permission sets.",
      category: "staff",
      tags: ["permissions", "roles", "security", "access"],
      helpful: 31,
      notHelpful: 1
    },
    {
      id: 'faq-10',
      question: "How to troubleshoot system performance issues?",
      answer: "Check the System Status dashboard → Review error logs → Clear browser cache → Restart the application → Contact support if issues persist. For critical issues, use the emergency contact number. Regular system maintenance is recommended for optimal performance.",
      category: "technical",
      tags: ["troubleshoot", "performance", "logs", "maintenance"],
      helpful: 52,
      notHelpful: 5
    }
  ];

  const filteredFAQ = faqData.filter(item => {
    const matchesSearch = item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket: SupportTicket = {
      id: `TKT-${Date.now()}`,
      title: ticketForm.title,
      description: ticketForm.description,
      status: 'open',
      priority: ticketForm.priority,
      category: ticketForm.category,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: []
    };
    
    const updatedTickets = [...tickets, newTicket];
    setTickets(updatedTickets);
    localStorage.setItem('rifah_support_tickets', JSON.stringify(updatedTickets));
    
    alert('Support ticket submitted successfully! Ticket ID: ' + newTicket.id);
    setShowTicketForm(false);
    setTicketForm({ title: '', description: '', priority: 'medium', category: 'general' });
  };

  const handleDownloadGuide = (guide: UserGuide) => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = guide.fileUrl;
    link.download = `${guide.title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Update download count
    const updatedGuides = guides.map(g => 
      g.id === guide.id ? { ...g, downloadCount: g.downloadCount + 1 } : g
    );
    setGuides(updatedGuides);
    localStorage.setItem('rifah_user_guides', JSON.stringify(updatedGuides));
  };

  const handleWatchVideo = (guide: UserGuide) => {
    if (guide.videoUrl) {
      setCurrentVideo(guide.videoUrl);
      setShowVideoModal(true);
    }
  };

  const handleHelpfulVote = (faqId: string, isHelpful: boolean) => {
    // In a real app, this would update the database
    console.log(`Voted ${isHelpful ? 'helpful' : 'not helpful'} for FAQ ${faqId}`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'text-yellow-600 bg-yellow-100';
      case 'in-progress': return 'text-blue-600 bg-blue-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'closed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'critical': return '🔴';
      case 'high': return '🟠';
      case 'medium': return '🟡';
      case 'low': return '🟢';
      default: return '⚪';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <HelpCircle className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
              <p className="text-gray-600">Get assistance with Rifah LIMS system</p>
            </div>
          </div>
          
          {/* Quick Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-3">
                <Phone className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold text-blue-900">Phone Support</h3>
                  <p className="text-blue-700">+92-300-1234567</p>
                  <p className="text-blue-600 text-sm">24/7 Emergency</p>
                </div>
              </div>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4 border border-green-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-3">
                <Mail className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold text-green-900">Email Support</h3>
                  <p className="text-green-700">support@rifah.com</p>
                  <p className="text-green-600 text-sm">Response within 2 hours</p>
                </div>
              </div>
            </div>
            
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center space-x-3">
                <Clock className="w-6 h-6 text-purple-600" />
                <div>
                  <h3 className="font-semibold text-purple-900">Support Hours</h3>
                  <p className="text-purple-700">Mon-Fri: 9:00 AM - 6:00 PM</p>
                  <p className="text-purple-600 text-sm">Sat: 9:00 AM - 2:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {[
                { id: 'overview', label: 'Overview', icon: Info },
                { id: 'faq', label: 'FAQ', icon: HelpCircle },
                { id: 'guides', label: 'User Guides', icon: BookOpen },
                { id: 'tickets', label: 'Support Tickets', icon: MessageCircle },
                { id: 'contact', label: 'Contact Us', icon: Phone }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Getting Started</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Complete your profile setup</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Add your first patient</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Configure test parameters</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Set up billing rates</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-green-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button 
                      onClick={() => setActiveTab('guides')}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <FileText className="w-4 h-4" />
                      <span>Download User Manual</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('guides')}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <Video className="w-4 h-4" />
                      <span>Watch Tutorial Videos</span>
                    </button>
                    <button 
                      onClick={() => setShowTicketForm(true)}
                      className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center space-x-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Submit Support Ticket</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-6 h-6 text-yellow-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-yellow-900">Important Notice</h4>
                    <p className="text-yellow-800 mt-1">
                      For urgent technical issues, please contact our support team directly via phone. 
                      For non-urgent matters, email support is available 24/7.
                    </p>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">System Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium">All Systems Operational</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium">Database: Online</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 font-medium">Backup: Last 2 hours ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-6">
              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search FAQ..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  <option value="patients">Patients</option>
                  <option value="reports">Reports</option>
                  <option value="appointments">Appointments</option>
                  <option value="rates">Rates</option>
                  <option value="backup">Backup</option>
                  <option value="knowledge">Knowledge Hub</option>
                  <option value="quality">Quality Control</option>
                  <option value="invoices">Invoices</option>
                  <option value="staff">Staff Management</option>
                  <option value="technical">Technical</option>
                </select>
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {filteredFAQ.map((item, index) => (
                  <div key={item.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex-1 text-left">
                        <span className="font-medium text-gray-900">{item.question}</span>
                        <div className="flex items-center space-x-2 mt-1">
                          {item.tags.map((tag, tagIndex) => (
                            <span key={tagIndex} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      {expandedFAQ === index ? (
                        <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                      )}
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-6 pb-4">
                        <p className="text-gray-600 leading-relaxed mb-4">{item.answer}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span>Was this helpful?</span>
                            <button 
                              onClick={() => handleHelpfulVote(item.id, true)}
                              className="flex items-center space-x-1 text-green-600 hover:text-green-700"
                            >
                              <CheckCircle className="w-4 h-4" />
                              <span>Yes ({item.helpful})</span>
                            </button>
                            <button 
                              onClick={() => handleHelpfulVote(item.id, false)}
                              className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                            >
                              <X className="w-4 h-4" />
                              <span>No ({item.notHelpful})</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'guides' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {guides.map((guide) => (
                  <div key={guide.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-blue-600" />
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {guide.category}
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">{guide.title}</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {guide.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <span>Downloads: {guide.downloadCount}</span>
                      <span>Updated: {new Date(guide.lastUpdated).toLocaleDateString()}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleDownloadGuide(guide)}
                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download PDF</span>
                      </button>
                      {guide.videoUrl && (
                        <button 
                          onClick={() => handleWatchVideo(guide)}
                          className="flex items-center space-x-2 text-green-600 hover:text-green-700 text-sm font-medium"
                        >
                          <Play className="w-4 h-4" />
                          <span>Watch Video</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">Support Tickets</h3>
                <button
                  onClick={() => setShowTicketForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>New Ticket</span>
                </button>
              </div>

              <div className="space-y-4">
                {tickets.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
                    <p className="text-gray-600 mb-4">Create your first support ticket to get help</p>
                    <button
                      onClick={() => setShowTicketForm(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      Create First Ticket
                    </button>
                  </div>
                ) : (
                  tickets.map((ticket) => (
                    <div key={ticket.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{ticket.title}</h4>
                          <p className="text-gray-600 text-sm mt-1">{ticket.description}</p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {getPriorityIcon(ticket.priority)} {ticket.priority}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>Ticket ID: {ticket.id}</span>
                        <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex space-x-2 mt-3">
                        <button 
                          onClick={() => setShowTicketDetail(ticket.id)}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details
                        </button>
                        <button className="text-gray-600 hover:text-gray-700 text-sm font-medium">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-gray-900">Contact Information</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">Phone Support</p>
                        <p className="text-gray-600">+92-300-1234567</p>
                        <p className="text-blue-600 text-sm">24/7 Emergency Support</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                      <Mail className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-gray-900">Email Support</p>
                        <p className="text-gray-600">support@rifah.com</p>
                        <p className="text-green-600 text-sm">Response within 2 hours</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium text-gray-900">Support Hours</p>
                        <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM</p>
                        <p className="text-purple-600 text-sm">Saturday: 9:00 AM - 2:00 PM</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3 p-4 bg-red-50 rounded-lg">
                      <MapPin className="w-5 h-5 text-red-600" />
                      <div>
                        <p className="font-medium text-gray-900">Office Address</p>
                        <p className="text-gray-600">Rifah Laboratory</p>
                        <p className="text-red-600 text-sm">Lahore, Pakistan</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                  <div className="space-y-3">
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h4 className="font-semibold text-red-900">Critical System Issues</h4>
                      <p className="text-red-700 text-sm mt-1">For urgent technical problems affecting system operation</p>
                      <p className="text-red-600 font-medium mt-2">+92-300-1234567 (24/7)</p>
                    </div>
                    
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <h4 className="font-semibold text-yellow-900">Data Recovery</h4>
                      <p className="text-yellow-700 text-sm mt-1">For data loss or backup restoration issues</p>
                      <p className="text-yellow-600 font-medium mt-2">support@rifah.com</p>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="font-semibold text-blue-900">Feature Requests</h4>
                      <p className="text-blue-700 text-sm mt-1">Suggest new features or improvements</p>
                      <p className="text-blue-600 font-medium mt-2">feedback@rifah.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Support Ticket Modal */}
        {showTicketForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Submit Support Ticket</h3>
                <button
                  onClick={() => setShowTicketForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <form onSubmit={handleSubmitTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input
                    type="text"
                    value={ticketForm.title}
                    onChange={(e) => setTicketForm({...ticketForm, title: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Brief description of your issue"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                  <textarea
                    value={ticketForm.description}
                    onChange={(e) => setTicketForm({...ticketForm, description: e.target.value})}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                    placeholder="Please provide detailed information about your issue..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority *</label>
                  <select
                    value={ticketForm.priority}
                    onChange={(e) => setTicketForm({...ticketForm, priority: e.target.value as 'low' | 'medium' | 'high' | 'critical'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="low">Low - General inquiry</option>
                    <option value="medium">Medium - Minor issue</option>
                    <option value="high">High - Important issue</option>
                    <option value="critical">Critical - System down</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select
                    value={ticketForm.category}
                    onChange={(e) => setTicketForm({...ticketForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="general">General</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing & Payment</option>
                    <option value="feature">Feature Request</option>
                    <option value="bug">Bug Report</option>
                    <option value="training">Training Request</option>
                  </select>
                </div>
                
                <div className="flex space-x-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    Submit Ticket
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowTicketForm(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Video Modal */}
        {showVideoModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-4xl mx-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900">Tutorial Video</h3>
                <button
                  onClick={() => setShowVideoModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="aspect-video">
                <iframe
                  src={currentVideo}
                  title="Tutorial Video"
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HelpSupport; 