import React, { useState } from 'react';
import { generateDiscInsights } from '../../services/geminiService';
import { Button } from './Button';
import { Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
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

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      // Construct context string from props
      const fullContext = `Request: ${promptTemplate}. User Data: ${JSON.stringify(contextData)}`;
      const result = await generateDiscInsights(discProfile, fullContext, mode, language);
      setInsight(result);
    } catch (err) {
      setError("Failed to generate insights.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-4 relative">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 text-indigo-900 font-medium">
          <Sparkles className="w-5 h-5 text-indigo-600" />
          <span>{title}</span>
        </div>
        {!insight && !loading && (
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
        <div className="flex items-center space-x-2 text-red-600 text-sm mt-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
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