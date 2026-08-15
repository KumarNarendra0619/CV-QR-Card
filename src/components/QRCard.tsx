import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCardProps {
  id: string;
  name: string;
  title: string;
  url: string;
}

export const QRCard: React.FC<QRCardProps> = ({ id, name, title, url }) => {
  return (
    <div className="w-[85.6mm] h-[53.98mm] bg-white rounded-lg shadow-xl overflow-hidden flex flex-col relative print:shadow-none border border-gray-200 print:border-black mx-auto">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#000_1px,transparent_1px)] [background-size:16px_16px]"></div>

      {/* Header bar */}
      <div className="h-2 w-full bg-blue-600 relative z-10"></div>

      <div className="flex-1 p-4 flex items-center gap-4 relative z-10">

        {/* QR Code section */}
        <div className="bg-white p-2 rounded shadow-sm border border-gray-100 flex-shrink-0">
          <QRCodeSVG
            value={url}
            size={90}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Info section */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-blue-600 font-bold uppercase tracking-wider mb-1">Academic CV</p>
          <h2 className="text-lg font-bold text-gray-900 truncate leading-tight mb-1" title={name}>{name}</h2>
          <p className="text-xs text-gray-600 truncate mb-3" title={title}>{title}</p>

          <div className="mt-auto">
             <p className="text-[9px] text-gray-400 uppercase">Scan to view profile</p>
             <p className="text-[10px] font-mono text-gray-500 mt-0.5 tracking-wider">ID: {id.slice(0,8).toUpperCase()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
