import React, { useState } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Star, X } from 'lucide-react';
import { apiRequest } from '../../services/api';
import { useUser } from '../../context/UserContext';
import { useNotification } from '../../context/NotificationContext';

interface NPSModalProps {
  onClose: () => void;
}

export const NPSModal: React.FC<NPSModalProps> = ({ onClose }) => {
  const { user } = useUser();
  const { addNotification } = useNotification();
  const [score, setScore] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (score === null) return;
    setSubmitting(true);
    try {
        await apiRequest('/nps/submit.php', 'POST', {
            user_id: user.id,
            score,
            comment
        });
        addNotification('success', 'Obrigado pelo seu feedback!');
        onClose();
    } catch (e) {
        addNotification('error', 'Erro ao enviar feedback.');
    } finally {
        setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 relative animate-in fade-in zoom-in-95">
        <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Como você avalia o DISC Coach?</h3>
            <p className="text-slate-500 text-sm">Sua opinião nos ajuda a evoluir a plataforma para líderes como você.</p>
        </div>

        <div className="flex justify-center gap-2 mb-6">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <button
                    key={num}
                    onClick={() => setScore(num)}
                    className={`w-8 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
                        score === num 
                        ? 'bg-indigo-600 text-white scale-110 shadow-lg' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                    {num}
                </button>
            ))}
        </div>

        <div className="mb-6">
            <textarea 
                className="w-full p-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none h-24"
                placeholder="Conte-nos mais sobre sua experiência (opcional)..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
            />
        </div>

        <div className="flex justify-end gap-3">
            <Button label="Cancelar" variant="ghost" onClick={onClose} />
            <Button 
                label={submitting ? "Enviando..." : "Enviar Feedback"} 
                disabled={score === null || submitting} 
                onClick={handleSubmit} 
            />
        </div>
      </div>
    </div>
  );
};
