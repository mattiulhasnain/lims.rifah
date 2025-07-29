import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, Search, Eye, Download,
  FileText, User, Calendar, TestTube, CheckCircle,
  Clock, AlertTriangle, Lock, Printer
} from 'lucide-react';
// 1. Import new types
import { Report, ReportTest, Invoice } from '../../types';
import { createReportPDF, exportReportsToExcel } from '../../utils/pdfGenerator';

const ReportManagement: React.FC = () => {
  const { reports, patients, doctors, tests, invoices, addReport, updateReport, recordPayment } = useData();
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReport, setEditingReport] = useState<Report | null>(null);
  const [viewingReport, setViewingReport] = useState<Report | null>(null);
  const [formData, setFormData] = useState({
    invoiceId: '',
    patientId: '',
    doctorId: '',
    tests: [] as ReportTest[],
    interpretation: '',
    criticalValues: false
  });
  // 2. Add state for comments, attachments, bulk selection, and export
  const [selectedReports, setSelectedReports] = useState<string[]>([]);
  const [commentText, setCommentText] = useState('');
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [paymentData, setPaymentData] = useState<{ amount: number; method: string; note: string }>({ amount: 0, method: 'cash', note: '' });

  const openPaymentModal = (invoice: Invoice) => {
    setPaymentInvoice(invoice);
    setPaymentData({ amount: invoice.finalAmount - (invoice.amountPaid || 0), method: 'cash', note: '' });
    setShowPaymentModal(true);
  };
  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentInvoice(null);
    setPaymentData({ amount: 0, method: 'cash', note: '' });
  };
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentInvoice) return;
    recordPayment(paymentInvoice.id, {
      amount: paymentData.amount,
      date: new Date(),
      method: paymentData.method,
      receivedBy: user?.name || 'System',
      note: paymentData.note
    });
    closePaymentModal();
  };

  const filteredReports = reports.filter(report => {
    const patient = patients.find(p => p.id === report.patientId);
    const doctor = doctors.find(d => d.id === report.doctorId);
    const matchesSearch = (
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reportData = {
      ...formData,
      status: 'pending' as const,
      createdBy: user?.id || ''
    };

    if (editingReport) {
      updateReport(editingReport.id, reportData);
      setEditingReport(null);
    } else {
      addReport(reportData);
    }
    
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      invoiceId: '',
      patientId: '',
      doctorId: '',
      tests: [],
      interpretation: '',
      criticalValues: false
    });
  };

  const updateReportTest = (index: number, field: keyof ReportTest, value: string | number | boolean) => {
    const updatedTests = [...formData.tests];
    updatedTests[index] = { ...updatedTests[index], [field]: value };
    setFormData({ ...formData, tests: updatedTests });
  };

  const addTestResult = () => {
    setFormData({
      ...formData,
      tests: [...formData.tests, {
        testId: '',
        testName: '',
        result: '',
        normalRange: '',
        isAbnormal: false,
        unit: ''
      }]
    });
  };

  const removeTestResult = (index: number) => {
    const updatedTests = formData.tests.filter((_, i) => i !== index);
    setFormData({ ...formData, tests: updatedTests });
  };

  const updateReportStatus = (reportId: string, newStatus: Report['status']) => {
    if (!hasPermission('reports', 'edit')) {
      alert('You do not have permission to update report status.');
      return;
    }
    
    const updateData: Partial<Report> = { status: newStatus };
    
    if (newStatus === 'verified') {
      updateData.verifiedBy = user?.id;
      updateData.verifiedAt = new Date();
    }
    
    updateReport(reportId, updateData);
  };

  const generateReportPDF = async (report: Report) => {
    const patient = patients.find(p => p.id === report.patientId);
    const doctor = doctors.find(d => d.id === report.doctorId);
    
    if (!patient || !doctor) {
      alert('Patient or doctor information not found');
      return;
    }

    const reportData = {
      reportId: report.id,
      patientName: patient.name,
      patientAge: patient.age,
      patientGender: patient.gender,
      patientContact: patient.contact,
      doctorName: doctor.name,
      tests: report.tests,
      interpretation: report.interpretation,
      criticalValues: report.criticalValues,
      verifiedBy: report.verifiedBy,
      verifiedAt: report.verifiedAt
    };

    try {
      await createReportPDF(reportData);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      case 'in_progress': return <TestTube className="w-4 h-4 text-blue-600" />;
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'verified': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'locked': return <Lock className="w-4 h-4 text-red-600" />;
      default: return <FileText className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'verified': return 'bg-green-100 text-green-800';
      case 'locked': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Replace export logic placeholders with stubs
  const handleExportPDF = () => {
    if (selectedReports.length > 0) {
      selectedReports.forEach(id => {
        const report = reports.find(r => r.id === id);
        if (report) {
          const patient = patients.find(p => p.id === report.patientId);
          const doctor = doctors.find(d => d.id === report.doctorId);
          createReportPDF({
            reportId: report.id,
            patientName: patient?.name || '',
            patientAge: patient?.age || '',
            patientGender: patient?.gender || '',
            patientContact: patient?.contact || '',
            doctorName: doctor?.name || '',
            tests: report.tests,
            interpretation: report.interpretation,
            criticalValues: report.criticalValues,
            verifiedBy: report.verifiedBy,
            verifiedAt: report.verifiedAt
          });
        }
      });
    } else {
      // Export all
      reports.forEach(report => {
        const patient = patients.find(p => p.id === report.patientId);
        const doctor = doctors.find(d => d.id === report.doctorId);
        createReportPDF({
          reportId: report.id,
          patientName: patient?.name || '',
          patientAge: patient?.age || '',
          patientGender: patient?.gender || '',
          patientContact: patient?.contact || '',
          doctorName: doctor?.name || '',
          tests: report.tests,
          interpretation: report.interpretation,
          criticalValues: report.criticalValues,
          verifiedBy: report.verifiedBy,
          verifiedAt: report.verifiedAt
        });
      });
    }
  };
  const handleExportExcel = () => {
    if (selectedReports.length > 0) {
      exportReportsToExcel(reports.filter(r => selectedReports.includes(r.id)), patients, doctors);
    } else {
      exportReportsToExcel(reports, patients, doctors);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Report Management</h1>
          <p className="text-gray-600">Manage laboratory test reports and results</p>
        </div>
        {hasPermission('reports', 'create') && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Report</span>
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
              placeholder="Search reports by patient or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="verified">Verified</option>
            <option value="locked">Locked</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Report Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingReport ? 'Edit Report' : 'Create New Report'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice *
                  </label>
                  <select
                    required
                    value={formData.invoiceId}
                    onChange={(e) => {
                      const selectedInvoice = invoices.find(inv => inv.id === e.target.value);
                      if (selectedInvoice) {
                        setFormData({
                          ...formData,
                          invoiceId: e.target.value,
                          patientId: selectedInvoice.patientId,
                          doctorId: selectedInvoice.doctorId,
                          tests: selectedInvoice.tests.map(test => ({
                            testId: test.testId,
                            testName: test.testName,
                            result: '',
                            normalRange: '',
                            isAbnormal: false,
                            unit: ''
                          }))
                        });
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Invoice</option>
                    {invoices.filter(inv => inv.status === 'finalized' || inv.status === 'paid').map(invoice => (
                      <option key={invoice.id} value={invoice.id}>
                        {invoice.invoiceNumber}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient
                  </label>
                  <input
                    type="text"
                    value={patients.find(p => p.id === formData.patientId)?.name || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Doctor
                  </label>
                  <input
                    type="text"
                    value={doctors.find(d => d.id === formData.doctorId)?.name || ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                  />
                </div>
              </div>

              {/* Test Results Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Test Results
                  </label>
                  <button
                    type="button"
                    onClick={addTestResult}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Add Test Result
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.tests.map((test, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-6 gap-3 p-3 border border-gray-200 rounded-lg">
                      <div>
                        <select
                          value={test.testId}
                          onChange={(e) => {
                            const selectedTest = tests.find(t => t.id === e.target.value);
                            updateReportTest(index, 'testId', e.target.value);
                            if (selectedTest) {
                              updateReportTest(index, 'testName', selectedTest.name);
                              updateReportTest(index, 'normalRange', selectedTest.referenceRange || '');
                              updateReportTest(index, 'unit', selectedTest.unit || '');
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Select Test</option>
                          {tests.filter(t => t.isActive).map(availableTest => (
                            <option key={availableTest.id} value={availableTest.id}>
                              {availableTest.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Result"
                          value={test.result}
                          onChange={(e) => updateReportTest(index, 'result', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Unit"
                          value={test.unit}
                          onChange={(e) => updateReportTest(index, 'unit', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="text"
                          placeholder="Normal Range"
                          value={test.normalRange}
                          onChange={(e) => updateReportTest(index, 'normalRange', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          checked={test.isAbnormal}
                          onChange={(e) => updateReportTest(index, 'isAbnormal', e.target.checked)}
                          className="mr-2"
                        />
                        <label className="text-sm text-gray-700">Abnormal</label>
                      </div>
                      <div className="flex items-center">
                        <button
                          type="button"
                          onClick={() => removeTestResult(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Interpretation
                </label>
                <textarea
                  value={formData.interpretation}
                  onChange={(e) => setFormData({...formData, interpretation: e.target.value})}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter clinical interpretation and recommendations..."
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.criticalValues}
                  onChange={(e) => setFormData({...formData, criticalValues: e.target.checked})}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Contains Critical Values
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingReport(null);
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
                  {editingReport ? 'Update' : 'Create'} Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report View Modal */}
      {viewingReport && (() => {
        const invoice = invoices.find(inv => inv.id === viewingReport.invoiceId);
        const isDue = invoice && invoice.finalAmount > (invoice.amountPaid || 0);
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Report Details</h2>
                <button onClick={() => setViewingReport(null)} className="text-gray-500 hover:text-gray-700">×</button>
              </div>
              <div className="space-y-4">
                {/* Invoice Status and Due Payment */}
                {invoice && (
                  <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-between">
                    <div>
                      <span className="font-semibold">Invoice Status:</span> <span className={`px-2 py-1 rounded-full text-sm font-semibold ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800 animate-pulse'}`}>{invoice.status.toUpperCase()}</span>
                      <span className="ml-4 font-semibold">Due Amount:</span> <span className="text-red-600 font-bold">PKR {(invoice.finalAmount - (invoice.amountPaid || 0)).toLocaleString()}</span>
                    </div>
                    {isDue && (
                      <button onClick={() => openPaymentModal(invoice)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 animate-bounce ml-4">Record Payment</button>
                    )}
                  </div>
                )}
                {/* Print/Export Buttons */}
                <div className="flex gap-2">
                  <button onClick={() => generateReportPDF(viewingReport)} disabled={isDue} className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${isDue ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700'}`}> <Printer className="w-4 h-4" /> <span>Print PDF</span></button>
                  <button onClick={handleExportExcel} disabled={isDue} className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${isDue ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}> <Download className="w-4 h-4" /> <span>Export Excel</span></button>
                  {isDue && <span className="text-red-600 font-semibold ml-2">Clear due to enable printing/export</span>}
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl shadow p-4 mb-4 border border-blue-100">
                  <h3 className="font-poppins text-lg font-bold text-blue-700 mb-2 flex items-center"><User className="w-5 h-5 mr-2 text-blue-400" />Patient Details</h3>
                  <div className="grid grid-cols-2 gap-2 text-inter text-sm">
                    <div><span className="font-semibold">Name:</span> {patients.find(p => p.id === viewingReport.patientId)?.name}</div>
                    <div><span className="font-semibold">ID:</span> <span className="font-sourcecodepro">{patients.find(p => p.id === viewingReport.patientId)?.patientId}</span></div>
                    <div><span className="font-semibold">Age:</span> {patients.find(p => p.id === viewingReport.patientId)?.age}</div>
                    <div><span className="font-semibold">Gender:</span> {patients.find(p => p.id === viewingReport.patientId)?.gender}</div>
                    <div><span className="font-semibold">Contact:</span> {patients.find(p => p.id === viewingReport.patientId)?.contact}</div>
                    <div><span className="font-semibold">Address:</span> {patients.find(p => p.id === viewingReport.patientId)?.address}</div>
                    {patients.find(p => p.id === viewingReport.patientId)?.cnic && <div><span className="font-semibold">CNIC:</span> {patients.find(p => p.id === viewingReport.patientId)?.cnic}</div>}
                    {patients.find(p => p.id === viewingReport.patientId)?.bloodGroup && <div><span className="font-semibold">Blood Group:</span> {patients.find(p => p.id === viewingReport.patientId)?.bloodGroup}</div>}
                    {patients.find(p => p.id === viewingReport.patientId)?.allergies && <div><span className="font-semibold">Allergies:</span> {patients.find(p => p.id === viewingReport.patientId)?.allergies}</div>}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Status Timeline</p>
                  <ol className="border-l-2 border-blue-500 pl-4">
                    {viewingReport.statusHistory.map((h, idx) => (
                      <li key={idx} className="mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(h.status)}`}>{h.status}</span>
                        <span className="ml-2 text-xs text-gray-500">{new Date(h.changedAt).toLocaleString()} by {h.changedBy}</span>
                      </li>
                    ))}
                  </ol>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Test Results</p>
                  <table className="w-full">
                    <thead><tr><th>Test</th><th>Result</th><th>Normal Range</th><th>Unit</th></tr></thead>
                    <tbody>
                      {viewingReport.tests.map((t, idx) => (
                        <tr key={idx} className={t.isAbnormal ? 'bg-red-100 animate-pulse' : ''}>
                          <td>{t.testName}</td>
                          <td className={t.isAbnormal ? 'text-red-700 font-bold' : ''}>{t.result}</td>
                          <td>{t.normalRange}</td>
                          <td>{t.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
            </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Comments</p>
                  <ul className="space-y-1 text-sm">
                    {viewingReport.comments.map((c, idx) => (
                      <li key={idx}><span className="font-semibold">{c.userId}</span>: {c.comment} <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span></li>
                    ))}
                  </ul>
                  <form onSubmit={e => { e.preventDefault(); if (commentText) { /* addReportComment */ setCommentText(''); }}} className="flex gap-2 mt-2">
                    <input type="text" value={commentText} onChange={e => setCommentText(e.target.value)} className="flex-1 px-2 py-1 border rounded" placeholder="Add a comment..." />
                    <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Send</button>
                  </form>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Attachments</p>
                  <ul className="space-y-1 text-sm">
                    {viewingReport.attachments.map((a, idx) => (
                      <li key={idx}><a href={a} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Attachment {idx+1}</a></li>
                    ))}
                  </ul>
                  <form onSubmit={e => { e.preventDefault(); if (attachmentFiles.length > 0) { /* handle upload and addReportAttachment */ setAttachmentFiles([]); }}} className="flex gap-2 mt-2">
                    <input type="file" multiple onChange={e => setAttachmentFiles(Array.from(e.target.files || []))} className="flex-1" />
                    <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Upload</button>
                  </form>
                </div>
                {invoice && (
                  <div className="bg-gradient-to-r from-blue-50 to-white rounded-xl shadow p-4 mt-4 border border-blue-100">
                    <h3 className="font-poppins text-lg font-bold text-blue-700 mb-2 flex items-center"><FileText className="w-5 h-5 mr-2 text-blue-400" />Invoice Details</h3>
                    <div className="grid grid-cols-2 gap-2 text-inter text-sm">
                      <div><span className="font-semibold">Number:</span> {invoice.invoiceNumber}</div>
                      <div><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800 animate-pulse'}`}>{invoice.status.toUpperCase()}</span></div>
                      <div><span className="font-semibold">Amount:</span> PKR {invoice.finalAmount.toLocaleString()}</div>
                      <div><span className="font-semibold">Paid:</span> PKR {(invoice.amountPaid || 0).toLocaleString()}</div>
                      <div><span className="font-semibold">Due:</span> <span className="text-red-600 font-bold">PKR {(invoice.finalAmount - (invoice.amountPaid || 0)).toLocaleString()}</span></div>
                      <div><span className="font-semibold">Date:</span> {new Date(invoice.createdAt).toLocaleDateString()}</div>
                      <div><span className="font-semibold">Created By:</span> {invoice.createdBy}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* Payment Modal */}
            {showPaymentModal && paymentInvoice && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
                <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl animate-slide-up">
                  <h2 className="text-lg font-bold mb-4 text-gray-900">Record Payment</h2>
                  <form onSubmit={handlePaymentSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                      <input
                        type="number"
                        min={1}
                        max={paymentInvoice.finalAmount - (paymentInvoice.amountPaid || 0)}
                        value={paymentData.amount}
                        onChange={e => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Method</label>
                      <select
                        value={paymentData.method}
                        onChange={e => setPaymentData({ ...paymentData, method: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="cash">Cash</option>
                        <option value="card">Card</option>
                        <option value="bank_transfer">Bank Transfer</option>
                        <option value="cheque">Cheque</option>
                      </select>
              </div>
              <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Note (optional)</label>
                      <input
                        type="text"
                        value={paymentData.note}
                        onChange={e => setPaymentData({ ...paymentData, note: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <button
                        type="button"
                        onClick={closePaymentModal}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Record Payment
                      </button>
                    </div>
                  </form>
                </div>
                </div>
              )}
          </div>
        );
      })()}

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Doctor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Tests</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Critical</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* 3. Add bulk actions and export buttons in the UI */}
              <tr className="bg-gray-50 border-b border-gray-200">
                <td colSpan={8} className="py-3 px-4">
                  <div className="flex flex-wrap gap-2 mb-2">
                    <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition" onClick={handleExportPDF}>Export PDF</button>
                    <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition" onClick={handleExportExcel}>Export Excel</button>
                    <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition" disabled={selectedReports.length === 0}>Bulk Verify</button>
                    <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition" disabled={selectedReports.length === 0}>Bulk Delete</button>
                  </div>
                </td>
              </tr>
              {filteredReports.map((report) => {
                const patient = patients.find(p => p.id === report.patientId);
                const doctor = doctors.find(d => d.id === report.doctorId);
                const invoice = invoices.find(inv => inv.id === report.invoiceId);
                return (
                  <tr key={report.id} className="border-b border-gray-200 hover:bg-gray-50">
                    {/* Invoice cell */}
                    <td className="py-3 px-4">
                      {invoice ? (
                        <div className="group relative">
                          <span className="font-sourcecodepro text-blue-700 font-semibold cursor-pointer group-hover:underline">
                            {invoice.invoiceNumber}
                          </span>
                          {/* Invoice Info Card on Hover */}
                          <div className="absolute left-0 top-8 z-20 hidden group-hover:block bg-white rounded-xl shadow-2xl border border-blue-200 p-4 w-80 animate-fade-in">
                            <h3 className="font-poppins text-lg font-bold text-blue-700 mb-2 flex items-center"><FileText className="w-5 h-5 mr-2 text-blue-400" />Invoice Details</h3>
                            <div className="grid grid-cols-2 gap-2 text-inter text-sm">
                              <div><span className="font-semibold">Number:</span> {invoice.invoiceNumber}</div>
                              <div><span className="font-semibold">Status:</span> <span className={`px-2 py-1 rounded-full text-xs font-semibold ${invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800 animate-pulse'}`}>{invoice.status.toUpperCase()}</span></div>
                              <div><span className="font-semibold">Amount:</span> PKR {invoice.finalAmount.toLocaleString()}</div>
                              <div><span className="font-semibold">Paid:</span> PKR {(invoice.amountPaid || 0).toLocaleString()}</div>
                              <div><span className="font-semibold">Due:</span> <span className="text-red-600 font-bold">PKR {(invoice.finalAmount - (invoice.amountPaid || 0)).toLocaleString()}</span></div>
                              <div><span className="font-semibold">Date:</span> {new Date(invoice.createdAt).toLocaleDateString()}</div>
                              <div><span className="font-semibold">Created By:</span> {invoice.createdBy}</div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">No Invoice</span>
                      )}
                    </td>
                    {/* 4. In the report table, add checkboxes for bulk selection and animated status badges */}
                    <td><input type="checkbox" checked={selectedReports.includes(report.id)} onChange={e => {
                      setSelectedReports(e.target.checked ? [...selectedReports, report.id] : selectedReports.filter(id => id !== report.id));
                    }} /></td>
                    <td>{getStatusIcon(report.status)} <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(report.status)} animate-pulse`}>{report.status.charAt(0).toUpperCase() + report.status.slice(1)}</span></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2 group relative">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-semibold cursor-pointer group-hover:underline">
                          {patient?.name}
                        </span>
                        {/* Patient Info Card on Hover */}
                        <div className="absolute left-0 top-8 z-20 hidden group-hover:block bg-white rounded-xl shadow-2xl border border-blue-200 p-4 w-80 animate-fade-in">
                          <h3 className="font-poppins text-lg font-bold text-blue-700 mb-2 flex items-center"><User className="w-5 h-5 mr-2 text-blue-400" />Patient Details</h3>
                          <div className="grid grid-cols-2 gap-2 text-inter text-sm">
                            <div><span className="font-semibold">Name:</span> {patient?.name}</div>
                            <div><span className="font-semibold">ID:</span> <span className="font-sourcecodepro">{patient?.patientId}</span></div>
                            <div><span className="font-semibold">Age:</span> {patient?.age}</div>
                            <div><span className="font-semibold">Gender:</span> {patient?.gender}</div>
                            <div><span className="font-semibold">Contact:</span> {patient?.contact}</div>
                            <div><span className="font-semibold">Address:</span> {patient?.address}</div>
                            {patient?.cnic && <div><span className="font-semibold">CNIC:</span> {patient.cnic}</div>}
                            {patient?.bloodGroup && <div><span className="font-semibold">Blood Group:</span> {patient.bloodGroup}</div>}
                            {patient?.allergies && <div><span className="font-semibold">Allergies:</span> {patient.allergies}</div>}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900">{doctor?.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900">{report.tests.length} tests</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{report.createdAt.toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setViewingReport(report)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {report.status === 'verified' ? (
                        <button
                          onClick={() => generateReportPDF(report)}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        ) : (
                          <button
                            onClick={() => generateReportPDF(report)}
                            className="p-1 text-gray-400 hover:text-gray-600 cursor-not-allowed"
                            title="Report must be verified before printing."
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                        )}
                        {hasPermission('reports', 'edit') && report.status !== 'locked' && (
                          <>
                            <button
                              onClick={() => updateReportStatus(report.id, 'in_progress')}
                              className="p-1 text-blue-600 hover:text-blue-800"
                              title="Mark In Progress"
                            >
                              <TestTube className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => updateReportStatus(report.id, 'completed')}
                              className="p-1 text-green-600 hover:text-green-800"
                              title="Mark Completed"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        {hasPermission('reports', 'verify') && report.status === 'completed' && (
                          <button
                            onClick={() => updateReportStatus(report.id, 'verified')}
                            className="p-1 text-purple-600 hover:text-purple-800"
                            title="Verify Report"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {filteredReports.length === 0 && (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No reports found</p>
        </div>
      )}
    </div>
  );
};

export default ReportManagement;