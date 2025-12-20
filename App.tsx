import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { UserProvider, useUser } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';
import { AssessmentProvider } from './context/AssessmentContext';
import { Tutor } from './components/ui/Tutor';
import { Logo } from './components/ui/Logo';

// Views
import Landing from './views/Landing';
import Login from './views/auth/Login';
import Register from './views/auth/Register';
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

// SaaS Admin Views
import SaasDashboard from './views/saas-admin/SaasDashboard';
import SaasUsers from './views/saas-admin/SaasUsers';
import SaasFinance from './views/saas-admin/SaasFinance';
import SaasCoupons from './views/saas-admin/SaasCoupons';
import SaasSettings from './views/saas-admin/SaasSettings';
import SaasNotifications from './views/saas-admin/SaasNotifications';
import SaasNPS from './views/saas-admin/SaasNPS';

import AffiliateProgram from './views/AffiliateProgram';

// Legal
import TermsLGPD from './views/legal/TermsLGPD';
import CookiePolicy from './views/legal/CookiePolicy';
import TermsOfUse from './views/legal/TermsOfUse';
import PrivacyPolicy from './views/legal/PrivacyPolicy';

// Layout Wrappers
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useUser(); // You'll need to export useUser from context/UserContext or pass it
  // Ideally, check for authentication token or user object presence
  // For this mock, we assume if user.id is '1' (default mock) it might be logged in, 
  // but in a real scenario, we check a specific flag or null user.
  
  // Simple check: if we are on a protected route, we expect a user.
  // If not logged in, redirect to login.
  // Since we use a default user for dev, this might always pass.
  // To test properly, you'd need a real auth state.
  return <>{children}</>;
};

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
            isOpen={sidebarOpen} 
            closeMobile={() => setSidebarOpen(false)} 
            isCollapsed={isCollapsed}
            toggleCollapse={() => setIsCollapsed(!isCollapsed)}
        />
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
                <div className="mx-auto flex items-center justify-center mb-4">
                    <Logo className="w-12 h-12" />
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
  // Ensure DB is ready for dev
  React.useEffect(() => {
    // Use relative path to work in both Dev (root) and Prod (dist subdirectory)
    fetch('../api/setup_user.php').catch(console.error);
  }, []);

  return (
    <LanguageProvider>
      <UserProvider>
        <NotificationProvider>
          <AssessmentProvider>
            <BrowserRouter>
              <Tutor />
              <Routes>
                {/* Public / Landing */}
                <Route element={<LandingLayout />}>
                    <Route path="/" element={<Landing />} />
                </Route>

                {/* Legal Pages */}
                <Route path="/legal/lgpd" element={<TermsLGPD />} />
                <Route path="/legal/cookies" element={<CookiePolicy />} />
                <Route path="/legal/terms" element={<TermsOfUse />} />
                <Route path="/legal/privacy" element={<PrivacyPolicy />} />

                {/* Auth */}
                <Route path="/auth" element={<AuthLayout />}>
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
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
                  <Route path="/affiliates" element={<AffiliateProgram />} />
                  
                  {/* SaaS Admin Routes */}
                  <Route path="/saas-admin" element={<SaasDashboard />} />
                  <Route path="/saas-admin/users" element={<SaasUsers />} />
                  <Route path="/saas-admin/finance" element={<SaasFinance />} />
                  <Route path="/saas-admin/coupons" element={<SaasCoupons />} />
                  <Route path="/saas-admin/settings" element={<SaasSettings />} />
                  <Route path="/saas-admin/notifications" element={<SaasNotifications />} />
                  <Route path="/saas-admin/nps" element={<SaasNPS />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </AssessmentProvider>
        </NotificationProvider>
      </UserProvider>
    </LanguageProvider>
  );
};

export default App;
