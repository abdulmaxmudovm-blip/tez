import { useState } from 'react';
import { TestLanguage, TestResult } from '../types';
import { PRESET_LEADERBOARD } from '../data/texts';
import { Trophy, Globe2, Compass, Medal, Calendar, Flame, RefreshCw, Zap } from 'lucide-react';

interface LeaderboardProps {
  currentLanguage: TestLanguage;
  localResults: TestResult[];
  currentUserProfile: { username: string; avatar: string };
  onClearLocalHighScore?: () => void;
}

export default function Leaderboard({ currentLanguage, localResults, currentUserProfile }: LeaderboardProps) {
  const [activeLangTab, setActiveLangTab] = useState<TestLanguage>(currentLanguage);

  // Combine preset competitor results and the user's best results for that language.
  const presetForLang = PRESET_LEADERBOARD[activeLangTab] || [];

  // Filter local results for active tab and find the highest score
  const localScoresForLang = localResults.filter(r => r.language === activeLangTab);
  
  // Create combined list
  let combinedList = [...presetForLang.map((item, index) => ({
    id: `preset-${index}`,
    username: item.name,
    avatar: item.avatar,
    wpm: item.wpm,
    accuracy: item.accuracy,
    date: item.date,
    isCurrentUser: false,
  }))];

  // If we have actual local scores, let's inject them as an entry!
  if (localScoresForLang.length > 0) {
    // Collect the best WPM test result
    const bestLocal = localScoresForLang.reduce((prev, curr) => (curr.wpm > prev.wpm ? curr : prev), localScoresForLang[0]);
    combinedList.push({
      id: 'current-user-best',
      username: currentUserProfile.username || 'Siz (Sizning rekordingiz)',
      avatar: currentUserProfile.avatar || '⚡',
      wpm: bestLocal.wpm,
      accuracy: bestLocal.accuracy,
      date: bestLocal.date.split('T')[0],
      isCurrentUser: true,
    });
  }

  // Sort by WPM descending, then by Accuracy descending
  combinedList.sort((a, b) => {
    if (b.wpm !== a.wpm) return b.wpm - a.wpm;
    return b.accuracy - a.accuracy;
  });

  return (
    <div id="leaderboard-panel" className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-zinc-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
            <Trophy className="text-amber-500 fill-amber-500/10" size={24} /> Peshqadamlar va Reyting
          </h2>
          <span className="text-xs text-gray-500 dark:text-zinc-400">
            Dunyodagi va mahalliy eng tezkor foydalanuvchilar bilan solishtiring.
          </span>
        </div>

        {/* Tab switcher for language leaderboards */}
        <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
          <button
            id="lb-tab-uz"
            onClick={() => setActiveLangTab('uz')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLangTab === 'uz'
                ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-200 shadow-sm'
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-800'
            }`}
          >
            🇺🇿 O'zbek
          </button>
          <button
            id="lb-tab-en"
            onClick={() => setActiveLangTab('en')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLangTab === 'en'
                ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-200 shadow-sm'
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-800'
            }`}
          >
            🇺🇸 English
          </button>
          <button
            id="lb-tab-ru"
            onClick={() => setActiveLangTab('ru')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeLangTab === 'ru'
                ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-200 shadow-sm'
                : 'text-gray-500 dark:text-zinc-400 hover:text-gray-800'
            }`}
          >
            🇷🇺 Русский
          </button>
        </div>
      </div>

      {/* Leaderboard list */}
      <div className="flex flex-col gap-2 max-h-[420px] overflow-y-auto pr-1">
        {combinedList.map((player, idx) => {
          const rank = idx + 1;
          let rankBadge = null;
          let itemStyle = 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800/80';

          if (player.isCurrentUser) {
            itemStyle = 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/60 ring-1 ring-blue-400';
          } else if (rank === 1) {
            itemStyle = 'bg-amber-50/40 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900/30';
          }

          if (rank === 1) {
            rankBadge = <span className="h-6 w-6 rounded-full bg-amber-100 dark:bg-amber-950/40 flex items-center justify-center text-xs font-bold text-amber-600">🥇</span>;
          } else if (rank === 2) {
            rankBadge = <span className="h-6 w-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-500">🥈</span>;
          } else if (rank === 3) {
            rankBadge = <span className="h-6 w-6 rounded-full bg-amber-500/10 flex items-center justify-center text-xs font-bold text-amber-700">🥉</span>;
          } else {
            rankBadge = <span className="h-6 w-6 text-center text-xs text-gray-400 font-bold">{rank}</span>;
          }

          return (
            <div
              id={`lb-row-${player.id}`}
              key={player.id}
              className={`flex items-center justify-between p-3 border rounded-xl transition-all duration-150 ${itemStyle}`}
            >
              <div className="flex items-center gap-3">
                <div className="w-6 flex justify-center">
                  {rankBadge}
                </div>
                <div className="h-9 w-9 rounded-xl bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-lg shadow-sm border border-gray-200/50 dark:border-zinc-700/50">
                  {player.avatar}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-sm font-semibold ${player.isCurrentUser ? 'text-blue-700 dark:text-blue-300' : 'text-gray-900 dark:text-zinc-100'}`}>
                      {player.username}
                    </span>
                    {player.isCurrentUser && (
                      <span className="text-[9px] bg-blue-500 text-white font-bold uppercase tracking-wider rounded px-1">
                        Siz
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mt-0.5">
                    <Calendar size={10} />
                    <span>{player.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-5">
                {/* Accuracy */}
                <div className="text-right">
                  <span className="text-[10px] text-gray-400 block font-medium">Aniqlik</span>
                  <span className="text-xs font-bold text-zinc-600 dark:text-zinc-400">{player.accuracy}%</span>
                </div>
                {/* WPM */}
                <div className="text-right bg-gray-50 dark:bg-zinc-800/60 rounded-lg px-2.5 py-1 border border-gray-100 dark:border-zinc-800/80">
                  <span className="text-[9px] text-gray-400 block font-medium uppercase tracking-wider">Tezlik</span>
                  <span className="text-sm font-black text-gray-900 dark:text-zinc-200 flex items-center justify-end gap-0.5">
                    {player.wpm} <span className="text-[10px] font-semibold text-gray-400">WPM</span>
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-blue-50/30 dark:bg-blue-950/10 border border-blue-100 dark:border-blue-950/40 rounded-xl p-3 flex gap-2">
        <div className="text-blue-500 mt-0.5">
          <Zap size={14} className="fill-blue-500/10" />
        </div>
        <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
          Natijalaringiz ushbu jadvalga avtomatik ravishda qo‘shiladi. Do‘stlaringiz bilan o‘zaro solishtirish uchun testdan so‘ng <strong>"Natijani ulashish"</strong> tugmasini bosib do‘stlarga yuboring!
        </p>
      </div>
    </div>
  );
}
