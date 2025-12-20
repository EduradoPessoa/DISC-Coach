import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Logo } from '../components/ui/Logo';
import { Shield, Layout, Zap, Lock, Crown, ChevronRight, Globe, Users, Star, Quote, ChevronDown, Check, CreditCard, Tag, Gift, HelpCircle } from 'lucide-react';
import { apiRequest } from '../services/api';
import { useLanguage } from '../context/LanguageContext';

const Landing = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isGiftMode, setIsGiftMode] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    apiRequest('/nps/public.php', 'GET').then(data => {
        if (Array.isArray(data)) setTestimonials(data);
    }).catch(console.error);
  }, []);

  const scrollToPricing = () => {
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' });
  };

  const plans = [
    {
      id: 'free',
      name: t('pricing.plans.free.name'),
      subtitle: t('pricing.plans.free.subtitle'),
      price: t('pricing.plans.free.price'),
      period: t('pricing.plans.free.period'),
      features: (t('pricing.plans.free.features') as unknown as string[]) || [],
      cta: t('pricing.plans.free.cta'),
      color: 'bg-white',
      textColor: 'text-slate-900',
      btnVariant: 'secondary' as const,
      highlight: false
    },
    {
      id: 'unit',
      name: t('pricing.plans.unit.name'),
      subtitle: t('pricing.plans.unit.subtitle'),
      price: isAnnual ? 'R$ 28,40' : t('pricing.plans.unit.price'), // Calculated 5% off approx
      period: t('pricing.plans.unit.period'),
      features: (t('pricing.plans.unit.features') as unknown as string[]) || [],
      cta: t('pricing.plans.unit.cta'),
      color: 'bg-white',
      textColor: 'text-slate-900',
      btnVariant: 'primary' as const,
      highlight: true,
      badge: 'POPULAR'
    },
    {
      id: 'clevel',
      name: t('pricing.plans.clevel.name'),
      subtitle: t('pricing.plans.clevel.subtitle'),
      price: isAnnual ? 'R$ 93,00' : t('pricing.plans.clevel.price'), // Calculated 5% off approx
      period: t('pricing.plans.clevel.period'),
      features: (t('pricing.plans.clevel.features') as unknown as string[]) || [],
      cta: t('pricing.plans.clevel.cta'),
      color: 'bg-slate-900',
      textColor: 'text-white',
      btnVariant: 'primary' as const,
      highlight: false,
      dark: true
    }
  ];

  const faqs = [
      { q: "O que é a avaliação DISC?", a: "DISC é uma metodologia de avaliação comportamental que analisa quatro fatores principais: Dominância, Influência, Estabilidade e Conformidade. Ela ajuda a entender como as pessoas reagem a desafios, influenciam os outros, lidam com mudanças e seguem regras." },
      { q: "Como funciona o pagamento recorrente?", a: "Nossos planos são assinaturas mensais ou anuais. O pagamento é processado de forma segura via AbacatePay, aceitando cartões de crédito e PIX. Você pode cancelar a qualquer momento." },
      { q: "O que está incluído no plano C-Level Pro?", a: "O plano C-Level Pro oferece acesso ilimitado a todas as ferramentas, incluindo o Coach IA (Gemini 2.5), relatórios avançados de equipe, comparação de perfis e suporte prioritário." },
      { q: "Posso usar para minha equipe inteira?", a: "Sim! Oferecemos planos corporativos e pacotes de 'Vouchers' para que você possa distribuir avaliações para seus colaboradores. Entre em contato para descontos por volume." },
      { q: "Meus dados estão seguros?", a: "Absolutamente. Seguimos rigorosamente a LGPD. Todos os dados são criptografados e não compartilhamos suas informações pessoais com terceiros sem seu consentimento explícito." },
      { q: "Como acesso o Programa de Afiliados?", a: "Após criar sua conta, acesse o menu do usuário (no canto superior direito) e clique em 'Afiliados'. Lá você encontrará seu link exclusivo para convidar amigos e acompanhar suas comissões." },
      { q: "O aplicativo funciona em celulares?", a: "Sim, o DISC Coach é totalmente responsivo e funciona perfeitamente em smartphones, tablets e desktops, sem necessidade de instalação." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white font-sans antialiased text-slate-900">
        {/* Navigation Wrapper - Blue Themed */}
        <header className="w-full bg-blue-900 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                <div className="flex items-center space-x-2">
                    <Logo className="w-10 h-10" />
                    <span className="font-bold text-xl tracking-tight text-white">DISC Coach</span>
                </div>
                <div className="hidden md:flex items-center space-x-6 text-white text-sm font-medium">
                    <button className="hover:text-sky-400 transition-colors" onClick={() => navigate('/')}>Home</button>
                    <button className="hover:text-sky-400 transition-colors" onClick={scrollToPricing}>Planos</button>
                    <button className="hover:text-sky-400 transition-colors" onClick={() => navigate('/auth/login')}>Login</button>
                </div>
                <Button 
                    label="Começar Agora" 
                    className="text-sm font-bold bg-sky-500 hover:bg-sky-600 text-white border-none rounded-full px-6" 
                    onClick={() => navigate('/auth/register')} 
                />
            </div>
        </header>

        <main className="flex-1">
            {/* Hero Section */}
            <section className="relative bg-blue-900 pt-12 pb-32 lg:pt-20 lg:pb-48 overflow-visible">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
                    
                    {/* Left Column: Image (Doctor/Exec) */}
                    <div className="relative z-10 order-2 lg:order-1 flex justify-center lg:justify-start">
                         <div className="relative">
                            <div className="absolute -inset-4 bg-sky-500/20 rounded-full blur-2xl"></div>
                            <img 
                                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                                alt="Executive" 
                                className="relative w-[400px] h-[500px] object-cover rounded-[3rem] shadow-2xl z-10 border-4 border-white/10"
                            />
                            
                            {/* Floating Card 1 */}
                            <div className="absolute top-10 -right-10 bg-white p-4 rounded-xl shadow-lg z-20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
                                <div className="bg-blue-100 p-2 rounded-lg text-blue-600">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">Compliance</p>
                                    <p className="text-sm font-bold text-slate-900">100% Seguro</p>
                                </div>
                            </div>

                            {/* Floating Card 2 */}
                            <div className="absolute bottom-10 -left-10 bg-white p-4 rounded-xl shadow-lg z-20 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-500">
                                <div className="bg-sky-100 p-2 rounded-lg text-sky-600">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 font-bold uppercase">AI Coach</p>
                                    <p className="text-sm font-bold text-slate-900">Gemini 2.5</p>
                                </div>
                            </div>
                         </div>
                    </div>

                    {/* Right Column: Text */}
                    <div className="relative z-10 order-1 lg:order-2 text-center lg:text-left text-white">
                        <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-blue-800 border border-blue-700 text-sky-400 text-xs font-bold mb-6 tracking-wide uppercase">
                            <Crown className="w-3.5 h-3.5" />
                            <span>Executive Intelligence Level C</span>
                        </div>
                        
                        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
                            Liderança de <br/><span className="text-sky-400">Alta Performance</span>
                        </h1>
                        
                        <p className="text-lg text-blue-100 mb-8 leading-relaxed max-w-lg mx-auto lg:mx-0">
                             A plataforma definitiva de avaliação DISC para governança moderna. Transforme dados em insights estratégicos com apoio de IA.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Button 
                                label="Avaliação Gratuita" 
                                className="h-14 px-8 text-base font-bold bg-sky-500 hover:bg-sky-600 border-none rounded-full shadow-lg shadow-sky-500/30" 
                                onClick={() => navigate('/auth/login')}
                            />
                             <Button 
                                label="Saber Mais" 
                                variant="ghost"
                                className="h-14 px-8 text-base font-bold text-white hover:bg-white/10 rounded-full border border-white/20" 
                                onClick={() => navigate('/pricing')}
                            />
                        </div>
                    </div>
                </div>

                {/* Curved Bottom SVG */}
                <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none rotate-180">
                    <svg className="relative block w-[calc(100%+1.3px)] h-[100px]" data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
                        <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" className="fill-white"></path>
                    </svg>
                </div>
            </section>

            {/* Features Section ("Extra Ordinary Solutions") */}
            <section className="py-20 max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <p className="text-sky-500 font-bold uppercase text-sm tracking-wider mb-2">Nossas Soluções</p>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900">Desenvolvimento Executivo <br/>Completo</h2>
                    </div>
                    <Button label="Ver Todos os Recursos" className="rounded-full bg-blue-900 text-white px-6" onClick={() => navigate('/pricing')} />
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600">
                            <Shield className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Foco em Compliance</h3>
                        <p className="text-slate-500 leading-relaxed text-sm">
                            Perfilagem específica para funções que exigem alta governança, precisão e gestão de riscos.
                        </p>
                        <button className="mt-6 text-sky-500 font-bold text-sm uppercase tracking-wide hover:underline">Ler Mais</button>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-sky-50 rounded-full flex items-center justify-center mb-6 text-sky-500">
                            <Zap className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Coach por IA</h3>
                        <p className="text-slate-500 leading-relaxed text-sm">
                             Nossa inteligência analisa seu perfil para sugerir passos de desenvolvimento em cenários de alta pressão.
                        </p>
                        <button className="mt-6 text-sky-500 font-bold text-sm uppercase tracking-wide hover:underline">Ler Mais</button>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg shadow-slate-200 border border-slate-100 hover:-translate-y-2 transition-transform duration-300">
                        <div className="w-14 h-14 bg-indigo-50 rounded-full flex items-center justify-center mb-6 text-indigo-600">
                            <Layout className="w-7 h-7" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Relatórios Board-Ready</h3>
                        <p className="text-slate-500 leading-relaxed text-sm">
                            Gere relatórios concisos e profissionais sobre dinâmicas de equipe e estilos de liderança.
                        </p>
                        <button className="mt-6 text-sky-500 font-bold text-sm uppercase tracking-wide hover:underline">Ler Mais</button>
                    </div>
                </div>
            </section>

            {/* About / Professional Section */}
            <section className="bg-slate-50 py-24 relative">
                <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left: Images Collage */}
                    <div className="relative h-[500px] hidden lg:block">
                        <img 
                            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                            className="absolute top-0 left-0 w-3/4 h-3/4 object-cover rounded-3xl shadow-xl z-10"
                            alt="Meeting"
                        />
                        <img 
                            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                            className="absolute bottom-0 right-0 w-2/3 h-2/3 object-cover rounded-3xl shadow-xl z-20 border-8 border-slate-50"
                            alt="Handshake"
                        />
                         <div className="absolute -bottom-6 -left-6 bg-sky-500 w-24 h-24 rounded-full flex items-center justify-center z-30 shadow-lg">
                            <div className="text-center text-white">
                                <span className="block text-2xl font-black">20+</span>
                                <span className="text-[10px] font-bold uppercase">Anos Exp.</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Content */}
                    <div>
                        <p className="text-sky-500 font-bold uppercase text-sm tracking-wider mb-2">Sobre Nós</p>
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Somos Profissionais em <br/>Inteligência Executiva</h2>
                        <p className="text-slate-500 text-lg leading-relaxed mb-8">
                            Nossa metodologia combina a ciência do comportamento com as exigências do mundo corporativo moderno.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                             <div className="flex items-start gap-3">
                                 <div className="bg-white p-2 rounded-lg shadow-sm text-sky-500"><Shield className="w-5 h-5" /></div>
                                 <div>
                                     <h4 className="font-bold text-slate-900">Segurança de Dados</h4>
                                     <p className="text-xs text-slate-500">Criptografia de ponta a ponta.</p>
                                 </div>
                             </div>
                             <div className="flex items-start gap-3">
                                 <div className="bg-white p-2 rounded-lg shadow-sm text-sky-500"><Globe className="w-5 h-5" /></div>
                                 <div>
                                     <h4 className="font-bold text-slate-900">Suporte Global</h4>
                                     <p className="text-xs text-slate-500">Disponível em 3 idiomas.</p>
                                 </div>
                             </div>
                        </div>

                        {/* Blue CTA Card ("Opening Hours" style) */}
                        <div className="bg-blue-900 rounded-2xl p-8 text-white relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/20 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                             <h3 className="text-xl font-bold mb-4">Pronto para começar?</h3>
                             <p className="text-blue-200 text-sm mb-6">Acesse planos exclusivos com pagamentos facilitados via AbacatePay.</p>
                             <div className="flex items-center justify-between border-t border-white/10 pt-4">
                                 <div>
                                     <span className="block text-xs text-blue-300 uppercase">Planos a partir de</span>
                                     <span className="text-2xl font-bold text-sky-400">R$ 29,90</span>
                                 </div>
                                 <Button label="Ver Planos" className="bg-sky-500 hover:bg-sky-600 border-none rounded-full text-sm" onClick={scrollToPricing} />
                             </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section (Moved from Pricing.tsx) */}
            <section id="pricing" className="py-24 max-w-7xl mx-auto px-6 border-t border-slate-100">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-sky-500 font-bold uppercase text-sm tracking-wider mb-2">Planos e Preços</p>
                    <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6">Investimento em Inteligência</h2>
                    <p className="text-xl text-slate-500 mb-8">
                        Escolha o plano ideal para sua jornada de liderança.
                    </p>
                    
                    {/* Toggle Monthly/Annual */}
                    <div className="flex justify-center items-center space-x-4 mt-8">
                        <span className={`text-sm font-medium ${!isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                            Mensal
                        </span>
                        <button
                            onClick={() => setIsAnnual(!isAnnual)}
                            className={`relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                            isAnnual ? 'bg-indigo-600' : 'bg-slate-200'
                            }`}
                        >
                            <span
                            className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200 ${
                                isAnnual ? 'translate-x-5' : 'translate-x-0'
                            }`}
                            />
                        </button>
                        <span className={`text-sm font-medium ${isAnnual ? 'text-slate-900' : 'text-slate-500'}`}>
                            Anual
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            -5% OFF
                            </span>
                        </span>
                    </div>

                    {/* Gift Mode Toggle */}
                    <div className="mt-6 flex justify-center items-center">
                        <label className="flex items-center space-x-2 cursor-pointer bg-white px-4 py-2 rounded-full shadow-sm border border-indigo-100 hover:border-indigo-300 transition-colors">
                            <input 
                                type="checkbox" 
                                checked={isGiftMode}
                                onChange={(e) => setIsGiftMode(e.target.checked)}
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out rounded" 
                            />
                            <span className="text-sm text-indigo-700 font-medium flex items-center">
                                <Gift className="w-4 h-4 mr-2" />
                                Comprar como Presente
                            </span>
                        </label>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3 lg:gap-8">
                    {plans.map((plan) => (
                    <div
                        key={plan.id}
                        className={`relative flex flex-col rounded-2xl shadow-xl overflow-hidden ${plan.color} ${
                        plan.highlight ? 'ring-2 ring-indigo-500 scale-105 z-10' : 'border border-slate-200'
                        }`}
                    >
                        {plan.badge && (
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                            {plan.badge}
                        </div>
                        )}
                        
                        <div className="p-8 flex-1">
                        <h3 className={`text-xl font-semibold ${plan.textColor}`}>
                            {plan.name}
                        </h3>
                        <p className={`mt-2 text-sm ${plan.dark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {plan.subtitle}
                        </p>
                        <div className="mt-8 flex items-baseline">
                            <span className={`text-4xl font-extrabold tracking-tight ${plan.textColor}`}>
                            {plan.price}
                            </span>
                            <span className={`ml-1 text-xl font-medium ${plan.dark ? 'text-slate-400' : 'text-slate-500'}`}>
                            {plan.period}
                            </span>
                        </div>

                        {/* Gift Input if active and not Free plan */}
                        {isGiftMode && plan.id !== 'free' && (
                            <div className="mt-6 bg-indigo-50 p-3 rounded-lg border border-indigo-100 animate-in fade-in">
                                <label className="block text-xs font-medium text-indigo-900 mb-1">
                                    Enviar para (Email):
                                </label>
                                <input 
                                    type="email" 
                                    placeholder="amigo@empresa.com" 
                                    className="w-full px-2 py-1 text-sm border-gray-300 rounded focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                        )}

                        <ul className="mt-8 space-y-4">
                            {plan.features.map((feature, index) => (
                            <li key={index} className="flex items-start">
                                <div className="flex-shrink-0">
                                <Check className={`h-5 w-5 ${plan.dark ? 'text-indigo-400' : 'text-green-500'}`} />
                                </div>
                                <p className={`ml-3 text-sm ${plan.dark ? 'text-slate-300' : 'text-slate-700'}`}>
                                {feature}
                                </p>
                            </li>
                            ))}
                        </ul>
                        </div>
                        <div className={`p-8 ${plan.dark ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <Button
                            label={isGiftMode && plan.id !== 'free' ? "Presentear" : plan.cta}
                            variant={plan.btnVariant}
                            fullWidth
                            onClick={() => {
                                if (plan.id === 'free') {
                                    // Free plan bypasses checkout
                                    navigate('/auth/register');
                                } else {
                                    navigate('/checkout', { 
                                        state: { 
                                            planId: plan.id, 
                                            price: isAnnual ? parseFloat(plan.price.replace('R$', '').replace(',', '.')) : parseFloat(plan.price.replace('R$', '').replace(',', '.')),
                                            isAnnual,
                                            isGift: isGiftMode
                                        } 
                                    });
                                }
                            }}
                            className={plan.dark ? 'bg-indigo-600 hover:bg-indigo-700 border-transparent' : ''}
                        />
                        </div>
                    </div>
                    ))}
                </div>

                {/* Affiliates & Coupon Section (Removed as per request, Affiliates moved to User Menu) */}
            </section>

            {/* QA Section */}
            <section className="bg-slate-50 py-24">
                <div className="max-w-3xl mx-auto px-6">
                    <div className="text-center mb-16">
                         <p className="text-sky-500 font-bold uppercase text-sm tracking-wider mb-2">Dúvidas Frequentes</p>
                         <h2 className="text-3xl font-bold text-slate-900">Perguntas & Respostas</h2>
                         <p className="text-slate-500 mt-2">Saiba mais sobre como o APP funciona.</p>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq, i) => (
                            <div key={i} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                                <button 
                                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none hover:bg-slate-50 transition-colors"
                                >
                                    <span className="font-bold text-slate-900 flex items-center">
                                        <HelpCircle className="w-5 h-5 mr-3 text-sky-500" />
                                        {faq.q}
                                    </span>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${openFaq === i ? 'rotate-180' : ''}`} />
                                </button>
                                <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                    <div className="p-6 pt-0 text-slate-600 text-sm leading-relaxed border-t border-slate-100 mt-2">
                                        {faq.a}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            {testimonials.length > 0 && (
                <section className="py-24 max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                         <p className="text-sky-500 font-bold uppercase text-sm tracking-wider mb-2">Depoimentos</p>
                         <h2 className="text-3xl font-bold text-slate-900">O que os Líderes Dizem</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((t, i) => (
                            <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                            {t.avatar ? <img src={t.avatar} alt={t.name} className="w-full h-full object-cover" /> : <Users className="w-6 h-6 m-auto mt-2 text-slate-400" />}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-slate-900">{t.name}</p>
                                            <p className="text-xs text-slate-400">{t.position}</p>
                                        </div>
                                    </div>
                                    <Quote className="w-8 h-8 text-blue-100" />
                                </div>
                                <p className="text-slate-600 mb-4 italic text-sm leading-relaxed">"{t.comment}"</p>
                                <div className="flex text-yellow-400">
                                    {[...Array(parseInt(t.score) >= 9 ? 5 : 4)].map((_, i) => <Star key={i} className="w-4 h-4 fill-current" />)}
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            )}
        </main>
        
        {/* Footer */}
        <footer className="w-full bg-blue-950 text-white pt-20 pb-10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-2 md:col-span-1">
                    <div className="flex items-center space-x-2 mb-6">
                        <Logo className="w-10 h-10" />
                        <span className="font-bold text-2xl tracking-tighter">DISC Coach</span>
                    </div>
                    <p className="text-blue-200 text-sm leading-relaxed max-w-xs">
                        A plataforma de inteligência comportamental de elite para líderes e organizações de alto nível.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Produto</h4>
                    <ul className="space-y-3 text-sm text-blue-300">
                        <li className="hover:text-white transition-colors cursor-pointer">Avaliações</li>
                        <li className="hover:text-white transition-colors cursor-pointer">Time Analytics</li>
                        <li className="hover:text-white transition-colors cursor-pointer">Planos</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Suporte</h4>
                    <ul className="space-y-3 text-sm text-blue-300">
                        <li className="hover:text-white transition-colors cursor-pointer">Ajuda</li>
                        <li className="hover:text-white transition-colors cursor-pointer">API Docs</li>
                        <li className="hover:text-white transition-colors cursor-pointer">AbacatePay</li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold text-white mb-6 uppercase text-xs tracking-widest">Legal</h4>
                    <ul className="space-y-3 text-sm text-blue-300">
                        <li className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/legal/privacy')}>Privacidade</li>
                        <li className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/legal/terms')}>Termos de Uso</li>
                        <li className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/legal/lgpd')}>LGPD</li>
                        <li className="hover:text-white transition-colors cursor-pointer" onClick={() => navigate('/legal/cookies')}>Política de Cookies</li>
                    </ul>
                </div>
            </div>
            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-xs text-blue-400 font-bold gap-4">
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <p>&copy; 2024 DISC COACH PROFESSIONAL.</p>
                    <span className="hidden md:inline text-blue-700">|</span>
                    <p>Powered by <a href="https://www.phoenyx.com.br" target="_blank" className="hover:text-white transition-colors">PHOENYX TECNOLOGIA</a></p>
                </div>
                <div className="flex gap-8 items-center">
                    <a href="https://wa.me/5519982210377" target="_blank" className="hover:text-white transition-colors flex items-center gap-2">
                        <span>WhatsApp: (19) 98221-0377</span>
                    </a>
                    <span className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> SSL SECURE</span>
                </div>
            </div>
        </footer>
    </div>
  );
};

export default Landing;