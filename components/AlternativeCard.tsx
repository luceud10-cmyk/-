
import React from 'react';
import { AlternativeProduct } from '../types';

interface Props {
  alternative: AlternativeProduct;
}

export const AlternativeCard: React.FC<Props> = ({ alternative }) => {
  return (
    <a 
      href={alternative.sourceUrl} 
      target="_blank" 
      rel="noopener noreferrer"
      className="block bg-white p-4 rounded-2xl shadow-sm border border-blue-100 hover:border-blue-300 transition-all group hover:shadow-md"
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold text-gray-800 group-hover:text-blue-600 transition-colors">{alternative.name}</h4>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 group-hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </div>
      <p className="text-xs text-gray-500 leading-relaxed">{alternative.reason}</p>
      <div className="mt-2 text-[10px] text-blue-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
        تصفح المنتج الآن ←
      </div>
    </a>
  );
};
