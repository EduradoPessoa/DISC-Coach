import React, { useState } from 'react';
import { HashRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { UserProvider } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import { AssessmentProvider } from './context/AssessmentContext';

// Views
import Landing from './views/Landing';
import Login from './views/auth/Login';
import Onboarding from './views/auth/Onboarding';
import Dashboard from './views/Dashboard';
import StartAssessment from './views/assessment/StartAssessment';
import Question from './views/assessment/Question';
import AssessmentReview from './views/assessment/AssessmentReview';
import ResultsSummary from './views/results/ResultsSummary';
import DevelopmentPlan from './views/DevelopmentPlan';
import AdminUsers from './views/AdminUsers';
import Settings from './views/Settings';
import Pricing from './views/Pricing';
import Checkout from './views/Checkout';
import PaymentSuccess from './views/PaymentSuccess';
import PaymentCancel from './views/PaymentCancel';

// Layout Wrappers
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} closeMobile={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AuthLayout = () => (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-md">
            <div className="text-center mb-8">
                <div className="w-12 h-12 bg-slate-900 rounded-xl mx-auto flex items-center justify-center mb-4">
                    <span className="text-white font-bold text-xl">DC</span>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">DISC Coach</h2>
                <p className="text-slate-500">Professional Intelligence</p>
            </div>
            <Outlet />
        </div>
    </div>
);

const LandingLayout = () => (
    <div className="min-h-screen bg-white">
        <Outlet />
    </div>
);

const App = () => {
  return (
    <LanguageProvider>
      <NotificationProvider>
        <UserProvider>
          <AssessmentProvider>
            <HashRouter>
              <Routes>
                {/* Public / Landing */}
                <Route element={<LandingLayout />}>
                    <Route path="/" element={<Landing />} />
                </Route>

                {/* Auth */}
                <Route path="/auth" element={<AuthLayout />}>
                  <Route path="login" element={<Login />} />
                  <Route path="onboarding" element={<Onboarding />} />
                </Route>
                
                {/* Checkout Return Routes (No Layout for Clean UI) */}
                <Route path="/checkout/success" element={<PaymentSuccess />} />
                <Route path="/checkout/cancel" element={<PaymentCancel />} />

                {/* Protected App Routes */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/assessment/start" element={<StartAssessment />} />
                  <Route path="/assessment/question/:id" element={<Question />} />
                  <Route path="/assessment/review" element={<AssessmentReview />} />
                  <Route path="/results/summary/:userId" element={<ResultsSummary />} />
                  <Route path="/development/:userId" element={<DevelopmentPlan />} />
                  <Route path="/admin/users" element={<AdminUsers />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Routes>
            </HashRouter>
          </AssessmentProvider>
        </UserProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
};

export default App;
