import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Settings, QrCode } from 'lucide-react';
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
    <div className="max-w-5xl mx-auto p-8">
      <header className="mb-10 flex justify-between items-center border-b pb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">My Resumes</h1>
          <p className="text-gray-500">Manage your automated academic CVs.</p>
        </div>
        <button
          onClick={createNewCV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          Create New CV
        </button>
      </header>

      {cvs.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">No CVs yet</h2>
          <p className="text-gray-500 mb-6">Create your first automated CV by importing a Google Sheet or Excel file.</p>
          <button
            onClick={createNewCV}
            className="text-blue-600 font-medium hover:underline"
          >
            Get Started &rarr;
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map(cv => (
            <div key={cv.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-1 truncate">{cv.title}</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Last updated: {new Date(cv.lastUpdated).toLocaleDateString()}
                </p>
                <div className="flex items-center gap-2 text-xs font-medium bg-gray-100 w-fit px-2 py-1 rounded text-gray-600 mb-6">
                  <span className="uppercase">{cv.dataSourceType}</span> • <span className="capitalize">{cv.template}</span>
                </div>

                <div className="flex gap-2">
                   <button
                     onClick={() => navigate(`/build/${cv.id}`)}
                     className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800 flex items-center justify-center gap-2"
                   >
                     <Settings className="w-4 h-4" />
                     Edit
                   </button>
                   <button
                     onClick={() => navigate(`/card/${cv.id}`)}
                     className="px-4 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center justify-center"
                     title="View QR Card"
                   >
                     <QrCode className="w-4 h-4" />
                   </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
