import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FileText, Plus } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CVConfig } from '../store';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
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

  const isHome = location.pathname === '/';

  // Don't show full navbar on builder, public, or card views to keep them clean,
  // or only show a slim one. Since builder has its own topbar, we might only use this on Dashboard.
  // Actually, a global navbar is good, but builder has a specific header. Let's make it a general layout component
  // that can be customized or hidden. For this app, it's best placed in Dashboard for now, or App layout.

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <FileText className="w-5 h-5" />
              </div>
              <span className="font-bold text-xl text-gray-900 tracking-tight">CVMaker</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {isHome && (
              <button
                onClick={createNewCV}
                className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New CV
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
