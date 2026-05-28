import React, { useState, useEffect, useRef } from 'react';
import { AppSettings, UserProfile } from '../types';
import { playKeySound, playErrorSound, playSuccessChime } from '../utils/audio';
import { BookOpen, Sparkles, Star, CheckCircle, Flame, Milestone, ArrowRight, HelpCircle } from 'lucide-react';
import VirtualKeyboard from './VirtualKeyboard';

interface LearnHubProps {
  settings: AppSettings;
  profile: UserProfile;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  showToast: (message: string, type: 'success' | 'badge' | 'info') => void;
}

interface LessonLevel {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  practiceText: string;
  expectedWpm: number;
  type: 'letters' | 'short-words' | 'medium-words' | 'short-sentences' | 'paragraphs';
}

const LESSON_LEVELS: LessonLevel[] = [
  {
    id: 1,
    title: "1-Bosqich: Boshlang'ich Harflar (Home Row)",
    subtitle: "Klaviatura asosiy qatori",
    description: "Chap va o'ng qo'lingiz ko'rsatkich barmoqlarini mos ravishda 'F' va 'J' harflariga qo'ying. Keyin qolgan barmoqlaringizni yonma-yon joylashtiring.",
    practiceText: "a s d f j k l a s d f j k l a s d f j k l a s d f j k l a s d f j k l a s d f",
    expectedWpm: 12,
    type: 'letters'
  },
  {
    id: 2,
    title: "2-Bosqich: Oddiy 3-harfli So'zlar",
    subtitle: "Oddiy so'zlarni tuzish",
    description: "Xat, non, sut kabi eng oddiy va qisqa quvnoq so'zlarni barmoqlaringizni Home rowdan uzoqlashtirmasdan yozishni mashq qiling.",
    practiceText: "ana ona non sut qush dars xat bola suv tog bog quy asr kun tush choy tin",
    expectedWpm: 15,
    type: 'short-words'
  },
  {
    id: 3,
    title: "3-Bosqich: Chiroyli 5-harfli So'zlar",
    subtitle: "Kundalik ishlatiladigan so'zlar",
    description: "Endi biroz uzunroq, lekin juda oddiy hayotiy so'zlarni yozib ko'ramiz. Har bir harfni diqqat bilan bosing.",
    practiceText: "salom maktab kitob bahor qalam quyosh daryo shahar daraxt oltin sovg'a o'rik",
    expectedWpm: 20,
    type: 'medium-words'
  },
  {
    id: 4,
    title: "4-Bosqich: Oson va Qisqa Gaplar",
    subtitle: "Sekin-asta gaplar tizimi",
    description: "Biz so'zlarni birlashtiramiz! Gaplar kichik harflar bilan yoziladi va nuqtalar ishlatilmaydi. Bo'shliq (Space) tugmasini bosishni unutmang.",
    practiceText: "bahor keldi quyosh chiqdi men kitob o'qiyman darslar boshlandi maktab go'zal makondir",
    expectedWpm: 25,
    type: 'short-sentences'
  },
  {
    id: 5,
    title: "5-Bosqich: Qiziqarli Hikoya Matni",
    subtitle: "To'liqligicha yozish mahorati",
    description: "Tabriklaymiz siz oxirgi bosqichdasiz! Endi bolalar va boshlanuvchilar uchun chiroyli kichik hikoyani to'liq terib ko'ring.",
    practiceText: "kichkina qushcha baland osmon bo'ylab uchib ketdi u yashil bog' ichra meva ko'rdi va quvondi barcha bolalar go'zal tabiat asrar",
    expectedWpm: 30,
    type: 'paragraphs'
  }
];

export default function LearnHub({ settings, profile, onUpdateProfile, showToast }: LearnHubProps) {
  const [activeLevelId, setActiveLevelId] = useState<number>(1);
  const [inputValue, setInputValue] = useState('');
  const [lastKeyPressed, setLastKeyPressed] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wpm, setWpm] = useState(0);

  // Active Lesson Object
  const currentLesson = LESSON_LEVELS.find(l => l.id === activeLevelId) || LESSON_LEVELS[0];

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    resetLesson();
  }, [activeLevelId]);

  // Keep focus on typing
  const handleWrapperClick = () => {
    if (inputRef.current) {
      inputRef.current.focus({ preventScroll: true });
    }
  };

  const resetLesson = () => {
    setInputValue('');
    setLastKeyPressed('');
    setStartTime(null);
    setElapsed(0);
    setIsActive(false);
    setIsFinished(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setAccuracy(100);
    setWpm(0);
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus({ preventScroll: true });
    }
  };

  // Handle global Enter key press to reset/restart the kids lesson
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (
          document.activeElement &&
          document.activeElement.tagName === 'INPUT' &&
          document.activeElement.id !== 'kids-hidden-input'
        ) {
          return;
        }
        e.preventDefault();
        resetLesson();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleGlobalKeyDown);
    };
  }, [currentLesson, settings]);

  // Timer run loop
  useEffect(() => {
    let timerId: any = null;
    if (isActive && !isFinished) {
      timerId = setInterval(() => {
        if (!startTime) return;
        const currentElapsed = (Date.now() - startTime) / 1000;
        setElapsed(currentElapsed);

        // Update real time WPM
        if (inputValue.length > 2) {
          const currentWpm = Math.round((correctCount / 5) / (currentElapsed / 60));
          setWpm(isNaN(currentWpm) ? 0 : currentWpm);
        }
      }, 500);
    }
    return () => clearInterval(timerId);
  }, [isActive, isFinished, startTime, correctCount, inputValue]);

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

    // Sound mechanics
    if (settings.soundEnabled) {
      playKeySound(settings.soundType || 'mechanical', 1.1 + Math.random() * 0.1);
    }

    // Match criteria
    let corrects = 0;
    let incorrects = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] === currentLesson.practiceText[i]) {
        corrects++;
      } else {
        incorrects++;
      }
    }

    setCorrectCount(corrects);
    setIncorrectCount(incorrects);

    if (incorrects > incorrectCount && settings.soundEnabled) {
      playErrorSound();
    }

    const totalTyped = value.length;
    if (totalTyped > 0) {
      setAccuracy(Math.round((corrects / totalTyped) * 100));
    }

    setInputValue(value);

    // End condition when reaches length of current lesson lesson text
    if (value.length >= currentLesson.practiceText.length) {
      finishLesson();
    }
  };

  const finishLesson = () => {
    setIsActive(false);
    setIsFinished(true);

    if (settings.soundEnabled) {
      playSuccessChime();
    }

    const finalSecs = Math.max((Date.now() - (startTime || Date.now())) / 1000, 1);
    const calculatedWpm = Math.round((correctCount / 5) / (finalSecs / 60));
    setWpm(calculatedWpm);

    // Give rewards inside profiles if they reached accuracy targets
    if (accuracy >= 85) {
      // Award Novice Points & unlock child badges!
      const currentBadges = [...profile.unlockedBadges];
      let unlockedNew = false;

      const badgeId = `kids_lvl_${activeLevelId}`;
      if (!currentBadges.includes(badgeId)) {
        currentBadges.push(badgeId);
        unlockedNew = true;
      }

      const updatedProfile = {
        ...profile,
        testsCompleted: profile.testsCompleted + 1,
        bestWpm: Math.max(profile.bestWpm, calculatedWpm),
        unlockedBadges: currentBadges
      };

      onUpdateProfile(updatedProfile);

      if (unlockedNew) {
        showToast(`Tabriklaymiz! ${activeLevelId}-bosqichni muvaffaqiyatli yakunlab nishon oldingiz! 🌟`, 'badge');
      } else {
        showToast("Dars muvaffaqiyatli yakunlandi! Rahmat mashq uchun!", 'success');
      }
    } else {
      showToast("To'g'rilik koeffitsiyenti biroz past (85% dan ko'p bo'lishi kerak). Qaytadan mashq qiling!", 'info');
    }
  };

  // Help position markers for hand placement
  const fingerMaps = [
    { hand: "Chap Qo'l", fingers: [
      { name: "Jimjiloq (Pinky)", keys: "A, Q, Z, 1, Left Shift", color: "bg-pink-100 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300" },
      { name: "Nomsiz (Ring)", keys: "S, W, X, 2", color: "bg-orange-100 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300" },
      { name: "O'rtacha (Middle)", keys: "D, E, C, 3", color: "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300" },
      { name: "Ko'rsatkich (Index)", keys: "F, G, R, T, V, B, 4, 5", color: "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300" },
    ]},
    { hand: "O'ng Qo'l", fingers: [
      { name: "Ko'rsatkich (Index)", keys: "J, H, U, Y, N, M, 6, 7", color: "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300" },
      { name: "O'rtacha (Middle)", keys: "K, I, ,, 8", color: "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300" },
      { name: "Nomsiz (Ring)", keys: "L, O, ., 9", color: "bg-teal-100 dark:bg-teal-950/40 text-teal-700 dark:text-teal-300" },
      { name: "Jimjiloq (Pinky)", keys: "P, ;, /, ?, Enter, Right Shift", color: "bg-rose-100 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300" },
    ]}
  ];

  return (
    <div id="learning-hub-root" className="flex flex-col gap-8">
      
      {/* Beginners Welcome Banner (Anti-AI-Slop Beautiful Design) */}
      <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/5 dark:from-blue-950/30 dark:to-zinc-900 border border-blue-100 dark:border-blue-900/40 rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute -right-4 -bottom-4 opacity-10 pointer-events-none text-[120px]">🧒</div>
        <div className="max-w-2xl">
          <span className="text-xs font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 bg-blue-100/60 dark:bg-blue-950/60 px-2.5 py-1 rounded-full flex items-center gap-1.5 w-max mb-3">
            <Star size={12} className="fill-blue-600" /> Yangi o'rganuvchilar va Bolalar uchun
          </span>
          <h2 className="text-2xl font-black text-gray-950 dark:text-zinc-50 tracking-tight">
            Noldan Klaviatura Mahorati darsligi
          </h2>
          <p className="text-sm text-gray-600 dark:text-zinc-400 mt-2 leading-relaxed">
            Klaviaturaga qanday qarashsiz, o'n barmoqli qo'lni joylashish usulidan boshlab, oddiy so'zlar va dildosh sekin-asta gaplar tizimiga o'tish darsliklarimizga xush kelibsiz. Har bir darsni muvaffaqiyatli topshirganda profil daxshatli yulduzlar bilan to'ladi!
          </p>
        </div>
      </div>

      {/* Hand Positioning details layout (O'rgatishlar bo'limi) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-805 p-6 rounded-2xl shadow-xs">
        <div>
          <h3 className="text-base font-bold text-gray-900 dark:text-zinc-100 flex items-center gap-1.5">
            👋 Klaviaturada barmoqlarni qanday to'g'ri qo'yish kerak?
          </h3>
          <p className="text-xs text-gray-500 dark:text-zinc-400 mt-2 leading-relaxed">
            Klaviatura har doim bitta joyda turadigan <strong>Home Row (Markaziy chiziq)</strong>ga ega. Bu qator: <strong>A, S, D, F</strong> va <strong>J, K, L, ;</strong> harflaridan iborat.
          </p>

          <div className="mt-4 space-y-3.5">
            <div className="p-3 bg-blue-50/50 dark:bg-blue-950/20 rounded-xl border border-blue-100 dark:border-blue-900/30 text-xs text-blue-800 dark:text-blue-350">
              📌 <strong>Kichik o'simtalar (F va J dagi bo'rtiqchalar):</strong> Ko'zingizni yumib, 'F' va 'J' klavishlaridagi kichkina bo'rtiqchalarni barmoq uchingiz bilan his qiling. Bu uylarimiz belgisidir! Ko'rsatkich barmoqlar har doim shu yerda turishi shart.
            </div>
            
            <div className="p-3 bg-indigo-50/30 dark:bg-indigo-950/10 rounded-xl border border-indigo-100 dark:border-indigo-900/20 text-xs text-indigo-800 dark:text-indigo-300">
              💻 <strong>Tana Holati:</strong> To'g'ri o'tiring. Qo'lingiz bilak qismlari stolga ortiqcha osilib qolmasin, barmoqlarni mushuk tirnog'iday yarim doira holatida ozgina bukib yozish eng to'g'ri yo'ldir.
            </div>
          </div>
        </div>

        {/* Dynamic hand guide visual representation mapping keys */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block">Barmoqlarning mas'uliyat zonalari</span>
          
          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {fingerMaps.map((hm, idx) => (
              <div key={idx} className="bg-gray-50 dark:bg-zinc-850 p-3 rounded-xl border border-gray-150 dark:border-zinc-800">
                <span className="text-xs font-black text-gray-800 dark:text-zinc-350 block border-b border-gray-200 dark:border-zinc-700 pb-1 mb-1.5">{hm.hand}</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {hm.fingers.map((fg, fidx) => (
                    <div key={fidx} className={`p-2 rounded-lg text-[10px] ${fg.color}`}>
                      <span className="font-bold block">{fg.name}</span>
                      <span className="font-medium mt-0.5 block opacity-90">{fg.keys}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Levels list and practice panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left column levels selection */}
        <div className="flex flex-col gap-2.5">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest">O'rganish Bosqichlari</span>
          
          {LESSON_LEVELS.map((level) => {
            const isUnlockedBadge = profile.unlockedBadges.includes(`kids_lvl_${level.id}`);
            const isActiveLevel = activeLevelId === level.id;

            return (
              <button
                id={`lesson-selector-${level.id}`}
                key={level.id}
                onClick={() => setActiveLevelId(level.id)}
                className={`p-4 border text-left rounded-2xl transition-all duration-150 flex items-start gap-3.5 relative ${
                  isActiveLevel
                    ? 'bg-blue-500 border-blue-500 text-white shadow-md scale-[1.01]'
                    : isUnlockedBadge
                    ? 'bg-white dark:bg-zinc-900 border-emerald-300 dark:border-emerald-900 text-gray-800 dark:text-zinc-200 hover:bg-gray-50'
                    : 'bg-white dark:bg-zinc-900 border-gray-200 dark:border-zinc-800 text-gray-800 dark:text-zinc-200 hover:bg-gray-50'
                }`}
              >
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                  isActiveLevel ? 'bg-white text-blue-600' : isUnlockedBadge ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 dark:bg-zinc-800 text-gray-500'
                }`}>
                  {level.id}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-extrabold">{level.title.split(':')[1] || level.title}</span>
                    {isUnlockedBadge && (
                      <span className="text-[9px] bg-emerald-500 text-white font-bold px-1.5 py-0.5 rounded-full">✓</span>
                    )}
                  </div>
                  <span className={`text-[10px] block mt-0.5 ${isActiveLevel ? 'text-blue-105' : 'text-gray-400'}`}>
                    {level.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right column active writing arena */}
        <div className="lg:col-span-2 flex flex-col gap-4">
          <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
            <Milestone size={14} className="text-blue-500" /> Amaliy Mashg'ulot maydoni
          </span>

          <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 shadow-sm flex flex-col gap-5 relative">
            
            {/* active lesson stats badge */}
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-zinc-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-zinc-150">{currentLesson.title}</h4>
                <p className="text-[10px] text-gray-400 mt-0.5">{currentLesson.description}</p>
              </div>
              <span className="text-xs bg-gray-100 dark:bg-zinc-800 text-gray-500 rounded-full px-2.5 py-1 shrink-0 font-medium">
                Maqsad: {currentLesson.expectedWpm} WPM
              </span>
            </div>

            {/* Live interactive metrics */}
            <div className="grid grid-cols-3 gap-2.5 text-center bg-gray-55/60 dark:bg-zinc-850/50 p-2 border border-gray-100 dark:border-zinc-800 rounded-xl">
              <div>
                <span className="text-[9px] text-gray-400 uppercase block font-medium">Tezlik</span>
                <span className="text-sm font-bold text-blue-600">{wpm} WPM</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 uppercase block font-medium">Vaqt</span>
                <span className="text-sm font-bold text-gray-800 dark:text-zinc-200">{Math.round(elapsed)}s</span>
              </div>
              <div>
                <span className="text-[9px] text-gray-400 uppercase block font-medium">To'g'rilik</span>
                <span className="text-sm font-bold text-emerald-600">{accuracy}%</span>
              </div>
            </div>

            {/* Invisible Input trigger */}
            <input
              id="kids-hidden-input"
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="opacity-0 absolute top-1/2 left-1/2 w-px h-px pointer-events-none -translate-x-1/2 -translate-y-1/2"
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck="false"
            />

            {!isFinished ? (
              <div
                id="kids-typing-wrapper"
                onClick={handleWrapperClick}
                className="cursor-text bg-gray-50 dark:bg-zinc-950/30 p-5 rounded-xl border border-gray-100 dark:border-zinc-800 relative select-none"
              >
                {!isActive && (
                  <div className="absolute inset-0 bg-blue-500/5 flex items-center justify-center rounded-xl pointer-events-none">
                    <span className="text-xs text-blue-600 bg-white dark:bg-zinc-800 font-bold px-3 py-1.5 rounded-lg border border-blue-250 animate-pulse">
                      Sichqonchaning o'ng tugmasini bosib yozishni boshlang! ⌨️
                    </span>
                  </div>
                )}

                {/* Highly viewable letters representation without bottom underline dots */}
                <div className="font-mono text-base tracking-wide leading-relaxed text-left break-words">
                  {currentLesson.practiceText.split('').map((char, index) => {
                    const typedLength = inputValue.length;
                    let color = 'text-gray-400 dark:text-zinc-650';
                    let bg = '';

                    if (index < typedLength) {
                      if (inputValue[index] === char) {
                        color = 'text-blue-600 dark:text-blue-400 font-extrabold';
                      } else {
                        color = 'text-red-500 font-black bg-red-500/10';
                      }
                    }

                    const isCurrent = index === typedLength;

                    return (
                      <span key={index} className={`relative ${color} ${bg}`}>
                        {isCurrent && (
                          <span className="absolute left-0 bottom-0 top-0 w-[2px] bg-blue-500 animate-pulse" />
                        )}
                        {char}
                      </span>
                    );
                  })}
                </div>

                {/* Simple Horizontal guide */}
                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-zinc-800 flex justify-between text-[10px] text-gray-400 font-semibold">
                  <span>{inputValue.length} ta yozildi</span>
                  <span>Jami: {currentLesson.practiceText.length} ta</span>
                </div>
              </div>
            ) : (
              /* Success Celebration Area */
              <div className="p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-emerald-950/25 dark:to-zinc-900 rounded-2xl border border-emerald-200 dark:border-emerald-950 text-center flex flex-col gap-4 animate-fadeIn">
                <div>
                  <span className="h-12 w-12 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 rounded-full flex items-center justify-center text-xl mx-auto mb-2">⭐</span>
                  <h4 className="text-base font-extrabold text-emerald-800 dark:text-emerald-400">Ajoyib natija!</h4>
                  <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1">Siz {currentLesson.title} darsini muvaffaqiyatli topshirdingiz!</p>
                </div>

                <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                  <div className="bg-white dark:bg-zinc-850 p-2 rounded-xl border border-gray-100 text-center">
                    <span className="text-[10px] block text-gray-400">Yozish Tezligi</span>
                    <span className="text-sm font-black text-gray-800 dark:text-zinc-150">{wpm} WPM</span>
                  </div>
                  <div className="bg-white dark:bg-zinc-850 p-2 rounded-xl border border-gray-100 text-center">
                    <span className="text-[10px] block text-gray-400">To'g'rilik</span>
                    <span className="text-sm font-black text-emerald-600">{accuracy}%</span>
                  </div>
                </div>

                <div className="flex gap-2 justify-center items-center mt-2">
                  <button
                    id="btn-kids-next-lesson"
                    onClick={() => {
                      if (activeLevelId < LESSON_LEVELS.length) {
                        setActiveLevelId(activeLevelId + 1);
                      } else {
                        showToast("Siz barcha bosqichli darslarni a'zo tugatdingiz! 🎉 Haqiqiy klaviatura jangchisiz!", 'success');
                        setActiveLevelId(1);
                      }
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-4 py-2 text-xs font-bold transition-colors flex items-center gap-1.5"
                  >
                    Keyingi darsga o'tish <ArrowRight size={13} />
                  </button>
                  <button
                    id="btn-kids-redo"
                    onClick={resetLesson}
                    className="text-gray-500 hover:text-gray-700 text-xs font-bold px-3 py-2"
                  >
                    Qaytadan mashq qilish
                  </button>
                </div>
              </div>
            )}

            {/* Home index helper markers */}
            <div className="bg-blue-50/20 dark:bg-zinc-850 p-3 rounded-xl border border-blue-50/50 dark:border-zinc-800 flex gap-2.5">
              <span className="text-xs">💡</span>
              <p className="text-[11px] text-gray-500 dark:text-zinc-400 leading-normal text-left">
                <strong>O'rganuvchilar uchun oltin qoida:</strong> Matnga qarang, aslo klaviaturaga qaramang! Miya o'zi avtomatik tarzda barmoqlarning qayerga borishini eslab qoladi. Klaviaturadagi 'F' va 'J' dagi chiziqchalarni uyingiz deb biling.
              </p>
            </div>

          </div>

          {settings.keyboardLayoutEnabled && !isFinished && (
            <VirtualKeyboard activeKey={lastKeyPressed} targetKey={currentLesson.practiceText[inputValue.length] || ''} />
          )}
        </div>

      </div>

    </div>
  );
}
