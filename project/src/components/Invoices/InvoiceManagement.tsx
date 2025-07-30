import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { 
  Plus, Search, Filter, Edit, Trash2, Eye,
  Receipt, DollarSign, Calendar, User,
  Lock, Unlock, Printer
} from 'lucide-react';
import { Invoice, InvoiceTest } from '../../types';
import { createInvoicePDF } from '../../utils/pdfGenerator';
import * as QRCode from 'qrcode';

const InvoiceManagement: React.FC = () => {
  const { invoices, patients, doctors, tests, addInvoice, updateInvoice, deleteInvoice, recordPayment, addPatient } = useData();
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [formData, setFormData] = useState({
    patientId: '',
    phcrNumber: '',
    mrNumber: '',
    doctorId: '',
    tests: [] as InvoiceTest[],
    discount: 0,
    notes: '',
    paymentMethod: 'cash',
    amountPaid: 0,
    sampleType: '',
    cnic: ''
  });
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentInvoice, setPaymentInvoice] = useState<Invoice | null>(null);
  const [paymentData, setPaymentData] = useState({ amount: 0, method: 'cash', note: '' });
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [newPatientData, setNewPatientData] = useState({ name: '', age: '', gender: 'male', contact: '', address: '' });
  const [patientFormError, setPatientFormError] = useState('');
  const [patientFormLoading, setPatientFormLoading] = useState(false);
  const [showPatientToast, setShowPatientToast] = useState(false);
  const patientModalRef = useRef<HTMLDivElement>(null);
  const [showQR, setShowQR] = useState(false);
  const [qrInvoice, setQRInvoice] = useState<Invoice | null>(null);

  // Add useEffect for focus trap and Escape key
  useEffect(() => {
    if (showPatientModal && patientModalRef.current) {
      const focusable = patientModalRef.current.querySelectorAll('input,select,button');
      (focusable[0] as HTMLElement)?.focus();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setShowPatientModal(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [showPatientModal]);

  const filteredInvoices = invoices.filter(invoice => {
    const patient = patients.find(p => p.id === invoice.patientId);
    const doctor = doctors.find(d => d.id === invoice.doctorId);
    return (
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalAmount = formData.tests.reduce((sum, test) => sum + (test.price * test.quantity), 0);
    const finalAmount = totalAmount - formData.discount;
    const defaultDueDate = new Date();
    defaultDueDate.setDate(defaultDueDate.getDate() + 7); // 7 days from now
    const invoiceData = {
      ...formData,
      invoiceNumber: `INV${(invoices.length + 1).toString().padStart(4, '0')}`,
      totalAmount,
      finalAmount,
      status: 'finalized' as const,
      createdBy: user?.id || '',
      isLocked: false,
      amountPaid: formData.amountPaid,
      dueDate: defaultDueDate,
      paymentHistory: formData.amountPaid > 0 ? [{
        amount: formData.amountPaid,
        date: new Date(),
        method: formData.paymentMethod,
        receivedBy: user?.name || 'System',
        note: 'Initial payment'
      }] : []
    };
    if (editingInvoice) {
      updateInvoice(editingInvoice.id, invoiceData);
      setEditingInvoice(null);
    } else {
      addInvoice(invoiceData);
    }
    setShowAddForm(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      phcrNumber: '',
      mrNumber: '',
      doctorId: '',
      tests: [],
      discount: 0,
      notes: '',
      paymentMethod: 'cash',
      amountPaid: 0,
      sampleType: '',
      cnic: ''
    });
  };

  const addTestToInvoice = () => {
    setFormData({
      ...formData,
      tests: [...formData.tests, { testId: '', testName: '', price: 0, quantity: 1 }]
    });
  };

  const updateInvoiceTest = (index: number, field: keyof InvoiceTest, value: string | number) => {
    const updatedTests = [...formData.tests];
    updatedTests[index] = { ...updatedTests[index], [field]: value };
    
    if (field === 'testId') {
      const selectedTest = tests.find(t => t.id === value);
      if (selectedTest) {
        updatedTests[index].testName = selectedTest.name;
        updatedTests[index].price = selectedTest.price;
      }
    }
    
    setFormData({ ...formData, tests: updatedTests });
  };

  const removeTestFromInvoice = (index: number) => {
    const updatedTests = formData.tests.filter((_, i) => i !== index);
    setFormData({ ...formData, tests: updatedTests });
  };

  const handleEdit = (invoice: Invoice) => {
    if (invoice.isLocked && !hasPermission('invoices', 'unlock')) {
      alert('This invoice is locked and cannot be edited.');
      return;
    }
    setEditingInvoice(invoice);
    setFormData({
      patientId: invoice.patientId,
      phcrNumber: invoice.phcrNumber || '',
      mrNumber: invoice.mrNumber || '',
      doctorId: invoice.doctorId,
      tests: invoice.tests,
      discount: invoice.discount,
      notes: invoice.notes || '',
      paymentMethod: invoice.paymentMethod || 'cash',
      amountPaid: invoice.amountPaid || 0,
      sampleType: invoice.sampleType || '',
      cnic: invoice.cnic || ''
    });
    setShowAddForm(true);
  };

  const toggleLock = (invoice: Invoice) => {
    if (!hasPermission('invoices', 'lock')) {
      alert('You do not have permission to lock/unlock invoices.');
      return;
    }
    updateInvoice(invoice.id, { isLocked: !invoice.isLocked });
  };

  const generateInvoicePDF = async (invoice: Invoice) => {
    const patient = patients.find(p => p.id === invoice.patientId);
    const doctor = doctors.find(d => d.id === invoice.doctorId);
    
    const qrCodeData = JSON.stringify({
      invoiceNumber: invoice.invoiceNumber,
      amount: invoice.finalAmount,
      status: invoice.status,
      date: invoice.createdAt,
      patient: {
        name: patient?.name,
        phone: patient?.contact,
        id: patient?.id
      }
    });

    try {
      const qrCodeDataUrl = await QRCode.toDataURL(qrCodeData, {
        errorCorrectionLevel: 'H',
        type: 'image/png',
        width: 150,
        margin: 1,
      });

      await createInvoicePDF({
      ...invoice,
        patientName: patient?.name || 'N/A',
        doctorName: doctor?.name || 'N/A',
        patientContact: patient?.contact || 'N/A',
        patientAge: patient?.age || '',
        patientGender: patient?.gender || '',
        patientCnic: patient?.cnic || '',
        phcrNumber: (invoice.phcrNumber || patient?.phcrNumber || 'R-34889').replace(/^PHCR#\s*/i, ''),
        mrNumber: invoice.mrNumber || patient?.mrNumber || '',
        sampleType: invoice.sampleType || patient?.sampleType || '',
        cnic: invoice.cnic || patient?.cnic || '',
        createdBy: user?.name || user?.username || 'Staff',
      }, qrCodeDataUrl);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
      // You can also show a notification to the user here
    }
  };

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
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'finalized': return 'bg-blue-100 text-blue-800';
      case 'due': return 'bg-yellow-100 text-yellow-800 animate-pulse';
      case 'overdue': return 'bg-red-200 text-red-800 animate-pulse';
      case 'partial': return 'bg-orange-100 text-orange-800 animate-pulse';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleShowQR = (invoice: Invoice) => {
    setQRInvoice(invoice);
    setShowQR(true);
  };
  const handleCloseQR = () => {
    setShowQR(false);
    setQRInvoice(null);
  };
  const handleDownloadQR = () => {
    const canvas = document.getElementById('invoice-qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice-qr-${qrInvoice?.invoiceNumber || ''}.png`;
      link.click();
    }
  };
  const handlePrintQR = () => {
    const canvas = document.getElementById('invoice-qr-canvas') as HTMLCanvasElement;
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const win = window.open('');
      if (win) {
        win.document.write(`<img src='${dataUrl}' style='width:256px;height:256px;'/>`);
        win.print();
        win.close();
      }
    }
  };

  const qrPatient = patients.find(p => p.id === qrInvoice?.patientId);

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Invoice Management</h1>
          <p className="text-gray-600">Create and manage patient invoices</p>
        </div>
        {hasPermission('invoices', 'create') && (
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Create Invoice</span>
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
              placeholder="Search invoices by number, patient, or doctor..."
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

      {/* Add/Edit Invoice Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              {editingInvoice ? 'Edit Invoice' : 'Create New Invoice'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient *
                  </label>
                  <select
                    required
                    value={formData.patientId}
                    onChange={(e) => {
                      if (e.target.value === 'add_new') {
                        setShowPatientModal(true);
                      } else {
                        setFormData({...formData, patientId: e.target.value});
                      }
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} ({patient.patientId})
                      </option>
                    ))}
                    <option value="add_new">+ Add New Patient</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referring Doctor *
                  </label>
                  <select
                    required
                    value={formData.doctorId}
                    onChange={(e) => setFormData({...formData, doctorId: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.filter(d => d.isActive).map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialty}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tests Section */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Tests *
                  </label>
                  <button
                    type="button"
                    onClick={addTestToInvoice}
                    className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Add Test
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.tests.map((test, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-3 p-3 border border-gray-200 rounded-lg">
                      <div className="md:col-span-2">
                        <select
                          value={test.testId}
                          onChange={(e) => updateInvoiceTest(index, 'testId', e.target.value)}
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
                          type="number"
                          placeholder="Quantity"
                          value={test.quantity}
                          onChange={(e) => updateInvoiceTest(index, 'quantity', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <input
                          type="number"
                          placeholder="Price"
                          value={test.price}
                          onChange={(e) => updateInvoiceTest(index, 'price', parseFloat(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-700 mr-2">
                          PKR {(test.price * test.quantity).toLocaleString()}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeTestFromInvoice(index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PHCR#</label>
                  <input type="text" value={formData.phcrNumber} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">MR No</label>
                  <input type="text" value={formData.mrNumber} disabled className="w-full px-3 py-2 border rounded-lg bg-gray-100 text-gray-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sample Type
                  </label>
                  <input
                    type="text"
                    value={formData.sampleType}
                    onChange={(e) => setFormData({...formData, sampleType: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (PKR)
                  </label>
                  <input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => setFormData({...formData, discount: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                    <option value="cheque">Cheque</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount Paid (PKR)
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={formData.tests.reduce((sum, test) => sum + (test.price * test.quantity), 0) - formData.discount}
                    value={formData.amountPaid}
                    onChange={e => setFormData({...formData, amountPaid: parseFloat(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Invoice Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">Invoice Summary</h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>PKR {formData.tests.reduce((sum, test) => sum + (test.price * test.quantity), 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount:</span>
                    <span>- PKR {formData.discount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg border-t pt-1">
                    <span>Total:</span>
                    <span>PKR {(formData.tests.reduce((sum, test) => sum + (test.price * test.quantity), 0) - formData.discount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddForm(false);
                    setEditingInvoice(null);
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
                  {editingInvoice ? 'Update' : 'Create'} Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice View Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Invoice Details</h2>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleShowQR(viewingInvoice)}
                  className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 flex items-center space-x-2"
                >
                  <span>Show QR</span>
                </button>
                <button
                  onClick={() => generateInvoicePDF(viewingInvoice)}
                  className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print PDF</span>
                </button>
                <button
                  onClick={() => setViewingInvoice(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Invoice Number</p>
                  <p className="font-medium">{viewingInvoice.invoiceNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="font-medium">{new Date(viewingInvoice.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getStatusColor(viewingInvoice.status)}`}>{viewingInvoice.status.charAt(0).toUpperCase() + viewingInvoice.status.slice(1)}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Due Date</p>
                  <p className="font-medium">{viewingInvoice.dueDate ? new Date(viewingInvoice.dueDate).toLocaleDateString() : '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Amount</p>
                  <p className="font-medium">PKR {viewingInvoice.finalAmount.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Amount Paid</p>
                  <p className="font-medium text-green-700">PKR {viewingInvoice.amountPaid?.toLocaleString() || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Outstanding</p>
                  <p className="font-medium text-red-700">PKR {(viewingInvoice.finalAmount - (viewingInvoice.amountPaid || 0)).toLocaleString()}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Payment History</p>
                <div className="bg-gray-50 rounded-lg p-2 max-h-32 overflow-y-auto">
                  {viewingInvoice.paymentHistory && viewingInvoice.paymentHistory.length > 0 ? (
                    <ul className="space-y-1 text-sm">
                      {viewingInvoice.paymentHistory.map((p, idx) => (
                        <li key={idx} className="flex justify-between items-center">
                          <span>{new Date(p.date).toLocaleDateString()} ({p.method})</span>
                          <span className="font-medium">PKR {p.amount.toLocaleString()}</span>
                          <span className="text-xs text-gray-500">{p.receivedBy}</span>
                          {p.note && <span className="text-xs text-gray-400 italic">{p.note}</span>}
                        </li>
                      ))}
                    </ul>
                  ) : <span className="text-gray-400">No payments yet</span>}
                </div>
              </div>
              <div className="flex justify-end space-x-2 mt-4">
                {hasPermission('invoices', 'edit') && viewingInvoice.status !== 'paid' && viewingInvoice.status !== 'cancelled' && (
                  <button
                    onClick={() => openPaymentModal(viewingInvoice)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 animate-bounce"
                  >
                    Record Payment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
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

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Invoice #</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Patient</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Doctor</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => {
                const patient = patients.find(p => p.id === invoice.patientId);
                const doctor = doctors.find(d => d.id === invoice.doctorId);
                return (
                  <tr key={invoice.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Receipt className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-blue-600">{invoice.invoiceNumber}</span>
                        {invoice.isLocked && <Lock className="w-4 h-4 text-red-600" />}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{patient?.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-gray-900">{doctor?.name}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900">{new Date(invoice.createdAt).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          PKR {invoice.finalAmount.toLocaleString()}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(invoice.status)}`}>
                        {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setViewingInvoice(invoice)}
                          className="p-1 text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => generateInvoicePDF(invoice)}
                          className="p-1 text-green-600 hover:text-green-800"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                        {hasPermission('invoices', 'edit') && (
                          <button
                            onClick={() => handleEdit(invoice)}
                            className="p-1 text-blue-600 hover:text-blue-800"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                        {hasPermission('invoices', 'lock') && (
                          <button
                            onClick={() => toggleLock(invoice)}
                            className="p-1 text-yellow-600 hover:text-yellow-800"
                          >
                            {invoice.isLocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                          </button>
                        )}
                        {hasPermission('invoices', 'delete') && !invoice.isLocked && (
                          <button
                            onClick={() => deleteInvoice(invoice.id)}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {filteredInvoices.length === 0 && (
        <div className="text-center py-8">
          <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">No invoices found</p>
        </div>
      )}

      {showPatientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div ref={patientModalRef} className="bg-white rounded-lg p-6 w-full max-w-md shadow-2xl animate-slide-up" role="dialog" aria-modal="true" aria-labelledby="add-patient-title">
            <h2 id="add-patient-title" className="text-lg font-bold mb-2 text-gray-900">Add New Patient</h2>
            <p className="text-gray-500 mb-4">Register a new patient without leaving the invoice form.</p>
            <form onSubmit={async e => {
              e.preventDefault();
              setPatientFormError('');
              if (!newPatientData.name.trim()) return setPatientFormError('Name is required');
              if (!newPatientData.age.trim() || isNaN(Number(newPatientData.age))) return setPatientFormError('Valid age is required');
              setPatientFormLoading(true);
              try {
                const patient = {
                  ...newPatientData,
                  age: parseInt(newPatientData.age),
                  gender: newPatientData.gender as "male" | "female" | "other",
                  createdBy: user?.id || '',
                  patientId: `P${(patients.length + 1).toString().padStart(5, '0')}`,
                };
                await addPatient(patient);
                setShowPatientModal(false);
                setNewPatientData({ name: '', age: '', gender: 'male', contact: '', address: '' });
                setShowPatientToast(true);
                setTimeout(() => setShowPatientToast(false), 2500);
                // Pre-select the new patient (find by name and contact)
                setTimeout(() => {
                  const added = patients.find(p => p.name === patient.name && p.contact === patient.contact);
                  if (added) setFormData(f => ({ ...f, patientId: added.id }));
                }, 100);
              } catch {
                setPatientFormError('Failed to add patient. Please try again.');
              } finally {
                setPatientFormLoading(false);
              }
            }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input type="text" required value={newPatientData.name} onChange={e => setNewPatientData(d => ({ ...d, name: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" aria-label="Patient Name" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age *</label>
                <input type="number" required value={newPatientData.age} onChange={e => setNewPatientData(d => ({ ...d, age: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" aria-label="Patient Age" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
                <select value={newPatientData.gender} onChange={e => setNewPatientData(d => ({ ...d, gender: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" aria-label="Patient Gender">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <input type="text" value={newPatientData.contact} onChange={e => setNewPatientData(d => ({ ...d, contact: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" aria-label="Patient Contact" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input type="text" value={newPatientData.address} onChange={e => setNewPatientData(d => ({ ...d, address: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" aria-label="Patient Address" />
              </div>
              {patientFormError && <div className="text-red-600 text-sm">{patientFormError}</div>}
              <div className="flex justify-end space-x-2 mt-4">
                <button type="button" onClick={() => setShowPatientModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 ${patientFormLoading ? 'opacity-60 cursor-not-allowed' : ''}`} disabled={patientFormLoading}>
                  {patientFormLoading && <span className="loader border-2 border-white border-t-blue-600 rounded-full w-4 h-4 animate-spin"></span>}
                  Add Patient
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showPatientToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg animate-fade-in z-50">
          Patient added and selected!
        </div>
      )}
      {/* QR Code Modal */}
      {showQR && qrInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 shadow-2xl flex flex-col items-center max-w-xs w-full animate-pop-in">
            <h3 className="text-lg font-bold text-gray-900 mb-2">Invoice QR Code</h3>
            <div style={{ background: '#fff', padding: 16, borderRadius: 16, border: '4px solid #e9d5ff', boxShadow: '0 2px 8px #0001', marginBottom: 16 }}>
              <QRCode value={qrInvoice && qrPatient ? JSON.stringify({
                invoiceNumber: qrInvoice.invoiceNumber,
                amount: qrInvoice.finalAmount,
                status: qrInvoice.status,
                date: qrInvoice.createdAt,
                patient: {
                  name: qrPatient.name,
                  phone: qrPatient.contact,
                  id: qrPatient.id
                }
              }) : ''} size={256} bgColor="#fff" fgColor="#1e293b" level="H" />
            </div>
            <div className="flex space-x-3 mt-2">
              <button onClick={handleDownloadQR} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Download</button>
              <button onClick={handlePrintQR} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Print</button>
              <button onClick={handleCloseQR} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300">Close</button>
            </div>
            <p className="text-xs text-gray-400 mt-3">Scan to view this invoice in the system</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement;