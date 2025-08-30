import React, { useMemo, useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import { Report, ReportTestParameter, Test } from '../../types';
import { Save, CheckCircle, AlertTriangle, Download } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const TestReporting: React.FC = () => {
  const { reports, updateReport, patients, doctors, tests } = useData();
  const { user, hasPermission } = useAuth();
  const selectedId = localStorage.getItem('lab_selected_report_id') || '';
  const report = useMemo(() => reports.find(r => r.id === selectedId) || reports[0], [reports, selectedId]);
  const [local, setLocal] = useState(report);
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Load parameter templates from test management when report changes
  useEffect(() => {
    if (report && tests.length > 0) {
      console.log('TestReporting: Loading parameter templates for report:', report.id);
      console.log('Available tests with templates:', tests.filter(t => t.parameterTemplates && t.parameterTemplates.length > 0));
      
      const updatedTests = report.tests.map(reportTest => {
        const testTemplate = tests.find(t => t.id === reportTest.testId);
        console.log(`TestReporting: Processing test ${reportTest.testName} (${reportTest.testId})`);
        console.log(`TestReporting: Found template:`, testTemplate);
        
        if (testTemplate && testTemplate.parameterTemplates && testTemplate.parameterTemplates.length > 0) {
          console.log(`TestReporting: Test has ${testTemplate.parameterTemplates.length} parameter templates`);
          // If test has parameter templates but report test doesn't have parameters, load them
          if (!reportTest.parameters || reportTest.parameters.length === 0) {
            const parameters: ReportTestParameter[] = testTemplate.parameterTemplates.map(template => ({
              name: template.name,
              result: '',
              normalRange: template.normalRange,
              unit: template.unit || '',
              isAbnormal: false
            }));
            
            // Also populate the main test fields with the first parameter's template values
            const firstParam = testTemplate.parameterTemplates[0];
            console.log(`TestReporting: Populating main fields with first parameter:`, firstParam);
            
            return { 
              ...reportTest, 
              parameters,
              normalRange: firstParam.normalRange,
              unit: firstParam.unit || ''
            };
          }
        }
        return reportTest;
      });
      
      if (JSON.stringify(updatedTests) !== JSON.stringify(report.tests)) {
        console.log('TestReporting: Updating tests with template data');
        setLocal({ ...report, tests: updatedTests });
      }
    }
  }, [report, tests]);

  if (!report) {
    return <div className="p-6">No report selected.</div>;
  }

  const patient = patients.find(p => p.id === report.patientId);
  const doctor = doctors.find(d => d.id === report.doctorId);
  const readOnly = report.status === 'verified' || report.status === 'locked' || !hasPermission('reports', 'edit');

  const setResult = (index: number, field: 'result' | 'normalRange' | 'unit' | 'isAbnormal', value: any) => {
    if (readOnly) return;
    const copy: Report = JSON.parse(JSON.stringify(local));
    // @ts-expect-error
    copy.tests[index][field] = value;
    
    // Sync first parameter result with main test result for consistency
    if (field === 'result' && copy.tests[index].parameters && copy.tests[index].parameters.length > 0) {
      copy.tests[index].parameters[0].result = value;
    }
    
    setLocal(copy);
  };

  const updateParam = (testIdx: number, paramIdx: number, field: keyof ReportTestParameter, value: any) => {
    if (readOnly) return;
    const copy: Report = JSON.parse(JSON.stringify(local));
    // @ts-expect-error
    copy.tests[testIdx].parameters[paramIdx][field] = value;
    
    // Sync main test result with first parameter result for better UX
    if (field === 'result' && paramIdx === 0) {
      copy.tests[testIdx].result = value;
    }
    
    setLocal(copy);
  };

  const validateBeforeComplete = (): boolean => {
    const hasEmpty = local.tests.some(t => !t.result && (!t.parameters || t.parameters.length === 0));
    if (hasEmpty) {
      alert('Please enter results for all tests before completing.');
      return false;
    }
    return true;
  };

  const saveProgress = () => {
    if (readOnly) return;
    updateReport(report.id, { tests: local.tests, interpretation: (local as any).interpretation || '', status: 'in_progress', userId: user?.id });
    alert('Progress saved');
  };

  const markCompleted = () => {
    if (readOnly) return;
    if (!validateBeforeComplete()) return;
    updateReport(report.id, { tests: local.tests, interpretation: (local as any).interpretation || '', status: 'completed', userId: user?.id });
    alert('Report marked as completed');
  };

  const loadParameterTemplates = (testIndex: number) => {
    if (readOnly) return;
    const test = local.tests[testIndex];
    const testTemplate = tests.find(t => t.id === test.testId);
    
    console.log(`TestReporting: Manually loading templates for test ${test.testName} (${test.testId})`);
    console.log(`TestReporting: Found template:`, testTemplate);
    
    if (testTemplate && testTemplate.parameterTemplates && testTemplate.parameterTemplates.length > 0) {
      console.log(`TestReporting: Loading ${testTemplate.parameterTemplates.length} parameters`);
      
      const parameters: ReportTestParameter[] = testTemplate.parameterTemplates.map(template => ({
        name: template.name,
        result: '',
        normalRange: template.normalRange,
        unit: template.unit || '',
        isAbnormal: false
      }));
      
      const copy: Report = JSON.parse(JSON.stringify(local));
      copy.tests[testIndex].parameters = parameters;
      
      // Also populate the main test fields with the first parameter's template values
      const firstParam = testTemplate.parameterTemplates[0];
      copy.tests[testIndex].normalRange = firstParam.normalRange;
      copy.tests[testIndex].unit = firstParam.unit || '';
      
      console.log(`TestReporting: Updated test with parameters and main fields:`, copy.tests[testIndex]);
      
      setLocal(copy);
      alert(`Loaded ${parameters.length} parameters from test template`);
    } else {
      console.log(`TestReporting: No parameter templates found for test ${test.testName}`);
      alert('No parameter templates found for this test');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Enter Test Results</h1>

      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
          <div><strong>Report ID:</strong> {report.id}</div>
          <div><strong>Invoice:</strong> {report.invoiceId}</div>
          <div><strong>Patient:</strong> {patient?.name}</div>
          <div><strong>Doctor:</strong> {doctor?.name || '-'}</div>
          <div><strong>Status:</strong> {report.status}</div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
              <p className="text-sm text-gray-600">Enter test results using standard parameters from test management</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowDetailedView(!showDetailedView)}
                className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                  showDetailedView 
                    ? 'bg-blue-600 text-white border-blue-600 hover:bg-blue-700' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
                title={showDetailedView ? "Switch to simple view" : "Switch to detailed view"}
              >
                {showDetailedView ? "Simple View" : "Detailed View"}
              </button>
              
              {/* Refresh button to sync with latest invoice changes */}
              <button
                onClick={() => {
                  // Force a refresh of the report data
                  const updatedReport = reports.find(r => r.id === report.id);
                  if (updatedReport) {
                    setLocal(updatedReport);
                  }
                }}
                className="px-3 py-2 text-sm font-medium rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
                title="Refresh report data to sync with latest invoice changes"
              >
                🔄 Refresh
              </button>
            </div>
          </div>
          <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Template System:</strong> When a test has parameter templates, the main fields will be automatically populated with the first parameter's values. 
              Use the "Load Standard Parameters" button to load all parameters, or manually enter results in the main fields.
              {showDetailedView && " You can now see both the main test fields and detailed parameters simultaneously."}
            </p>
          </div>
          
          {/* Show warning if tests were recently updated */}
          {report && report.statusHistory && report.statusHistory.length > 1 && (
            <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-amber-800">⚠️</span>
                <p className="text-sm text-amber-800">
                  <strong>Test List Updated:</strong> This report's test list was recently modified from the invoice. 
                  Please review all tests and ensure results are entered for any newly added tests.
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                {/* Show these headers when detailed view is enabled OR when no parameters are loaded */}
                {(showDetailedView || !local.tests.some(t => t.parameters && t.parameters.length > 0)) && (
                  <>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Result</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Normal Range</th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit</th>
                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Abnormal</th>
                  </>
                )}
                {/* Show summary header when parameters are loaded and not in detailed view */}
                {(!showDetailedView && local.tests.some(t => t.parameters && t.parameters.length > 0)) && (
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                )}
                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Parameters</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {local.tests.map((t, idx) => (
                <tr key={t.testId} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{t.testName}</div>
                    {t.parameters && t.parameters.length > 0 && (
                      <div className="text-xs text-blue-600 mt-1">
                        ✓ {t.parameters.length} parameter{t.parameters.length !== 1 ? 's' : ''} loaded
                      </div>
                    )}
                  </td>
                  
                  {/* Show main test fields when detailed view is enabled OR when NO parameters are loaded */}
                  {(showDetailedView || !t.parameters || t.parameters.length === 0) ? (
                    <>
                      <td className="px-6 py-4">
                        <input 
                          disabled={readOnly} 
                          value={t.result} 
                          onChange={e => setResult(idx, 'result', e.target.value)} 
                          placeholder="Enter result"
                          className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${
                            t.parameters && t.parameters.length > 0 && !showDetailedView ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
                          }`}
                        />
                        {t.parameters && t.parameters.length > 0 && !showDetailedView && (
                          <div className="text-xs text-blue-600 mt-1">Template available</div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          disabled={readOnly} 
                          value={t.normalRange} 
                          onChange={e => setResult(idx, 'normalRange', e.target.value)} 
                          placeholder="Normal range"
                          className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${
                            t.parameters && t.parameters.length > 0 && !showDetailedView ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
                          }`}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input 
                          disabled={readOnly} 
                          value={t.unit || ''} 
                          onChange={e => setResult(idx, 'unit', e.target.value)} 
                          placeholder="Unit"
                          className={`w-full px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:text-gray-500 ${
                            t.parameters && t.parameters.length > 0 && !showDetailedView ? 'border-blue-300 bg-blue-50' : 'border-gray-300'
                          }`}
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <input 
                          disabled={readOnly} 
                          type="checkbox" 
                          checked={t.isAbnormal} 
                          onChange={e => setResult(idx, 'isAbnormal', e.target.checked)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded disabled:bg-gray-100"
                        />
                      </td>
                    </>
                  ) : (
                    <>
                      {/* When parameters are loaded and not in detailed view, show a summary view */}
                      <td className="px-6 py-4" colSpan={4}>
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Template loaded:</span> {t.parameters.length} parameter{t.parameters.length !== 1 ? 's' : ''} available
                        </div>
                      </td>
                    </>
                  )}
                  
                  <td className="px-6 py-4">
                    <div className="space-y-3">
                      {/* Load Parameters Button - Only show if no parameters loaded */}
                      {(!t.parameters || t.parameters.length === 0) && (
                        <div className="text-center">
                          <button 
                            disabled={readOnly} 
                            onClick={() => loadParameterTemplates(idx)} 
                            className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${readOnly ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm'}`}
                            title="Load parameters from test template"
                          >
                            <Download className="w-4 h-4" /> Load Standard Parameters
                          </button>
                        </div>
                      )}
                      
                      {/* Parameters List - Only show if parameters exist */}
                      {(t.parameters && t.parameters.length > 0) && (
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-medium text-gray-700">
                                {t.parameters.length} Parameter{t.parameters.length !== 1 ? 's' : ''}
                              </span>
                              <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded">Standard Template Values</span>
                            </div>
                          </div>
                          
                          <div className="divide-y divide-gray-200">
                            {t.parameters.map((p, pIdx) => (
                              <div key={pIdx} className="p-3">
                                <div className="grid grid-cols-4 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Parameter</label>
                                    <input 
                                      disabled={true} 
                                      value={p.name} 
                                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm bg-gray-50 text-gray-700" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Result</label>
                                    <input 
                                      disabled={readOnly} 
                                      value={p.result} 
                                      onChange={e => updateParam(idx, pIdx, 'result', e.target.value)} 
                                      placeholder="Enter result" 
                                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Normal Range</label>
                                    <input 
                                      disabled={true} 
                                      value={p.normalRange} 
                                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm bg-gray-50 text-gray-700" 
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs font-medium text-gray-600 mb-1">Unit</label>
                                    <input 
                                      disabled={true} 
                                      value={p.unit || ''} 
                                      className="w-full px-2 py-1 border border-gray-200 rounded text-sm bg-gray-50 text-gray-700" 
                                    />
                                  </div>
                                </div>
                                {/* Add abnormal checkbox for each parameter */}
                                <div className="mt-2 flex items-center gap-2">
                                  <input 
                                    disabled={readOnly} 
                                    type="checkbox" 
                                    checked={p.isAbnormal} 
                                    onChange={e => updateParam(idx, pIdx, 'isAbnormal', e.target.checked)}
                                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded disabled:bg-gray-100"
                                  />
                                  <label className="text-xs text-gray-600">Mark as abnormal</label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-4 mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Narrative / Interpretation</label>
        <ReactQuill readOnly={readOnly} theme={readOnly ? undefined : 'snow'} value={(local as any)?.interpretation || ''} onChange={html => !readOnly && setLocal({ ...(local as any), interpretation: html })} />
      </div>

      <div className="mt-4 flex gap-2">
        <button disabled={readOnly} onClick={saveProgress} className={`inline-flex items-center gap-2 px-4 py-2 rounded text-white ${readOnly ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
          <Save className="w-4 h-4" /> Save Progress
        </button>
        <button disabled={readOnly} onClick={markCompleted} className={`inline-flex items-center gap-2 px-4 py-2 rounded text-white ${readOnly ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
          <CheckCircle className="w-4 h-4" /> Mark Completed
        </button>
        {local.tests.some(t => t.isAbnormal || (t.parameters || []).some(p => p.isAbnormal)) && (
          <div className="inline-flex items-center gap-1 text-amber-700 bg-amber-50 px-3 py-2 rounded">
            <AlertTriangle className="w-4 h-4" /> Abnormal results present
          </div>
        )}
      </div>
    </div>
  );
};

export default TestReporting; 