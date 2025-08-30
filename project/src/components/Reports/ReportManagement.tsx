import React, { useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { FileText, Filter, Search, ClipboardEdit, ShieldCheck, Download, Printer } from 'lucide-react';
import { Report } from '../../types';
import { exportReportsToExcel, createReportPDF } from '../../utils/pdfGenerator';
import { Sparkles } from 'lucide-react';

const ReportManagement: React.FC = () => {
  const { reports, patients, doctors } = useData();
  const { user, hasPermission } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const enableAI = (import.meta as any).env?.VITE_ENABLE_AI === 'true';

  const filtered = useMemo(() => {
    const byStatus = statusFilter === 'all' ? reports : reports.filter(r => r.status === statusFilter);
    if (!search.trim()) return byStatus;
    const s = search.toLowerCase();
    return byStatus.filter(r => {
      const patient = patients.find(p => p.id === r.patientId);
      const doctor = doctors.find(d => d.id === r.doctorId);
      return (
        r.id.toLowerCase().includes(s) ||
        r.invoiceId.toLowerCase().includes(s) ||
        (patient?.name || '').toLowerCase().includes(s) ||
        (doctor?.name || '').toLowerCase().includes(s) ||
        r.tests.some(t => t.testName.toLowerCase().includes(s))
      );
    });
  }, [reports, statusFilter, search, patients, doctors]);

  const goto = (tab: string, reportId: string) => {
    localStorage.setItem('lab_selected_report_id', reportId);
    window.location.hash = `#${tab}`;
  };

  const onExport = () => {
    exportReportsToExcel(reports, patients, doctors);
  };

  const onPrint = async (report: Report) => {
    if (report.status !== 'verified') {
      alert('Please verify the report before printing.');
      return;
    }
    const patient = patients.find(p => p.id === report.patientId);
    const doctor = doctors.find(d => d.id === report.doctorId);
    await createReportPDF({
      reportId: report.id,
      patientName: patient?.name,
      patientAge: patient?.age,
      patientGender: patient?.gender,
      patientContact: patient?.contact,
      doctorName: doctor?.name || '-',
      tests: report.tests,
      interpretation: report.interpretation,
      criticalValues: report.criticalValues,
      verifiedBy: report.verifiedBy,
      verifiedAt: report.verifiedAt,
    });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="w-6 h-6" /> Reports</h1>
        {hasPermission('reports', 'export') && (
          <button onClick={onExport} className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Download className="w-4 h-4" /> Export
          </button>
        )}
      </div>

      <div className="bg-white rounded-lg shadow p-4 mb-4 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border rounded px-2 py-1">
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="verified">Verified</option>
            <option value="locked">Locked</option>
          </select>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <Search className="w-4 h-4 text-gray-500" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by ID, patient, doctor, test" className="border rounded px-2 py-1 w-64" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3">Report ID</th>
              <th className="px-4 py-3">Invoice</th>
              <th className="px-4 py-3">Patient</th>
              <th className="px-4 py-3">Doctor</th>
              <th className="px-4 py-3">Tests</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(report => {
              const patient = patients.find(p => p.id === report.patientId);
              const doctor = doctors.find(d => d.id === report.doctorId);
              const canVerify = report.status === 'completed' && (hasPermission('report-verification', 'verify') || user?.role === 'admin' || user?.role === 'pathologist');
              return (
                <tr key={report.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{report.id}</td>
                  <td className="px-4 py-3">{report.invoiceId}</td>
                  <td className="px-4 py-3">{patient?.name || '-'}</td>
                  <td className="px-4 py-3">{doctor?.name || '-'}</td>
                  <td className="px-4 py-3">{report.tests.map(t => t.testName).join(', ')}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      report.status === 'verified' ? 'bg-green-100 text-green-700' :
                      report.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                      report.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                      report.status === 'locked' ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {report.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-2">
                      <button
                        onClick={() => onPrint(report)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-white ${report.status === 'verified' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        title={report.status === 'verified' ? 'Print (PDF)' : 'Verify report before printing'}
                        disabled={report.status !== 'verified'}
                      >
                        <Printer className="w-4 h-4" />
                      </button>
                      {hasPermission('reports', 'edit') && (
                        <button
                          onClick={() => goto('test-reporting', report.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                          title="Enter Results"
                        >
                          <ClipboardEdit className="w-4 h-4" />
                        </button>
                      )}
                      {enableAI && hasPermission('ai-feedback', 'view') && (
                        <button
                          onClick={() => goto('ai-feedback', report.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 bg-fuchsia-600 text-white rounded hover:bg-fuchsia-700"
                          title="AI Review"
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => canVerify && goto('report-verification', report.id)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded text-white ${canVerify ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-400 cursor-not-allowed'}`}
                        title={canVerify ? 'Verify' : 'Only authorized users can verify a completed report'}
                        disabled={!canVerify}
                      >
                        <ShieldCheck className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-gray-500">No reports found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-gray-500 mt-3">Logged in as: {user?.username}</p>
    </div>
  );
};

export default ReportManagement; 