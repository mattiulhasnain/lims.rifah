import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { exportReportsToExcel } from '../../utils/pdfGenerator';
import { Eye, Download, CheckCircle, AlertTriangle, Info, ArrowRight, Check, X, Save, FileText, Play } from 'lucide-react';
import { Report, ReportTest } from '../../types';
type ResultRow = ReportTest & { reportId: string; patientId: string; doctorId: string; createdAt: Date; status: string; abnormal: boolean; critical: boolean; report: Report; idx: number; };

const TestReporting: React.FC = () => {
  const { reports, patients, doctors, tests, updateReport, addNotification } = useData();
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ patient: '', doctor: '', test: '', abnormal: '', date: '' });
  // 1. Add a state to toggle between 'All Results' and 'Pending Results'
  const [showPendingOnly, setShowPendingOnly] = useState(true);

  // 2. Add a state for editing a result
  const [editingResult, setEditingResult] = useState<ResultRow | null>(null);
  const [editResultValue, setEditResultValue] = useState('');
  const [editValidationError, setEditValidationError] = useState('');
  const [editCriticalComment, setEditCriticalComment] = useState('');
  const [editAcknowledgeCritical, setEditAcknowledgeCritical] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [nextPendingTest, setNextPendingTest] = useState<ResultRow | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<(() => void) | null>(null);
  
  // 3. Add workflow state management
  const [workflowStep, setWorkflowStep] = useState<'entry' | 'draft' | 'completed' | 'reporting'>('entry');
  const [showWorkflowGuide, setShowWorkflowGuide] = useState(true);

  // Flatten all test results from reports for easier filtering
  const allResults: ResultRow[] = reports.flatMap((report) => 
    (report.tests || []).map((test, testIdx) => ({
      ...test,
      reportId: report.id,
      patientId: report.patientId,
      doctorId: report.doctorId,
      createdAt: report.createdAt,
      status: report.status,
      abnormal: test.isAbnormal || false,
      critical: test.isCritical || false,
      report,
      idx: testIdx
    }))
  );

  // Filter for pending results (no result entered yet)
  const pendingResults = allResults.filter(result => 
    !result.result || result.result.trim() === ''
  );

  // Filter results based on search and filters
  const filteredResults = (showPendingOnly ? pendingResults : allResults).filter(result => {
    const patient = patients.find(p => p.id === result.patientId);
    const doctor = doctors.find(d => d.id === result.doctorId);
    const test = tests.find(t => t.id === result.testId);
    
    const matchesSearch = searchTerm === '' || 
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      test?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPatient = filter.patient === '' || result.patientId === filter.patient;
    const matchesDoctor = filter.doctor === '' || result.doctorId === filter.doctor;
    const matchesTest = filter.test === '' || result.testId === filter.test;
    const matchesAbnormal = filter.abnormal === '' || 
      (filter.abnormal === 'true' && result.abnormal) ||
      (filter.abnormal === 'false' && !result.abnormal);
    const matchesDate = filter.date === '' || 
      result.createdAt.toDateString() === new Date(filter.date).toDateString();
    
    return matchesSearch && matchesPatient && matchesDoctor && matchesTest && matchesAbnormal && matchesDate;
  });

  const handleEditResult = (result: ResultRow) => {
    setEditingResult(result);
    setEditResultValue(result.result || '');
    setEditValidationError('');
    setEditCriticalComment('');
    setEditAcknowledgeCritical(false);
    setWorkflowStep('entry');
  };

  const handleSaveDraft = () => {
    if (!editingResult) return;
    
    setShowSuccessMessage(true);
    setSuccessMessage('Draft saved successfully. You can continue editing later.');
    setTimeout(() => setShowSuccessMessage(false), 3000);
    setWorkflowStep('draft');
  };

  const handleSaveResult = () => {
    if (!editingResult) return;
    
    // Validation: required
    if (!editResultValue.trim()) {
      setEditValidationError('Result is required.');
      return;
    }
    
    // Abnormal/critical flagging (simple demo: if value contains 'critical')
    const isCritical = editResultValue.toLowerCase().includes('critical');
    const abnormalParams: string[] = [];
    const criticalParams: string[] = [];
    
    if (isCritical && (!editAcknowledgeCritical || !editCriticalComment.trim())) {
      setEditValidationError('Critical results detected. Please acknowledge and add a comment.');
      return;
    }
    
    // Update the report
    const report = reports.find(r => r.id === editingResult.reportId);
    if (!report) return;
    
    const updatedTests = [...(report.tests || [])];
    const idx = updatedTests.findIndex(t => t.testId === editingResult.testId);
    if (idx >= 0) {
      updatedTests[idx] = {
        ...updatedTests[idx],
        result: editResultValue,
        isAbnormal: false,
        isCritical,
        abnormalParams,
        criticalParams,
        criticalComment: isCritical ? editCriticalComment : undefined
      };
    }
    
    updateReport(report.id, { tests: updatedTests });
    
    // Add notification
    addNotification({
      type: isCritical ? 'warning' : 'info',
      category: 'report',
      title: 'Result Entered',
      message: `Result entered for test ${editingResult.testName} (${isCritical ? 'Critical' : 'Normal'})`,
      isRead: false,
      priority: isCritical ? 'high' : 'medium'
    });
    
    // Find next pending test
    const remainingPending = pendingResults.filter(r => 
      r.reportId !== editingResult.reportId || r.testId !== editingResult.testId
    );
    const nextTest = remainingPending.length > 0 ? remainingPending[0] : null;
    
    // Show success message
    setSuccessMessage(
      isCritical 
        ? `Critical result saved successfully! Please ensure the doctor is notified immediately.`
        : `Result saved successfully for ${editingResult.testName}`
    );
    setShowSuccessMessage(true);
    setNextPendingTest(nextTest);
    setWorkflowStep('completed');
    
    // Reset form
    setEditingResult(null);
    setEditResultValue('');
    setEditValidationError('');
    setEditCriticalComment('');
    setEditAcknowledgeCritical(false);
    
    // Auto-hide success message after 5 seconds
    setTimeout(() => setShowSuccessMessage(false), 5000);
  };

  const handleNextPendingTest = () => {
    if (nextPendingTest) {
      handleEditResult(nextPendingTest);
    }
  };

  const confirmAction = () => {
    if (confirmationAction) {
      confirmationAction();
    }
    setShowConfirmation(false);
    setConfirmationAction(null);
  };

  const handleMarkReportCompleted = (reportId: string) => {
    updateReport(reportId, { status: 'completed' });
    addNotification({
      type: 'info',
      category: 'report',
      title: 'Report Completed',
      message: 'Report marked as completed and ready for verification',
      isRead: false,
      priority: 'medium'
    });
    setWorkflowStep('reporting');
  };

  const getWorkflowStepInfo = () => {
    switch (workflowStep) {
      case 'entry':
        return {
          title: 'Result Entry',
          description: 'Enter test results and save as draft or complete',
          icon: <FileText className="w-5 h-5" />,
          color: 'blue'
        };
      case 'draft':
        return {
          title: 'Draft Saved',
          description: 'Results saved as draft. You can continue editing later',
          icon: <Save className="w-5 h-5" />,
          color: 'yellow'
        };
      case 'completed':
        return {
          title: 'Result Completed',
          description: 'Result saved successfully. Ready for report completion',
          icon: <CheckCircle className="w-5 h-5" />,
          color: 'green'
        };
      case 'reporting':
        return {
          title: 'Reporting Area',
          description: 'Report completed and ready for verification',
          icon: <Eye className="w-5 h-5" />,
          color: 'purple'
        };
      default:
        return {
          title: 'Add Results',
          description: 'Enter and manage test results',
          icon: <Play className="w-5 h-5" />,
          color: 'blue'
        };
    }
  };

  const workflowInfo = getWorkflowStepInfo();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Workflow Success Banner */}
      {showSuccessMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 animate-slide-down">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <h3 className="text-lg font-semibold text-green-800">{successMessage}</h3>
                {nextPendingTest && (
                  <button
                    onClick={handleNextPendingTest}
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
                  >
                    <ArrowRight className="w-4 h-4" />
                    <span>Next Test</span>
                  </button>
                )}
              </div>
            </div>
            <button 
              onClick={() => setShowSuccessMessage(false)}
              className="text-green-600 hover:text-green-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Workflow Guide Banner */}
      {showWorkflowGuide && (
        <div className={`bg-${workflowInfo.color}-50 border border-${workflowInfo.color}-200 rounded-lg p-4 mb-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {workflowInfo.icon}
              <div>
                <h3 className="text-lg font-semibold text-gray-800">{workflowInfo.title}</h3>
                <p className="text-gray-600">{workflowInfo.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <strong>Workflow:</strong> Entry → Draft/Complete → Reporting → Verification
                </div>
              </div>
            </div>
            <button 
              onClick={() => setShowWorkflowGuide(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* User Guidance Banner */}
      {showPendingOnly && pendingResults.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-3">
            <Info className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800">Workflow Guidance</h3>
              <p className="text-blue-600">Step-by-step process:</p>
              <ol className="list-decimal list-inside text-blue-600 mt-1 space-y-1">
                <li>Select a pending test from the list below</li>
                <li>Enter the test result in the popup form</li>
                <li>Save as draft or complete the result</li>
                <li>For critical results, acknowledge and add comments</li>
                <li>Mark report as completed when all tests are done</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* Progress Indicator */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">Progress Overview</h3>
          <div className="text-sm text-gray-600">
            {pendingResults.length} pending • {allResults.length - pendingResults.length} completed
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((allResults.length - pendingResults.length) / allResults.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {showPendingOnly ? 'Add Results - Pending Tests' : 'Add Results - All Tests'}
          </h1>
          <p className="text-gray-600 mt-1">
            {showPendingOnly 
              ? `Manage ${pendingResults.length} pending test results`
              : `View and manage all ${allResults.length} test results`
            }
          </p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowPendingOnly(!showPendingOnly)}
            className={`px-4 py-2 rounded-lg flex items-center space-x-2 ${
              showPendingOnly 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Eye className="w-4 h-4" />
            <span>{showPendingOnly ? 'Show All' : 'Show Pending Only'}</span>
          </button>
                     {hasPermission('reports', 'export') && (
             <button
               onClick={() => exportReportsToExcel(reports, patients, doctors)}
               className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
             >
               <Download className="w-4 h-4" />
               <span>Export</span>
             </button>
           )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          <div>
            <input
              type="text"
              placeholder="Search tests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <select
              value={filter.patient}
              onChange={(e) => setFilter({...filter, patient: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Patients</option>
              {patients.map(patient => (
                <option key={patient.id} value={patient.id}>{patient.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filter.doctor}
              onChange={(e) => setFilter({...filter, doctor: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Doctors</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filter.test}
              onChange={(e) => setFilter({...filter, test: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Tests</option>
              {tests.map(test => (
                <option key={test.id} value={test.id}>{test.name}</option>
              ))}
            </select>
          </div>
          <div>
            <select
              value={filter.abnormal}
              onChange={(e) => setFilter({...filter, abnormal: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Results</option>
              <option value="true">Abnormal Only</option>
              <option value="false">Normal Only</option>
            </select>
          </div>
          <div>
            <input
              type="date"
              value={filter.date}
              onChange={(e) => setFilter({...filter, date: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Results Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Patient
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Doctor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Result
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
                         <tbody className="bg-white divide-y divide-gray-200">
               {filteredResults.map((result) => {
                 const patient = patients.find(p => p.id === result.patientId);
                 const doctor = doctors.find(d => d.id === result.doctorId);
                 const test = tests.find(t => t.id === result.testId);
                 const report = reports.find(r => r.id === result.reportId);
                
                return (
                  <tr key={`${result.reportId}-${result.testId}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{patient?.name}</div>
                      <div className="text-sm text-gray-500">{patient?.patientId}</div>
                    </td>
                                         <td className="px-6 py-4 whitespace-nowrap">
                       <div className="text-sm text-gray-900">{doctor?.name}</div>
                       <div className="text-sm text-gray-500">{doctor?.specialty}</div>
                     </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{test?.name}</div>
                      <div className="text-sm text-gray-500">{test?.sampleRequired}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {result.result ? (
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            result.critical 
                              ? 'bg-red-100 text-red-800' 
                              : result.abnormal 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-green-100 text-green-800'
                          }`}>
                            {result.result}
                          </span>
                        ) : (
                          <span className="text-gray-400 italic">Pending</span>
                        )}
                      </div>
                      {result.critical && (
                        <div className="text-xs text-red-600 mt-1">Critical Result</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        report?.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : report?.status === 'verified'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {report?.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {result.createdAt.toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {!result.result && (
                          <button
                            onClick={() => handleEditResult(result)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 px-3 py-1 rounded-lg hover:bg-blue-100"
                          >
                            Add/Edit Result
                          </button>
                        )}
                        {result.result && (
                          <button
                            onClick={() => handleEditResult(result)}
                            className="text-green-600 hover:text-green-900 bg-green-50 px-3 py-1 rounded-lg hover:bg-green-100"
                          >
                            Edit Result
                          </button>
                        )}
                        {report && report.status === 'pending' && report.tests.every(t => t.result) && (
                          <button
                            onClick={() => handleMarkReportCompleted(report.id)}
                            className="text-purple-600 hover:text-purple-900 bg-purple-50 px-3 py-1 rounded-lg hover:bg-purple-100"
                          >
                            Mark Complete
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
        
        {filteredResults.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-lg">
              {showPendingOnly ? 'No pending tests found' : 'No test results found'}
            </div>
            <div className="text-gray-500 mt-2">
              {showPendingOnly 
                ? 'All tests have been completed or try adjusting your filters'
                : 'Try adjusting your search criteria or filters'
              }
            </div>
          </div>
        )}
      </div>

      {/* Result Entry Modal */}
      {editingResult && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                {editingResult.result ? 'Edit Test Result' : 'Add Test Result'}
              </h2>
              <button
                onClick={() => setEditingResult(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Patient:</span> {patients.find(p => p.id === editingResult.patientId)?.name}
                </div>
                <div>
                  <span className="font-medium">Doctor:</span> {doctors.find(d => d.id === editingResult.doctorId)?.name}
                </div>
                <div>
                  <span className="font-medium">Test:</span> {tests.find(t => t.id === editingResult.testId)?.name}
                </div>
                <div>
                  <span className="font-medium">Sample:</span> {tests.find(t => t.id === editingResult.testId)?.sampleRequired}
                </div>
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleSaveResult(); }} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Test Result *
                </label>
                <textarea
                  value={editResultValue}
                  onChange={(e) => setEditResultValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Enter the test result..."
                />
                {editValidationError && (
                  <p className="text-red-600 text-sm mt-1">{editValidationError}</p>
                )}
              </div>

              {editResultValue.toLowerCase().includes('critical') && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-medium text-red-800">Critical Result Detected</span>
                  </div>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editAcknowledgeCritical}
                        onChange={(e) => setEditAcknowledgeCritical(e.target.checked)}
                        className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                      />
                      <span className="text-sm text-red-700">I acknowledge this is a critical result</span>
                    </label>
                    <div>
                      <label className="block text-sm font-medium text-red-700 mb-1">
                        Critical Comment *
                      </label>
                      <textarea
                        value={editCriticalComment}
                        onChange={(e) => setEditCriticalComment(e.target.value)}
                        className="w-full px-3 py-2 border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows={3}
                        placeholder="Add a comment about the critical result..."
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save as Draft</span>
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
                >
                  <Check className="w-4 h-4" />
                  <span>Save Result</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex items-center space-x-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-600" />
              <h3 className="text-lg font-semibold text-gray-900">Confirm Critical Action</h3>
            </div>
            <p className="text-gray-600 mb-6">
              This action involves critical results. Are you sure you want to proceed?
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestReporting; 