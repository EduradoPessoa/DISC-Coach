import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Shield, Layout, Zap, Lock, ChevronRight, Globe, Users } from 'lucide-react';

// Use a local name that won't collide with any imports
const CrownIcon = ({ className }: { className?: string }) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7zm3 16h14" />
    </svg>
);

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans antialiased text-slate-900">
        <header className="w-full border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-2">
                    <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">DC</span>
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900">DISC Coach</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4">
                    <Button label="Acessar" variant="ghost" className="text-sm font-semibold text-slate-600" onClick={() => navigate('/auth/login')} />
                    <Button label="Começar Agora" className="text-sm font-bold shadow-md px-5" onClick={() => navigate('/auth/onboarding')} />
                </div>
            </div>
        </header>

        <main className="flex-1">
            <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,theme(colors.indigo.50),white_70%)]"></div>
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-extrabold mb-10 tracking-wide uppercase">
                        <CrownIcon className="w-3.5 h-3.5" />
                        <span>Executive Intelligence Level C</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight mb-8 leading-[1.05]">
                        Liderança de Alta Performance <br className="hidden md:block"/> com <span className="text-indigo-600">Inteligência Comportamental</span>.
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-14 leading-relaxed font-light">
                        A plataforma definitiva de avaliação DISC para governança moderna. Transforme dados em insights estratégicos com apoio de IA.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
                        <Button 
                            label="Avaliação Gratuita" 
                            className="h-16 px-12 text-lg font-bold shadow-xl shadow-indigo-200 bg-indigo-600 hover:bg-indigo-700 border-none" 
                            onClick={() => navigate('/auth/login')}
                        />
                        <Button 
                            label="Ver Planos Pro" 
                            variant="secondary" 
                            className="h-16 px-12 text-lg font-bold border-slate-200"
                            onClick={() => navigate('/pricing')}
                        />
                    </div>
                </div>
            </section>

            <div className="w-full bg-slate-50 border-y border-slate-100">
                <section className="py-24 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Desenvolvimento Executivo Completo</h2>
                        <p className="text-lg text-slate-500 max-w-2xl mx-auto font-medium">Ferramentas robustas desenhadas para a complexidade da governança corporativa.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10">
                        <div className="group bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white shadow-sm">
                                <Shield className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Foco em Compliance</h3>
                            <p className="text-slate-500 leading-relaxed text-lg">
                                Perfilagem específica para funções que exigem alta governança, precisão e gestão de riscos. Ideal para CCOs e CFOs.
                            </p>
                        </div>

                        <div className="group bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white shadow-sm">
                                <Zap className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Coach por IA</h3>
                            <p className="text-slate-500 leading-relaxed text-lg">
                                Nossa inteligência analisa seu perfil para sugerir passos de desenvolvimento em cenários de alta pressão.
                            </p>
                        </div>

                        <div className="group bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-200 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">
                            <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mb-8 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white shadow-sm">
                                <Layout className="w-8 h-8" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Relatórios Board-Ready</h3>
                            <p className="text-slate-500 leading-relaxed text-lg">
                                Gere relatórios concisos e profissionais sobre dinâmicas de equipe e estilos de liderança em segundos.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </main>
        
        <footer className="w-full bg-slate-50 border-t border-slate-200 pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-16 mb-16">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center space-x-2 mb-8">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center">
                            <span className="text-white font-bold text-base">DC</span>
                        </div>
                        <span className="font-bold text-2xl text-slate-900 tracking-tighter">DISC Coach</span>
                    </div>
                    <p className="text-slate-500 text-base leading-relaxed max-w-xs">
                        A plataforma de inteligência comportamental de elite para líderes e organizações de alto nível.
                    </p>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 font-bold gap-4">
                <p>&copy; 2024 DISC COACH PROFESSIONAL. TODOS OS DIREITOS RESERVADOS.</p>
                <div className="flex gap-8">
                    <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> SSL SECURE CONNECTION</span>
                    <span>MADE IN BRAZIL</span>
                </div>
            </div>
        </footer>
    </div>
  );
};

export default Landing;
