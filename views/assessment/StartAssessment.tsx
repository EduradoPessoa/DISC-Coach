import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Clock, Info, ShieldCheck } from 'lucide-react';
import { useAssessment } from '../../context/AssessmentContext';
import { useLanguage } from '../../context/LanguageContext';

const StartAssessment = () => {
  const navigate = useNavigate();
  const { startAssessment } = useAssessment();
  const { t } = useLanguage();

  const handleStart = () => {
    startAssessment();
    navigate('/assessment/question/1');
  };

  return (
    <div className="max-w-3xl mx-auto">
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('assessment.title')}</h1>
            <p className="text-slate-500">Analyzing Leadership, Compliance, and Governance Styles</p>
        </div>

        <Card className="mb-6">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
                <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                        <Clock className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900">15 Minutes</h3>
                    <p className="text-sm text-slate-500">Average completion time</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
                        <Info className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900">30 Questions</h3>
                    <p className="text-sm text-slate-500">Rapid-choice format</p>
                </div>
                <div className="flex flex-col items-center text-center p-4">
                    <div className="w-12 h-12 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-3">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h3 className="font-semibold text-slate-900">Private</h3>
                    <p className="text-sm text-slate-500">Confidential results</p>
                </div>
            </div>

            <div className="bg-slate-50 p-6 rounded-lg mb-8 border border-slate-100">
                <h4 className="font-bold text-slate-900 mb-2">Instructions</h4>
                <ul className="list-disc list-inside text-slate-700 space-y-2 text-sm">
                    <li>There are no right or wrong answers.</li>
                    <li>Respond based on your professional behavior in your current role.</li>
                    <li>Avoid "Neutral" responses when possible for better accuracy.</li>
                    <li>Move quickly—your first instinct is usually correct.</li>
                </ul>
            </div>

            <div className="flex flex-col gap-3">
                <Button 
                    label="Begin Assessment" 
                    className="w-full h-12 text-lg" 
                    onClick={handleStart} 
                />
                <Button 
                    label="View Sample Questions" 
                    variant="ghost" 
                    className="w-full"
                />
            </div>
        </Card>
    </div>
  );
};

export default StartAssessment;