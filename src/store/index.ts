export type TemplateType = 'academic' | 'modern';

export interface CVConfig {
  id: string;
  title: string;
  dataSourceType: 'excel' | 'gsheets';
  sheetId?: string;
  template: TemplateType;
  lastUpdated: string;
}

// In a real application, you might use Zustand or Redux here.
// For this simple application, custom hooks with localStorage is sufficient.
