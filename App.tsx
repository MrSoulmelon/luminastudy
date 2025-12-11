
import React, { useState, useEffect } from 'react';
import { ViewState, StudyPlan, UserInputs, User } from './types';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import PlannerWizard from './components/PlannerWizard';
import PlanView from './components/PlanView';
import AuthForm from './components/AuthForm';
import { generateStudyPlan } from './services/geminiService';
import { Moon, Sun, Bell, UserCircle2, Info, LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('auth');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Session restoration
    const savedUser = localStorage.getItem('lumina_user');
    const savedPlan = localStorage.getItem('lumina_study_plan');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentView('dashboard');
    }
    if (savedPlan) setPlan(JSON.parse(savedPlan));

    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = (email: string, name: string) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      name,
      streak: 0
    };
    setUser(newUser);
    localStorage.setItem('lumina_user', JSON.stringify(newUser));
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('lumina_user');
    setCurrentView('auth');
  };

  const handleGeneratePlan = async (inputs: UserInputs) => {
    setIsGenerating(true);
    try {
      const newPlan = await generateStudyPlan(inputs);
      setPlan(newPlan);
      localStorage.setItem('lumina_study_plan', JSON.stringify(newPlan));
      setCurrentView('plan-view');
    } catch (error) {
      alert(error instanceof Error ? error.message : "An unexpected error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  // Auth Guard
  if (!user && currentView !== 'auth') {
    return <AuthForm onLogin={handleLogin} />;
  }

  if (currentView === 'auth') {
    return <AuthForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen flex bg-gray-50 dark:bg-slate-950 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Sidebar currentView={currentView} setView={setCurrentView} />
      
      <main className="flex-1 ml-64 p-8 transition-all">
        {/* Top Navbar */}
        <header className="no-print flex justify-between items-center mb-10">
          <div className="flex items-center gap-2">
             <div className="p-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg text-amber-600 dark:text-amber-400">
               <Info className="w-4 h-4" />
             </div>
             <p className="text-xs font-medium text-gray-500">Welcome, {user?.name}. Your AI Study Buddy is active.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all text-gray-500 hover:text-primary-500 border border-transparent hover:border-gray-200 dark:hover:border-slate-700"
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <button className="p-2.5 rounded-xl hover:bg-white dark:hover:bg-slate-800 transition-all text-gray-500 border border-transparent hover:border-gray-200 dark:hover:border-slate-700 relative" title="Notifications">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-gray-50 dark:border-slate-950"></span>
            </button>
            <div className="h-10 w-px bg-gray-200 dark:bg-slate-800 mx-1"></div>
            
            <div className="flex items-center gap-3 pl-2 group relative">
              <div className="text-right hidden md:block">
                <p className="text-sm font-bold leading-none">{user?.name}</p>
                <p className="text-[10px] text-gray-500 font-medium mt-1 uppercase tracking-tighter">Pro Student</p>
              </div>
              <button className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary-500/20">
                <UserCircle2 className="w-6 h-6" />
              </button>
              
              {/* User Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-48 py-2 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-all z-[100]">
                <button 
                  onClick={() => setCurrentView('settings')}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                >
                  My Profile
                </button>
                <div className="h-px bg-gray-100 dark:bg-slate-800 my-1"></div>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="max-w-6xl mx-auto">
          {currentView === 'dashboard' && <Dashboard plan={plan} onNavigate={setCurrentView} />}
          {currentView === 'planner' && <PlannerWizard onGenerate={handleGeneratePlan} isLoading={isGenerating} />}
          {currentView === 'plan-view' && (
            plan ? <PlanView plan={plan} /> : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-20 h-20 bg-gray-100 dark:bg-slate-800 rounded-3xl flex items-center justify-center mb-6 text-gray-400">
                  <Info className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No Plan Found</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-sm">You haven't generated a study plan yet. Start by uploading your syllabus in the planner.</p>
                <button 
                  onClick={() => setCurrentView('planner')}
                  className="bg-primary-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-500/20 hover:scale-105 transition-all"
                >
                  Go to Planner
                </button>
              </div>
            )
          )}
          {currentView === 'revision' && (
             <div className="py-20 text-center">
               <h3 className="text-2xl font-bold mb-4">Revision Tracker</h3>
               <p className="text-gray-500 max-w-lg mx-auto mb-8">This view integrates with your plan to track your spaced repetition sessions.</p>
               <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-dashed border-gray-200 dark:border-slate-800 text-gray-400 italic">
                 {plan ? "Revision lists are available in your main plan view. Interactive tracking is currently in sync." : "Generate a plan first to see your revision schedule."}
               </div>
             </div>
          )}
          {currentView === 'settings' && (
            <div className="max-w-2xl py-10 space-y-10">
              <h2 className="text-3xl font-bold">Settings</h2>
              <div className="space-y-6">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <h4 className="font-bold mb-4">Account Details</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Email</span>
                      <span className="text-sm text-gray-500">{user?.email}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Daily Notifications</span>
                      <div className="w-10 h-6 bg-primary-600 rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-gray-100 dark:border-slate-800">
                  <h4 className="font-bold mb-4 text-red-600">Danger Zone</h4>
                  <button 
                    onClick={() => {
                      if(confirm("Wipe all saved plan data?")) {
                        localStorage.removeItem('lumina_study_plan');
                        setPlan(null);
                        setCurrentView('dashboard');
                      }
                    }}
                    className="text-sm font-medium text-gray-500 hover:text-red-600 transition-colors"
                  >
                    Reset Application Data
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
