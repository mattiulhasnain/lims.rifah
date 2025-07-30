import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { User, Report } from '../../types';
import { Eye, CheckCircle } from 'lucide-react';
import { createReportPDF } from '../../utils/pdfGenerator';

const ReportVerification: React.FC = () => {
  const { reports, patients, doctors, invoices, updateReport } = useData();
  const { user, hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'completed' | 'verified'>('all');
  const [viewingReport, setViewingReport] = useState<Report | null>(null);
  const [verifying, setVerifying] = useState<string | null>(null);


  // Filter reports for verification
  const filteredReports = reports.filter(report => {
    const matchesStatus =
      statusFilter === 'all'
        ? ['completed', 'verified'].includes(report.status)
        : report.status === statusFilter;
    const patient = patients.find(p => p.id === report.patientId);
    const doctor = doctors.find(d => d.id === report.doctorId);
    const matchesSearch =
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalReports = reports.filter(r => ['completed', 'verified'].includes(r.status)).length;
  const completedCount = reports.filter(r => r.status === 'completed').length;
  const verifiedCount = reports.filter(r => r.status === 'verified').length;

  const handleVerify = (report: Report) => {
    if (!user || !hasPermission('reports', 'verify')) return;
    if (!window.confirm('Are you sure you want to verify this report?')) return;
    setVerifying(report.id);
    updateReport(report.id, {
      status: 'verified',
      userId: user.id,
      verifiedBy: user.id,
      verifiedAt: new Date(),
    });
    setTimeout(() => setVerifying(null), 1000);
  };

  const handleDecline = (report: Report) => {
    if (!user || !hasPermission('reports', 'verify')) return;
    const reason = window.prompt('Enter reason for declining this report:', '');
    if (!reason) return;
    updateReport(report.id, {
      status: 'declined',
      userId: user.id,
      declinedBy: user.id,
      declinedAt: new Date(),
      declineReason: reason,
      statusHistory: [
        ...(report.statusHistory || []),
        { status: 'declined', changedBy: user.id, changedAt: new Date(), comment: reason }
      ]
    });
  };
  const handleUndo = (report: Report) => {
    if (!user || !hasPermission('reports', 'verify')) return;
    updateReport(report.id, {
      status: 'completed',
      userId: user.id,
      statusHistory: [
        ...(report.statusHistory || []),
        { status: 'completed', changedBy: user.id, changedAt: new Date(), comment: 'Undo verification/decline' }
      ]
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-poppins text-gray-900">Report Verification</h1>
          <p className="text-gray-600 font-inter">Verify completed laboratory reports</p>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by patient, doctor, or report ID..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
          />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
          >
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="verified">Verified</option>
          </select>
        </div>
      </div>
      {/* Summary Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-4 border border-blue-100 flex flex-col items-center">
          <span className="font-poppins text-3xl font-bold text-blue-700">{totalReports}</span>
          <span className="font-inter text-gray-600">Total Reports</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-yellow-100 flex flex-col items-center">
          <span className="font-poppins text-3xl font-bold text-yellow-600">{completedCount}</span>
          <span className="font-inter text-gray-600">Completed</span>
        </div>
        <div className="bg-white rounded-lg shadow p-4 border border-green-100 flex flex-col items-center">
          <span className="font-poppins text-3xl font-bold text-green-600">{verifiedCount}</span>
          <span className="font-inter text-gray-600">Verified</span>
        </div>
      </div>
      {/* Reports Table/Card List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mt-4">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="py-3 px-4 text-left font-medium text-gray-900">Report ID</th>
                <th className="py-3 px-4 text-left font-medium text-gray-900">Patient</th>
                <th className="py-3 px-4 text-left font-medium text-gray-900">Doctor</th>
                <th className="py-3 px-4 text-left font-medium text-gray-900">Status</th>
                <th className="py-3 px-4 text-left font-medium text-gray-900">Verified By</th>
                <th className="py-3 px-4 text-left font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400 font-inter">No reports found</td>
                </tr>
              )}
              {filteredReports.map(report => {
                const patient = patients.find(p => p.id === report.patientId);
                const doctor = doctors.find(d => d.id === report.doctorId);
                const verifiedUser = report.verifiedBy && report.verifiedBy !== '' ? report.verifiedBy : null;
                return (
                  <tr key={report.id} className="border-b border-gray-100 hover:bg-blue-50 transition">
                    <td className="py-3 px-4 font-sourcecodepro text-blue-700">{report.id}</td>
                    <td className="py-3 px-4 flex items-center gap-2">
                      <UserIcon className="w-4 h-4 text-gray-400" />
                      <span className="font-inter text-gray-900">{patient?.name}</span>
                    </td>
                    <td className="py-3 px-4 font-inter">{doctor?.name}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold font-inter ${report.status === 'verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800 animate-pulse'}`}>{report.status.toUpperCase()}</span>
                    </td>
                    <td className="py-3 px-4 font-inter">
                      {report.status === 'verified' && (
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                          {verifiedUser}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 flex gap-2">
                      <button
                        className="p-1 text-blue-600 hover:text-blue-800"
                        onClick={() => setViewingReport(report)}
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {report.status === 'completed' && hasPermission('reports', 'verify') && (
                        <button
                          className="p-1 text-green-600 hover:text-green-800"
                          onClick={() => handleVerify(report)}
                          disabled={verifying === report.id}
                          title="Verify Report"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      )}
                      {report.status === 'completed' && hasPermission('reports', 'verify') && (
                        <button
                          className="p-1 text-red-600 hover:text-red-800"
                          onClick={() => handleDecline(report)}
                          title="Decline Report"
                        >
                          Decline
                        </button>
                      )}
                      {['verified', 'declined'].includes(report.status) && hasPermission('reports', 'verify') && (
                        <button
                          className="p-1 text-yellow-600 hover:text-yellow-800"
                          onClick={() => handleUndo(report)}
                          title="Undo"
                        >
                          Undo
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Report Details Modal */}
      {viewingReport && (() => {
        const patient = patients.find(p => p.id === viewingReport.patientId);
        const doctor = doctors.find(d => d.id === viewingReport.doctorId);
        return (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-slide-up">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 font-poppins">Report Details</h2>
                <button onClick={() => setViewingReport(null)} className="text-gray-500 hover:text-gray-700">×</button>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><span className="font-semibold">Patient:</span> {patient?.name}</div>
                  <div><span className="font-semibold">Doctor:</span> {doctor?.name}</div>
                  <div><span className="font-semibold">Report ID:</span> {viewingReport.id}</div>
                  <div><span className="font-semibold">Status:</span> {viewingReport.status}</div>
                  <div><span className="font-semibold">Verified By:</span> {viewingReport.verifiedBy || '-'}</div>
                  <div><span className="font-semibold">Verified At:</span> {viewingReport.verifiedAt ? new Date(viewingReport.verifiedAt).toLocaleString() : '-'}</div>
                </div>
                <div>
                  <span className="font-semibold">Tests:</span>
                  <ul className="list-disc ml-6 mt-1">
                    {viewingReport.tests.map((t, idx) => (
                      <li key={idx}>{t.testName} {t.result && (<span className="text-gray-500">- {t.result}</span>)}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <span className="font-semibold">Interpretation:</span>
                  <div className="bg-gray-50 rounded p-2 mt-1 font-inter text-sm">{viewingReport.interpretation || '-'}</div>
                </div>
                <div>
                  <span className="font-semibold">Status Timeline:</span>
                  <ol className="border-l-2 border-blue-500 pl-4 mt-2">
                    {viewingReport.statusHistory.map((h, idx) => (
                      <li key={idx} className="mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold font-inter ${h.status === 'verified' ? 'bg-green-100 text-green-800' : h.status === 'declined' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{h.status}</span>
                        <span className="ml-2 text-xs text-gray-500">{new Date(h.changedAt).toLocaleString()} by {h.changedBy}</span>
                        {h.comment && <span className="ml-2 text-xs text-gray-500 italic">({h.comment})</span>}
                      </li>
                    ))}
                  </ol>
                </div>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4"
                  onClick={() => createReportPDF(viewingReport)}
                >
                  Preview as PDF
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default ReportVerification; 