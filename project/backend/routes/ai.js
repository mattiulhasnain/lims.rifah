const express = require('express');
const router = express.Router();

const { GoogleGenerativeAI } = require('@google/generative-ai');
const rateLimit = require('express-rate-limit');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
	console.warn('GEMINI_API_KEY is not set. /api/ai endpoints will return 503 until configured.');
}

// Per-route rate limiter for AI calls
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 12,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post('/review', aiLimiter, async (req, res) => {
	try {
		if (!GEMINI_API_KEY) {
			return res.status(503).json({ error: 'AI service not configured' });
		}

		const { report, patient, doctor, notes, options } = req.body || {};
		if (!report || !patient) {
			return res.status(400).json({ error: 'Missing report or patient data' });
		}

		const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
		const modelName = options?.model || 'gemini-1.5-flash';
		const model = genAI.getGenerativeModel({ model: modelName });

		const prompt = buildPrompt({ report, patient, doctor, notes, options });
		const result = await model.generateContent(prompt);
		const text = result?.response?.text?.() || 'No response';

		return res.json({ feedback: text });
	} catch (err) {
		console.error('AI review error:', err);
		return res.status(500).json({ error: 'Failed to generate AI feedback' });
	}
});

function buildPrompt({ report, patient, doctor, notes, options }) {
	const testsArray = (report.tests || []);
	const filteredTests = options?.abnormalOnly
		? testsArray.filter(t => t.isAbnormal || t.isCritical || (t.parameters || []).some(p => p.isAbnormal || p.isCritical))
		: testsArray;
	const testsText = filteredTests
		.map(t => {
			const params = (t.parameters || [])
				.map(p => `- ${p.name}: ${p.result} ${p.unit || ''} (Range: ${p.normalRange})${p.isAbnormal ? ' [abnormal]' : ''}${p.isCritical ? ' [CRITICAL]' : ''}`)
				.join('\n');
			return `Test: ${t.testName}
Result: ${t.result}${t.unit ? ' ' + t.unit : ''}
Range: ${t.normalRange}
${params ? `Parameters:\n${params}` : ''}`;
		})
		.join('\n\n');

	const tone = options?.tone || 'clinician-friendly';
	const language = options?.language || 'English';
	const target = options?.target || 'clinician';
	const maxWords = options?.maxWords || 250;
	return `You are a senior clinical pathologist assistant. Review the following lab report for potential issues, flag critical values, and provide a concise, ${tone} summary in ${language} for a ${target} audience. Avoid definitive diagnoses. Use bullet points. Limit to about ${maxWords} words.

Patient:
- Name: ${patient.name}
- Age: ${patient.age}
- Gender: ${patient.gender}
${patient.medicalHistory ? `- History: ${patient.medicalHistory}` : ''}

Doctor: ${doctor ? doctor.name : 'N/A'}
Report ID: ${report.id}
Status: ${report.status}
Tests:
${testsText || 'No tests listed'}

${notes ? `Additional notes: ${notes}` : ''}

Format:
- Key findings
- Abnormal/critical values (with brief context)
- Potential interferences/pre-analytical considerations
- Suggested next steps/follow-up tests
- Communication notes for clinician`;
}

module.exports = router; 