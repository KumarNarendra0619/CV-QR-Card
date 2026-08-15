export interface CVProfile {
  name: string;
  title: string;
  email: string;
  phone: string;
  website?: string;
  location: string;
  summary: string;
}

export interface CVEducation {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description?: string;
}

export interface CVExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface CVPublication {
  title: string;
  authors: string;
  publisher: string;
  date: string;
  url?: string;
}

export interface CVSkill {
  category: string;
  skills: string;
}

export interface CVData {
  profile: CVProfile;
  education: CVEducation[];
  experience: CVExperience[];
  publications: CVPublication[];
  skills: CVSkill[];
}
