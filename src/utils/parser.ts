import * as xlsx from 'xlsx';
import type { CVData } from '../types/cv';

export const parseExcelFile = (file: File): Promise<CVData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = xlsx.read(data, { type: 'array' });

        const cvData: CVData = {
          profile: {
            name: '', title: '', email: '', phone: '', location: '', summary: ''
          },
          education: [],
          experience: [],
          publications: [],
          skills: []
        };

        // Parse Profile
        if (workbook.Sheets['Profile']) {
          const profileRaw = xlsx.utils.sheet_to_json(workbook.Sheets['Profile'])[0] as any;
          if (profileRaw) {
             cvData.profile = {
               name: profileRaw.Name || '',
               title: profileRaw.Title || '',
               email: profileRaw.Email || '',
               phone: profileRaw.Phone || '',
               website: profileRaw.Website || '',
               location: profileRaw.Location || '',
               summary: profileRaw.Summary || ''
             }
          }
        }

        // Parse Education
        if (workbook.Sheets['Education']) {
           cvData.education = xlsx.utils.sheet_to_json(workbook.Sheets['Education']).map((row: any) => ({
             institution: row.Institution || '',
             degree: row.Degree || '',
             field: row.Field || '',
             startDate: row.StartDate || '',
             endDate: row.EndDate || '',
             description: row.Description || ''
           }));
        }

        // Parse Experience
        if (workbook.Sheets['Experience']) {
           cvData.experience = xlsx.utils.sheet_to_json(workbook.Sheets['Experience']).map((row: any) => ({
             company: row.Company || '',
             position: row.Position || '',
             startDate: row.StartDate || '',
             endDate: row.EndDate || '',
             description: row.Description || ''
           }));
        }

        // Parse Publications
        if (workbook.Sheets['Publications']) {
           cvData.publications = xlsx.utils.sheet_to_json(workbook.Sheets['Publications']).map((row: any) => ({
             title: row.Title || '',
             authors: row.Authors || '',
             publisher: row.Publisher || '',
             date: row.Date || '',
             url: row.Url || ''
           }));
        }

        // Parse Skills
        if (workbook.Sheets['Skills']) {
           cvData.skills = xlsx.utils.sheet_to_json(workbook.Sheets['Skills']).map((row: any) => ({
             category: row.Category || '',
             skills: row.Skills || ''
           }));
        }

        resolve(cvData);
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
};

export const fetchGoogleSheetData = async (sheetId: string): Promise<CVData> => {
  // Uses public Google Sheets API (gviz)
  const fetchSheet = async (sheetName: string) => {
    try {
      const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:csv&sheet=${sheetName}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      const csv = await response.text();
      // Using xlsx to parse CSV string
      const workbook = xlsx.read(csv, { type: 'string' });
      return xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    } catch (e) {
      console.warn(`Failed to fetch sheet ${sheetName}`);
      return [];
    }
  };

  const profileData = await fetchSheet('Profile') as any[];
  const educationData = await fetchSheet('Education') as any[];
  const experienceData = await fetchSheet('Experience') as any[];
  const publicationsData = await fetchSheet('Publications') as any[];
  const skillsData = await fetchSheet('Skills') as any[];

  const cvData: CVData = {
    profile: { name: '', title: '', email: '', phone: '', location: '', summary: '' },
    education: [],
    experience: [],
    publications: [],
    skills: []
  };

  if (profileData.length > 0) {
    const p = profileData[0];
    cvData.profile = {
      name: p.Name || '',
      title: p.Title || '',
      email: p.Email || '',
      phone: p.Phone || '',
      website: p.Website || '',
      location: p.Location || '',
      summary: p.Summary || ''
    };
  }

  cvData.education = educationData.map(row => ({
    institution: row.Institution || '',
    degree: row.Degree || '',
    field: row.Field || '',
    startDate: row.StartDate || '',
    endDate: row.EndDate || '',
    description: row.Description || ''
  }));

  cvData.experience = experienceData.map(row => ({
    company: row.Company || '',
    position: row.Position || '',
    startDate: row.StartDate || '',
    endDate: row.EndDate || '',
    description: row.Description || ''
  }));

  cvData.publications = publicationsData.map(row => ({
    title: row.Title || '',
    authors: row.Authors || '',
    publisher: row.Publisher || '',
    date: row.Date || '',
    url: row.Url || ''
  }));

  cvData.skills = skillsData.map(row => ({
    category: row.Category || '',
    skills: row.Skills || ''
  }));

  return cvData;
};
