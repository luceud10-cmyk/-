
import React, { useState, useRef } from 'react';
import { analyzeProductImage, getHealthierAlternatives } from './geminiService';
import { AnalysisResult, AlternativeProduct } from './types';
import { IngredientCard } from './components/IngredientCard';
import { ScoreGauge } from './components/ScoreGauge';
import { VerdictGuide } from './components/VerdictGuide';
import { AlternativeCard } from './components/AlternativeCard';

const App: React.FC = () => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingAlternatives, setLoadingAlternatives] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [alternatives, setAlternatives] = useState<AlternativeProduct[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64 = event.target?.result as string;
      setImage(base64);
      setResult(null);
      setAlternatives([]);
      setError(null);
      await performAnalysis(base64);
    };
    reader.readAsDataURL(file);
  };

  const performAnalysis = async (base64: string) => {
    setLoading(true);
    try {
      const data = await analyzeProductImage(base64);
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'فشل التحليل. يرجى المحاولة مرة أخرى بصورة أوضح.');
    } finally {
      setLoading(false);
    }
  };

  const handleFindAlternatives = async () => {
    if (!result) return;
    setLoadingAlternatives(true);
    try {
      const badIngredients = [...result.negatives, ...result.questionable].map(i => i.component);
      const suggestions = await getHealthierAlternatives(result.productName, badIngredients);
      setAlternatives(suggestions);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingAlternatives(false);
    }
  };

  const reset = () => {
    setImage(null);
    setResult(null);
    setAlternatives([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const hasIssues = result && (result.negatives.length > 0 || result.questionable.length > 0);

  return (
    <div className="min-h-screen pb-32 max-w-2xl mx-auto px-4 pt-8">
      {/* Header */}
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">محلل المكونات الذكي</h1>
        <p className="text-gray-500">التقط صورة لملصق المكونات واكتشف الحقيقة وراء المنتج</p>
      </header>

      {/* Upload Section */}
      {!image ? (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="bg-white border-2 border-dashed border-blue-200 rounded-3xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all flex flex-col items-center"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <span className="text-lg font-bold text-gray-700">اضغط لالتقاط أو اختيار صورة</span>
          <p className="text-sm text-gray-400 mt-2">تأكد من وضوح نص المكونات</p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden mb-6 h-64 shadow-inner">
          <img src={image} alt="Product" className="w-full h-full object-cover" />
          <button 
            onClick={reset}
            className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-lg text-red-500 hover:bg-white transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-blue-600 font-bold animate-pulse">جاري تحليل المكونات وفحص المصادر...</p>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-2xl border border-red-100 mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p>{error}</p>
        </div>
      )}

      {/* Results View */}
      {result && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-4">
              <ScoreGauge score={result.overallScore} verdict={result.verdict} />
              <button 
                onClick={() => setShowGuide(!showGuide)}
                className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center gap-1"
              >
                {showGuide ? 'إخفاء الدليل' : 'ماذا تعني هذه التقييمات؟'}
              </button>
            </div>
            <div className="bg-blue-600 text-white p-6 rounded-3xl shadow-lg flex flex-col justify-center">
              <h2 className="text-2xl font-bold mb-2">{result.productName}</h2>
              <p className="text-blue-100 text-sm leading-relaxed">{result.summary}</p>
              <div className="mt-4 pt-4 border-t border-blue-400/30 flex justify-between text-[10px] uppercase font-bold tracking-widest opacity-80">
                <span>الثقة: {result.analysisConfidence.productIdentification}</span>
                <span>دقة OCR: {result.analysisConfidence.ocrAccuracy}</span>
              </div>
            </div>
          </div>

          {showGuide && <VerdictGuide />}

          {/* Alternatives Suggestion Section */}
          {hasIssues && alternatives.length === 0 && !loadingAlternatives && (
            <div className="bg-orange-50 border border-orange-100 p-6 rounded-3xl flex flex-col items-center text-center shadow-sm">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 text-orange-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h4 className="font-bold text-orange-800 mb-2">اكتشف خيارات أكثر صحة</h4>
              <p className="text-sm text-orange-600 mb-4">يحتوي هذا المنتج على بعض المكونات التي قد تؤثر على جودته. هل ترغب في العثور على بدائل أفضل؟</p>
              <button 
                onClick={handleFindAlternatives}
                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-8 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
              >
                البحث عن بدائل صحية
              </button>
            </div>
          )}

          {/* Loading Alternatives */}
          {loadingAlternatives && (
            <div className="flex flex-col items-center justify-center py-8 gap-3">
              <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-orange-600 font-bold text-sm animate-pulse">جاري البحث عن بدائل أفضل في السوق...</p>
            </div>
          )}

          {/* Alternatives List */}
          {alternatives.length > 0 && (
            <section className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100">
              <h3 className="text-lg font-bold text-blue-800 mb-4 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                </svg>
                بدائل صحية موصى بها
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {alternatives.map((alt, idx) => (
                  <AlternativeCard key={idx} alternative={alt} />
                ))}
              </div>
            </section>
          )}

          <div className="space-y-6">
            {/* Positives */}
            {result.positives.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-green-700 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-sm">✓</span>
                  المكونات الإيجابية
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.positives.map((item, idx) => (
                    <IngredientCard key={idx} item={item} type="positive" />
                  ))}
                </div>
              </section>
            )}

            {/* Questionable */}
            {result.questionable.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-orange-700 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-sm">?</span>
                  مكونات مثيرة للجدل
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.questionable.map((item, idx) => (
                    <IngredientCard key={idx} item={item} type="questionable" />
                  ))}
                </div>
              </section>
            )}

            {/* Negatives */}
            {result.negatives.length > 0 && (
              <section>
                <h3 className="text-lg font-bold text-red-700 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center text-sm">!</span>
                  المكونات السلبية
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.negatives.map((item, idx) => (
                    <IngredientCard key={idx} item={item} type="negative" />
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="bg-gray-100 p-4 rounded-xl text-[10px] text-gray-500 text-center">
            المصدر: {result.analysisConfidence.dataSource}
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      {!loading && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-xs px-4">
           <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            </svg>
            تحليل منتج {result ? 'آخر' : 'جديد'}
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
