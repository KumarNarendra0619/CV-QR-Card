import React from 'react';
import type { CVData } from '../../types/cv';

interface AcademicTemplateProps {
  data: CVData;
}

export const AcademicTemplate: React.FC<AcademicTemplateProps> = ({ data }) => {
  const { profile, education, experience, publications, skills } = data;

  return (
    <div className="max-w-[210mm] mx-auto bg-white min-h-[297mm] p-[20mm] font-serif text-sm leading-relaxed text-gray-900 shadow-lg print:shadow-none print:p-0 print:m-0">

      {/* Header */}
      <header className="text-center mb-8 border-b-2 border-gray-800 pb-6">
        <h1 className="text-4xl font-bold mb-2 uppercase tracking-wide">{profile.name}</h1>
        <div className="text-lg text-gray-700 mb-2 italic">{profile.title}</div>
        <div className="text-sm flex flex-wrap justify-center gap-x-4 text-gray-600">
          {profile.email && <span>{profile.email}</span>}
          {profile.phone && <span>{profile.phone}</span>}
          {profile.location && <span>{profile.location}</span>}
          {profile.website && <a href={profile.website} className="text-blue-600 hover:underline">{profile.website}</a>}
        </div>
      </header>

      {/* Summary */}
      {profile.summary && (
        <section className="mb-8">
          <p className="text-justify">{profile.summary}</p>
        </section>
      )}

      {/* Education */}
      {education.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-4 border-b border-gray-300 pb-1">Education</h2>
          <div className="space-y-4">
            {education.map((edu, idx) => (
              <div key={idx} className="flex flex-col break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-base">{edu.degree} in {edu.field}</span>
                  <span className="text-gray-600 italic text-xs whitespace-nowrap ml-4">{edu.startDate} – {edu.endDate}</span>
                </div>
                <div className="text-gray-800 font-medium">{edu.institution}</div>
                {edu.description && <p className="text-gray-600 mt-1 text-justify">{edu.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Experience */}
      {experience.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-4 border-b border-gray-300 pb-1">Academic & Professional Experience</h2>
          <div className="space-y-6">
            {experience.map((exp, idx) => (
              <div key={idx} className="flex flex-col break-inside-avoid">
                <div className="flex justify-between items-baseline mb-1">
                  <span className="font-bold text-base">{exp.position}</span>
                  <span className="text-gray-600 italic text-xs whitespace-nowrap ml-4">{exp.startDate} – {exp.endDate}</span>
                </div>
                <div className="text-gray-800 font-medium">{exp.company}</div>
                {exp.description && <p className="text-gray-600 mt-1 text-justify whitespace-pre-line">{exp.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Publications */}
      {publications.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-4 border-b border-gray-300 pb-1">Publications</h2>
          <ul className="list-decimal pl-5 space-y-3">
            {publications.map((pub, idx) => (
              <li key={idx} className="pl-2 break-inside-avoid">
                <span className="text-gray-800">{pub.authors} ({pub.date}). </span>
                <span className="font-medium">"{pub.title}." </span>
                <span className="italic">{pub.publisher}</span>
                {pub.url && <span>. <a href={pub.url} className="text-blue-600 hover:underline">Link</a></span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Skills */}
      {skills.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xl font-bold uppercase tracking-wider mb-4 border-b border-gray-300 pb-1">Skills & Competencies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, idx) => (
              <div key={idx} className="break-inside-avoid">
                <span className="font-bold block mb-1">{skill.category}:</span>
                <span className="text-gray-700 leading-snug">{skill.skills}</span>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
