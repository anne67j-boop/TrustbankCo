import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PieChart, ArrowRightLeft, MessageSquareText, LogOut, Landmark, Menu, X, Settings, Bell } from 'lucide-react';
import { User, NavItem } from '../types';
import Tooltip from './ui/Tooltip';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Portfolio Overview', path: '/', icon: Home },
  { label: 'Wealth Reports', path: '/transactions', icon: PieChart },
  { label: 'Wire & Transfer', path: '/transfer', icon: ArrowRightLeft },
  { label: 'Private Advisor', path: '/advisor', icon: MessageSquareText },
];

const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const handleNav = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden font-inter text-slate-200 selection:bg-orange-500/30">
      {/* Sidebar (Desktop) - Compressed Width */}
      <aside className="hidden md:flex w-72 flex-col bg-slate-900 border-r border-slate-800 shadow-2xl z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-800 bg-slate-900">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-1.5 rounded-lg shadow-lg shadow-orange-500/20">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight leading-none text-white font-bank">TRUSTBANK</span>
              <span className="text-[10px] text-orange-400 uppercase tracking-[0.2em] mt-1 font-bold">Private Wealth</span>
            </div>
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-2 px-3">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Tooltip key={item.path} content={item.label} position="right">
                <button
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive 
                      ? 'bg-orange-600/10 text-orange-400 shadow-lg border border-orange-500/20' 
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className={`p-1.5 rounded-md ${isActive ? 'bg-orange-500/20 text-orange-400' : 'text-slate-500 group-hover:text-white transition-colors'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold tracking-wide text-sm md:text-base">{item.label}</span>
                </button>
              </Tooltip>
            );
          })}
        </nav>

        {/* User Profile Snippet */}
        <div className="p-6 bg-slate-900 border-t border-slate-800">
          <div className="flex items-center space-x-3 mb-5">
             <img src={user.avatar} alt="User" className="w-12 h-12 rounded-full border-2 border-orange-500/50 shadow-sm object-cover" />
             <div className="flex-1 min-w-0">
               <p className="text-sm font-bold text-white truncate font-bank">{user.name}</p>
               <p className="text-[10px] text-orange-400 uppercase tracking-wider font-bold truncate mt-0.5">Chairman's Circle</p>
             </div>
             <Tooltip content="Settings">
               <button className="text-slate-500 hover:text-white transition-colors">
                  <Settings className="w-5 h-5" />
               </button>
             </Tooltip>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center space-x-2 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-bold text-slate-300 hover:text-white transition-colors uppercase tracking-wider border border-slate-700"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header & Content Wrapper */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header Bar (Desktop) - Compressed Height */}
        <header className="hidden md:flex bg-[#020617]/90 backdrop-blur-md h-20 border-b border-slate-800 items-center justify-between px-8 z-10 sticky top-0">
          <h2 className="text-xl font-bold text-white tracking-tight font-bank">
            {location.pathname === '/' ? 'Portfolio Dashboard' : 
             location.pathname.startsWith('/account/') ? 'Account Details' :
             NAV_ITEMS.find(i => i.path === location.pathname)?.label}
          </h2>
          <div className="flex items-center space-x-6">
            <Tooltip content="Notifications">
              <button className="relative p-1.5 text-slate-400 hover:text-orange-400 transition">
                <Bell className="w-6 h-6" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-orange-500 rounded-full border-2 border-[#020617]"></span>
              </button>
            </Tooltip>
            <div className="h-8 w-px bg-slate-800"></div>
            <span className="text-sm text-slate-400 font-medium font-mono tracking-wide">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </header>

        {/* Mobile Header (Sticky) */}
        <header className="md:hidden bg-[#020617]/95 backdrop-blur-xl text-white p-4 flex justify-between items-center shadow-md z-30 border-b border-slate-800 sticky top-0 pt-safe">
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-1 rounded shadow-lg">
               <Landmark className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight font-bank">TrustBank</span>
          </div>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 -mr-2 active:scale-95 transition-transform">
            {mobileMenuOpen ? <X className="w-6 h-6 text-slate-300" /> : <Menu className="w-6 h-6 text-slate-300" />}
          </button>
        </header>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute inset-0 z-20 bg-[#020617]/98 backdrop-blur-xl pt-20 px-6 space-y-2 animate-in slide-in-from-top-5 fade-in duration-200 flex flex-col">
             {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center space-x-4 px-4 py-4 rounded-lg text-lg border-b border-slate-800/50 transition-colors ${
                    isActive ? 'text-orange-400 font-bold bg-slate-900' : 'text-slate-400 font-medium'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span>{item.label}</span>
                </button>
              );
            })}
             <div className="mt-auto pb-safe mb-8">
               <button 
                onClick={onLogout}
                className="w-full flex items-center justify-center space-x-3 px-6 py-4 text-rose-400 bg-rose-500/10 rounded-lg border border-rose-500/20 text-base font-semibold"
              >
                <LogOut className="w-5 h-5" />
                <span>Sign Out</span>
              </button>
             </div>
          </div>
        )}

        {/* Main Content Area - Compressed Padding */}
        <main className="flex-1 overflow-y-auto bg-[#020617] p-4 md:p-6 scroll-smooth pb-safe">
          <div className="max-w-6xl mx-auto pb-10 md:pb-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;