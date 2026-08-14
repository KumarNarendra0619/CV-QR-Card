import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Printer } from 'lucide-react';
import { QRCard } from '../components/QRCard';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CVConfig } from '../store';

export const IDCardView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cvs] = useLocalStorage<CVConfig[]>('cv_configs', []);

  const config = cvs.find(c => c.id === id);

  if (!config) {
    return <div className="p-8 text-center">CV Configuration not found.</div>;
  }

  // Generate the public URL that the QR code will point to.
  // In a real app, this would be the actual hosted domain.
  const baseUrl = window.location.origin + window.location.pathname;
  // If the data source is gsheets, use the sheet ID for the public route, otherwise fallback to internal ID
  const publicId = config.dataSourceType === 'gsheets' && config.sheetId ? config.sheetId : id;
  const publicUrl = `${baseUrl}#/cv/${publicId}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between print:hidden">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="text-gray-500 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold text-gray-900">QR ID Card</h1>
        </div>
        <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
          <Printer className="w-4 h-4" /> Print Card
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-8 print:p-0 print:items-start">
        <div className="text-center print:text-left w-full">
           <div className="mb-8 print:hidden text-gray-500 max-w-md mx-auto">
             <p>This is your unique QR ID card. Print it on standard ID card dimensions (85.6mm x 53.98mm).</p>
           </div>

           <QRCard
             id={id!}
             name={config.title.replace("'s CV", "")}
             title={config.dataSourceType === 'gsheets' ? 'Live Auto-Updating CV' : 'Static Uploaded CV'}
             url={publicUrl}
           />
        </div>
      </div>
    </div>
  );
};
