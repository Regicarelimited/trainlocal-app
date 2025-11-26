import React from 'react';
import { X, Check, Filter, HelpCircle } from 'lucide-react';
import { COLORS } from '../constants';

interface TagProps {
  text: string;
  color: string;
  onRemove?: () => void;
}

export const Tag: React.FC<TagProps> = ({ text, color, onRemove }) => (
  <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wide mr-2 mb-2 transition-all hover:scale-105 cursor-default inline-flex items-center gap-1 shadow-sm whitespace-nowrap" style={{ backgroundColor: `${color}25`, color: color, border: `1px solid ${color}50` }}>
    {text}
    {onRemove && <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="hover:text-red-500 ml-1"><X size={12} /></button>}
  </span>
);

interface FilterToggleProps {
  active: boolean;
  label: string;
  onClick: () => void;
  isMoreButton?: boolean;
}

export const FilterToggle: React.FC<FilterToggleProps> = ({ active, label, onClick, isMoreButton }) => (
  <button onClick={onClick} className={`group relative px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ease-out border flex items-center gap-2 whitespace-nowrap ${active ? 'text-white shadow-lg scale-105 border-transparent' : isMoreButton ? 'bg-[#2E294E] text-white border-transparent hover:bg-opacity-90 shadow-md' : 'bg-white text-gray-600 border-gray-300 hover:border-pink-300 hover:bg-pink-50 shadow-sm'}`}>
    {active && (<div className="absolute inset-0 rounded-xl -z-10" style={{ backgroundImage: `linear-gradient(to right, ${COLORS.pink}, ${COLORS.yellow})` }} />)}
    {active ? <Check size={14} className="text-white" /> : isMoreButton ? <Filter size={14} className="text-white" /> : null}
    {label}
  </button>
);

export const Tooltip: React.FC<{ text: string }> = ({ text }) => (
    <div className="group relative inline-block ml-2">
        <HelpCircle size={12} className="text-gray-400 cursor-help" />
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 bg-gray-900 text-white text-[10px] p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {text}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
        </div>
    </div>
);
