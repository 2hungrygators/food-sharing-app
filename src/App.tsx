import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Insights from './components/Insights';
import Auth from './components/Auth';
import CreatePostModal from './components/CreatePostModal';
import ErrorBoundary from './components/ErrorBoundary';
import { Plus } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, loading, isAuthReady } = useAuth();
  const [activeTab, setActiveTab] = useState('feed');
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!isAuthReady || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-accent font-serif italic text-2xl animate-pulse">Nourish...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex min-h-screen bg-bg text-text-main font-sans selection:bg-accent/30">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <main className="flex-1 flex overflow-hidden">
        {activeTab === 'feed' && <Feed />}
        {activeTab === 'discover' && (
          <div className="flex-1 p-10 flex items-center justify-center text-text-dim uppercase tracking-widest text-sm">
            Discover feature coming soon
          </div>
        )}
        {activeTab === 'groups' && (
          <div className="flex-1 p-10 flex items-center justify-center text-text-dim uppercase tracking-widest text-sm">
            Groups feature coming soon
          </div>
        )}
        {activeTab === 'profile' && (
          <div className="flex-1 p-10 flex items-center justify-center text-text-dim uppercase tracking-widest text-sm">
            Profile feature coming soon
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="flex-1 p-10 flex items-center justify-center text-text-dim uppercase tracking-widest text-sm">
            Settings feature coming soon
          </div>
        )}
        
        <Insights />
      </main>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-10 right-[340px] bg-accent text-bg w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform z-40"
      >
        <Plus size={24} />
      </button>

      <CreatePostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}
