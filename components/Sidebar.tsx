
import React from 'react';
import { LayoutDashboard, CalendarRange, ListChecks, Settings, PlusCircle, LogOut } from 'lucide-react';
import { ViewState } from '../types';

interface SidebarProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'planner', label: 'Create Plan', icon: PlusCircle },
    { id: 'plan-view', label: 'My Plan', icon: CalendarRange },
    { id: 'revision', label: 'Revision Tracker', icon: ListChecks },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="no-print w-64 h-screen fixed left-0 top-0 border-r border-gray-200 dark:border-slate-800 flex flex-col bg-white dark:bg-slate-900 z-50">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-500/30">
            <span className="font-bold text-xl">L</span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">LuminaStudy</h1>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400 font-medium'
                  : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 group-hover:text-gray-600 dark:text-gray-500 dark:group-hover:text-gray-300'}`} />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-slate-800">
        <div className="bg-gradient-to-br from-primary-500 to-indigo-600 rounded-2xl p-4 text-white">
          <p className="text-xs font-medium opacity-80 uppercase tracking-wider mb-1">Weekly Goal</p>
          <p className="text-sm font-semibold mb-3">Complete 5 Modules</p>
          <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white w-3/5 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="p-4">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors">
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
