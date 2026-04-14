import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Sidebar';
import Feed from './components/Feed';
import Insights from './components/Insights';
import Auth from './components/Auth';
import CreatePostModal from './components/CreatePostModal';
import ErrorBoundary from './components/ErrorBoundary';
import { Plus, Home, Compass, Users, User } from 'lucide-react';

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
    <div className="flex flex-col md:flex-row min-h-screen bg-bg text-text-main font-sans selection:bg-accent/30">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
      
      <main className="flex-1 flex flex-col md:flex-row overflow-hidden pb-20 md:pb-0">
        <div className="flex-1 overflow-y-auto">
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
        </div>
        
        {/* Desktop Insights */}
        <div className="hidden lg:block">
          <Insights />
        </div>
      </main>

      {/* Mobile Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-card-bg border-t border-border flex justify-around items-center p-4 z-40">
        <button onClick={() => setActiveTab('feed')} className={`p-2 ${activeTab === 'feed' ? 'text-accent' : 'text-text-dim'}`}>
          <Home size={24} />
        </button>
        <button onClick={() => setActiveTab('discover')} className={`p-2 ${activeTab === 'discover' ? 'text-accent' : 'text-text-dim'}`}>
          <Compass size={24} />
        </button>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-accent text-bg w-12 h-12 rounded-full flex items-center justify-center shadow-lg -translate-y-6"
        >
          <Plus size={24} />
        </button>
        <button onClick={() => setActiveTab('groups')} className={`p-2 ${activeTab === 'groups' ? 'text-accent' : 'text-text-dim'}`}>
          <Users size={24} />
        </button>
        <button onClick={() => setActiveTab('profile')} className={`p-2 ${activeTab === 'profile' ? 'text-accent' : 'text-text-dim'}`}>
          <User size={24} />
        </button>
      </div>

      {/* Desktop FAB */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="hidden md:flex fixed bottom-10 right-10 lg:right-[340px] bg-accent text-bg w-14 h-14 rounded-full items-center justify-center shadow-2xl hover:scale-110 transition-transform z-40"
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
