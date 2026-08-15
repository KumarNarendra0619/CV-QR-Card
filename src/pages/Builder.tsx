import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Eye, Printer, LayoutTemplate, Database, Link as LinkIcon, Download } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CVConfig } from '../store';
import type { CVData } from '../types/cv';
import { parseExcelFile, fetchGoogleSheetData } from '../utils/parser';
import { CVRenderer } from '../components/CVRenderer';
import { Alert } from '../components/Alert';

const defaultCVData: CVData = {
  profile: { name: 'John Doe', title: 'Researcher', email: 'john@example.com', phone: '', location: '', summary: '' },
  education: [], experience: [], publications: [], skills: []
};

export const Builder: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cvs, setCvs] = useLocalStorage<CVConfig[]>('cv_configs', []);

  const [config, setConfig] = useState<CVConfig | null>(null);
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const existing = cvs.find(c => c.id === id);
    if (existing) {
      setConfig(existing);
      if (existing.dataSourceType === 'gsheets' && existing.sheetId) {
        loadSheetData(existing.sheetId);
      }
    } else {
      navigate('/');
    }
  }, [id]);

  const loadSheetData = async (sheetId: string) => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await fetchGoogleSheetData(sheetId);
      if (data.profile.name === '' && data.education.length === 0) {
         setError('No data found. Ensure the sheet is public and tabs are named correctly (Profile, Education, etc).');
      } else {
         setCvData(data);
         setSuccess('Data synced successfully from Google Sheets.');
      }
    } catch (err) {
      setError('Failed to fetch Google Sheet data. Ensure it is published to the web.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const data = await parseExcelFile(file);
      setCvData(data);
      updateConfig({ dataSourceType: 'excel', title: data.profile.name ? `${data.profile.name}'s CV` : config?.title });
      setSuccess('Excel file parsed successfully.');
    } catch (err) {
      setError('Failed to parse Excel file. Ensure the format is correct.');
    } finally {
      setLoading(false);
    }
  };

  const updateConfig = (updates: Partial<CVConfig>) => {
    if (!config) return;
    const newConfig = { ...config, ...updates, lastUpdated: new Date().toISOString() };
    setConfig(newConfig);
    setCvs(cvs.map(c => c.id === id ? newConfig : c));
  };

  const handlePrint = () => {
    window.print();
  };

  if (!config) return null;

  return (
    <div className="flex h-screen bg-gray-50 flex-col overflow-hidden font-sans print:h-auto print:overflow-visible print:block print:bg-white">
      {/* Topbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 z-10 print:hidden shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <input
            type="text"
            value={config.title}
            onChange={(e) => updateConfig({ title: e.target.value })}
            className="text-lg font-bold text-gray-900 bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-3 py-1 hover:bg-gray-50 transition-colors w-64"
            placeholder="CV Title..."
          />
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => window.open(`/#/cv/${id}`, '_blank')} className="px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 flex items-center gap-2 transition-colors">
            <Eye className="w-4 h-4 text-gray-500" /> Public View
          </button>
          <button onClick={handlePrint} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg shadow-sm hover:bg-blue-500 flex items-center gap-2 transition-colors">
            <Printer className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-hidden flex print:h-auto print:overflow-visible print:block relative">

        {/* Config Sidebar */}
        <div className="w-[400px] bg-white border-r border-gray-200 overflow-y-auto print:hidden shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-10">
          <div className="p-6 space-y-8">

            {/* Alerts */}
            {(error || success) && (
              <div className="space-y-3">
                {error && <Alert type="error" message={error} />}
                {success && <Alert type="success" message={success} />}
              </div>
            )}

            {/* Data Source Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Data Source</h2>
              </div>

              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-5">
                <div className="grid grid-cols-2 gap-2 p-1 bg-gray-200/50 rounded-lg mb-4">
                   <button
                     onClick={() => updateConfig({ dataSourceType: 'gsheets' })}
                     className={`py-2 text-sm font-medium rounded-md transition-colors ${config.dataSourceType === 'gsheets' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                   >
                     Google Sheets
                   </button>
                   <button
                     onClick={() => updateConfig({ dataSourceType: 'excel' })}
                     className={`py-2 text-sm font-medium rounded-md transition-colors ${config.dataSourceType === 'excel' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                   >
                     Excel Upload
                   </button>
                </div>

                {config.dataSourceType === 'gsheets' ? (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Sheet ID</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <LinkIcon className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={config.sheetId || ''}
                        onChange={(e) => updateConfig({ sheetId: e.target.value })}
                        placeholder="e.g. 1BxiMvs0XRY..."
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                      />
                    </div>
                    <button
                      onClick={() => config.sheetId && loadSheetData(config.sheetId)}
                      disabled={!config.sheetId || loading}
                      className="w-full bg-gray-900 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-800 disabled:opacity-50 transition-colors flex justify-center items-center gap-2 shadow-sm"
                    >
                      {loading ? (
                         <><svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Syncing...</>
                      ) : 'Sync Data'}
                    </button>
                    <p className="text-[11px] text-gray-500 leading-relaxed mt-2 text-center">
                      Document must be published to the web. <a href="#" className="text-blue-600 hover:underline">Learn how</a>.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Upload File</label>
                    <label className="flex flex-col items-center justify-center w-full h-36 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-xl cursor-pointer hover:border-blue-400 hover:bg-blue-50 group">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-8 h-8 text-gray-400 mb-3 group-hover:text-blue-500 transition-colors" />
                            <p className="mb-2 text-sm text-gray-500 font-medium">
                              {loading ? 'Processing...' : <><span className="text-blue-600 font-semibold">Click to upload</span> or drag and drop</>}
                            </p>
                            <p className="text-xs text-gray-400">XLSX or XLS files only</p>
                        </div>
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" disabled={loading} />
                    </label>
                    <div className="text-center">
                       <a href="/template.xlsx" className="inline-flex items-center gap-1 text-xs text-blue-600 font-medium hover:underline">
                         <Download className="w-3 h-3" /> Download Excel Template
                       </a>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Template Section */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <LayoutTemplate className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-gray-900">Template</h2>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateConfig({ template: 'modern' })}
                  className={`group relative p-1 rounded-xl transition-all ${config.template === 'modern' ? 'bg-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'hover:bg-gray-200'}`}
                >
                   <div className="bg-white rounded-lg p-3 border border-gray-100 h-full">
                     <div className="w-full h-24 bg-gray-50 rounded-md mb-3 flex flex-row overflow-hidden border border-gray-200 group-hover:border-gray-300 transition-colors">
                        <div className="w-1/3 bg-slate-800 h-full"></div>
                        <div className="w-2/3 bg-white h-full p-2 space-y-1.5">
                           <div className="w-3/4 h-1 bg-gray-300 rounded"></div>
                           <div className="w-full h-0.5 bg-gray-200 rounded"></div>
                           <div className="w-5/6 h-0.5 bg-gray-200 rounded"></div>
                        </div>
                     </div>
                     <span className={`block text-center text-sm font-semibold ${config.template === 'modern' ? 'text-blue-700' : 'text-gray-700'}`}>Modern</span>
                   </div>
                </button>

                <button
                  onClick={() => updateConfig({ template: 'academic' })}
                  className={`group relative p-1 rounded-xl transition-all ${config.template === 'academic' ? 'bg-blue-500 ring-2 ring-blue-500 ring-offset-2' : 'hover:bg-gray-200'}`}
                >
                   <div className="bg-white rounded-lg p-3 border border-gray-100 h-full">
                     <div className="w-full h-24 bg-gray-50 rounded-md mb-3 flex flex-col items-center pt-3 px-2 border border-gray-200 group-hover:border-gray-300 transition-colors">
                        <div className="w-1/2 h-1.5 bg-slate-800 rounded mb-3"></div>
                        <div className="w-full h-0.5 bg-gray-300 rounded mb-1.5"></div>
                        <div className="w-full h-0.5 bg-gray-200 rounded mb-1"></div>
                        <div className="w-5/6 h-0.5 bg-gray-200 rounded"></div>
                     </div>
                     <span className={`block text-center text-sm font-semibold ${config.template === 'academic' ? 'text-blue-700' : 'text-gray-700'}`}>Academic</span>
                   </div>
                </button>
              </div>
            </section>
          </div>
        </div>

        {/* Live Preview Desk */}
        <div className="flex-1 bg-gray-200/80 overflow-auto print:h-auto print:bg-white print:overflow-visible relative">
           {/* Desk texture overlay */}
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none print:hidden"></div>

           <div className="py-12 px-8 min-w-fit flex justify-center print:p-0">
             <div className="bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] print:shadow-none print:m-0 transition-all duration-500 ease-in-out origin-top relative group">
               {/* Page indicator for non-print */}
               <div className="absolute -left-12 top-0 bottom-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
                 <div className="h-full w-px bg-gray-400/50 absolute left-1/2"></div>
                 <span className="bg-gray-700 text-white text-[10px] font-bold px-2 py-1 rounded-full z-10 rotate-[-90deg] uppercase tracking-widest whitespace-nowrap">A4 Size</span>
               </div>

               <CVRenderer data={cvData} template={config.template} />
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};
