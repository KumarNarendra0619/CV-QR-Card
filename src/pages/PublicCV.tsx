import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { CVData } from '../types/cv';
import { fetchGoogleSheetData } from '../utils/parser';
import { CVRenderer } from '../components/CVRenderer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CVConfig } from '../store';

const defaultCVData: CVData = {
  profile: { name: 'Loading...', title: '', email: '', phone: '', location: '', summary: '' },
  education: [], experience: [], publications: [], skills: []
};

export const PublicCV: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [cvs] = useLocalStorage<CVConfig[]>('cv_configs', []);
  const [cvData, setCvData] = useState<CVData>(defaultCVData);
  const [template, setTemplate] = useState<'academic' | 'modern'>('modern');
  const [error, setError] = useState('');

  useEffect(() => {
    // In a real application, the ID would be used to fetch the config from a database.
    // Here, we look it up in local storage if available on the same machine,
    // or if the ID is actually a sheet ID, we fetch that directly.
    const config = cvs.find(c => c.id === id);

    if (config && config.dataSourceType === 'gsheets' && config.sheetId) {
       setTemplate(config.template);
       fetchData(config.sheetId);
    } else {
       // Fallback: assume the ID passed in the URL *is* the sheet ID for public testing
       fetchData(id || '');
    }
  }, [id, cvs]);

  const fetchData = async (sheetId: string) => {
    try {
      const data = await fetchGoogleSheetData(sheetId);
      setCvData(data);
    } catch (err) {
      setError('Failed to load CV data. Ensure the Google Sheet is public.');
    }
  };

  if (error) {
    return <div className="p-8 text-red-600 text-center mt-20">{error}</div>;
  }

  return (
    <div className="bg-gray-500 min-h-screen py-8 print:p-0 print:bg-white">
      <CVRenderer data={cvData} template={template} />
    </div>
  );
};
