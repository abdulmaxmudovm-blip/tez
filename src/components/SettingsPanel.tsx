import { AppSettings, TestLanguage, TestMode, Theme } from '../types';
import { LANGUAGES_SUPPORT } from '../data/texts';
import { Volume2, VolumeX, Eye, AlignLeft, Info, HelpCircle, Keyboard, RefreshCw, Smartphone } from 'lucide-react';

interface SettingsPanelProps {
  settings: AppSettings;
  updateSettings: (updater: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => void;
  onResetProgress: () => void;
}

export default function SettingsPanel({ settings, updateSettings, onResetProgress }: SettingsPanelProps) {
  const themes: { id: Theme; name: string; bg: string; text: string; accent: string }[] = [
    { id: 'dark', name: 'Qorong‘u (Charcoal)', bg: 'bg-zinc-950', text: 'text-zinc-100', accent: 'bg-blue-600' },
    { id: 'light', name: 'Yorug‘u (Alabaster)', bg: 'bg-white', text: 'text-zinc-900', accent: 'bg-blue-500' },
    { id: 'sepia', name: 'Klassik / Sepia', bg: 'bg-amber-50', text: 'text-amber-950', accent: 'bg-amber-700' },
    { id: 'cyberpunk', name: 'Kiberpank (Neon)', bg: 'bg-yellow-950', text: 'text-yellow-400', accent: 'bg-pink-600' },
  ];

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const setLanguage = (lang: TestLanguage) => {
    updateSettings({ language: lang });
  };

  const setMode = (mode: TestMode) => {
    updateSettings({ mode });
  };

  const selectTheme = (theme: Theme) => {
    updateSettings({ theme });
  };

  const availableFonts = [
    { id: 'inter', name: 'Inter (Sans)', class: 'font-inter' },
    { id: 'space', name: 'Space Grotesk', class: 'font-space' },
    { id: 'jetbrains', name: 'JetBrains (Mono)', class: 'font-jetbrains' },
    { id: 'comic', name: 'Comic Neue', class: 'font-comic' },
    { id: 'playfair', name: 'Playfair Display', class: 'font-playfair' },
    { id: 'montserrat', name: 'Montserrat', class: 'font-montserrat' },
    { id: 'caveat', name: 'Caveat (Cute)', class: 'font-caveat' },
    { id: 'ubuntu', name: 'Ubuntu (Round)', class: 'font-ubuntu' },
    { id: 'roboto', name: 'Roboto', class: 'font-roboto' },
    { id: 'lora', name: 'Lora (Serif)', class: 'font-lora' },
    { id: 'fira', name: 'Fira Code', class: 'font-fira' },
    { id: 'oswald', name: 'Oswald (Tall)', class: 'font-oswald' },
    { id: 'merriweather', name: 'Merriweather', class: 'font-merriweather' },
    { id: 'pacifico', name: 'Pacifico (Fancy)', class: 'font-pacifico' },
    { id: 'cormorant', name: 'Cormorant Serif', class: 'font-cormorant' }
  ];

  return (
    <div id="settings-panel" className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-gray-100 dark:border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-2">
          <span>⚙️</span> Sozlamalar va Vizualizatsiya
        </h2>
        <span className="text-xs bg-gray-100 dark:bg-zinc-800 text-gray-500 rounded-full px-2.5 py-1 flex items-center gap-1">
          <Smartphone size={12} /> Maxsus sozlamalar
        </span>
      </div>

      {/* Language Selector */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
          Klaviatura tili va matn to'plami
        </label>
        <div className="grid grid-cols-3 gap-2">
          {LANGUAGES_SUPPORT.map((lang) => (
            <button
              id={`setting-lang-${lang.id}`}
              key={lang.id}
              onClick={() => setLanguage(lang.id)}
              className={`py-2.5 px-3 rounded-xl border text-sm font-medium transition-all duration-150 flex items-center justify-center gap-2 ${
                settings.language === lang.id
                  ? 'bg-blue-50 border-blue-200 dark:bg-blue-950/40 dark:border-blue-800 text-blue-600 dark:text-blue-300 shadow-sm ring-1 ring-blue-500'
                  : 'bg-gray-55 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-700 text-gray-700 dark:text-zinc-300'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Choice - Styled previews */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300">
          Mavzuni tanlash (Theme)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {themes.map((t) => (
            <button
              id={`setting-theme-${t.id}`}
              key={t.id}
              onClick={() => selectTheme(t.id)}
              className={`p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all duration-150 ${
                settings.theme === t.id
                  ? 'border-blue-500 ring-2 ring-blue-400 dark:ring-blue-600'
                  : 'border-gray-200 dark:border-zinc-700 hover:scale-[1.02]'
              } ${t.bg}`}
            >
              <span className={`text-xs font-semibold ${t.text}`}>{t.name}</span>
              <div className="flex gap-1.5 mt-2">
                <span className={`h-4 w-4 rounded-full ${t.accent}`} />
                <span className="h-4 w-12 rounded-sm bg-gray-300 dark:bg-zinc-600 opacity-50" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 15 Font Options Selector */}
      <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-zinc-800 pt-4">
        <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
          <span>🔤</span> Kursiv va Shriftlar (15 xil variant)
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {availableFonts.map((f) => {
            const isSelected = settings.fontFamily === f.id || (!settings.fontFamily && f.id === 'inter');
            return (
              <button
                id={`setting-font-${f.id}`}
                key={f.id}
                onClick={() => updateSettings({ fontFamily: f.id })}
                className={`p-2 rounded-xl border text-center transition-all duration-150 flex flex-col items-center justify-center gap-0.5 ${
                  isSelected
                    ? 'bg-blue-50 border-blue-300 dark:bg-blue-950/35 dark:border-blue-800 text-blue-600 dark:text-blue-300 ring-1 ring-blue-500'
                    : 'bg-gray-55/60 dark:bg-zinc-850/50 border-gray-200 dark:border-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-805 text-gray-700 dark:text-zinc-300'
                }`}
              >
                <span className={`text-sm font-semibold ${f.class}`}>Aa</span>
                <span className="text-[9px] truncate w-full">{f.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sound System Custom Options - O'ziga xos narsalar */}
      <div className="flex flex-col gap-3 border-t border-gray-100 dark:border-zinc-800 pt-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-semibold text-gray-700 dark:text-zinc-300 block">
              Ovozli qayta aloqa
            </span>
            <span className="text-xs text-gray-500 dark:text-zinc-400">
              Yozish paytidagi tugmalar va xatolar tovushi
            </span>
          </div>
          <button
            id="setting-toggle-sound"
            onClick={toggleSound}
            className={`p-2 rounded-lg transition-colors ${
              settings.soundEnabled
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-300'
                : 'bg-gray-100 text-gray-400 dark:bg-zinc-800'
            }`}
          >
            {settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>
        </div>

        {settings.soundEnabled && (
          <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-gray-100 dark:border-zinc-800 flex flex-col gap-2">
            <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider block">
              Tovush mavzusi
            </span>
            <div className="grid grid-cols-4 gap-1.5">
              {(['mechanical', 'retro', 'pop', 'beep'] as const).map((soundType) => {
                const isSelected = (settings as any).soundType === soundType || (!('soundType' in settings) && soundType === 'mechanical');
                return (
                  <button
                    id={`setting-sound-type-${soundType}`}
                    key={soundType}
                    onClick={() => updateSettings({ ...settings, soundType } as any)}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border capitalize ${
                      isSelected
                        ? 'bg-blue-500 border-blue-500 text-white'
                        : 'bg-white dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-700 dark:text-zinc-300 hover:bg-gray-50'
                    }`}
                  >
                    {soundType === 'mechanical' ? 'Clack' : soundType === 'retro' ? 'Synth' : soundType === 'pop' ? 'Buk' : 'Bip'}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Visual Switches - Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-gray-100 dark:border-zinc-800 pt-4">
        {/* Toggle Live Stats */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/30 rounded-xl border border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Eye className="text-blue-500" size={18} />
            <div>
              <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 block">
                Jonli Statistika
              </span>
              <span className="text-[10px] text-gray-400">Tezlikni simulyatsiya qilish</span>
            </div>
          </div>
          <button
            id="setting-toggle-live-stats"
            onClick={() => updateSettings({ liveStatsEnabled: !settings.liveStatsEnabled })}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
              settings.liveStatsEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${
                settings.liveStatsEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Toggle Virtual Keyboard */}
        <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-800/30 rounded-xl border border-gray-100 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Keyboard className="text-emerald-500" size={18} />
            <div>
              <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 block">
                Ekrandagi Klaviatura
              </span>
              <span className="text-[10px] text-gray-400">Tugmalar nuroniyligi</span>
            </div>
          </div>
          <button
            id="setting-toggle-keyboard"
            onClick={() => updateSettings({ keyboardLayoutEnabled: !settings.keyboardLayoutEnabled })}
            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
              settings.keyboardLayoutEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-200 ${
                settings.keyboardLayoutEnabled ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Font Size Choices */}
      <div className="flex flex-col gap-2 border-t border-gray-100 dark:border-zinc-800 pt-4">
        <label className="text-sm font-semibold text-gray-700 dark:text-zinc-300 flex items-center gap-1.5">
          <AlignLeft size={16} /> Harflar o‘lchami (Font size)
        </label>
        <div className="grid grid-cols-4 gap-1.5 p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl">
          {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
            <button
              id={`setting-font-size-${sz}`}
              key={sz}
              onClick={() => updateSettings({ fontSize: sz })}
              className={`py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
                settings.fontSize === sz
                  ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-300 shadow-sm'
                  : 'text-gray-500 dark:text-zinc-400 hover:text-gray-700'
              }`}
            >
              {sz.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="border-t border-red-100 dark:border-red-950/40 pt-4 flex flex-col gap-3">
        <span className="text-xs font-semibold text-red-500 dark:text-red-400 uppercase tracking-wider">
          Xavfli hudud
        </span>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-700 dark:text-zinc-300 block">
              Barcha natijalarni tozalash
            </span>
            <span className="text-[11px] text-gray-500">
              O'yin tarixi, shaxsiy rekord va barcha erishilgan nishonlarni butunlay o'chirib yuboradi.
            </span>
          </div>
          <button
            id="setting-reset-progress-btn"
            onClick={() => {
              if (window.confirm("Haqiqatdan ham butun natijalarni mutlaqo tozalashni xohlaysizmi? Bu amalni ortga qaytarib bo'lmaydi.")) {
                onResetProgress();
              }
            }}
            className="text-xs font-semibold py-2 px-3 border border-red-300 hover:border-red-400 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl flex items-center gap-1.5 group self-start sm:self-auto"
          >
            <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-500" />
            Butunlay Tozalash
          </button>
        </div>
      </div>
    </div>
  );
}
