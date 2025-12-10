import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { CheckCircle, Shield, TrendingUp } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-slate-100 max-w-7xl mx-auto w-full">
            <div className="font-bold text-xl text-slate-900">DISC Coach</div>
            <div className="space-x-4">
                <Button label="Sign In" variant="ghost" onClick={() => navigate('/auth/login')} />
                <Button label="Get Started" onClick={() => navigate('/auth/onboarding')} />
            </div>
        </nav>

        <main className="flex-1">
            {/* Hero */}
            <section className="px-6 py-20 lg:py-32 max-w-7xl mx-auto text-center">
                <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-6">
                    Designed for C-Level Professionals
                </span>
                <h1 className="text-4xl md:text-6xl font-bold text-slate-900 tracking-tight mb-6">
                    Precision in Leadership <br className="hidden md:block"/> Starts with Self-Awareness.
                </h1>
                <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10">
                    The advanced DISC assessment platform focusing on governance, compliance, and executive decision-making styles.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Button 
                        label="Start Assessment" 
                        className="h-12 px-8 text-lg" 
                        onClick={() => navigate('/auth/login')}
                    />
                    <Button 
                        label="View Demo Report" 
                        variant="secondary" 
                        className="h-12 px-8 text-lg" 
                    />
                </div>
            </section>

            {/* Features */}
            <section className="bg-slate-50 py-20 px-6">
                <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
                            <Shield className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Compliance Focused</h3>
                        <p className="text-slate-600">
                            Tailored specifically for roles requiring high governance, precision, and risk management.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
                            <TrendingUp className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">AI-Driven Insights</h3>
                        <p className="text-slate-600">
                            Our Gemini-powered engine analyzes your profile to suggest actionable development steps.
                        </p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                        <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6 text-indigo-600">
                            <CheckCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3">Executive Reporting</h3>
                        <p className="text-slate-600">
                            Generate concise, board-ready reports on team dynamics and individual leadership styles.
                        </p>
                    </div>
                </div>
            </section>
        </main>
        
        <footer className="bg-slate-900 text-slate-400 py-12 px-6 text-center">
            <p>&copy; 2024 DISC Coach. All rights reserved.</p>
        </footer>
    </div>
  );
};

export default Landing;