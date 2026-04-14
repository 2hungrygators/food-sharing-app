import React from 'react';
import { LogOut, Home, Compass, Users, User, Settings } from 'lucide-react';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { profile } = useAuth();

  const navItems = [
    { id: 'feed', label: 'Feed', icon: Home },
    { id: 'discover', label: 'Discover', icon: Compass },
    { id: 'groups', label: 'Groups', icon: Users },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="w-[240px] border-r border-border p-10 flex flex-col gap-8 h-screen sticky top-0">
      <div className="logo text-[28px] italic text-accent font-serif mb-5">Nourish</div>
      
      <ul className="flex flex-col gap-2">
        {navItems.map((item) => (
          <li
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`nav-item flex items-center gap-3 ${activeTab === item.id ? 'active' : ''}`}
          >
            <item.icon size={18} />
            {item.label}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-8 border-t border-border">
        <button
          onClick={() => auth.signOut()}
          className="flex items-center gap-3 text-text-dim hover:text-text-main transition-colors uppercase text-sm tracking-widest"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Sidebar;
