import React from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'right';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <div className="group relative inline-flex items-center justify-center">
      {children}
      <div className={`absolute hidden group-hover:block z-50 px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-200 text-xs font-semibold rounded-lg shadow-xl whitespace-nowrap animate-in fade-in zoom-in duration-200 ${positionClasses[position]}`}>
        {content}
        {/* Arrow */}
        <div className={`absolute w-2 h-2 bg-slate-900 border-l border-b border-slate-700 rotate-45 ${
            position === 'top' ? '-bottom-1 left-1/2 -translate-x-1/2 border-l-0 border-t border-slate-700 bg-slate-900' :
            position === 'bottom' ? '-top-1 left-1/2 -translate-x-1/2 border-l border-t border-slate-700 bg-slate-900' :
            'left-[-5px] top-1/2 -translate-y-1/2'
        }`}></div>
      </div>
    </div>
  );
};

export default Tooltip;