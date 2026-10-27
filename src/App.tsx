import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { AppHeader } from './components/AppHeader';
import { Footer } from './components/Footer';
import { ToastContainer } from './components/Toast';

// Pages
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { MatchmakerPage } from './pages/MatchmakerPage';
import { DesignerPage } from './pages/DesignerPage';
import { ConnectPage } from './pages/ConnectPage';
import { AuthPage } from './pages/AuthPage';
import { BuyerDashboardPage } from './pages/BuyerDashboardPage';
import { SavedPropertiesPage } from './pages/SavedPropertiesPage';
import { ComparePage } from './pages/ComparePage';
import { MessagesPage } from './pages/MessagesPage';
import { SellerDashboardPage } from './pages/SellerDashboardPage';
import { SellerPropertiesPage } from './pages/SellerPropertiesPage';
import { SellerAddEditPropertyPage } from './pages/SellerAddEditPropertyPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import { canAccessRoute } from './utils/permissions';

function AppContent() {
  const { currentPath, currentUser } = useApp();

  // Route authorization is evaluated from the active role on every render, so
  // typing a protected URL is handled the same way as clicking a hidden link.
  const access = canAccessRoute(currentUser?.role, currentPath);

  // Route matching
  const renderRoute = () => {
    // Strip query string for matching
    const cleanPath = currentPath.split('?')[0].replace(/\/+$/, '') || '/';

    // Home
    if (cleanPath === '/') {
      return <HomePage />;
    }

    // Properties catalog
    if (cleanPath === '/properties') {
      return <PropertiesPage />;
    }

    // Single Property details: /properties/:id
    if (cleanPath.startsWith('/properties/') && !cleanPath.includes('/edit')) {
      const id = cleanPath.replace('/properties/', '');
      return <PropertyDetailPage propertyId={id} />;
    }

    // AI Matchmaker
    if (cleanPath === '/matchmaker') {
      return <MatchmakerPage />;
    }

    // AI Designer
    if (cleanPath === '/designer') {
      return <DesignerPage />;
    }

    // AI Connect
    if (cleanPath === '/connect') {
      return <ConnectPage />;
    }

    // Auth routes
    if (cleanPath === '/login') {
      return <AuthPage initialMode="login" />;
    }
    if (cleanPath === '/register') {
      return <AuthPage initialMode="register" />;
    }
    if (cleanPath === '/forgot-password') {
      return <AuthPage initialMode="forgot" />;
    }

    // Buyer routes
    if (cleanPath === '/dashboard') {
      return <BuyerDashboardPage />;
    }
    if (cleanPath === '/saved') {
      return <SavedPropertiesPage />;
    }
    if (cleanPath === '/compare') {
      return <ComparePage />;
    }
    if (cleanPath === '/messages') {
      return <MessagesPage />;
    }

    // Seller routes
    if (cleanPath === '/seller') {
      return <SellerDashboardPage />;
    }
    if (cleanPath === '/seller/properties') {
      return <SellerPropertiesPage />;
    }
    if (cleanPath === '/seller/properties/new') {
      return <SellerAddEditPropertyPage />;
    }
    if (cleanPath.startsWith('/seller/properties/') && cleanPath.endsWith('/edit')) {
      const match = cleanPath.match(/\/seller\/properties\/([^/]+)\/edit/);
      const id = match ? match[1] : undefined;
      return <SellerAddEditPropertyPage editPropertyId={id} />;
    }

    // Profile & Admin
    if (cleanPath === '/profile') {
      return <ProfilePage />;
    }
    if (cleanPath === '/admin') {
      return <AdminPage />;
    }

    // 404
    return <NotFoundPage />;
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-[#070e18] text-slate-900 dark:text-slate-100 font-sans selection:bg-teal-500 selection:text-white transition-colors">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1">
          {access.allowed ? (
            renderRoute()
          ) : (
            <AccessDeniedPage
              reason={access.reason}
              recommendedPath={access.recommendedPath}
              requiredRoleLabel={access.requiredRoleLabel}
            />
          )}
        </main>
        <Footer />
      </div>
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
