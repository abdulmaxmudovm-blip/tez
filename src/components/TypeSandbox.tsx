import React, { useEffect, useRef, useState } from 'react';
import { AppSettings, Badge, TestLanguage, TestMode, TestResult, Theme, UserProfile } from '../types';
import { TYPING_PARAGRAPHS, TYPING_WORDS } from '../data/texts';
import { playKeySound, playErrorSound, playSuccessChime } from '../utils/audio';
import { Zap, Timer, RefreshCw, Sparkles, ChevronRight, Award, Volume2, ShieldAlert, Wifi, WifiOff } from 'lucide-react';
import VirtualKeyboard from './VirtualKeyboard';

interface TypeSandboxProps {
  settings: AppSettings;
  updateSettings: (updater: Partial<AppSettings> | ((prev: AppSettings) => AppSettings)) => void;
  profile: UserProfile;
  onTestComplete: (result: TestResult) => void;
  onlineStatus: boolean;
}

export default function TypeSandbox({ settings, updateSettings, profile, onTestComplete, onlineStatus }: TypeSandboxProps) {
  // Config state
  const [textToType, setTextToType] = useState('');
  const [textCategory, setTextCategory] = useState('');
  const [textAuthor, setTextAuthor] = useState('');

  // Typing tracking state
  const [inputValue, setInputValue] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0); // in seconds
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [lastKeyPressed, setLastKeyPressed] = useState('');

  // For live stats representation
  const [liveWpm, setLiveWpm] = useState(0);
  const [liveAccuracy, setLiveAccuracy] = useState(100);
  const [finalTestWpm, setFinalTestWpm] = useState(0);

  // Characters counts
  const [correctKeyCount, setCorrectKeyCount] = useState(0);
  const [incorrectKeyCount, setIncorrectKeyCount] = useState(0);

  // Sync state values to references to avoid stale closure in timer intervals or callbacks
  const correctKeyCountRef = useRef(0);
  const incorrectKeyCountRef = useRef(0);
  const inputValueRef = useRef('');
  const liveAccuracyRef = useRef(100);

  // DOM elements and UI triggers
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [challengeParams, setChallengeParams] = useState<{ wpm: number; accuracy: number; lang: string } | null>(null);

  // Initialize text when settings change
  useEffect(() => {
    resetTest();
  }, [settings.language, settings.mode, settings.duration, settings.wordCount]);

  // Read URL challenges format `?challenge=75_98_uz`
  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const chall = urlParams.get('challenge');
      if (chall) {
        const [wpm, acc, lang] = chall.split('_');
        setChallengeParams({
          wpm: parseInt(wpm) || 0,
          accuracy: parseInt(acc) || 0,
          lang: lang || 'uz'
        });
      }
    } catch (e) {
      // Ignored
    }
  }, []);

  // Generate appropriate text based on requirements
  const generateText = () => {
    const lang = settings.language;
    if (settings.mode === 'time') {
      const items = TYPING_PARAGRAPHS[lang];
      // Pick random paragraph or concatenate if needed for long durations
      const randomItem = items[Math.floor(Math.random() * items.length)];
      setTextToType(randomItem.text.toLowerCase());
      setTextCategory(randomItem.category);
      setTextAuthor(randomItem.author || '');
    } else {
      // Word length based
      const wordsPool = TYPING_WORDS[lang];
      const selectedWords: string[] = [];
      const count = settings.wordCount;
      for (let i = 0; i < count; i++) {
        selectedWords.push(wordsPool[Math.floor(Math.random() * wordsPool.length)].toLowerCase());
      }
      setTextToType(selectedWords.join(' '));
      setTextCategory('Tezkor so‘zlar');
      setTextAuthor('Tasodifiy');
    }
  };

  const resetTest = () => {
    generateText();
    setInputValue('');
    setStartTime(null);
    setElapsed(0);
    setIsActive(false);
    setIsFinished(false);
    setCorrectKeyCount(0);
    setIncorrectKeyCount(0);
    setLiveWpm(0);
    setLiveAccuracy(100);
    setFinalTestWpm(0);
    correctKeyCountRef.current = 0;
    incorrectKeyCountRef.current = 0;
    inputValueRef.current = '';
    liveAccuracyRef.current = 100;
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus({ preventScroll: true });
    }
  };

  // Handle global Enter key press to reset/restart the test
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (
          document.activeElement &&
          document.activeElement.tagName === 'INPUT' &&
          document.activeElement.id !== 'sandbox-typing-input-elem'
        ) {
          return;
        }
        e.preventDefault();
        resetTest();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [textToType, settings]);

  // Timer interval
  useEffect(() => {
    let intervalId: any = null;
    if (isActive && !isFinished) {
      intervalId = setInterval(() => {
        if (!startTime) return;
        const currentElapsed = (Date.now() - startTime) / 1000;
        setElapsed(currentElapsed);

        // Check if time mode is finished
        if (settings.mode === 'time' && currentElapsed >= settings.duration) {
          finishTest(currentElapsed);
        }
      }, 250);
    }
    return () => clearInterval(intervalId);
  }, [isActive, isFinished, startTime, settings.mode, settings.duration]);

  // Handle key typing triggers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isFinished) return;

    if (!isActive) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    const lastChar = value[value.length - 1];
    if (lastChar) {
      setLastKeyPressed(lastChar);
    }

    // Play synthesized mechanical key click sound
    if (settings.soundEnabled) {
      const soundType = (settings as any).soundType || 'mechanical';
      playKeySound(soundType, 1 + Math.random() * 0.2);
    }

    // Work out errors in typed characters
    let correct = 0;
    let incorrect = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === textToType[i]) {
        correct++;
      } else {
        incorrect++;
      }
    }

    setCorrectKeyCount(correct);
    setIncorrectKeyCount(incorrect);
    correctKeyCountRef.current = correct;
    incorrectKeyCountRef.current = incorrect;

    // Play tiny fail buzz sound on incorrect inputs
    if (incorrect > incorrectKeyCount && settings.soundEnabled) {
      playErrorSound();
    }

    // Update real-time accuracy
    const totalTyped = value.length;
    let calculatedAcc = 100;
    if (totalTyped > 0) {
      calculatedAcc = Math.round((correct / totalTyped) * 100);
      setLiveAccuracy(calculatedAcc);
    } else {
      setLiveAccuracy(100);
    }
    liveAccuracyRef.current = calculatedAcc;

    // Live WPM calculation (Assume average word length is 5 letters)
    if (settings.liveStatsEnabled && totalTyped > 3) {
      const elapsedMinutes = (Date.now() - (startTime || Date.now())) / 60000;
      if (elapsedMinutes > 0.01) {
        const currentWpm = Math.round((correct / 5) / elapsedMinutes);
        setLiveWpm(currentWpm);
      }
    }

    setInputValue(value);
    inputValueRef.current = value;

    // Grow words in time mode continuously so they never run out of words
    if (settings.mode === 'time' && textToType.length - value.length < 80) {
      const wordsPool = TYPING_WORDS[settings.language] || TYPING_WORDS['uz'] || ['bir', 'ikki', 'uch'];
      const dynamicBatch: string[] = [];
      for (let i = 0; i < 20; i++) {
        dynamicBatch.push(wordsPool[Math.floor(Math.random() * wordsPool.length)].toLowerCase());
      }
      setTextToType(prev => prev + ' ' + dynamicBatch.join(' '));
    }

    // Word mode termination condition
    if (settings.mode === 'words' && value.length >= textToType.length) {
      const finalSecs = (Date.now() - (startTime || Date.now())) / 1000;
      finishTest(finalSecs);
    }
  };

  const finishTest = (finalElapsed: number) => {
    setIsActive(false);
    setIsFinished(true);
    
    // Use settings.duration exactly in time mode to avoid floating sub-millisecond variations
    const finalSeconds = settings.mode === 'time' ? settings.duration : Math.max(finalElapsed, 0.5);
    setElapsed(finalSeconds);

    if (settings.soundEnabled) {
      playSuccessChime();
    }

    // Calculations
    const correctChars = correctKeyCountRef.current;
    const incorrectChars = incorrectKeyCountRef.current;
    const typedText = inputValueRef.current;
    const currentAcc = liveAccuracyRef.current;

    const wpm = Math.round((correctChars / 5) / (finalSeconds / 60));
    const rawWpm = Math.round((typedText.length / 5) / (finalSeconds / 60));
    setFinalTestWpm(isNaN(wpm) ? 0 : wpm);

    const result: TestResult = {
      id: Math.random().toString(36).substring(2, 9),
      username: profile.username,
      avatar: profile.avatar,
      wpm: isNaN(wpm) ? 0 : wpm,
      accuracy: currentAcc,
      rawWpm: isNaN(rawWpm) ? 0 : rawWpm,
      correctChars: correctChars,
      incorrectChars: incorrectChars,
      date: new Date().toISOString(),
      language: settings.language,
      duration: Math.round(finalSeconds),
      mode: settings.mode
    };

    onTestComplete(result);

    // Dynamic Voice Synthesis Announcement in Uzbek
    if ('speechSynthesis' in window && settings.soundEnabled) {
      try {
        window.speechSynthesis.cancel();
        
        // Formulate spoken report sentence in Uzbek
        const spokenText = `Test yakunlandi. Tezligingiz daqiqasiga ${isNaN(wpm) ? 0 : wpm} ta so'z, aniqlik ${currentAcc} foiz.`;
        
        const utterance = new SpeechSynthesisUtterance(spokenText);
        utterance.lang = 'uz-UZ';
        
        // Attempt to find Uzbek or general Turkish voice for better accent mapping, or fallback to default
        const voices = window.speechSynthesis.getVoices();
        const suitableVoice = voices.find(v => v.lang.startsWith('uz') || v.lang.startsWith('tr'));
        if (suitableVoice) {
          utterance.voice = suitableVoice;
        }
        
        window.speechSynthesis.speak(utterance);
      } catch (e) {
        console.error('Text to speech failed to play:', e);
      }
    }
  };

  // Focus typing box
  const handleDivClick = () => {
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  };

  // Scroll active word/character into view automatically
  useEffect(() => {
    const activeEl = document.getElementById('sandbox-active-char');
    if (activeEl && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const rect = activeEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      // Check if the current letter is near scroll viewport boundaries
      if (rect.bottom > containerRect.bottom - 12 || rect.top < containerRect.top + 12) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }
  }, [inputValue]);

  // Render highlighted letters of text
  const renderLetters = () => {
    const elements: React.ReactNode[] = [];
    const typedLength = inputValue.length;

    for (let i = 0; i < textToType.length; i++) {
      const char = textToType[i];
      let colorClass = 'text-gray-400 dark:text-zinc-500'; // Untyped
      let bgClass = '';

      if (i < typedLength) {
        if (inputValue[i] === char) {
          colorClass = 'text-gray-900 dark:text-zinc-100 font-semibold'; // Correct
        } else {
          colorClass = 'text-red-500 dark:text-red-400 font-bold bg-red-500/15 rounded-xs'; // Incorrect non-disruptive highlighting
        }
      }

      // Cursor indicator
      const isCurrentChar = i === typedLength;

      elements.push(
        <span
          key={i}
          id={isCurrentChar ? 'sandbox-active-char' : undefined}
          className={`relative ${colorClass} ${bgClass} transition-colors duration-75`}
        >
          {isCurrentChar && (
            <span className="absolute left-0 bottom-0 top-0 w-[2px] bg-blue-500 dark:bg-blue-400 animate-pulse" />
          )}
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    }

    return elements;
  };

  // Calculate current progress width percentage
  const progressPercent = Math.min((inputValue.length / (textToType.length || 1)) * 100, 100);

  return (
    <div id="typing-sandbox" className="flex flex-col gap-6">

      {/* Connection Mode + Challenge alert */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center">
        {!onlineStatus ? (
          <div className="rounded-xl bg-orange-55 border border-orange-200/60 dark:bg-orange-950/20 dark:border-orange-900/40 p-3 flex items-center gap-2 text-xs text-orange-700 dark:text-orange-300">
            <WifiOff size={14} className="animate-bounce" />
            <span><strong>Oflayn rejim faol:</strong> Natijalar va nishonlar mahalliy xotiraga (localStorage) to‘liq yoziladi!</span>
          </div>
        ) : (
          <div className="rounded-xl bg-emerald-50/50 border border-emerald-200/40 dark:bg-emerald-950/10 dark:border-emerald-900/30 p-2.5 flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400">
            <Wifi size={13} />
            <span>Onlayn tarmog'ingiz barqaror.</span>
          </div>
        )}

        {challengeParams && (
          <div className="rounded-xl bg-purple-50/60 border border-purple-200/40 dark:bg-purple-950/20 dark:border-purple-900/40 p-3 flex items-center justify-between gap-4 text-xs text-purple-700 dark:text-purple-300">
            <div className="flex items-center gap-2">
              <Award size={14} className="text-purple-500" />
              <span>
                Do'stingiz sizni chaqirdi: <strong>{challengeParams.wpm} WPM</strong> ({challengeParams.accuracy}% aniqlik). O'zingizni sinab ko'rsatuvchi raqib!
              </span>
            </div>
            <button
              id="clear-challenge-btn"
              onClick={() => setChallengeParams(null)}
              className="text-[10px] underline font-semibold hover:text-purple-950"
            >
              Yopish
            </button>
          </div>
        )}
      </div>

      {/* Main interactive speed test card */}
      <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-md flex flex-col gap-6 relative overflow-hidden">
        
        {/* Dynamic backdrop accent lines block */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

        {/* Configurations for test duration/words inside sandbox */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 dark:border-zinc-800 pb-4">
          
          {/* Preset Buttons for test settings */}
          <div className="flex items-center gap-3">
            {/* Mode choices */}
            <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-xl">
              <button
                id="sandbox-mode-time"
                onClick={() => updateSettings({ mode: 'time' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  settings.mode === 'time'
                    ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-200 shadow-sm'
                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-800'
                }`}
              >
                <Timer size={12} /> Vaqt
              </button>
              <button
                id="sandbox-mode-words"
                onClick={() => updateSettings({ mode: 'words' })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                  settings.mode === 'words'
                    ? 'bg-white dark:bg-zinc-700 text-blue-600 dark:text-blue-200 shadow-sm'
                    : 'text-gray-500 dark:text-zinc-400 hover:text-gray-800'
                }`}
              >
                <Zap size={12} /> So‘zlar soni
              </button>
            </div>

            {/* Sub options preset details */}
            {settings.mode === 'time' ? (
              <div className="flex items-center gap-1 bg-gray-50 dark:bg-zinc-800/40 p-1 rounded-xl border border-gray-100 dark:border-zinc-800">
                {([15, 30, 60, 120] as const).map((secs) => (
                  <button
                    id={`sandbox-duration-${secs}`}
                    key={secs}
                    onClick={() => updateSettings({ duration: secs })}
                    className={`h-7 px-2 text-xs font-bold rounded-lg ${
                      settings.duration === secs
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-250 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {secs}s
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-gray-50 dark:bg-zinc-800/40 p-1 rounded-xl border border-gray-100 dark:border-zinc-800">
                {([10, 25, 50, 100] as const).map((cnt) => (
                  <button
                    id={`sandbox-words-${cnt}`}
                    key={cnt}
                    onClick={() => updateSettings({ wordCount: cnt })}
                    className={`h-7 px-2 text-xs font-bold rounded-lg ${
                      settings.wordCount === cnt
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-500 dark:text-zinc-400 hover:bg-gray-250 dark:hover:bg-zinc-700'
                    }`}
                  >
                    {cnt} ta
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick reset/restart action */}
          <button
            id="sandbox-reset-btn"
            onClick={resetTest}
            className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-blue-500 rounded-xl transition-all border border-gray-200/60 dark:border-zinc-700/60 flex items-center gap-1 text-xs font-bold"
            title="Qayta boshlash"
          >
            <RefreshCw size={14} /> Qayta O'rnatish
          </button>
        </div>

        {/* Live Metrics and statistics shown during test */}
        <div className="grid grid-cols-3 max-w-lg mx-auto w-full gap-4 text-center">
          <div className="p-3 bg-gray-50 dark:bg-zinc-850 rounded-xl border border-gray-100 dark:border-zinc-800/80">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Tezlik (Live)</span>
            <span className="text-xl font-extrabold text-blue-500">
              {settings.liveStatsEnabled ? liveWpm : '∗∗'}{' '}
              <span className="text-xs font-medium text-gray-400">WPM</span>
            </span>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-zinc-850 rounded-xl border border-gray-100 dark:border-zinc-800/80">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Vaqt ruli</span>
            <span className="text-xl font-extrabold text-gray-800 dark:text-zinc-200">
              {settings.mode === 'time'
                ? Math.max(0, Math.ceil(settings.duration - elapsed)) + 's'
                : Math.round(elapsed) + 's'}
            </span>
          </div>
          <div className="p-3 bg-gray-50 dark:bg-zinc-850 rounded-xl border border-gray-100 dark:border-zinc-800/80">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Aniqlik</span>
            <span className="text-xl font-extrabold text-emerald-500">
              {liveAccuracy}%
            </span>
          </div>
        </div>

        {/* Hidden active input proxying typing */}
        <input
          id="sandbox-typing-input-elem"
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          className="opacity-0 absolute top-1/2 left-1/2 w-px h-px pointer-events-none -translate-x-1/2 -translate-y-1/2"
          autoFocus
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck="false"
        />

        {/* Beautiful visual layout of words to write */}
        {!isFinished ? (
          <div
            id="typing-wrapper-area"
            onClick={handleDivClick}
            className="cursor-text bg-gray-50/70 hover:bg-gray-50 dark:bg-zinc-950/40 dark:hover:bg-zinc-950/60 p-5 rounded-2xl border border-gray-100 dark:border-zinc-800 transition-all focus-within:ring-2 focus-within:ring-blue-400 relative"
          >
            {/* Visual prompt to tap/focus for mobile screens */}
            {!isActive && (
              <div className="absolute inset-0 bg-blue-500/5 backdrop-blur-[1px] flex items-center justify-center rounded-2xl pointer-events-none">
                <span className="text-xs text-blue-600 dark:text-blue-300 font-bold bg-white dark:bg-zinc-800 py-1.5 px-3 rounded-lg shadow-sm border border-blue-250 animate-bounce">
                  Yozishni boshlash uchun bosing ⌨️
                </span>
              </div>
            )}

            {/* Main fluid layout with different font choices */}
            <div
              ref={scrollContainerRef}
              className={`${settings.fontFamily ? `font-${settings.fontFamily}` : 'font-mono'} text-left leading-relaxed break-words outline-none select-none tracking-wide max-h-52 overflow-y-auto ${
                settings.fontSize === 'sm' ? 'text-sm' :
                settings.fontSize === 'md' ? 'text-base sm:text-lg' :
                settings.fontSize === 'lg' ? 'text-lg sm:text-2xl' :
                'text-xl sm:text-3xl' // xl
              }`}
            >
              {renderLetters()}
            </div>

            {/* Horizontal progress bar highlighting words left */}
            <div className="w-full bg-gray-100 dark:bg-zinc-800 h-1 rounded-full mt-4 overflow-hidden">
              <div
                className="bg-blue-500 h-full transition-all duration-150"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-1.5 font-semibold">
              <span>{inputValue.length} yozildi</span>
              <span>{textToType.length} ta simvoldan</span>
            </div>
          </div>
        ) : (
          /* Report Card layout shown after completion */
          <div
            id="report-card-area"
            className="p-6 bg-gradient-to-br from-blue-50/40 via-white to-emerald-50/20 dark:from-zinc-950/60 dark:via-zinc-900 dark:to-emerald-950/10 rounded-2xl border border-gray-200 dark:border-zinc-800/80 flex flex-col gap-6 animate-fadeIn"
          >
            <div className="text-center">
              <span className="h-10 w-10 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl mb-2">🎉</span>
              <h3 className="text-lg font-black text-gray-900 dark:text-zinc-100">Test Muvaffaqiyatli Yakunlandi!</h3>
              <p className="text-xs text-gray-500 mt-1">O'z ko'rsatkichlaringizni tekshiring.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white dark:bg-zinc-850 p-4 rounded-xl border border-gray-150 dark:border-zinc-800 text-center shadow-xs">
                <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-widest mb-1">Tezlik (WPM)</span>
                <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                  {finalTestWpm}
                </span>
              </div>
              <div className="bg-white dark:bg-zinc-850 p-4 rounded-xl border border-gray-150 dark:border-zinc-800 text-center shadow-xs">
                <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-widest mb-1">Aniqlik</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {liveAccuracy}%
                </span>
              </div>
              <div className="bg-white dark:bg-zinc-850 p-4 rounded-xl border border-gray-150 dark:border-zinc-800 text-center shadow-xs">
                <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-widest mb-1">Tugmalar</span>
                <span className="text-2xl font-black text-gray-800 dark:text-zinc-300">
                  {correctKeyCount}<span className="text-xs text-red-500"> / {incorrectKeyCount}</span>
                </span>
                <span className="text-[9px] text-gray-400 block mt-0.5">Xato / To'g'ri</span>
              </div>
              <div className="bg-white dark:bg-zinc-850 p-4 rounded-xl border border-gray-150 dark:border-zinc-800 text-center shadow-xs">
                <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-widest mb-1">Sarflangan Vaqt</span>
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                  {Math.round(elapsed)}s
                </span>
              </div>
            </div>

            {/* Try again button (No share system) */}
            <div className="flex justify-center items-center border-t border-gray-100 dark:border-zinc-800 pt-4">
              <button
                id="sandbox-try-again-btn"
                onClick={resetTest}
                className="w-full sm:w-auto bg-blue-650 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <RefreshCw size={12} /> Yana bir marta sinash
              </button>
            </div>
          </div>
        )}

        {/* Text Details metadata summary */}
        {textAuthor && !isFinished && (
          <div className="text-right text-[10px] text-gray-400 font-semibold italic flex items-center justify-end gap-1.5">
            <span>#{textCategory}</span>
            <ChevronRight size={10} />
            <span>Muallif: {textAuthor}</span>
          </div>
        )}
      </div>

      {/* Show Virtual Keyboard in simulator under the sandbox */}
      {settings.keyboardLayoutEnabled && !isFinished && (
        <VirtualKeyboard activeKey={lastKeyPressed} targetKey={textToType[inputValue.length] || ''} />
      )}
    </div>
  );
}
