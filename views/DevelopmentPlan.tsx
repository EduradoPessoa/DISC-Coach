import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PremiumGate } from '../components/ui/PremiumGate';
import { useAssessment } from '../context/AssessmentContext';
import { useLanguage } from '../context/LanguageContext';
import { useNotification } from '../context/NotificationContext';
import { generateDevelopmentSuggestions } from '../services/geminiService';
import { Target, Calendar, CheckSquare, Sparkles, Loader2, Plus, Trash2, CheckCircle2 } from 'lucide-react';

const DevelopmentPlan = () => {
  const { language } = useLanguage();
  const { addNotification } = useNotification();
  const { latestResult, focusAreas, addFocusArea, updateFocusArea, removeFocusArea } = useAssessment();
  
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const fetchSuggestions = async () => {
    if (!latestResult) {
      addNotification('warning', 'Realize uma avaliação primeiro para receber sugestões personalizadas.');
      return;
    }
    setIsLoadingSuggestions(true);
    try {
      const data = await generateDevelopmentSuggestions(latestResult.scores, language);
      setSuggestions(data);
    } catch (e) {
      addNotification('error', 'Erro ao gerar sugestões da IA.');
    } finally {
      setIsLoadingSuggestions(false);
    }
  };

  useEffect(() => {
    if (latestResult && suggestions.length === 0) {
      fetchSuggestions();
    }
  }, [latestResult]);

  const handleAddSuggestion = (suggestion: any) => {
    addFocusArea({
      title: suggestion.title,
      description: suggestion.description,
      category: suggestion.category,
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // +30 dias
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
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Plano de Desenvolvimento</h1>
          <p className="text-slate-500 font-medium">Ações estratégicas baseadas no seu perfil executivo.</p>
        </div>
        <Button 
          label="Atualizar Sugestões" 
          variant="ghost" 
          onClick={fetchSuggestions}
          disabled={isLoadingSuggestions}
          className="flex items-center gap-2 border border-indigo-100 text-indigo-600 bg-white"
        >
          {isLoadingSuggestions ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          IA Coach
        </Button>
      </div>

      <PremiumGate 
        title="IA Executive Coach" 
        message="Faça o upgrade para o Plano Pro para receber roteiros de desenvolvimento personalizados gerados por IA."
      >
        {/* AI Suggestions Section */}
        <section className="space-y-4">
          <div className="flex items-center gap-2 text-indigo-900 font-bold px-1">
            <Sparkles className="w-5 h-5 text-indigo-500" />
            <h2 className="text-lg">Sugestões de Foco IA</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {isLoadingSuggestions ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white border border-slate-100 rounded-2xl p-6 h-48 animate-pulse">
                  <div className="h-4 bg-slate-100 rounded w-3/4 mb-4"></div>
                  <div className="h-3 bg-slate-50 rounded w-full mb-2"></div>
                  <div className="h-3 bg-slate-50 rounded w-5/6"></div>
                </div>
              ))
            ) : suggestions.length > 0 ? (
              suggestions.map((suggestion, idx) => (
                <div 
                  key={idx} 
                  className="group bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs mb-3 ${getCategoryColor(suggestion.category)}`}>
                      {suggestion.category}
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm mb-2 line-clamp-1">{suggestion.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{suggestion.description}</p>
                  </div>
                  <button 
                    onClick={() => handleAddSuggestion(suggestion)}
                    className="mt-4 flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-colors"
                  >
                    <Plus className="w-3 h-3" /> Adicionar ao Plano
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
                <Target className="w-12 h-12 text-slate-300 mb-3 opacity-20" />
                <p className="text-sm text-slate-400 font-medium">Nenhuma sugestão nova. Clique em atualizar.</p>
              </div>
            )}
          </div>
        </section>

        {/* Active Plan List */}
        <section className="space-y-4 pt-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-slate-900">Meu Roadmap Estratégico</h2>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              {focusAreas.length} Ações Ativas
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {focusAreas.length > 0 ? (
              focusAreas.map((area) => (
                <div 
                  key={area.id}
                  className={`bg-white border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6 transition-all ${
                    area.status === 'completed' ? 'opacity-60 grayscale' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-4 rounded-2xl flex-shrink-0 ${getCategoryColor(area.category)}`}>
                    <Target className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-2">
                      <h4 className="font-bold text-slate-900 text-lg">{area.title}</h4>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${getStatusColor(area.status)}`}>
                        {area.status.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">{area.description}</p>
                    
                    <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" /> 
                        Prazo: {area.dueDate ? new Date(area.dueDate).toLocaleDateString() : 'Indefinido'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckSquare className="w-3.5 h-3.5" /> 
                        Prioridade Alta
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto">
                    {area.status !== 'completed' && (
                      <button 
                        onClick={() => updateFocusArea(area.id, { status: area.status === 'planned' ? 'in_progress' : 'completed' })}
                        className="flex-1 md:flex-none py-2 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                      >
                        {area.status === 'planned' ? 'Iniciar' : 'Concluir'}
                      </button>
                    )}
                    {area.status === 'completed' && (
                       <button 
                       onClick={() => updateFocusArea(area.id, { status: 'in_progress' })}
                       className="flex-1 md:flex-none py-2 px-4 bg-green-50 text-green-600 rounded-xl text-xs font-bold hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                     >
                       <CheckCircle2 className="w-4 h-4" /> Reabrir
                     </button>
                    )}
                    <button 
                      onClick={() => removeFocusArea(area.id)}
                      className="p-2.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 bg-slate-50 rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                  <Target className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Seu Roadmap está vazio</h3>
                <p className="text-slate-500 max-w-sm font-medium">Adicione sugestões da IA acima ou realize uma avaliação para começar seu desenvolvimento.</p>
                <Button label="Realizar Avaliação" className="mt-8" onClick={() => window.location.hash = '/assessment/start'} />
              </div>
            )}
          </div>
        </section>
      </PremiumGate>
    </div>
  );
};

export default DevelopmentPlan;