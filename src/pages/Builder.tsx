import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Upload, Eye, Printer, AlertCircle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CVConfig } from '../store';
import type { CVData } from '../types/cv';
import { parseExcelFile, fetchGoogleSheetData } from '../utils/parser';
import { CVRenderer } from '../components/CVRenderer';

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
  const [activeTab, setActiveTab] = useState<'config' | 'preview'>('config');

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
    try {
      const data = await fetchGoogleSheetData(sheetId);
      setCvData(data);
    } catch (err) {
      setError('Failed to fetch Google Sheet data. Ensure it is public.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const data = await parseExcelFile(file);
      setCvData(data);
      updateConfig({ dataSourceType: 'excel', title: data.profile.name ? `${data.profile.name}'s CV` : config?.title });
    } catch (err) {
      setError('Failed to parse Excel file.');
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

  if (!config) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-50 flex-col overflow-hidden">
      {/* Topbar */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between shrink-0 print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <input
            type="text"
            value={config.title}
            onChange={(e) => updateConfig({ title: e.target.value })}
            className="text-xl font-bold bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2"
          />
        </div>

        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'config' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('config')}
          >
            Configure
          </button>
          <button
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${activeTab === 'preview' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => window.open(`/#/cv/${id}`, '_blank')} className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2">
            <Eye className="w-4 h-4" /> Public View
          </button>
          <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
            <Printer className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 overflow-auto flex print:overflow-visible print:block">

        {/* Config Panel */}
        {activeTab === 'config' && (
          <div className="w-full max-w-2xl mx-auto p-8 print:hidden">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-xl font-bold mb-6">Data Source</h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Import Method</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="datasource"
                        checked={config.dataSourceType === 'gsheets'}
                        onChange={() => updateConfig({ dataSourceType: 'gsheets' })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Google Sheets</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="datasource"
                        checked={config.dataSourceType === 'excel'}
                        onChange={() => updateConfig({ dataSourceType: 'excel' })}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">Excel Upload</span>
                    </label>
                  </div>
                </div>

                {config.dataSourceType === 'gsheets' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Google Sheet ID</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={config.sheetId || ''}
                        onChange={(e) => updateConfig({ sheetId: e.target.value })}
                        placeholder="e.g. 1BxiMvs0XRY..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                      />
                      <button
                        onClick={() => config.sheetId && loadSheetData(config.sheetId)}
                        disabled={!config.sheetId || loading}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50"
                      >
                        {loading ? 'Loading...' : 'Fetch'}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Ensure the sheet is published to the web or set to "Anyone with the link can view".</p>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Upload Excel File</label>
                    <label className="flex justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
                        <span className="flex items-center space-x-2">
                            <Upload className="w-6 h-6 text-gray-600" />
                            <span className="font-medium text-gray-600">
                                {loading ? 'Processing...' : 'Drop files to Attach, or browse'}
                            </span>
                        </span>
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" disabled={loading} />
                    </label>
                  </div>
                )}

                {error && (
                  <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> {error}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
              <h2 className="text-xl font-bold mb-6">Template Selection</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => updateConfig({ template: 'modern' })}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center transition-all ${config.template === 'modern' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                   <div className="w-full h-24 bg-gray-100 rounded mb-3 flex flex-row">
                      <div className="w-1/3 bg-gray-300 h-full rounded-l"></div>
                      <div className="w-2/3 bg-gray-200 h-full rounded-r"></div>
                   </div>
                   <span className="font-medium text-gray-900">Modern Sidebar</span>
                </button>
                <button
                  onClick={() => updateConfig({ template: 'academic' })}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center justify-center transition-all ${config.template === 'academic' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}
                >
                   <div className="w-full h-24 bg-gray-100 rounded mb-3 flex flex-col items-center pt-2">
                      <div className="w-1/2 h-2 bg-gray-400 rounded mb-2"></div>
                      <div className="w-full h-1 bg-gray-300 rounded mb-1"></div>
                      <div className="w-full h-1 bg-gray-300 rounded"></div>
                   </div>
                   <span className="font-medium text-gray-900">Classic Academic</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Panel */}
        <div className={`${activeTab === 'preview' ? 'w-full block' : 'hidden'} lg:block w-full bg-gray-500 p-8 overflow-auto print:p-0 print:bg-white print:overflow-visible`}>
           <div className="print:m-0 mx-auto shadow-2xl">
             <CVRenderer data={cvData} template={config.template} />
           </div>
        </div>

      </div>
    </div>
  );
};
