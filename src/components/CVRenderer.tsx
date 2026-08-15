import React from 'react';
import type { CVData } from '../types/cv';
import { AcademicTemplate } from './templates/AcademicTemplate';
import { ModernTemplate } from './templates/ModernTemplate';

interface CVRendererProps {
  data: CVData;
  template: 'academic' | 'modern';
}

export const CVRenderer: React.FC<CVRendererProps> = ({ data, template }) => {
  if (template === 'academic') {
    return <AcademicTemplate data={data} />;
  }

  return <ModernTemplate data={data} />;
};
