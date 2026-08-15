import React from 'react';
import type { CVData } from '../../types/cv';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface ModernTemplateProps {
  data: CVData;
}

export const ModernTemplate: React.FC<ModernTemplateProps> = ({ data }) => {
  const { profile, education, experience, publications, skills } = data;

  return (
    <div className="max-w-[210mm] mx-auto bg-white min-h-[297mm] flex font-sans text-sm text-gray-800 shadow-lg print:shadow-none print:m-0">

      {/* Left Sidebar */}
      <aside className="w-1/3 bg-gray-900 text-gray-200 p-[10mm] print:p-[10mm] flex flex-col">
        <div className="mb-10 text-center">
          <div className="w-32 h-32 bg-gray-700 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-gray-400">
             {profile.name.charAt(0)}
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{profile.name}</h1>
          <p className="text-blue-400 font-medium tracking-wide uppercase text-xs">{profile.title}</p>
        </div>

        <div className="mb-10 space-y-4 text-xs">
          <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-2 mb-4 uppercase tracking-widest">Contact</h2>
          {profile.email && (
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-blue-400" />
              <span>{profile.email}</span>
            </div>
          )}
          {profile.phone && (
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-blue-400" />
              <span>{profile.phone}</span>
            </div>
          )}
          {profile.location && (
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-blue-400" />
              <span>{profile.location}</span>
            </div>
          )}
          {profile.website && (
            <div className="flex items-center gap-3">
              <Globe className="w-4 h-4 text-blue-400" />
              <a href={profile.website} className="hover:text-white truncate">{profile.website}</a>
            </div>
          )}
        </div>

        {skills.length > 0 && (
          <div className="mb-10">
            <h2 className="text-lg font-bold text-white border-b border-gray-700 pb-2 mb-4 uppercase tracking-widest">Expertise</h2>
            <div className="space-y-4">
              {skills.map((skill, idx) => (
                <div key={idx} className="break-inside-avoid">
                  <h3 className="font-semibold text-blue-400 mb-1">{skill.category}</h3>
                  <div className="flex flex-wrap gap-1">
                    {skill.skills.split(',').map((s, i) => (
                      <span key={i} className="bg-gray-800 text-gray-300 px-2 py-1 text-xs rounded">
                        {s.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <main className="w-2/3 p-[12mm] bg-gray-50 print:p-[12mm]">
        {profile.summary && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2 mb-4 uppercase tracking-widest">Profile</h2>
            <p className="text-gray-600 leading-relaxed text-justify">{profile.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2 mb-4 uppercase tracking-widest">Experience</h2>
            <div className="space-y-6">
              {experience.map((exp, idx) => (
                <div key={idx} className="relative pl-4 border-l-2 border-gray-200 break-inside-avoid">
                  <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-[7px] top-1.5 ring-4 ring-gray-50"></div>
                  <h3 className="font-bold text-gray-900 text-base">{exp.position}</h3>
                  <div className="flex justify-between items-center text-xs text-gray-500 mb-2 font-medium">
                    <span className="text-blue-600 uppercase tracking-wide">{exp.company}</span>
                    <span>{exp.startDate} – {exp.endDate}</span>
                  </div>
                  <p className="text-gray-600 text-justify">{exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {education.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2 mb-4 uppercase tracking-widest">Education</h2>
            <div className="space-y-5">
              {education.map((edu, idx) => (
                <div key={idx} className="break-inside-avoid">
                  <h3 className="font-bold text-gray-900 text-base">{edu.degree} in {edu.field}</h3>
                  <div className="flex justify-between text-xs text-gray-500 mb-1 font-medium">
                    <span className="uppercase tracking-wide">{edu.institution}</span>
                    <span>{edu.startDate} – {edu.endDate}</span>
                  </div>
                  {edu.description && <p className="text-gray-600 text-sm mt-1">{edu.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        {publications.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 pb-2 mb-4 uppercase tracking-widest">Publications</h2>
            <div className="space-y-3">
              {publications.map((pub, idx) => (
                <div key={idx} className="bg-white p-3 rounded shadow-sm border border-gray-100 break-inside-avoid">
                  <h3 className="font-bold text-gray-800">{pub.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{pub.authors} • {pub.date}</p>
                  <p className="text-sm italic text-gray-600 mt-1">{pub.publisher}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>

    </div>
  );
};
