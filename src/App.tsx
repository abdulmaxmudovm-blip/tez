import { useEffect, useState } from 'react';
import { AppSettings, Badge, HistoryItem, TestResult, Theme, UserProfile } from './types';
import { ACHIEVEMENTS_LIST } from './data/texts';
import TypeSandbox from './components/TypeSandbox';
import ProfileEdit from './components/ProfileEdit';
import Leaderboard from './components/Leaderboard';
import SettingsPanel from './components/SettingsPanel';
import LearnHub from './components/LearnHub';
import { Keyboard, Trophy, User, Settings, Sparkles, Share2, HelpCircle, Star } from 'lucide-react';

const DEFAULT_PROFILE: UserProfile = {
  username: 'Klaviatura Ustasi',
  avatar: '🚀',
  bio: "Tezlik mening qonimda! Har bir simvol beg'ubor teshiladi.",
  bestWpm: 0,
  averageWpm: 0,
  averageAccuracy: 0,
  testsCompleted: 0,
  unlockedBadges: [],
};

const DEFAULT_SETTINGS: AppSettings = {
  language: 'uz',
  mode: 'time',
  duration: 30,
  wordCount: 25,
  soundEnabled: true,
  liveStatsEnabled: true,
  keyboardLayoutEnabled: true,
  fontSize: 'md',
  theme: 'dark',
  fontFamily: 'inter',
  soundType: 'mechanical',
};

export default function App() {
  // Persistence state
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [results, setResults] = useState<TestResult[]>([]);
  const [badges, setBadges] = useState<Badge[]>(ACHIEVEMENTS_LIST);

  // Active Screen Tab
  const [activeTab, setActiveTab] = useState<'sandbox' | 'kids' | 'profile' | 'leaderboard' | 'settings'>('sandbox');

  // Network connection listener for mobile/offline mode
  const [onlineStatus, setOnlineStatus] = useState(navigator.onLine);

  // App notification banner state
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'badge' | 'info' } | null>(null);

  // Read state from localStorage on init
  useEffect(() => {
    try {
      const persistedProfile = localStorage.getItem('tezyoz_profile_2026');
      if (persistedProfile) {
        setProfile(JSON.parse(persistedProfile));
      }

      const persistedSettings = localStorage.getItem('tezyoz_settings_2026');
      if (persistedSettings) {
        setSettings(JSON.parse(persistedSettings));
      }

      const persistedResults = localStorage.getItem('tezyoz_results_2026');
      if (persistedResults) {
        setResults(JSON.parse(persistedResults));
      }
    } catch (e) {
      console.error('Failed to load local state', e);
    }
  }, []);

  // Sync state changes to localStorage
  const saveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    localStorage.setItem('tezyoz_profile_2026', JSON.stringify(newProfile));
  };

  const saveSettings = (newSettings: AppSettings) => {
    setSettings(newSettings);
    localStorage.setItem('tezyoz_settings_2026', JSON.stringify(newSettings));
  };

  const saveResults = (newResults: TestResult[]) => {
    setResults(newResults);
    localStorage.setItem('tezyoz_results_2026', JSON.stringify(newResults));
  };

  // Theme switcher classes injection
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'light', 'sepia-theme', 'cyberpunk-theme');

    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.add('light'); // system standard
    } else if (settings.theme === 'sepia') {
      root.classList.add('light');
      root.style.setProperty('--background', '#f4ecd8');
    } else if (settings.theme === 'cyberpunk') {
      root.classList.add('dark');
    }
  }, [settings.theme]);

  // Monitor network connection changes
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'badge' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 5000);
  };

  const handleTestComplete = (newResult: TestResult) => {
    // 1. Add new score to history
    const updatedResults = [newResult, ...results];
    saveResults(updatedResults);

    // 2. Calculations for updated profile statistics
    const completedCount = profile.testsCompleted + 1;
    const bestWpm = Math.max(profile.bestWpm, newResult.wpm);

    // Calc Average indicators
    const sumWpm = updatedResults.reduce((acc, curr) => acc + curr.wpm, 0);
    const avgWpm = Math.round(sumWpm / updatedResults.length);

    const sumAccuracy = updatedResults.reduce((acc, curr) => acc + curr.accuracy, 0);
    const avgAccuracy = Math.round(sumAccuracy / updatedResults.length);

    // 3. Evaluate Achievement locks
    const newlyUnlockedBadges: string[] = [...profile.unlockedBadges];

    // Badge 1: first_test
    if (!newlyUnlockedBadges.includes('first_test')) {
      newlyUnlockedBadges.push('first_test');
      showToast("Yashil Chiroq erishildi! Birinchi test muvaffaqiyatli topshirildi.", 'badge');
    }

    // Badge 2: speed_50
    if (newResult.wpm >= 50 && !newlyUnlockedBadges.includes('speed_50')) {
      newlyUnlockedBadges.push('speed_50');
      showToast("O'rtacha Tezkor erishildi! 50+ WPM tezlik!", 'badge');
    }

    // Badge 3: speed_80
    if (newResult.wpm >= 80 && !newlyUnlockedBadges.includes('speed_80')) {
      newlyUnlockedBadges.push('speed_80');
      showToast("Klaviatura Ustasi unvoni! 80+ WPM tezlik!", 'badge');
    }

    // Badge 4: speed_110
    if (newResult.wpm >= 110 && !newlyUnlockedBadges.includes('speed_110')) {
      newlyUnlockedBadges.push('speed_110');
      showToast("Chaqmoq Tezligi zabt etildi! 110+ WPM hayratlanarli natija!", 'badge');
    }

    // Badge 5: perfectionist
    if (newResult.accuracy >= 98 && newResult.wpm >= 30 && !newlyUnlockedBadges.includes('perfectionist')) {
      newlyUnlockedBadges.push('perfectionist');
      showToast("Xatosiz Shooter! Mumtoz 98% dan yuqori aniqlik!", 'badge');
    }

    // Badge 6: multilingual
    // Check if user has tests in multiple languages
    const languagesTested = new Set(updatedResults.map(r => r.language));
    if (languagesTested.size >= 2 && !newlyUnlockedBadges.includes('multilingual')) {
      newlyUnlockedBadges.push('multilingual');
      showToast("Poliglot! Ikki xil tilda tez yozish testi yakunlandi.", 'badge');
    }

    // Badge 7: marathon
    if (newResult.mode === 'time' && newResult.duration >= 60 && !newlyUnlockedBadges.includes('marathon')) {
      newlyUnlockedBadges.push('marathon');
      showToast("Marafonsiz tinmas! Uzoq vaqtga chidamlilik testi.", 'badge');
    }

    const updatedProfile: UserProfile = {
      ...profile,
      bestWpm,
      averageWpm: avgWpm,
      averageAccuracy: avgAccuracy,
      testsCompleted: completedCount,
      unlockedBadges: newlyUnlockedBadges
    };

    saveProfile(updatedProfile);
  };

  const handleUpdateProfile = (updated: Partial<UserProfile>) => {
    const updatedProfile = { ...profile, ...updated };
    saveProfile(updatedProfile);
    showToast("Profil tahrirlari muvaffaqiyatli saqlandi!", "success");
  };

  const handleUpdateSettings = (updater: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => {
    if (typeof updater === 'function') {
      const next = updater(settings);
      saveSettings(next);
    } else {
      const next = { ...settings, ...updater };
      saveSettings(next);
    }
  };

  const handleResetProgress = () => {
    setProfile(DEFAULT_PROFILE);
    setSettings(DEFAULT_SETTINGS);
    setResults([]);
    localStorage.removeItem('tezyoz_profile_2026');
    localStorage.removeItem('tezyoz_settings_2026');
    localStorage.removeItem('tezyoz_results_2026');
    showToast("Profil va natijalar mutlaqo tozalandi.", "info");
    setActiveTab('sandbox');
  };

  // Choose bg color depending on theme setting
  const getThemeBgColor = () => {
    if (settings.theme === 'light') return 'bg-gray-50 text-gray-900';
    if (settings.theme === 'sepia') return 'bg-[#f5ebd3] text-amber-950';
    if (settings.theme === 'cyberpunk') return 'bg-[#1e0724] text-yellow-400';
    return 'bg-zinc-950 text-zinc-150'; // Default dark
  };

  return (
    <div className={`min-h-screen ${getThemeBgColor()} transition-colors duration-200 font-sans pb-16`}>
      
      {/* Dynamic Pop-up Toasts */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 animate-bounce duration-700">
          <div className={`rounded-xl px-5 py-3 shadow-2xl border flex items-center gap-3 ${
            notification.type === 'badge'
              ? 'bg-gradient-to-r from-yellow-500 to-amber-600 text-white border-yellow-400'
              : 'bg-zinc-900 dark:bg-zinc-800 text-zinc-100 border-zinc-700'
          }`}>
            <Sparkles size={18} className="animate-pulse text-yellow-200" />
            <div>
              <p className="text-xs font-bold uppercase tracking-wider">Yangi Xabarnoma!</p>
              <p className="text-xs mt-0.5">{notification.message}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main header navbar */}
      <header className="border-b border-gray-200 dark:border-zinc-800 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Logo brand */}
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-blue-650 flex items-center justify-center text-white font-extrabold shadow-sm">
              ⌨️
            </div>
            <div>
              <h1 className="text-sm font-black tracking-tight flex items-center gap-1.5 text-gray-900 dark:text-zinc-100">
                <span>TezYoz</span> 
                <span className="text-[10px] bg-blue-500/10 text-blue-600 rounded-full px-1.5 py-0.5 font-bold">PRO</span>
              </h1>
              <p className="text-[9px] text-gray-400 font-medium">Tezlik va Xatosiz Yozish</p>
            </div>
          </div>

          {/* Nav pills */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              id="nav-tab-sandbox"
              onClick={() => setActiveTab('sandbox')}
              className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'sandbox'
                  ? 'bg-blue-500 text-white shadow-xs'
                  : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-105 dark:hover:bg-zinc-800'
              }`}
            >
              <Keyboard size={13} /> <span className="hidden sm:inline">Mashq</span>
            </button>
            <button
              id="nav-tab-kids"
              onClick={() => setActiveTab('kids')}
              className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'kids'
                  ? 'bg-amber-500 text-white shadow-xs'
                  : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-105 dark:hover:bg-zinc-800'
              }`}
            >
              <Star size={13} className={activeTab === 'kids' ? "fill-white text-white" : "fill-amber-400 text-amber-500"} /> <span className="hidden sm:inline">Bolalar & Boshlanuvchilar</span>
            </button>
            <button
              id="nav-tab-leaderboard"
              onClick={() => setActiveTab('leaderboard')}
              className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'leaderboard'
                  ? 'bg-blue-500 text-white shadow-xs'
                  : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-105 dark:hover:bg-zinc-800'
              }`}
            >
              <Trophy size={13} /> <span className="hidden sm:inline">Reyting</span>
            </button>
            <button
              id="nav-tab-profile"
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'profile'
                  ? 'bg-blue-500 text-white shadow-xs'
                  : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-105 dark:hover:bg-zinc-800'
              }`}
            >
              <User size={13} /> <span className="hidden sm:inline">Profil</span>
            </button>
            <button
              id="nav-tab-settings"
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'settings'
                  ? 'bg-blue-500 text-white shadow-xs'
                  : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-105 dark:hover:bg-zinc-800'
              }`}
            >
              <Settings size={13} /> <span className="hidden sm:inline">Sozlamalar</span>
            </button>
          </nav>

        </div>
      </header>

      {/* Main Body container */}
      <main className="max-w-4xl mx-auto px-4 mt-8 flex flex-col gap-8">
        
        {/* Active view routing switch */}
        {activeTab === 'sandbox' && (
          <TypeSandbox
            settings={settings}
            updateSettings={handleUpdateSettings}
            profile={profile}
            onTestComplete={handleTestComplete}
            onlineStatus={onlineStatus}
          />
        )}

        {activeTab === 'kids' && (
          <LearnHub
            settings={settings}
            profile={profile}
            onUpdateProfile={handleUpdateProfile}
            showToast={showToast}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileEdit
            profile={profile}
            badges={badges}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === 'leaderboard' && (
          <Leaderboard
            currentLanguage={settings.language}
            localResults={results}
            currentUserProfile={{ username: profile.username, avatar: profile.avatar }}
          />
        )}

        {activeTab === 'settings' && (
          <SettingsPanel
            settings={settings}
            updateSettings={handleUpdateSettings}
            onResetProgress={handleResetProgress}
          />
        )}

        {/* Footer info message */}
        <div className="text-center mt-6 text-[11px] text-gray-400 dark:text-zinc-600 flex flex-col items-center justify-center gap-2">
          <span>O'rnatilgan audio sintezatori yozish hissini yanada go'zallashtiradi.</span>
          <div className="flex gap-4">
            <span>🚀 <strong>100% Oflayn qo'llab-quvvatlash</strong></span>
            <span>🔒 <strong>Mahalliy xavfsizlik</strong></span>
          </div>
        </div>

      </main>
    </div>
  );
}
