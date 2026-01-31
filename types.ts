
export interface IngredientDetail {
  component: string;
  value: string;
  severity: 'sever' | 'high' | 'moderate' | 'low' | 'good' | 'ambiguous' | 'moderate_concern';
  penalty?: number;
  bonus?: number;
  description: string;
}

export interface AnalysisConfidence {
  productIdentification: string;
  ocrAccuracy: string;
  dataSource: string;
}

export interface AnalysisResult {
  productName: string;
  analysisConfidence: AnalysisConfidence;
  overallScore: number;
  verdict: string;
  summary: string;
  negatives: IngredientDetail[];
  positives: IngredientDetail[];
  questionable: IngredientDetail[];
}

export interface AlternativeProduct {
  name: string;
  reason: string;
  sourceUrl: string;
}

export enum SeverityColor {
  sever = 'bg-red-600',
  high = 'bg-red-400',
  moderate = 'bg-orange-400',
  low = 'bg-yellow-400',
  good = 'bg-green-500',
  ambiguous = 'bg-gray-400',
  moderate_concern = 'bg-purple-400'
}
