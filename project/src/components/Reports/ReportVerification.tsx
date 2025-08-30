import React, { useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Lock } from 'lucide-react';
import { createReportPDF } from '../../utils/pdfGenerator';

const ReportVerification: React.FC = () => {
	const { reports, updateReport, patients, doctors } = useData();
	const { user, hasPermission } = useAuth();
	const selectedId = localStorage.getItem('lab_selected_report_id') || '';
	const report = useMemo(() => reports.find(r => r.id === selectedId) || reports[0], [reports, selectedId]);

	if (!report) {
		return <div className="p-6">No report selected.</div>;
	}

	const patient = patients.find(p => p.id === report.patientId);
	const doctor = doctors.find(d => d.id === report.doctorId);
	const canDownload = report.status === 'verified';
	const canVerifyPermission = report.status === 'completed' && (hasPermission('reports', 'verify') || user?.role === 'admin' || user?.role === 'pathologist');
	const canLockPermission = report.status === 'verified' && (hasPermission('reports', 'verify') || user?.role === 'admin' || user?.role === 'pathologist');

	const verify = () => {
		if (!canVerifyPermission) {
			alert('You do not have permission to verify reports.');
			return;
		}
		updateReport(report.id, { status: 'verified', userId: user?.id, verifiedBy: user?.name || user?.username, verifiedAt: new Date() as any });
		alert('Report verified');
	};

	const lock = () => {
		if (!canLockPermission) {
			alert(report.status !== 'verified' ? 'Locking is only allowed after verification.' : 'You do not have permission to lock reports.');
			return;
		}
		updateReport(report.id, { status: 'locked', userId: user?.id });
		alert('Report locked');
	};

	const downloadPdf = async () => {
		if (!canDownload) {
			alert('Please verify the report before printing.');
			return;
		}
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
				<div>
					<h1 className="text-2xl font-bold text-gray-900">Report Verification</h1>
					<p className="text-gray-600">Verify and approve completed test reports</p>
				</div>
			</div>

			{/* Show warning if tests were recently updated */}
			{report && report.statusHistory && report.statusHistory.length > 1 && (
				<div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
					<div className="flex items-center gap-2">
						<span className="text-amber-800">⚠️</span>
						<p className="text-sm text-amber-800">
							<strong>Test List Updated:</strong> This report's test list was recently modified from the invoice. 
							Please review all tests before verification to ensure all results are complete and accurate.
						</p>
					</div>
				</div>
			)}

			<div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
				<div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
					<div><strong>Report ID:</strong> {report.id}</div>
					<div><strong>Invoice:</strong> {report.invoiceId}</div>
					<div><strong>Patient:</strong> {patient?.name}</div>
					<div><strong>Doctor:</strong> {doctor?.name || '-'}</div>
					<div><strong>Status:</strong> {report.status}</div>
				</div>
			</div>

			<div className="flex gap-2 mb-6">
				<button onClick={verify} disabled={!canVerifyPermission} className={`inline-flex items-center gap-2 px-4 py-2 rounded text-white ${canVerifyPermission ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-gray-400 cursor-not-allowed'}`}>
					<CheckCircle2 className="w-4 h-4" /> Verify
				</button>
				<button onClick={lock} disabled={!canLockPermission} className={`inline-flex items-center gap-2 px-4 py-2 rounded text-white ${canLockPermission ? 'bg-gray-700 hover:bg-gray-800' : 'bg-gray-400 cursor-not-allowed'}`}>
					<Lock className="w-4 h-4" /> Lock
				</button>
				<button onClick={downloadPdf} disabled={!canDownload} className={`inline-flex items-center gap-2 px-4 py-2 rounded text-white ${canDownload ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'}`} title={canDownload ? 'Download PDF' : 'Verify report before printing'}>
					Download PDF
				</button>
			</div>

			{/* Live Preview */}
			<div className="bg-white shadow rounded overflow-hidden">
				<div className="w-full">
					<img src="/image.png" alt="Header" className="w-full" />
				</div>
				<div className="p-6">
					<div className="mb-4 border p-4 bg-gray-50">
						<div className="flex justify-between text-sm">
							<div>
								<p><strong>Patient:</strong> {patient?.name}</p>
								<p><strong>Age/Gender:</strong> {patient?.age} / {patient?.gender}</p>
								<p><strong>Contact:</strong> {patient?.contact}</p>
							</div>
							<div className="text-right">
								<p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
								<p><strong>Report ID:</strong> {report.id}</p>
								<p><strong>Ref. By:</strong> {doctor?.name || '-'}</p>
							</div>
						</div>
					</div>
					<table className="w-full text-sm border-collapse">
						<thead>
							<tr className="bg-blue-800 text-white">
								<th className="border px-3 py-2 text-left">Test</th>
								<th className="border px-3 py-2 text-center">Result</th>
								<th className="border px-3 py-2 text-center">Normal Range</th>
								<th className="border px-3 py-2 text-center">Unit</th>
								<th className="border px-3 py-2 text-center">Status</th>
							</tr>
						</thead>
						<tbody>
							{report.tests.map((t, idx) => (
								<React.Fragment key={t.testId}>
									<tr className={idx % 2 === 0 ? 'bg-gray-50' : ''}>
										<td className="border px-3 py-2 font-medium">{t.testName}</td>
										<td className="border px-3 py-2 text-center" style={{ color: t.isAbnormal ? '#dc2626' : undefined, fontWeight: t.isAbnormal ? 700 : 500 }}>{t.result}</td>
										<td className="border px-3 py-2 text-center">{t.normalRange}</td>
										<td className="border px-3 py-2 text-center">{t.unit || '-'}</td>
										<td className="border px-3 py-2 text-center">
											<span className={`font-semibold ${t.isAbnormal ? 'text-red-600' : 'text-green-600'}`}>{t.isAbnormal ? 'ABNORMAL' : 'NORMAL'}</span>
										</td>
									</tr>
									{Array.isArray(t.parameters) && t.parameters.length > 0 && (
										<tr>
											<td colSpan={5} className="p-0">
												<table className="w-full text-sm border-collapse">
													<thead>
														<tr className="bg-gray-200">
															<th className="border px-2 py-1 text-left">Parameter</th>
															<th className="border px-2 py-1 text-center">Result</th>
															<th className="border px-2 py-1 text-center">Normal Range</th>
															<th className="border px-2 py-1 text-center">Unit</th>
															<th className="border px-2 py-1 text-center">Status</th>
														</tr>
													</thead>
													<tbody>
														{t.parameters.map((p, i) => (
															<tr key={i} className={i % 2 === 0 ? '' : 'bg-gray-50'}>
																<td className="border px-2 py-1">{p.name}</td>
																<td className="border px-2 py-1 text-center" style={{ color: p.isAbnormal ? '#dc2626' : undefined, fontWeight: p.isAbnormal ? 700 : undefined }}>{p.result}</td>
																<td className="border px-2 py-1 text-center">{p.normalRange}</td>
																<td className="border px-2 py-1 text-center">{p.unit || '-'}</td>
																<td className="border px-2 py-1 text-center">
																	<span className={`font-semibold ${p.isAbnormal ? 'text-red-600' : 'text-green-600'}`}>{p.isAbnormal ? 'ABNORMAL' : 'NORMAL'}</span>
																</td>
															</tr>
														))}
													</tbody>
												</table>
											</td>
										</tr>
									)}
								</React.Fragment>
							))}
						</tbody>
					</table>

					{report.interpretation && (
						<div className="mt-4 border p-4 bg-gray-50">
							<h3 className="font-semibold text-blue-800 mb-2">Clinical Interpretation & Recommendations</h3>
							<div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: report.interpretation }} />
						</div>
					)}
				</div>
				<div className="w-full mt-4">
					<img src="/image copy.png" alt="Footer" className="w-full" />
				</div>
			</div>
		</div>
	);
};

export default ReportVerification; 