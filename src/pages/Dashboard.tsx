import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Edit3, QrCode, Sparkles, Clock } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CVConfig } from '../store';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [cvs, setCvs] = useLocalStorage<CVConfig[]>('cv_configs', []);

  const createNewCV = () => {
    const newId = Math.random().toString(36).substr(2, 9);
    const newCv: CVConfig = {
      id: newId,
      title: 'Untitled CV',
      dataSourceType: 'gsheets',
      template: 'modern',
      lastUpdated: new Date().toISOString()
    };
    setCvs([...cvs, newCv]);
    navigate(`/build/${newId}`);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-12">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl mb-3">Your Resumes</h1>
        <p className="text-lg text-gray-500 max-w-2xl">Manage your automated academic CVs. Connect a data source and let the system handle the formatting.</p>
      </header>

      {cvs.length === 0 ? (
        <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 shadow-sm text-center py-24 px-6 sm:py-32">
          {/* Decorative background element */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -z-10"></div>

          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-blue-100 mb-8 shadow-inner">
            <Sparkles className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3 tracking-tight">No resumes yet</h2>
          <p className="text-gray-500 mb-8 max-w-md mx-auto text-base">Get started by creating your first automated CV. You can import data from a Google Sheet or upload an Excel file.</p>
          <button
            onClick={createNewCV}
            className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all hover:scale-105 active:scale-95"
          >
            Create Your First CV
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cvs.map(cv => (
            <div key={cv.id} className="group relative flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden cursor-pointer" onClick={() => navigate(`/build/${cv.id}`)}>
              {/* Card Header Pattern */}
              <div className="h-24 bg-gradient-to-br from-blue-50 to-gray-50 border-b border-gray-100 flex items-start justify-between p-5 relative overflow-hidden">
                 <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-100 rounded-full opacity-50 blur-xl group-hover:bg-blue-200 transition-colors"></div>
                 <div className="bg-white p-2.5 rounded-xl shadow-sm border border-gray-100 relative z-10 group-hover:scale-110 transition-transform">
                   <FileText className="w-5 h-5 text-blue-600" />
                 </div>
                 <div className="flex flex-col items-end relative z-10">
                   <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${cv.dataSourceType === 'gsheets' ? 'bg-green-50 text-green-700 ring-green-600/20' : 'bg-purple-50 text-purple-700 ring-purple-600/20'}`}>
                     {cv.dataSourceType === 'gsheets' ? 'Live Auto-Sync' : 'Static File'}
                   </span>
                 </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">{cv.title}</h3>

                <div className="flex items-center text-xs text-gray-500 mb-4 gap-1.5 font-medium">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Updated {new Date(cv.lastUpdated).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric'})}</span>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-3">
                   <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md capitalize">
                     {cv.template} Template
                   </span>

                   <div className="flex items-center gap-1">
                     <button
                       onClick={(e) => { e.stopPropagation(); navigate(`/card/${cv.id}`); }}
                       className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors tooltip-trigger relative"
                       title="Print QR ID Card"
                     >
                       <QrCode className="w-4 h-4" />
                     </button>
                     <button
                       onClick={(e) => { e.stopPropagation(); navigate(`/build/${cv.id}`); }}
                       className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                       title="Edit Config"
                     >
                       <Edit3 className="w-4 h-4" />
                     </button>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
