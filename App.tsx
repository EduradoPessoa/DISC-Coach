
import React, { useState } from 'react';
import { HashRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { UserProvider, useUser } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import { AssessmentProvider } from './context/AssessmentContext';

// Views
import Landing from './views/Landing';
import Login from './views/auth/Login';
import ForgotPassword from './views/auth/ForgotPassword';
import ResetPassword from './views/auth/ResetPassword';
import Onboarding from './views/auth/Onboarding';
import Dashboard from './views/Dashboard';
import StartAssessment from './views/assessment/StartAssessment';
import Question from './views/assessment/Question';
import AssessmentReview from './views/assessment/AssessmentReview';
import ResultsSummary from './views/results/ResultsSummary';
import DevelopmentPlan from './views/DevelopmentPlan';
import Settings from './views/Settings';
import Pricing from './views/Pricing';
import Checkout from './views/Checkout';
import PaymentSuccess from './views/PaymentSuccess';
import PaymentCancel from './views/PaymentCancel';

// Admin Views
import SaasAdminUsers from './views/admin/SaasAdminUsers';
import SaasAdminFinance from './views/admin/SaasAdminFinance';
import SaasAdminCoupons from './views/admin/SaasAdminCoupons';
import SaasAdminAffiliates from './views/admin/SaasAdminAffiliates';
import TeamManagement from './views/admin/TeamManagement';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useUser();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  return <>{children}</>;
};

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar isOpen={sidebarOpen} closeMobile={() => setSidebarOpen(false)} />
        <main className="flex-1 overflow-auto p-4 md:p-8 custom-scrollbar">
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
                <div className="w-14 h-14 bg-slate-900 rounded-2xl mx-auto flex items-center justify-center mb-4 shadow-xl">
                    <span className="text-white font-black text-2xl">DC</span>
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">DISC Coach</h2>
                <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.3em]">Professional Level C</p>
            </div>
            <Outlet />
        </div>
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
                {/* Public Route: Landing Page is the system entry point */}
                <Route path="/" element={<Landing />} />

                <Route path="/auth" element={<AuthLayout />}>
                  <Route path="login" element={<Login />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                  <Route path="reset-password/:token" element={<ResetPassword />} />
                  <Route path="onboarding" element={<Onboarding />} />
                </Route>
                
                <Route path="/checkout/success" element={<PaymentSuccess />} />
                <Route path="/checkout/cancel" element={<PaymentCancel />} />

                <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/assessment/start" element={<StartAssessment />} />
                  <Route path="/assessment/question/:id" element={<Question />} />
                  <Route path="/assessment/review" element={<AssessmentReview />} />
                  <Route path="/results/summary/:userId" element={<ResultsSummary />} />
                  <Route path="/development/:userId" element={<DevelopmentPlan />} />
                  <Route path="/settings" element={<Settings />} />

                  {/* Saas Admin Routes */}
                  <Route path="/admin/saas/users" element={<SaasAdminUsers />} />
                  <Route path="/admin/saas/finance" element={<SaasAdminFinance />} />
                  <Route path="/admin/saas/coupons" element={<SaasAdminCoupons />} />
                  <Route path="/admin/saas/affiliates" element={<SaasAdminAffiliates />} />

                  {/* Team Admin Routes */}
                  <Route path="/admin/team" element={<TeamManagement />} />
                </Route>

                {/* Catch all redirect to root */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </HashRouter>
          </AssessmentProvider>
        </UserProvider>
      </NotificationProvider>
    </LanguageProvider>
  );
};

export default App;
