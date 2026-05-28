import { useEffect, useState } from 'react';

interface VirtualKeyboardProps {
  activeKey: string;
  targetKey?: string;
}

// Map characters to specific hand & finger
function getFingerForChar(char: string): { hand: 'left' | 'right' | 'both'; finger: 'pinky' | 'ring' | 'middle' | 'index' | 'thumb'; label: string } | null {
  if (!char) return null;
  const c = char.toLowerCase();

  // Space/blank
  if (c === ' ' || c === 'space' || c === '\u00A0') {
    return { hand: 'both', finger: 'thumb', label: 'Bosh barmoq (Space)' };
  }

  // Left Pinky
  if ('1qaz`!qaz'.includes(c) || c === '~' || c === 'escape' || c === 'tab' || c === 'capslock' || c === 'shift') {
    return { hand: 'left', finger: 'pinky', label: 'Chap qo\'l Jimjiloq (Pinky)' };
  }
  // Left Ring
  // Handle o' g' for Uzbek users specifically
  if ('2wsx@wsx'.includes(c)) {
    return { hand: 'left', finger: 'ring', label: 'Chap qo\'l Nomsiz (Ring)' };
  }
  // Left Middle
  if ('3edc#edc'.includes(c)) {
    return { hand: 'left', finger: 'middle', label: 'Chap qo\'l O\'rtacha (Middle)' };
  }
  // Left Index
  if ('45rtfgvb$4%5rtfgvb'.includes(c)) {
    return { hand: 'left', finger: 'index', label: 'Chap qo\'l Ko\'rsatkich (Index)' };
  }

  // Right Index
  if ('67yuhjnm^6&7yuhjnm'.includes(c)) {
    return { hand: 'right', finger: 'index', label: 'O\'ng qo\'l Ko\'rsatkich (Index)' };
  }
  // Right Middle
  if ('8ik,*8ik<'.includes(c)) {
    return { hand: 'right', finger: 'middle', label: 'O\'ng qo\'l O\'rtacha (Middle)' };
  }
  // Right Ring
  if ('9ol.(9ol>'.includes(c)) {
    return { hand: 'right', finger: 'ring', label: 'O\'ng qo\'l Nomsiz (Ring)' };
  }
  // Right Pinky
  if ('0p;\'/\\-=[]_+=|:\"{}?/'.includes(c) || c === 'p' || c === 'o\'' || c === 'g\'' || c === 'o`' || c === 'o‘' || c === 'g‘' || c === 'enter' || c === 'backspace') {
    return { hand: 'right', finger: 'pinky', label: 'O\'ng qo\'l Jimjiloq (Pinky)' };
  }

  return null;
}

export default function VirtualKeyboard({ activeKey, targetKey = '' }: VirtualKeyboardProps) {
  const [pressedKeys, setPressedKeys] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (activeKey) {
      const normalizedKey = activeKey.toLowerCase();
      setPressedKeys((prev) => ({ ...prev, [normalizedKey]: true }));
      const timer = setTimeout(() => {
        setPressedKeys((prev) => ({ ...prev, [normalizedKey]: false }));
      }, 120);
      return () => clearTimeout(timer);
    }
  }, [activeKey]);

  // Keep track of real physical keys as well to light them up
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      // Map space correctly
      const mappedKey = e.code === 'Space' ? ' ' : key;
      setPressedKeys((prev) => ({ ...prev, [mappedKey]: true }));
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const mappedKey = e.code === 'Space' ? ' ' : key;
      setPressedKeys((prev) => ({ ...prev, [mappedKey]: false }));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const layout = [
    ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '='],
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', "'"],
    ['z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/'],
    ['space']
  ];

  const fingerInfo = getFingerForChar(targetKey);
  const activeHand = fingerInfo?.hand || null;
  const activeFinger = fingerInfo?.finger || null;

  return (
    <div id="virtual-keyboard-holder" className="w-full flex flex-col gap-6 p-5 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-805 rounded-3xl select-none max-w-3xl mx-auto shadow-sm">
      
      {/* Uzbek Interactive Dynamic Typing Buddy & Guidance */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-55/60 dark:bg-zinc-950/20 px-4 py-3 rounded-2xl border border-gray-100 dark:border-zinc-800">
        <div className="flex items-center gap-2.5">
          <span className="text-2xl animate-bounce">💡</span>
          <div className="text-left">
            <span className="text-[10px] uppercase font-black tracking-wider text-amber-500 block">Klaviatura Ko'rsatmasi</span>
            <p className="text-xs font-semibold text-gray-700 dark:text-zinc-350">
              {targetKey ? (
                <span>
                  Keyingi harf: <strong className="text-amber-500 text-sm px-1 font-mono uppercase bg-amber-500/10 rounded-sm">"{targetKey === ' ' ? 'Space (Bo\'shliq)' : targetKey}"</strong>. Uni{' '}
                  <span className="text-blue-500 font-bold">{fingerInfo?.label || 'tegishli barmoq'}</span> bilan bosing.
                </span>
              ) : (
                <span>Yozishni boshlang, klaviatura darslar orqali harf va barmoqlarni ko'rsatadi.</span>
              )}
            </p>
          </div>
        </div>
        {targetKey && (
          <span className="hidden sm:inline-block text-[10px] bg-blue-50 dark:bg-zinc-800 text-blue-600 dark:text-zinc-300 font-bold px-2.5 py-1 rounded-full border border-blue-100 dark:border-zinc-700">
            Home Row tizimi
          </span>
        )}
      </div>

      {/* Rows representation */}
      <div className="flex flex-col gap-1.5 w-full">
        {layout.map((row, rIdx) => (
          <div key={rIdx} className="flex justify-center gap-1.5 w-full">
            {row.map((k) => {
              const normalK = k.toLowerCase();
              const isPressed = pressedKeys[normalK === 'space' ? ' ' : normalK];
              const isTargetString = targetKey.toLowerCase();
              const isTarget = targetKey && (
                (k === 'space' && (isTargetString === ' ' || isTargetString === 'space' || isTargetString === '\u00a0')) ||
                (k !== 'space' && normalK === isTargetString)
              );

              if (k === 'space') {
                return (
                  <div
                    id="key-space"
                    key={k}
                    className={`h-11 flex-1 max-w-xs sm:max-w-md rounded-xl flex items-center justify-center text-xs font-bold uppercase transition-all duration-100 ${
                      isPressed
                        ? 'bg-emerald-500 text-white shadow-md translate-y-0.5 scale-95 border-emerald-600'
                        : isTarget
                        ? 'bg-amber-400 dark:bg-amber-500 text-gray-950 border-2 border-amber-500 animate-pulse font-black shadow-md'
                        : 'bg-gray-50 dark:bg-zinc-800 text-gray-400 border border-gray-200 dark:border-zinc-750 shadow-xs'
                    }`}
                  >
                    🚀 Space (Bo'shliq)
                  </div>
                );
              }

              return (
                <div
                  id={`key-${k}`}
                  key={k}
                  className={`h-9 w-9 sm:h-11 sm:w-11 rounded-lg sm:rounded-xl flex items-center justify-center text-xs sm:text-sm font-black uppercase transition-all duration-100 ${
                    isPressed
                      ? 'bg-emerald-500 text-white shadow-md translate-y-0.5 scale-95 border-emerald-600'
                      : isTarget
                      ? 'bg-amber-400 dark:bg-amber-500 text-gray-950 border-2 border-amber-500 animate-pulse font-extrabold shadow-md'
                      : 'bg-gray-50/50 dark:bg-zinc-800/80 text-gray-700 dark:text-zinc-350 border border-gray-200/80 dark:border-zinc-750 shadow-xs'
                  }`}
                >
                  {k}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Hands and fingers visual layout container */}
      <div className="flex flex-col xs:flex-row gap-5 justify-center items-center mt-3 border-t border-gray-100 dark:border-zinc-800 pt-5">
        
        {/* Left hand details mapping */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500">Chap Qo'l (Left Hand)</span>
          <div className="flex items-end gap-1.5 h-20 bg-gray-55/60 dark:bg-zinc-950/20 border border-gray-100 dark:border-zinc-800 p-3 rounded-2xl relative shadow-inner">
            
            {/* Pinky (L5) */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-3.5 rounded-full transition-all duration-200 ${activeFinger === 'pinky' && activeHand === 'left' ? 'h-11 bg-amber-400 dark:bg-amber-500 animate-pulse ring-2 ring-amber-300' : 'h-7 bg-gray-200 dark:bg-zinc-800'}`} />
              <span className="text-[7px] font-bold text-gray-400">P</span>
            </div>

            {/* Ring (L4) */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-3.5 rounded-full transition-all duration-200 ${activeFinger === 'ring' && activeHand === 'left' ? 'h-13 bg-amber-400 dark:bg-amber-500 animate-pulse ring-2 ring-amber-300' : 'h-9 bg-gray-200 dark:bg-zinc-800'}`} />
              <span className="text-[7px] font-bold text-gray-400">R</span>
            </div>

            {/* Middle (L3) */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-3.5 rounded-full transition-all duration-200 ${activeFinger === 'middle' && activeHand === 'left' ? 'h-15 bg-amber-400 dark:bg-amber-500 animate-pulse ring-2 ring-amber-300' : 'h-11 bg-gray-200 dark:bg-zinc-800'}`} />
              <span className="text-[7px] font-bold text-gray-400">M</span>
            </div>

            {/* Index (L2) */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-3.5 rounded-full transition-all duration-200 ${activeFinger === 'index' && activeHand === 'left' ? 'h-13 bg-amber-400 dark:bg-amber-500 animate-pulse ring-2 ring-amber-300' : 'h-9 bg-gray-200 dark:bg-zinc-800'}`} />
              <span className="text-[7px] font-bold text-gray-400">I</span>
            </div>

            {/* Thumb (L1) */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-3.5 rounded-full transition-all duration-200 ${(activeFinger === 'thumb' && (activeHand === 'left' || activeHand === 'both')) ? 'h-8 bg-amber-400 dark:bg-amber-500 animate-pulse ring-2 ring-amber-300' : 'h-5 bg-gray-200 dark:bg-zinc-800'}`} />
              <span className="text-[7px] font-bold text-gray-400">T</span>
            </div>

          </div>
        </div>

        {/* Separator / Divider bubble */}
        <div className="hidden xs:flex h-10 w-10 shrink-0 bg-gray-100 dark:bg-zinc-800 rounded-full items-center justify-center text-[10px] font-black text-gray-400 dark:text-zinc-500">
          VS
        </div>

        {/* Right hand details mapping */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 dark:text-zinc-500">O'ng Qo'l (Right Hand)</span>
          <div className="flex items-end gap-1.5 h-20 bg-gray-55/60 dark:bg-zinc-950/20 border border-gray-100 dark:border-zinc-800 p-3 rounded-2xl relative shadow-inner">
            
            {/* Thumb (R1) */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-3.5 rounded-full transition-all duration-200 ${(activeFinger === 'thumb' && (activeHand === 'right' || activeHand === 'both')) ? 'h-8 bg-amber-400 dark:bg-amber-500 animate-pulse ring-2 ring-amber-300' : 'h-5 bg-gray-200 dark:bg-zinc-800'}`} />
              <span className="text-[7px] font-bold text-gray-400">T</span>
            </div>

            {/* Index (R2) */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-3.5 rounded-full transition-all duration-200 ${activeFinger === 'index' && activeHand === 'right' ? 'h-13 bg-amber-400 dark:bg-amber-500 animate-pulse ring-2 ring-amber-300' : 'h-9 bg-gray-200 dark:bg-zinc-800'}`} />
              <span className="text-[7px] font-bold text-gray-400">I</span>
            </div>

            {/* Middle (R3) */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-3.5 rounded-full transition-all duration-200 ${activeFinger === 'middle' && activeHand === 'right' ? 'h-15 bg-amber-400 dark:bg-amber-500 animate-pulse ring-2 ring-amber-300' : 'h-11 bg-gray-200 dark:bg-zinc-800'}`} />
              <span className="text-[7px] font-bold text-gray-400">M</span>
            </div>

            {/* Ring (R4) */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-3.5 rounded-full transition-all duration-200 ${activeFinger === 'ring' && activeHand === 'right' ? 'h-13 bg-amber-400 dark:bg-amber-500 animate-pulse ring-2 ring-amber-300' : 'h-9 bg-gray-200 dark:bg-zinc-800'}`} />
              <span className="text-[7px] font-bold text-gray-400">R</span>
            </div>

            {/* Pinky (R5) */}
            <div className="flex flex-col items-center gap-1">
              <div className={`w-3.5 rounded-full transition-all duration-200 ${activeFinger === 'pinky' && activeHand === 'right' ? 'h-11 bg-amber-400 dark:bg-amber-500 animate-pulse ring-2 ring-amber-300' : 'h-7 bg-gray-200 dark:bg-zinc-800'}`} />
              <span className="text-[7px] font-bold text-gray-400">P</span>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
