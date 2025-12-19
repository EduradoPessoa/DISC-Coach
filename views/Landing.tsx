import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Shield, Layout, Zap, Lock, Crown, ChevronRight, Globe, Users } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans antialiased text-slate-900">
        {/* Navigation Wrapper - FULL WIDTH BORDER */}
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
            {/* Hero Section */}
            <section className="relative overflow-hidden pt-20 pb-24 lg:pt-32 lg:pb-40">
                <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,theme(colors.indigo.50),white_70%)]"></div>
                
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-extrabold mb-10 tracking-wide uppercase">
                        <Crown className="w-3.5 h-3.5" />
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
                    
                    {/* Partners/Trust */}
                    <div className="mt-24 pt-10 border-t border-slate-100 flex flex-wrap justify-center items-center gap-10 md:gap-20 opacity-40 grayscale transition-all hover:grayscale-0">
                        <span className="font-black text-slate-400 text-xl tracking-tighter italic">FINANCE HUB</span>
                        <span className="font-black text-slate-400 text-xl tracking-tighter">CORP GOVERNANCE</span>
                        <span className="font-black text-slate-400 text-xl tracking-tighter">LEGAL STRATEGY</span>
                        <span className="font-black text-slate-400 text-xl tracking-tighter">ELITE OPS</span>
                    </div>
                </div>
            </section>

            {/* Features Section - FULL WIDTH BACKGROUND */}
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
                                Nossa inteligência (Gemini 2.5) analisa seu perfil para sugerir passos de desenvolvimento em cenários de alta pressão.
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

            {/* AbacatePay & SaaS Section */}
            <section className="py-24 max-w-7xl mx-auto px-6">
                <div className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-white flex flex-col md:flex-row items-center gap-12 shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20"></div>
                    <div className="flex-1 z-10">
                        <div className="flex items-center gap-2 mb-6">
                            <Globe className="w-6 h-6 text-indigo-200" />
                            <span className="font-bold text-indigo-100 uppercase tracking-widest text-sm">Escalabilidade Global</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Expanda seu Acesso com o Nível C Pro.</h2>
                        <p className="text-indigo-100 text-xl mb-10 leading-relaxed max-w-xl">
                            Use cupons exclusivos de até 100% de desconto. Pagamento seguro via AbacatePay com liberação imediata.
                        </p>
                        <Button 
                            label="Ver Planos e Preços" 
                            className="h-16 px-12 text-lg font-bold bg-white text-indigo-700 hover:bg-indigo-50 border-none shadow-lg" 
                            onClick={() => navigate('/pricing')}
                        />
                    </div>
                    <div className="w-full md:w-1/3 z-10">
                        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                    <span className="font-medium text-sm">Usuários Corporativos</span>
                                    <Users className="w-4 h-4" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                    <span className="font-medium text-sm">Gestão de Cupons</span>
                                    <Crown className="w-4 h-4" />
                                </div>
                                <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                                    <span className="font-medium text-sm">Checkout AbacatePay</span>
                                    <Shield className="w-4 h-4" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
        
        {/* Footer - FULL WIDTH BORDER */}
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
                <div>
                    <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Produto</h4>
                    <ul className="space-y-4 text-sm text-slate-500 font-medium">
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer">Avaliações</li>
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer">Time Analytics</li>
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer">Planos</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Suporte</h4>
                    <ul className="space-y-4 text-sm text-slate-500 font-medium">
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer">Ajuda</li>
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer">API Docs</li>
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer">AbacatePay</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-slate-900 mb-6 uppercase text-xs tracking-widest">Legal</h4>
                    <ul className="space-y-4 text-sm text-slate-500 font-medium">
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer">Privacidade</li>
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer">Termos</li>
                    </ul>
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