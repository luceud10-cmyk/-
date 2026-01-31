
import React from 'react';

export const VerdictGuide: React.FC = () => {
  const guideItems = [
    { label: 'ممتاز', color: 'bg-green-500', text: 'مكونات طبيعية بالكامل، غنية بالعناصر الغذائية وخالية من المضافات الصناعية الضارة.' },
    { label: 'جيد', color: 'bg-yellow-500', text: 'مكونات آمنة إجمالاً، قد تحتوي على مضافات معتمدة بنسب ضئيلة لا تشكل خطورة.' },
    { label: 'متوسط', color: 'bg-orange-500', text: 'يحتوي على مضافات صناعية أو نسب ملحوظة من السكر أو الملح التي يفضل الحد منها.' },
    { label: 'ضعيف', color: 'bg-red-400', text: 'يحتوي على مكونات معالجة بكثافة أو نسب عالية جداً من المواد غير الصحية كالمحليات الصناعية.' },
    { label: 'تجنبه', color: 'bg-red-600', text: 'يحتوي على دهون متحولة، ملونات محظورة، أو مكونات ذات مخاطر صحية مثبتة.' },
  ];

  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mt-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        دليل مستويات التقييم
      </h3>
      <div className="space-y-4">
        {guideItems.map((item, idx) => (
          <div key={idx} className="flex gap-4 items-start">
            <div className={`shrink-0 w-3 h-3 rounded-full mt-1.5 ${item.color}`}></div>
            <div>
              <span className="font-bold text-gray-700 block text-sm">{item.label}</span>
              <p className="text-xs text-gray-500 leading-relaxed">{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
