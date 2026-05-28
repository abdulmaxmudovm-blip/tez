import { useState } from 'react';
import { UserProfile, Badge } from '../types';
import { ACHIEVEMENTS_LIST } from '../data/texts';
import { Edit2, Save, User, Award, CheckCircle2, BookOpen, Star, Sparkles, Smile } from 'lucide-react';

interface ProfileEditProps {
  profile: UserProfile;
  badges: Badge[];
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
}

export default function ProfileEdit({ profile, badges, onUpdateProfile }: ProfileEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(profile.username);
  const [bio, setBio] = useState(profile.bio);
  const [avatar, setAvatar] = useState(profile.avatar);

  const avatars = ['⚡', '🥷', '👩‍💻', '👨‍💻', '🚀', '🧠', '👾', '🐱', '🔥', '🦁', '🦉', '🦊', '🍀', '🌟'];

  const handleSave = () => {
    onUpdateProfile({
      username: username.trim() || 'Guest Runner',
      bio: bio.trim(),
      avatar: avatar
    });
    setIsEditing(false);
  };

  return (
    <div id="profile-edit-component" className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm flex flex-col gap-6">
      
      {/* Header Profile with Stats */}
      <div className="flex flex-col md:flex-row items-center gap-6 pb-6 border-b border-gray-100 dark:border-zinc-800">
        
        {/* Avatar block */}
        <div className="flex flex-col items-center gap-2">
          <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-4xl shadow-md border-2 border-white dark:border-zinc-800 relative group">
            <span>{avatar}</span>
            {isEditing && (
              <span className="absolute -bottom-1 -right-1 bg-yellow-500 text-white rounded-full p-1 text-[10px] border border-white">
                <Smile size={10} />
              </span>
            )}
          </div>
          
          {isEditing && (
            <div className="flex flex-wrap gap-1 justify-center max-w-[200px] mt-2 p-1 bg-gray-50 dark:bg-zinc-800 rounded-xl border border-gray-100 dark:border-zinc-700">
              {avatars.map((av) => (
                <button
                  id={`avatar-choice-${av}`}
                  key={av}
                  onClick={() => setAvatar(av)}
                  className={`h-6 w-6 rounded flex items-center justify-center text-xs hover:bg-gray-200 dark:hover:bg-zinc-700 transition-all ${
                    avatar === av ? 'bg-blue-100 dark:bg-blue-900 ring-1 ring-blue-500' : ''
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Profile Details Block */}
        <div className="flex-1 text-center md:text-left">
          {isEditing ? (
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1">Taxallusingiz / Username</label>
                <input
                  id="profile-username-input"
                  type="text"
                  maxLength={18}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-sm text-gray-900 dark:text-zinc-100 focus:outline-none focus:ring-1 focus:ring-blue-500 font-bold"
                  placeholder="Ismingizni kiriting..."
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest block mb-1">O'zingiz haqizda / Bio</label>
                <textarea
                  id="profile-bio-input"
                  maxLength={100}
                  value={bio}
                  rows={2}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl px-3 py-1.5 text-xs text-gray-700 dark:text-zinc-300 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed resize-none"
                  placeholder="Klaviatura jangchisi..."
                />
              </div>
              <div className="flex gap-2">
                <button
                  id="profile-save-btn"
                  onClick={handleSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-3.5 py-1.5 text-xs font-bold shadow-sm transition-colors flex items-center gap-1"
                >
                  <Save size={12} /> Saqlash
                </button>
                <button
                  id="profile-cancel-btn"
                  onClick={() => {
                    setUsername(profile.username);
                    setBio(profile.bio);
                    setAvatar(profile.avatar);
                    setIsEditing(false);
                  }}
                  className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 text-gray-600 dark:text-zinc-300 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-colors"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col h-full justify-between">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <h3 className="text-lg font-extrabold text-gray-900 dark:text-zinc-100">
                    {profile.username}
                  </h3>
                  <button
                    id="profile-edit-btn"
                    onClick={() => setIsEditing(true)}
                    className="p-1.5 hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-400 hover:text-blue-500 rounded-lg transition-colors"
                    title="Profilni tahrirlash"
                  >
                    <Edit2 size={13} />
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 max-w-md leading-relaxed">
                  {profile.bio || "Hayot - bu barcha simvollarni benuqson terish san'atidir."}
                </p>
              </div>

              {/* Badges counter */}
              <div className="flex items-center justify-center md:justify-start gap-2 mt-3">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full px-2.5 py-0.5">
                  <Award size={12} />
                  <span>{profile.unlockedBadges.length} Nishonlar</span>
                </div>
                <div className="inline-flex items-center gap-1 text-[11px] font-bold bg-indigo-50/60 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 rounded-full px-2.5 py-0.5">
                  <Sparkles size={11} />
                  <span>{profile.testsCompleted} Testlar</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Numerical Stats - Responsive Columns */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 bg-gray-5/50 dark:bg-zinc-800/20 p-4 border border-gray-100 dark:border-zinc-800/80 rounded-xl">
        <div className="p-2 text-center md:text-left border-r border-gray-100 dark:border-zinc-800/50">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Eng yaxshi tezlik</span>
          <span className="text-xl font-black text-gray-900 dark:text-zinc-100 flex items-baseline justify-center md:justify-start gap-0.5">
            {profile.bestWpm} <span className="text-xs font-semibold text-gray-400">WPM</span>
          </span>
        </div>
        <div className="p-2 text-center md:text-left lg:border-r border-gray-100 dark:border-zinc-800/50">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">O'rtacha tezlik</span>
          <span className="text-xl font-black text-gray-900 dark:text-zinc-100 flex items-baseline justify-center md:justify-start gap-0.5">
            {profile.averageWpm || 0} <span className="text-xs font-semibold text-gray-400">WPM</span>
          </span>
        </div>
        <div className="p-2 text-center md:text-left border-r border-gray-100 dark:border-zinc-800/50">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">O'rtacha aniqlik</span>
          <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 flex items-baseline justify-center md:justify-start gap-0.5">
            {profile.averageAccuracy || 0}<span className="text-xs font-semibold">%</span>
          </span>
        </div>
        <div className="p-2 text-center md:text-left">
          <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider block">Barcha qatnashishlar</span>
          <span className="text-xl font-black text-gray-900 dark:text-zinc-100">
            {profile.testsCompleted} <span className="text-xs font-semibold text-gray-400">marta</span>
          </span>
        </div>
      </div>

      {/* Children darslik stars tracking block */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-950 dark:to-zinc-850 rounded-2xl border border-blue-50/60 dark:border-zinc-800 flex flex-col gap-3">
        <span className="text-xs font-bold text-gray-500 dark:text-zinc-450 uppercase tracking-widest flex items-center gap-1.5">
          <Star size={14} className="text-amber-500 fill-amber-400" /> Bolalar Darsligi Progressi
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[1, 2, 3, 4, 5].map((lvlNum) => {
            const hasStar = profile.unlockedBadges.includes(`kids_lvl_${lvlNum}`);
            const titles = ["Asosiy Harf", "Uch Harfli", "Besh Harfli", "Mashq Gapi", "Shirin Hikoya"];
            return (
              <div
                key={lvlNum}
                className={`p-3 rounded-xl text-center border flex flex-col items-center gap-1.5 justify-center ${
                  hasStar
                    ? 'bg-white dark:bg-zinc-900 border-yellow-250 dark:border-yellow-900 shadow-xs'
                    : 'bg-gray-100/40 dark:bg-zinc-900/10 border-gray-200/60 dark:border-zinc-805/40 opacity-55'
                }`}
              >
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Level {lvlNum}</span>
                <span className={`text-2xl ${hasStar ? 'animate-pulse text-amber-400' : 'text-gray-300'}`}>
                  {hasStar ? '⭐' : '☆'}
                </span>
                <span className="text-[9px] font-bold text-gray-500 dark:text-zinc-400 leading-none">{titles[lvlNum - 1]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Badge Trophy Cabinet Grid */}
      <div className="flex flex-col gap-3">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
          <Star size={14} className="text-amber-500 fill-amber-500/10" /> Yutuqlar va Maxsus Sovrinlar
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {badges.map((badge) => {
            const isUnlocked = profile.unlockedBadges.includes(badge.id);
            return (
              <div
                id={`badge-card-${badge.id}`}
                key={badge.id}
                className={`p-3.5 border rounded-xl flex items-start gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-white to-gray-50 dark:from-zinc-900 dark:to-zinc-800/80 border-gray-250 dark:border-zinc-700/80 hover:shadow-sm'
                    : 'bg-gray-100/40 dark:bg-zinc-900/40 border-dashed border-gray-200 dark:border-zinc-800 opacity-60'
                }`}
              >
                <div className={`h-11 w-11 rounded-xl flex items-center justify-center text-white shrink-0 bg-gradient-to-br ${
                  isUnlocked ? badge.color : 'from-gray-300 to-gray-450 dark:from-zinc-800 dark:to-zinc-700'
                } shadow-sm`}>
                  {/* Custom emoji or dynamic indicator for icon fallback */}
                  <span className="text-lg font-bold">
                    {badge.id === 'first_test' ? '🏅' :
                     badge.id === 'speed_50' ? '⚡' :
                     badge.id === 'speed_80' ? '🏆' :
                     badge.id === 'speed_110' ? '👑' :
                     badge.id === 'perfectionist' ? '🎯' :
                     badge.id === 'multilingual' ? '🌍' : '⏱️'}
                  </span>
                </div>
                <div>
                  <h4 className={`text-xs font-bold ${isUnlocked ? 'text-gray-900 dark:text-zinc-150' : 'text-gray-400'}`}>
                    {badge.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 mt-0.5 leading-relaxed">
                    {badge.description}
                  </p>
                  {isUnlocked && (
                    <span className="inline-block mt-1 text-[9px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20 dark:text-emerald-400 font-semibold rounded-full px-1.5">
                      Bajarildi ✓
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
