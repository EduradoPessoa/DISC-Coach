import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { X, Lightbulb, ChevronRight, MessageCircle } from 'lucide-react';
import { useUser } from '../../context/UserContext';

export const Tutor = () => {
  const { user } = useUser();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const [tip, setTip] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  // Tips logic based on route
  useEffect(() => {
    // Only show for logged in users
    if (!user) return;

    const path = location.pathname;
    let message = '';

    if (path.includes('/dashboard')) {
        message = `Olá ${user.name.split(' ')[0]}! Aqui no Dashboard você tem uma visão geral do seu progresso. Confira seus resultados recentes.`;
    } else if (path.includes('/assessment/start')) {
        message = "Responda com sinceridade. Não existem respostas certas ou erradas, apenas o seu perfil natural.";
    } else if (path.includes('/development')) {
        message = "Este plano é gerado por IA baseado no seu perfil. Revise as ações sugeridas e marque as concluídas.";
    } else if (path.includes('/pricing')) {
        message = "O plano Level C Pro desbloqueia o Coach IA e relatórios detalhados para sua equipe.";
    }

    if (message) {
        setTip(message);
        // Delay appearance
        const timer = setTimeout(() => setShow(true), 1500);
        return () => clearTimeout(timer);
    } else {
        setShow(false);
    }
  }, [location.pathname, user]);

  if (!show) return null;

  if (isMinimized) {
      return (
          <button 
            onClick={() => setIsMinimized(false)}
            className="fixed bottom-6 right-6 z-50 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all animate-bounce"
          >
              <Lightbulb className="w-6 h-6" />
          </button>
      );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom-5 duration-500">
        <div className="bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden relative">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-3 flex items-center justify-between">
                <div className="flex items-center space-x-2 text-white">
                    <div className="bg-white/20 p-1.5 rounded-lg">
                        <MessageCircle className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm">DISC Tutor</span>
                </div>
                <div className="flex items-center space-x-1">
                    <button onClick={() => setIsMinimized(true)} className="text-white/80 hover:text-white p-1">
                        <ChevronRight className="w-4 h-4 rotate-90" />
                    </button>
                    <button onClick={() => setShow(false)} className="text-white/80 hover:text-white p-1">
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
            <div className="p-5 flex gap-4">
                <div className="flex-shrink-0">
                    {/* Animated Avatar Placeholder */}
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center relative overflow-hidden">
                        <img 
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=tutor&backgroundColor=transparent`} 
                            alt="Tutor" 
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
                <div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        {tip}
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
};
