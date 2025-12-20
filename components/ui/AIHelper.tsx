import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateDiscInsights } from '../../services/geminiService';
import { Button } from './Button';
import { Sparkles, RefreshCw, AlertCircle, Zap } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface AIHelperProps {
  promptTemplate: string;
  mode: 'suggest' | 'coach' | 'audit';
  discProfile: string;
  contextData: any;
  title?: string;
}

export const AIHelper: React.FC<AIHelperProps> = ({ 
  promptTemplate, 
  mode, 
  discProfile,
  contextData,
  title = "AI Executive Coach"
}) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { language } = useLanguage();
  const navigate = useNavigate();

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      // Construct context string from props
      const fullContext = `Request: ${promptTemplate}. User Data: ${JSON.stringify(contextData)}`;
      const result = await generateDiscInsights(discProfile, fullContext, mode, language);
      setInsight(result);
    } catch (err: any) {
      setError(err.message || "Failed to generate insights.");
    } finally {
      setLoading(false);
    }
  };

  const isQuotaError = error && (error.includes("High Traffic") || error.includes("429") || error.includes("Free Tier"));

  return (
    <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-indigo-900 font-medium">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span>{title}</span>
        </div>
        {!insight && !loading && !isQuotaError && (
          <Button 
            label="Generate Insights" 
            variant="ghost" 
            className="text-indigo-600 bg-white hover:bg-indigo-50 border border-indigo-200 text-xs py-1 px-2 h-auto"
            onClick={handleGenerate}
          />
        )}
        {insight && (
            <button 
                onClick={handleGenerate} 
                className="p-1 hover:bg-indigo-100 rounded-full transition-colors text-indigo-400"
                title="Regenerate"
            >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
        )}
      </div>

      {loading && (
        <div className="space-y-2 animate-pulse mt-2">
          <div className="h-4 bg-indigo-200/50 rounded w-3/4"></div>
          <div className="h-4 bg-indigo-200/50 rounded w-full"></div>
          <div className="h-4 bg-indigo-200/50 rounded w-5/6"></div>
        </div>
      )}

      {error && (
        <div className={`mt-3 p-3 rounded-lg border text-sm ${
          isQuotaError 
            ? 'bg-amber-50 border-amber-200 text-amber-800' 
            : 'bg-red-50 border-red-200 text-red-800'
        }`}>
          <div className="flex items-start gap-2">
            {isQuotaError ? <Zap className="w-5 h-5 text-amber-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />}
            <div>
              <p className="font-medium mb-1">
                {isQuotaError ? "High Demand (Free Tier)" : "Generation Failed"}
              </p>
              <p className="opacity-90">{error}</p>
              
              {isQuotaError && (
                <button 
                  onClick={() => navigate('/pricing')}
                  className="mt-2 text-xs font-bold text-amber-700 hover:text-amber-900 underline"
                >
                  Upgrade to Pro for Priority Access →
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {insight && !loading && (
        <div className="text-sm text-slate-700 leading-relaxed mt-2 whitespace-pre-wrap">
          {insight}
        </div>
      )}
      
      {!insight && !loading && !error && (
        <p className="text-xs text-slate-500 italic mt-1">
          Click generate to receive personalized {mode === 'audit' ? 'governance' : 'development'} insights based on the current profile.
        </p>
      )}
    </div>
  );
};