import { useState } from 'react';
import GuideLogin from './components/GuideLogin';
import RevealPage from './components/RevealPage';
import AdminPanel from './components/AdminPanel';
import { Guide } from './lib/supabase';

type View = 'login' | 'reveal' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<View>('login');
  const [currentGuide, setCurrentGuide] = useState<Guide | null>(null);

  const handleLogin = (guide: Guide) => {
    setCurrentGuide(guide);
    setCurrentView('reveal');
  };

  const handleLogout = () => {
    setCurrentGuide(null);
    setCurrentView('login');
  };

  const handleAdminAccess = () => {
    setCurrentView('admin');
  };

  const handleBackToLogin = () => {
    setCurrentView('login');
  };

  return (
    <>
      {currentView === 'login' && (
        <GuideLogin onLogin={handleLogin} onAdminAccess={handleAdminAccess} />
      )}
      {currentView === 'reveal' && currentGuide && (
        <RevealPage guide={currentGuide} onLogout={handleLogout} />
      )}
      {currentView === 'admin' && (
        <AdminPanel onBack={handleBackToLogin} />
      )}
    </>
  );
}

export default App;
