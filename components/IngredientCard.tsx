
import React from 'react';
import { IngredientDetail, SeverityColor } from '../types';

interface Props {
  item: IngredientDetail;
  type: 'positive' | 'negative' | 'questionable';
}

export const IngredientCard: React.FC<Props> = ({ item, type }) => {
  const severityClass = SeverityColor[item.severity as keyof typeof SeverityColor] || 'bg-gray-200';
  
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col gap-2 transition-transform hover:scale-[1.01]">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <span className={`w-3 h-3 rounded-full ${severityClass}`}></span>
          <h4 className="font-bold text-gray-800">{item.component}</h4>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
          type === 'positive' ? 'bg-green-100 text-green-700' : 
          type === 'negative' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
        }`}>
          {type === 'positive' ? `+${item.bonus}` : `-${item.penalty}`}
        </span>
      </div>
      <p className="text-sm text-gray-600 font-medium">{item.value}</p>
      <p className="text-xs text-gray-500 leading-relaxed">{item.description}</p>
    </div>
  );
};
