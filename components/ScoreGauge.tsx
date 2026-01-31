
import React from 'react';

interface Props {
  score: number;
  verdict: string;
}

export const ScoreGauge: React.FC<Props> = ({ score, verdict }) => {
  const getScoreColor = (s: number) => {
    if (s >= 80) return 'text-green-500';
    if (s >= 60) return 'text-yellow-500';
    if (s >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getProgressColor = (s: number) => {
    if (s >= 80) return 'stroke-green-500';
    if (s >= 60) return 'stroke-yellow-500';
    if (s >= 40) return 'stroke-orange-500';
    return 'stroke-red-500';
  };

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-3xl shadow-lg border-2 border-gray-50">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full transform -rotate-90">
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-100"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${getProgressColor(score)} transition-all duration-1000 ease-out`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-bold ${getScoreColor(score)}`}>{score}</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">من 100</span>
        </div>
      </div>
      <h3 className={`mt-4 text-xl font-bold ${getScoreColor(score)}`}>{verdict}</h3>
    </div>
  );
};
