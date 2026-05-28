import { TestLanguage, Badge } from '../types';

export interface TextData {
  text: string;
  category: string;
  author?: string;
}

export const LANGUAGES_SUPPORT: { id: TestLanguage; name: string; flag: string }[] = [
  { id: 'uz', name: 'O‘zbekcha', flag: '🇺🇿' },
  { id: 'en', name: 'English', flag: '🇺🇸' },
  { id: 'ru', name: 'Русский', flag: '🇷🇺' },
];

export const TYPING_PARAGRAPHS: Record<TestLanguage, TextData[]> = {
  uz: [
    {
      text: "vatan muqaddas makon har bir inson vatan sevadi mehnat qilar tinch hayot kechirar go'zal tabiat musaffo osmon toza havo biz uchun katta baxt keltirar kelajak yosh intiluvchan inson uchun yangi muvaffaqiyat ochadi",
      category: "Ma'naviyat",
      author: "Xalq hikmati"
    },
    {
      text: "kompyuter texnologiya hayot uchun yangi yordamchi bo'lar zamonaviy dastur sun'iy intellekt tizim inson imkoniyat har soha doim oson bajarar kelajak har bir yosh inson go'zal sayt va dastur tuzar",
      category: "Texnologiya",
      author: "Axborot Texnologiyalari dunyosi"
    },
    {
      text: "muvaffaqiyat sari yo'l tinimsiz mehnat va o'z kuchi bilan ishlash bo'lar har kim har kun yangi bilim egallar va o'z maqsad sari sadoqat bilan intilar orzu qilgan go'zal cho'qqi zabt etar",
      category: "Motivatsiya",
      author: "Ibn Sino"
    },
    {
      text: "kitob inson eng yaqin do'st va maslahatchi bo'lar u nafaqat yangi bilim berar balki dunyoqarash kengaytirar tafakkur charxlar va hayot yo'l yoritar kitob o'qigan inson hech qachon axloqsiz bo'lmas",
      category: "Adabiyot",
      author: "Alisher Navoiy"
    },
    {
      text: "ona tabiat go'zallik cheksiz u asrab avaylash har bir inson burch bo'lish lozim toza havo shaffof suv va yam yashil daraxt kelajak avlod sog'liq va sog'lom hayot uchun eng zaruriy manba bo'lar",
      category: "Ekologiya",
      author: "Tabiatni asrash qo'mitasi"
    }
  ],
  en: [
    {
      text: "The web is more than just a place to find information; it is a global environment where people connect, share ideas, and build products. Coding allows us to speak the language of computers, turning abstract structures into dynamic experiences that shape our everyday modern interactions.",
      category: "Technology",
      author: "Tim Berners-Lee"
    },
    {
      text: "The only way to do great work is to love what you do. If you haven't found it yet, keep looking. Don't settle. As with all matters of the heart, you'll know when you find it. And, like any great relationship, it just gets better and better as the years roll on.",
      category: "Inspiration",
      author: "Steve Jobs"
    },
    {
      text: "To be yourself in a world that is constantly trying to make you something else is the greatest accomplishment. Conformity is the easy path, but the unique individual is the one who ultimately pushes human civilization forward and introduces new paradigms of thought.",
      category: "Philosophy",
      author: "Ralph Waldo Emerson"
    },
    {
      text: "Success is not final, failure is not fatal: it is the courage to continue that counts. In the grand tapestry of life, every mistake teaches us a vital lesson, and every challenge builds our character. Keep writing, keep practicing, and never cease to improve.",
      category: "Motivation",
      author: "Winston Churchill"
    },
    {
      text: "Space, the final frontier. The exploration of the cosmos stimulates our collective imagination and drives technological innovation here on Earth. Looking up at the stars reminds us of how small our planet is, and yet how vast our potential remains.",
      category: "Science",
      author: "Carl Sagan"
    }
  ],
  ru: [
    {
      text: "Для того чтобы быть хорошим программистом, мало просто знать синтаксис языка программирования. Необходимо понимать алгоритмы, структуру данных и уметь логически мыслить. Практика слепой печати помогает освободить разум от поиска нужных клавиш.",
      category: "Технологии",
      author: "Анонимный разработчик"
    },
    {
      text: "Красота спасёт мир. Но что такое настоящая красота? Это гармония внутреннего духа, чистоты помыслов и уважения к окружающим. Когда человек стремится к созиданию, его жизнь наполняется глубоким смыслом, а мир вокруг преображается к лучшему.",
      category: "Философия",
      author: "Федор Достоевский"
    },
    {
      text: "Учитесь так, как будто вам предстоит жить вечно; живите так, как будто вам предстоит умереть завтра. Знания — это единственный багаж, который человек может унести с собой через любые жизненные испытания и непредвиденные шторма судьбы.",
      category: "Мудрость",
      author: "Махатма Ганди"
    },
    {
      text: "Нет ничего более прекрасного, чем утренний лес, полный свежего воздуха и пения птиц. Природа щедро делится своими сокровищами с каждым, кто готов открыть своё сердце её величию. Восстановите силы, прогулявшись в тишине под сенью деревьев.",
      category: "Экология",
      author: "Иван Тургенев"
    }
  ]
};

export const TYPING_WORDS: Record<TestLanguage, string[]> = {
  uz: [
    "vatan", "axborot", "texnologiya", "dastur", "bilim", "kelajak", "yulduz", "kitob",
    "maqsad", "mehnat", "baxt", "hamkorlik", "salomatlik", "inson", "suv", "havo", "tabiat",
    "go'zal", "yosh", "rivoj", "samara", "yutuq", "o'yin", "tez", "aniq",
    "klaviatura", "ekran", "tugma", "mashq", "ustoz", "shogird", "ijtimoiy", "tarmoq", "sayt",
    "aloqa", "dunyo", "mamlakat", "burch", "vijdon", "sadoqat", "ilm", "izlan", "hayot"
  ],
  en: [
    "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on",
    "with", "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we",
    "say", "her", "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
    "so", "up", "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can",
    "like", "time", "no", "just", "him", "know", "take", "people", "into", "year", "your", "good"
  ],
  ru: [
    "и", "в", "во", "не", "что", "он", "на", "я", "с", "со", "как", "а", "то", "все", "она",
    "так", "его", "но", "да", "ты", "к", "ко", "у", "же", "вы", "за", "бы", "по", "только",
    "ее", "мне", "было", "вот", "от", "ото", "меня", "еще", "нет", "о", "об", "обо", "из",
    "ему", "им", "хотя", "слово", "человек", "время", "дело", "жизнь", "рука", "работа", "место"
  ]
};

// Default highscores for realistic competitive ranking comparison
export const PRESET_LEADERBOARD: Record<TestLanguage, { name: string; avatar: string; wpm: number; accuracy: number; date: string }[]> = {
  uz: [
    { name: "Doniyor Coding", avatar: "🚀", wpm: 124, accuracy: 99, date: "2026-05-24" },
    { name: "Madina_PZ", avatar: "👩‍💻", wpm: 108, accuracy: 98, date: "2026-05-23" },
    { name: "Sherzod_Uz", avatar: "⚡", wpm: 95, accuracy: 96, date: "2026-05-25" },
    { name: "Nodira_Alimova", avatar: "🎓", wpm: 88, accuracy: 97, date: "2026-05-25" },
    { name: "Bekzod99", avatar: "🎮", wpm: 79, accuracy: 94, date: "2026-05-22" },
    { name: "Otabek_Pro", avatar: "🦁", wpm: 72, accuracy: 93, date: "2026-05-21" },
  ],
  en: [
    { name: "TypeNinja", avatar: "🥷", wpm: 135, accuracy: 99, date: "2026-05-24" },
    { name: "KeyMasher", avatar: "💥", wpm: 112, accuracy: 97, date: "2026-05-25" },
    { name: "SpeedyGonzales", avatar: "🐁", wpm: 99, accuracy: 95, date: "2026-05-23" },
    { name: "Alice_W", avatar: "🧠", wpm: 91, accuracy: 98, date: "2026-05-25" },
    { name: "ClackClack", avatar: "⌨️", wpm: 84, accuracy: 94, date: "2026-05-24" },
  ],
  ru: [
    { name: "Алексей_Тайп", avatar: "🐻", wpm: 115, accuracy: 98, date: "2026-05-24" },
    { name: "Маша_Клавиатура", avatar: "💅", wpm: 102, accuracy: 99, date: "2026-05-25" },
    { name: "Скорпио_99", avatar: "🦂", wpm: 92, accuracy: 95, date: "2026-05-22" },
    { name: "Пушкин_2026", avatar: "✍️", wpm: 81, accuracy: 97, date: "2026-05-25" },
    { name: "Дмитрий_Код", avatar: "🛡️", wpm: 74, accuracy: 93, date: "2026-05-23" },
  ]
};

// Achievement badges list
export const ACHIEVEMENTS_LIST: Badge[] = [
  {
    id: "first_test",
    title: "Yashil Chiroq",
    description: "Birinchi tezlik testini to'liq yakunlang.",
    iconName: "Zap",
    color: "from-green-500 to-emerald-600",
    unlocked: false
  },
  {
    id: "speed_50",
    title: "O'rtacha Tezkor",
    description: "Tezlikni 50 WPM (so'z daqiqasiga) va undan oshiring.",
    iconName: "Flame",
    color: "from-blue-500 to-indigo-600",
    unlocked: false
  },
  {
    id: "speed_80",
    title: "Klaviatura Ustasi",
    description: "Tezlikni 80 WPM va undan oshiring.",
    iconName: "Award",
    color: "from-purple-500 to-pink-600",
    unlocked: false
  },
  {
    id: "speed_110",
    title: "Chaqmoq Tezligi",
    description: "Dahshatli 110 WPM tezlik to'sig'ini zabt eting!",
    iconName: "Milestone",
    color: "from-red-500 to-orange-600",
    unlocked: false
  },
  {
    id: "perfectionist",
    title: "Xatosiz Shooter",
    description: "Kamida 98% aniqlik bilan testni yakunlang (kamida 30 WPM bilan).",
    iconName: "CheckCircle",
    color: "from-teal-500 to-cyan-600",
    unlocked: false
  },
  {
    id: "multilingual",
    title: "Poliglot",
    description: "Kamida ikki xil tilda test topshirib natija qayd eting.",
    iconName: "Globe2",
    color: "from-amber-500 to-yellow-600",
    unlocked: false
  },
  {
    id: "marathon",
    title: "Marafonsiz tinmas",
    description: "60 yoki 120 soniyalik testni muvaffaqiyatli yakunlang.",
    iconName: "Timer",
    color: "from-rose-500 to-red-600",
    unlocked: false
  }
];
