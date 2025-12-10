import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { QUESTIONS } from '../../data/questions';
import { useLanguage } from '../../context/LanguageContext';
import { useNotification } from '../../context/NotificationContext';
import { useAssessment } from '../../context/AssessmentContext';
import { Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const Question = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { saveAnswer, answers, elapsedTime } = useAssessment();
  
  const currentId = parseInt(id || '1');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  const question = QUESTIONS.find(q => q.id === currentId);
  const totalQuestions = QUESTIONS.length;
  const isLast = currentId === totalQuestions;
  const progress = ((currentId - 1) / totalQuestions) * 100;

  // Load saved answer if exists
  useEffect(() => {
    if (answers[currentId]) {
      setSelectedOption(answers[currentId]);
    } else {
      setSelectedOption(null);
    }
  }, [currentId, answers]);

  // Format timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleNext = () => {
    if (selectedOption !== null) {
      saveAnswer(currentId, selectedOption);
      if (isLast) {
        navigate('/assessment/review');
      } else {
        navigate(`/assessment/question/${currentId + 1}`);
      }
    }
  };

  const handlePrevious = () => {
    if (currentId > 1) {
      navigate(`/assessment/question/${currentId - 1}`);
    }
  };

  if (!question) return <div>Question not found</div>;

  return (
    <div className="max-w-3xl mx-auto py-6">
      {/* Top Bar: Progress & Timer */}
      <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
         <div className="flex-1 mr-8">
            <div className="flex justify-between text-xs font-semibold text-slate-500 mb-2">
                <span>{t('assessment.progress')}</span>
                <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
         </div>
         <div className="flex items-center text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
             <Clock className="w-4 h-4 mr-2 text-indigo-600" />
             <span className="font-mono font-medium">{formatTime(elapsedTime)}</span>
         </div>
      </div>

      <Card className="py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="mb-8 text-center px-4">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 block">
                {t('assessment.question')} {currentId} / {totalQuestions}
            </span>
            <h2 className="text-xl md:text-2xl font-medium text-slate-900 leading-relaxed min-h-[80px] flex items-center justify-center">
                "{question.text[language]}"
            </h2>
        </div>

        <div className="space-y-3 max-w-lg mx-auto mb-10">
            {[
                { val: 1, label: t('assessment.stronglyDisagree') },
                { val: 2, label: t('assessment.disagree') },
                { val: 3, label: t('assessment.neutral') },
                { val: 4, label: t('assessment.agree') },
                { val: 5, label: t('assessment.stronglyAgree') }
            ].map((opt) => (
                <button
                    key={opt.val}
                    onClick={() => setSelectedOption(opt.val)}
                    className={`group w-full p-4 rounded-lg border text-left transition-all duration-200 flex items-center justify-between ${
                        selectedOption === opt.val 
                        ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-1 ring-indigo-600 shadow-md' 
                        : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-700'
                    }`}
                >
                    <span className="font-medium">{opt.label}</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                        selectedOption === opt.val ? 'border-indigo-600' : 'border-slate-300 group-hover:border-slate-400'
                    }`}>
                        {selectedOption === opt.val && <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>}
                    </div>
                </button>
            ))}
        </div>

        <div className="flex justify-between items-center px-4 max-w-lg mx-auto pt-6 border-t border-slate-50">
            <Button 
                label={t('common.back')} 
                variant="ghost"
                onClick={handlePrevious}
                disabled={currentId === 1}
                className={`flex items-center ${currentId === 1 ? 'invisible' : ''}`}
            >
                <ChevronLeft className="w-4 h-4 mr-1" />
            </Button>

            <Button 
                label={isLast ? 'Review Answers' : t('common.next')} 
                disabled={selectedOption === null}
                onClick={handleNext}
                className="px-8"
            />
        </div>
      </Card>
    </div>
  );
};

export default Question;