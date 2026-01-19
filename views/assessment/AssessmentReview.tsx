
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useAssessment } from '../../context/AssessmentContext';
import { QUESTIONS } from '../../data/questions';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { Edit2, Loader2 } from 'lucide-react';

const AssessmentReview = () => {
  const navigate = useNavigate();
  const { answers, submitAssessment } = useAssessment();
  const { language, t } = useLanguage();
  const { addNotification } = useNotification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = QUESTIONS.length;
  const isComplete = answeredCount === totalQuestions;

  const handleSubmit = async () => {
    if (!isComplete) {
      addNotification('error', 'Por favor, responda todas as questões antes de enviar.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const newResult = await submitAssessment();
      addNotification('success', 'Avaliação enviada com sucesso!');
      navigate(`/results/summary/${newResult.id}`);
    } catch (error) {
      addNotification('error', 'Falha ao salvar avaliação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Revisão de Respostas</h1>
        <p className="text-slate-500">Revise suas escolhas antes de processar sua inteligência comportamental.</p>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-slate-900">Resumo</h3>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${isComplete ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                    {isComplete ? 'Pronto para Enviar' : 'Incompleto'}
                </div>
            </div>
            
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {QUESTIONS.map((q) => {
                    const answerVal = answers[q.id];
                    const labels = {
                        1: t('assessment.stronglyDisagree'),
                        2: t('assessment.disagree'),
                        3: t('assessment.neutral'),
                        4: t('assessment.agree'),
                        5: t('assessment.stronglyAgree')
                    };
                    const answerLabel = answerVal ? labels[answerVal as keyof typeof labels] : 'Não Respondida';

                    return (
                        <div key={q.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors">
                            <div className="flex-1 mb-2 sm:mb-0">
                                <div className="flex items-center">
                                    <span className="text-xs font-bold text-slate-400 w-8">#{q.id}</span>
                                    <p className="text-sm text-slate-700 font-medium truncate max-w-md">{q.text[language]}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`text-xs px-2 py-1 rounded border ${
                                    answerVal 
                                    ? 'bg-white border-slate-200 text-slate-600' 
                                    : 'bg-red-50 border-red-200 text-red-600'
                                }`}>
                                    {answerLabel}
                                </span>
                                <button 
                                    onClick={() => navigate(`/assessment/question/${q.id}`)}
                                    className="text-slate-400 hover:text-indigo-600 transition-colors"
                                    title="Editar Resposta"
                                    disabled={isSubmitting}
                                >
                                    <Edit2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
      </div>

      <div className="flex justify-end gap-4">
         <Button 
            label="Voltar" 
            variant="secondary" 
            onClick={() => navigate(`/assessment/question/${totalQuestions}`)} 
            disabled={isSubmitting}
         />
         <Button 
            label={isSubmitting ? "Enviando..." : "Finalizar e Ver Resultados"} 
            onClick={handleSubmit} 
            disabled={!isComplete || isSubmitting}
            className={`${!isComplete || isSubmitting ? 'opacity-50 cursor-not-allowed' : ''} flex items-center gap-2`}
         >
           {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
         </Button>
      </div>
    </div>
  );
};

export default AssessmentReview;
