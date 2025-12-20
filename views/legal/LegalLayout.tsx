import React from 'react';

export const LegalLayout: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-slate-900 mb-8 pb-4 border-b border-slate-200">{title}</h1>
      <div className="prose prose-slate max-w-none text-slate-600">
        {children}
      </div>
    </div>
  );
};
