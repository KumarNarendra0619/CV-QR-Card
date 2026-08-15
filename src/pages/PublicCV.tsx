import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import type { CVData } from '../types/cv';
import { fetchGoogleSheetData } from '../utils/parser';
import { CVRenderer } from '../components/CVRenderer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import type { CVConfig } from '../store';
import { Alert } from '../components/Alert';

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
      if (data.profile.name === '' && data.education.length === 0) {
         setError('No CV data could be found. The Google Sheet may not be public or may lack the required tabs (Profile, Education, etc).');
      } else {
         setCvData(data);
      }
    } catch (err) {
      setError('Failed to load CV data. Ensure the Google Sheet is published to the web.');
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
           <Alert type="error" message={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200/80 min-h-screen py-12 flex justify-center print:p-0 print:bg-white relative">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none print:hidden"></div>

      <div className="bg-white shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] print:shadow-none print:m-0 z-10">
        <CVRenderer data={cvData} template={template} />
      </div>
    </div>
  );
};
