import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PremiumGate } from '../components/ui/PremiumGate';
import { useAssessment } from '../context/AssessmentContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import { generateDevelopmentSuggestions, generateDiscInsights } from '../services/geminiService';
// Fix: Added missing AlertCircle import
import { Target, Calendar, CheckSquare, Sparkles, Loader2, Plus, Trash2, CheckCircle2, MessageSquareText, AlertCircle } from 'lucide-react';

const DevelopmentPlan = () => {
  const { userId } = useParams();
  const { language } = useLanguage();
  const { addNotification } = useNotification();
  const { history, focusAreas, addFocusArea, updateFocusArea, removeFocusArea } = useAssessment();
  
  // Use the specific result based on URL or fallback to the latest in history
  const currentResult = history.find(r => r.id === userId) || (history.length > 0 ? history[history.length - 1] : null);

  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [isAnalyzingPlan, setIsAnalyzingPlan] = useState(false);
  const [planFeedback, setPlanFeedback] = useState<string | null>(null);

  const fetchSuggestions = async () => {
    if (!currentResult) {
      addNotification('warning', 'Realize uma avaliação primeiro para receber sugestões personalizadas.');
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const data = await generateDevelopmentSuggestions(currentResult.scores, language);
      setSuggestions(data);
    } catch (e) {
      addNotification('error', 'Erro ao gerar sugestões da IA.');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  const handleAnalyzePlan = async () => {
    if (!currentResult) return;
    if (focusAreas.length === 0) {
      addNotification('info', 'Adicione algumas áreas de foco antes da análise.');
      return;
    }
    setIsAnalyzingPlan(true);
    try {
      const context = `O executivo possui as seguintes áreas de foco em seu PDI: ${focusAreas.map(a => `${a.title} (${a.category})`).join(', ')}. Status atual: ${focusAreas.filter(a => a.status === 'completed').length} concluídas de ${focusAreas.length}.`;
      const feedback = await generateDiscInsights(
        JSON.stringify(currentResult.scores),
        context,
        'coach',
        language
      );
      setPlanFeedback(feedback);
      addNotification('success', 'Análise de progresso concluída!');
    } catch (e) {
      addNotification('error', 'Erro na análise do plano.');
    } finally {
      setIsAnalyzingPlan(false);
    }
  };

  useEffect(() => {
    if (currentResult && suggestions.length === 0) {
      fetchSuggestions();
    }
  }, [currentResult?.id]);

  const handleAddSuggestion = (suggestion: any) => {
    addFocusArea({
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.category,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    });
    setSuggestions(prev => prev.filter(s => s.title !== suggestion.title));
    addNotification('success', 'Ação adicionada ao seu plano!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'D': return 'bg-red-50 text-red-600';
      case 'I': return 'bg-yellow-50 text-yellow-600';
      case 'S': return 'bg-green-50 text-green-600';
      case 'C': return 'bg-blue-50 text-blue-600';
      default: return 'bg-indigo-50 text-indigo-600';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Plano de Desenvolvimento (PDI)</h1>
          <p className="text-slate-500 font-medium">
            Foco atual: {currentResult ? `Avaliação de ${new Date(currentResult.timestamp).toLocaleDateString()}` : 'Nenhuma avaliação encontrada'}
          </p>
        </div>
        <div className="flex gap-2">
            <Button 
              label="Sugestões IA" 
              variant="secondary" 
              onClick={fetchSuggestions}
              disabled={isLoadingSuggestions || !currentResult}
              className="flex items-center gap-2 bg-white"
            >
              {isLoadingSuggestions ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-indigo-500" />}
            </Button>
            <Button 
              label="Analisar Progresso" 
              onClick={handleAnalyzePlan}
              disabled={isAnalyzingPlan || focusAreas.length === 0 || !currentResult}
              className="flex items-center gap-2"
            >
              {isAnalyzingPlan ? <Loader2 className="w-4 h-4 animate-spin" /> : <MessageSquareText className="w-4 h-4" />}
            </Button>
        </div>
      </div>

      {!currentResult && (
        <Card className="text-center py-12">
           <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
           <h3 className="text-lg font-bold text-slate-900">Nenhum Assessment encontrado</h3>
           <p className="text-slate-500">Realize sua primeira avaliação para gerar um plano estratégico.</p>
        </Card>
      )}

      {planFeedback && (
        <Card className="bg-indigo-900 text-white border-none shadow-2xl shadow-indigo-200 animate-in fade-in slide-in-from-top-4">
             <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-indigo-300" />
                <h3 className="font-black uppercase tracking-widest text-xs text-indigo-200">Feedback do Executive Coach IA</h3>
             </div>
             <div className="prose prose-invert prose-sm max-w-none text-indigo-50 leading-relaxed">
                <p className="whitespace-pre-wrap">{planFeedback}</p>
             </div>
             <Button label="Entendido" variant="ghost" className="mt-4 text-indigo-300 hover:bg-white/10" onClick={() => setPlanFeedback(null)} />
        </Card>
      )}

      <PremiumGate 
        title="IA Executive Coach" 
        message="Acesso ao PDI sugerido por IA e análise de plano executivo."
      >
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-900 font-bold px-1">
            <h2 className="text-lg">Novas Sugestões</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestions.map((suggestion, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-300 transition-all flex flex-col justify-between">
                  <div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs mb-3 ${getCategoryColor(suggestion.category)}`}>
                      {suggestion.category}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-2">{suggestion.title}</h4>
                    <p className="text-[11px] text-slate-500 line-clamp-3">{suggestion.description}</p>
                  </div>
                  <button 
                    onClick={() => handleAddSuggestion(suggestion)}
                    className="mt-4 flex items-center justify-center gap-2 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Adicionar
                  </button>
                </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">Áreas de Foco Atuais</h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {focusAreas.length} Ações
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {focusAreas.length > 0 ? (
              focusAreas.map((area) => (
                <div key={area.id} className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 transition-all ${area.status === 'completed' ? 'opacity-50 grayscale' : 'border-slate-200'}`}>
                  <div className={`p-4 rounded-2xl ${getCategoryColor(area.category)}`}>
                    <Target className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h4 className="font-bold text-slate-900 text-lg">{area.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusColor(area.status)}`}>
                        {area.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed">{area.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => updateFocusArea(area.id, { status: area.status === 'planned' ? 'in_progress' : area.status === 'in_progress' ? 'completed' : 'planned' })}
                      className="py-2 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors"
                    >
                      {area.status === 'planned' ? 'Iniciar' : area.status === 'in_progress' ? 'Concluir' : 'Resetar'}
                    </button>
                    <button onClick={() => removeFocusArea(area.id)} className="p-2.5 text-slate-300 hover:text-red-500 rounded-xl transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center text-center">
                <Target className="w-10 h-10 text-slate-300 mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Seu plano está vazio</h3>
                <p className="text-slate-400 text-sm max-w-xs mx-auto">Escolha sugestões acima ou crie metas manuais para iniciar seu tracking.</p>
              </div>
            )}
          </div>
        </section>
      </PremiumGate>
    </div>
  );
};

export default DevelopmentPlan;