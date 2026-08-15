import React from 'react';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

interface AlertProps {
  type: 'success' | 'error' | 'info';
  message: string;
}

export const Alert: React.FC<AlertProps> = ({ type, message }) => {
  const styles = {
    success: 'bg-green-50 text-green-800 border-green-200',
    error: 'bg-red-50 text-red-800 border-red-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
  };

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border shadow-sm ${styles[type]} transition-all animate-in fade-in slide-in-from-top-2 duration-300`}>
      {icons[type]}
      <p className="text-sm font-medium leading-tight pt-0.5">{message}</p>
    </div>
  );
};
