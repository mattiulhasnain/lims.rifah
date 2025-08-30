import React, { useEffect, useMemo, useState } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Loader2, AlertTriangle, Copy, Check, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const AIFeedback: React.FC = () => {
	const { reports, patients, doctors, addReportComment } = useData() as any;
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [feedback, setFeedback] = useState<string>('');
	const [notes, setNotes] = useState<string>('');
	const [tone, setTone] = useState<string>('clinician-friendly');
	const [language, setLanguage] = useState<string>('English');
	const [maxWords, setMaxWords] = useState<number>(250);
	const [copied, setCopied] = useState<boolean>(false);
	const [abnormalOnly, setAbnormalOnly] = useState<boolean>(false);
	const [model, setModel] = useState<string>('gemini-1.5-flash');

	const selectedReportId = useMemo(() => localStorage.getItem('lab_selected_report_id') || '', []);
	const report = reports.find((r: any) => r.id === selectedReportId);
	const patient = report ? patients.find((p: any) => p.id === report.patientId) : undefined;
	const doctor = report ? doctors.find((d: any) => d.id === report.doctorId) : undefined;

	const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
	const aiEnabled = (import.meta as any).env?.VITE_ENABLE_AI !== 'false';

	const buildLocalSummary = (): string => {
		if (!report) return '';
		const abnormalTests = (report.tests || []).filter((t: any) => t.isAbnormal || t.isCritical || (t.parameters || []).some((p: any) => p.isAbnormal || p.isCritical));
		const lines: string[] = [];
		lines.push(`Key findings:`);
		(abnormalOnly && abnormalTests.length > 0 ? abnormalTests : (report.tests || [])).forEach((t: any) => {
			const status = t.isAbnormal ? 'abnormal' : (t.isCritical ? 'CRITICAL' : 'normal');
			lines.push(`- ${t.testName}: ${t.result}${t.unit ? ' ' + t.unit : ''} (Range: ${t.normalRange}) [${status}]`);
			(t.parameters || []).forEach((p: any) => {
				const pStatus = p.isAbnormal ? 'abnormal' : (p.isCritical ? 'CRITICAL' : 'normal');
				lines.push(`  • ${p.name}: ${p.result}${p.unit ? ' ' + p.unit : ''} (Range: ${p.normalRange}) [${pStatus}]`);
			});
		});
		if (notes) {
			lines.push('');
			lines.push(`Context: ${notes}`);
		}
		lines.push('');
		lines.push('Suggested next steps:');
		lines.push('- Correlate clinically.');
		lines.push('- Consider repeat or confirmatory testing if results are unexpected.');
		return lines.join('\n');
	};

	const generate = async () => {
		if (!report || !patient) {
			setError('No report selected. Go to Reports and click AI Review.');
			return;
		}
		setError(null);
		setLoading(true);
		setFeedback('');
		try {
			if (!aiEnabled) {
				setFeedback(buildLocalSummary());
				return;
			}

			const res = await fetch(`${apiBase}/ai/review`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ report, patient, doctor, notes, options: { tone, language, maxWords, target: 'clinician', abnormalOnly, model } })
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error || `Request failed (${res.status})`);
			}
			const data = await res.json();
			setFeedback(data.feedback || 'No feedback received');
		} catch (e: any) {
			const message = (e?.message || '').toString();
			if (message.includes('503') || message.toLowerCase().includes('ai service not configured')) {
				setFeedback(buildLocalSummary());
				setError(null);
			} else {
				setError(message || 'Failed to get AI feedback');
			}
		} finally {
			setLoading(false);
		}
	};

	const copyFeedback = async () => {
		try {
			await navigator.clipboard.writeText(feedback);
			setCopied(true);
			setTimeout(() => setCopied(false), 1500);
		} catch {}
	};

	const saveToComments = () => {
		if (!report || !feedback) return;
		addReportComment(report.id, {
			userId: user?.id || 'System',
			comment: `[AI Feedback]\n\n${feedback}`,
			createdAt: new Date()
		});
	};

	useEffect(() => {
		// Auto-generate on load if a report is present
		if (report && patient) {
			generate();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold flex items-center gap-2"><Sparkles className="w-6 h-6 text-fuchsia-600" /> AI Report Review</h1>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-1 space-y-4">
					<div className="bg-white rounded-lg shadow p-4">
						<h2 className="font-semibold mb-3">Context</h2>
						<div className="text-sm text-gray-700 space-y-1">
							<p><strong>Report:</strong> {report?.id || '-'}</p>
							<p><strong>Patient:</strong> {patient ? `${patient.name} (${patient.age}y, ${patient.gender})` : '-'}</p>
							<p><strong>Doctor:</strong> {doctor?.name || '-'}</p>
						</div>
					</div>
					<div className="bg-white rounded-lg shadow p-4">
						<h2 className="font-semibold mb-2">AI settings</h2>
						<div className="grid grid-cols-2 gap-2">
							<label className="text-sm">
								<span className="block text-gray-600 mb-1">Tone</span>
								<select className="w-full border rounded p-2" value={tone} onChange={e => setTone(e.target.value)}>
									<option value="clinician-friendly">Clinician-friendly</option>
									<option value="patient-friendly">Patient-friendly</option>
									<option value="formal">Formal</option>
									<option value="bullet-summary">Bullet summary</option>
								</select>
							</label>
							<label className="text-sm">
								<span className="block text-gray-600 mb-1">Language</span>
								<input className="w-full border rounded p-2" value={language} onChange={e => setLanguage(e.target.value)} />
							</label>
							<label className="text-sm">
								<span className="block text-gray-600 mb-1">Max words</span>
								<input type="number" min={100} max={600} className="w-full border rounded p-2" value={maxWords} onChange={e => setMaxWords(parseInt(e.target.value || '0') || 250)} />
							</label>
							<label className="text-sm">
								<span className="block text-gray-600 mb-1">Model</span>
								<select className="w-full border rounded p-2" value={model} onChange={e => setModel(e.target.value)}>
									<option value="gemini-1.5-flash">Gemini 1.5 Flash (fast)</option>
									<option value="gemini-1.5-pro">Gemini 1.5 Pro (better)</option>
								</select>
							</label>
						</div>
						<label className="inline-flex items-center gap-2 mt-2 text-sm">
							<input type="checkbox" className="h-4 w-4" checked={abnormalOnly} onChange={e => setAbnormalOnly(e.target.checked)} />
							<span>Focus on abnormal/critical findings only</span>
						</label>
					</div>
					<div className="bg-white rounded-lg shadow p-4">
						<h2 className="font-semibold mb-2">Optional notes</h2>
						<textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Include clinical question, suspected condition, or context"
							className="w-full border rounded p-2 min-h-[100px]" />
						<div className="mt-3 flex gap-2">
							<button onClick={generate} disabled={loading}
								className={`inline-flex items-center gap-2 px-4 py-2 rounded text-white ${loading ? 'bg-fuchsia-400' : 'bg-fuchsia-600 hover:bg-fuchsia-700'}`}>
								{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
								<span>{loading ? 'Analyzing…' : aiEnabled ? 'Generate Feedback' : 'Generate Summary'}</span>
							</button>
							<button onClick={copyFeedback} disabled={!feedback}
								className={`inline-flex items-center gap-2 px-3 py-2 rounded border ${feedback ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-400 cursor-not-allowed'}`}>
								{copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
								<span>{copied ? 'Copied' : 'Copy'}</span>
							</button>
							<button onClick={saveToComments} disabled={!feedback}
								className={`inline-flex items-center gap-2 px-3 py-2 rounded border ${feedback ? 'text-gray-700 hover:bg-gray-50' : 'text-gray-400 cursor-not-allowed'}`}>
								<Save className="w-4 h-4" />
								<span>Save to comments</span>
							</button>
						</div>
						{error && (
							<div className="mt-3 text-sm text-red-600 flex items-start gap-2">
								<AlertTriangle className="w-4 h-4 mt-0.5" />
								<span>{error}</span>
							</div>
						)}
					</div>
				</div>

				<div className="lg:col-span-2">
					<div className="bg-white rounded-lg shadow p-4 min-h-[300px]">
						<h2 className="font-semibold mb-3">AI Feedback</h2>
						{feedback ? (
							<div className="prose max-w-none prose-sm">
								<ReactMarkdown>{feedback}</ReactMarkdown>
							</div>
						) : (
							<p className="text-gray-500 text-sm">{loading ? 'Generating feedback…' : 'No feedback yet.'}</p>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default AIFeedback; 