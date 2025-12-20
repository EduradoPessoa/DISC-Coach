import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, subtitle, children, actions, className = '', ...props }) => {
  return (
    <div className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`} {...props}>
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-slate-100">
          {title && <h3 className="text-lg font-semibold text-slate-900">{title}</h3>}
          {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="px-6 py-6">
        {children}
      </div>
      {actions && (
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end space-x-3">
          {actions}
        </div>
      )}
    </div>
  );
};