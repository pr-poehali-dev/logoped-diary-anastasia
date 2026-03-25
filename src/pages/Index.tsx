import { useState } from "react";
import Icon from "@/components/ui/icon";

const HERO_IMAGE = "https://cdn.poehali.dev/projects/bac66344-3379-445c-9eff-5943591085b9/files/35f7b6dd-2902-4179-9dde-0dba7b8c7aa7.jpg";

type Section = "home" | "exercises" | "games" | "tasks" | "schedule" | "reports" | "gallery" | "videos";
type Direction = "articulation" | "speech" | "motor" | "phonemic" | "school";

const DIRECTIONS: { id: Direction; label: string; emoji: string; color: string; bg: string; border: string; desc: string }[] = [
  { id: "articulation", label: "Артикуляция", emoji: "👄", color: "text-orange-700", bg: "bg-orange-100", border: "border-orange-300", desc: "Гимнастика языка и губ" },
  { id: "speech",       label: "Запуск речи",  emoji: "🗣️", color: "text-pink-700",   bg: "bg-pink-100",   border: "border-pink-300",   desc: "Стимуляция первых слов" },
  { id: "motor",        label: "Мелкая моторика", emoji: "🖐️", color: "text-green-700", bg: "bg-green-100", border: "border-green-300", desc: "Развитие ручек и пальчиков" },
  { id: "phonemic",     label: "Фонематич. слух", emoji: "👂", color: "text-blue-700",  bg: "bg-blue-100",  border: "border-blue-300",  desc: "Различение звуков речи" },
  { id: "school",       label: "Подготовка к школе", emoji: "🎒", color: "text-purple-700", bg: "bg-purple-100", border: "border-purple-300", desc: "Буквы, слоги, анализ слов" },
];

const EXERCISES_BY_DIR: Record<Direction, { title: string; desc: string; emoji: string; level: string }[]> = {
  articulation: [
    { title: "Лошадка",    desc: "Щёлканье языком — укрепляем подъязычную связку", emoji: "🐴", level: "Лёгкое" },
    { title: "Грибок",     desc: "Присасываем язык к нёбу и держим 5–10 секунд",    emoji: "🍄", level: "Среднее" },
    { title: "Варенье",    desc: "Облизываем верхнюю губу языком медленно",          emoji: "🍓", level: "Лёгкое" },
    { title: "Качели",     desc: "Поочерёдно поднимаем и опускаем язык",            emoji: "🎡", level: "Среднее" },
    { title: "Часики",     desc: "Двигаем языком влево-вправо как маятник",          emoji: "⏰", level: "Лёгкое" },
    { title: "Парус",      desc: "Напрягаем язык и поднимаем к нёбу",               emoji: "⛵", level: "Сложное" },
  ],
  speech: [
    { title: "Звукоподражание", desc: "Повторяем голоса животных: мяу, гав, му, ко-ко", emoji: "🐱", level: "Лёгкое" },
    { title: "Слоговые цепочки", desc: "Ба-ба-ба, ма-ма-ма, па-па-па ритмично",         emoji: "🔗", level: "Лёгкое" },
    { title: "Договаривай",     desc: "Начинаем фразу — ребёнок договаривает конец",     emoji: "💬", level: "Среднее" },
    { title: "Комментирование", desc: "Называем всё, что делает ребёнок в игре",         emoji: "📢", level: "Лёгкое" },
    { title: "Выбор из двух",   desc: "«Дай мне кошку или собаку?» — стимул к речи",    emoji: "🤔", level: "Среднее" },
    { title: "Жестовое общение",desc: "Учим базовые жесты: дай, на, ещё, нет, да",       emoji: "🤲", level: "Лёгкое" },
  ],
  motor: [
    { title: "Пальчиковая гимнастика", desc: "«Сорока-ворона», «Этот пальчик» и другие", emoji: "🖐️", level: "Лёгкое" },
    { title: "Шнуровка",    desc: "Продеваем шнурок в отверстия карточки",            emoji: "🪢", level: "Среднее" },
    { title: "Прищепки",    desc: "Цепляем прищепки по контуру — развиваем хват",    emoji: "🔧", level: "Среднее" },
    { title: "Лепка",       desc: "Мнём, раскатываем, щиплём пластилин",             emoji: "🫙", level: "Лёгкое" },
    { title: "Пересыпание", desc: "Ложкой перекладываем крупу из чашки в чашку",    emoji: "🫘", level: "Лёгкое" },
    { title: "Массажный мячик", desc: "Катаем мячик-ёжик между ладонями",            emoji: "🔴", level: "Лёгкое" },
  ],
  phonemic: [
    { title: "Хлопни на звук", desc: "Хлопай, когда услышишь звук [А] в словах",   emoji: "👏", level: "Лёгкое" },
    { title: "Звуковое лото",  desc: "Находим картинки с нужным первым звуком",     emoji: "🎲", level: "Среднее" },
    { title: "Тихо-громко",    desc: "Различаем тихое и громкое произнесение слов", emoji: "🔊", level: "Лёгкое" },
    { title: "Рифмы",          desc: "Подбираем рифмующиеся слова: дом-ком-лом",   emoji: "🎵", level: "Среднее" },
    { title: "Похожие слова",  desc: "Различаем: коса-коза, мышка-мишка, рак-лак", emoji: "👂", level: "Сложное" },
    { title: "Цепочка звуков", desc: "Воспроизводим ряд звуков в правильном порядке", emoji: "🔗", level: "Сложное" },
  ],
  school: [
    { title: "Буквы из пластилина", desc: "Лепим буквы, называем и обводим пальцем",   emoji: "🅰️", level: "Лёгкое" },
    { title: "Слоговое деление",    desc: "Хлопаем на каждый слог в слове: ма-ши-на", emoji: "✋", level: "Среднее" },
    { title: "Первый звук",         desc: "«Какой первый звук в слове КОТ?» — [К]!",  emoji: "🔤", level: "Среднее" },
    { title: "Штриховка",           desc: "Штрихуем буквы и фигуры не выходя за края", emoji: "✏️", level: "Лёгкое" },
    { title: "Слово из звуков",     desc: "Составляем слово из отдельных звуков",      emoji: "🧩", level: "Сложное" },
    { title: "Чтение слогов",       desc: "Читаем открытые слоги: МА, ПА, ЛА, СА",   emoji: "📖", level: "Сложное" },
  ],
};

const GAMES_BY_DIR: Record<Direction, { title: string; desc: string; emoji: string; age: string; color: string }[]> = {
  articulation: [
    { title: "Зеркало логопеда", desc: "Повторяй позы языка глядя в зеркало", emoji: "🪞", age: "3–6 лет", color: "from-orange-300 to-yellow-300" },
    { title: "Артикуляшки",      desc: "Карточки с картинками упражнений",    emoji: "🃏", age: "4–6 лет", color: "from-pink-300 to-orange-300" },
    { title: "Надуй пузырь",     desc: "Дуй в трубочку и надувай щёки",       emoji: "🫧", age: "3–5 лет", color: "from-yellow-300 to-green-300" },
  ],
  speech: [
    { title: "Весёлый поезд",    desc: "Произноси звуки как гудок паровоза",  emoji: "🚂", age: "2–4 года", color: "from-green-300 to-teal-300" },
    { title: "Кто как говорит",  desc: "Угадай животное по звукоподражанию",  emoji: "🐾", age: "2–4 года", color: "from-teal-300 to-blue-300" },
    { title: "Договори словечко",desc: "Начинаю фразу из сказки — ты заканчивай", emoji: "📕", age: "3–5 лет", color: "from-pink-300 to-rose-300" },
  ],
  motor: [
    { title: "Театр на пальчиках", desc: "Разыгрываем сказку пальчиками руки",  emoji: "🎭", age: "3–6 лет", color: "from-purple-300 to-pink-300" },
    { title: "Мозаика",            desc: "Собираем узор из мелких деталей",      emoji: "🔮", age: "4–6 лет", color: "from-blue-300 to-purple-300" },
    { title: "Крышки-сортировка",  desc: "Сортируем крышки по цвету и размеру", emoji: "🔵", age: "3–5 лет", color: "from-cyan-300 to-blue-300" },
  ],
  phonemic: [
    { title: "Звуковое эхо",  desc: "Повторяй цепочку звуков вслед за мной",  emoji: "🏔️", age: "4–6 лет", color: "from-blue-300 to-purple-300" },
    { title: "Угадай слово",  desc: "По первому звуку угадай слово на картинке", emoji: "🔍", age: "5–6 лет", color: "from-indigo-300 to-blue-300" },
    { title: "Поймай звук",   desc: "Хлопни в ладоши, услышав нужный звук",   emoji: "👏", age: "4–6 лет", color: "from-sky-300 to-cyan-300" },
  ],
  school: [
    { title: "Азбука в картинках", desc: "Каждой букве — своя смешная картинка", emoji: "📚", age: "5–7 лет", color: "from-purple-300 to-pink-300" },
    { title: "Слоговые домики",    desc: "Раскладываем картинки по домикам-слогам", emoji: "🏠", age: "6–7 лет", color: "from-rose-300 to-orange-300" },
    { title: "Буквенное лото",     desc: "Закрываем буквы фишками — называем",    emoji: "🎯", age: "6–7 лет", color: "from-green-300 to-teal-300" },
  ],
};

type VideoLesson = { title: string; subtitle: string; dir: Direction; duration: string; emoji: string; qr: string; url?: string; color: string; cardBg: string };

const VIDEO_LESSONS: VideoLesson[] = [
  {
    title: "Артикуляционная гимнастика",
    subtitle: "5 базовых упражнений для малышей",
    dir: "articulation" as Direction,
    duration: "7 мин",
    emoji: "👄",
    qr: "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://youtube.com/watch?v=articulation_demo&color=f97316&bgcolor=fff7ed",
    color: "from-orange-400 to-yellow-400",
    cardBg: "bg-orange-50 border-orange-200",
  },
  {
    title: "Запуск речи у малышей",
    subtitle: "Игры и приёмы для неговорящих детей",
    dir: "speech" as Direction,
    duration: "12 мин",
    emoji: "🗣️",
    qr: "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://rutube.ru/video/private/94ea3a79ac07baefd225dcfea2d4109c/?p=5Dwm0s09OSSy8dy4ONudnQ&color=ec4899&bgcolor=fdf2f8",
    url: "https://rutube.ru/video/private/94ea3a79ac07baefd225dcfea2d4109c/?p=5Dwm0s09OSSy8dy4ONudnQ",
    color: "from-pink-400 to-rose-400",
    cardBg: "bg-pink-50 border-pink-200",
  },
  {
    title: "Мелкая моторика дома",
    subtitle: "Пальчиковые игры без специальных пособий",
    dir: "motor" as Direction,
    duration: "9 мин",
    emoji: "🖐️",
    qr: "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://youtube.com/watch?v=fine_motor&color=22c55e&bgcolor=f0fdf4",
    color: "from-green-400 to-teal-400",
    cardBg: "bg-green-50 border-green-200",
  },
  {
    title: "Фонематический слух",
    subtitle: "Учим различать похожие звуки: играем!",
    dir: "phonemic" as Direction,
    duration: "8 мин",
    emoji: "👂",
    qr: "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://youtube.com/watch?v=phonemic_hearing&color=3b82f6&bgcolor=eff6ff",
    color: "from-blue-400 to-indigo-400",
    cardBg: "bg-blue-50 border-blue-200",
  },
  {
    title: "Подготовка к школе",
    subtitle: "Звуковой анализ слова, чтение слогов",
    dir: "school" as Direction,
    duration: "15 мин",
    emoji: "🎒",
    qr: "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://youtube.com/watch?v=school_prep&color=a855f7&bgcolor=faf5ff",
    color: "from-purple-400 to-violet-400",
    cardBg: "bg-purple-50 border-purple-200",
  },
  {
    title: "Полное занятие — Звук [Р]",
    subtitle: "Постановка и автоматизация сложного звука",
    dir: "articulation" as Direction,
    duration: "20 мин",
    emoji: "🦁",
    qr: "https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=https://youtube.com/watch?v=sound_r_lesson&color=f97316&bgcolor=fff7ed",
    color: "from-red-400 to-orange-400",
    cardBg: "bg-red-50 border-red-200",
  },
];

const NAV_ITEMS = [
  { id: "home"      as Section, label: "Главная",    emoji: "🏠", color: "bg-pink-400" },
  { id: "exercises" as Section, label: "Упражнения", emoji: "👄", color: "bg-orange-400" },
  { id: "games"     as Section, label: "Игры",       emoji: "🎮", color: "bg-yellow-400" },
  { id: "videos"    as Section, label: "Видео",      emoji: "📹", color: "bg-red-400" },
  { id: "tasks"     as Section, label: "Задания",    emoji: "📝", color: "bg-green-400" },
  { id: "schedule"  as Section, label: "Расписание", emoji: "📅", color: "bg-blue-400" },
  { id: "reports"   as Section, label: "Отчёты",     emoji: "📊", color: "bg-purple-400" },
  { id: "gallery"   as Section, label: "Галерея",    emoji: "🖼️", color: "bg-rose-400" },
];

const TASKS = [
  { student: "Маша К.",  task: "Повторить звук [Р] — карточки 1–5",   due: "25 марта", done: true,  emoji: "👧" },
  { student: "Вася П.",  task: "Стихи на звук [Ш] — выучить 2 строфы", due: "26 марта", done: false, emoji: "👦" },
  { student: "Аня С.",   task: "Дыхательная гимнастика — 5 минут",     due: "25 марта", done: true,  emoji: "👧" },
  { student: "Дима В.",  task: "Скороговорки на звук [Ц]",             due: "27 марта", done: false, emoji: "👦" },
  { student: "Оля Т.",   task: "Лепка букв из пластилина",             due: "28 марта", done: false, emoji: "👧" },
];

const SCHEDULE = [
  { time: "09:00", name: "Маша К.",  theme: "Автоматизация [Р]",      color: "border-l-pink-400 bg-pink-50" },
  { time: "09:30", name: "Вася П.",  theme: "Постановка [Ш]",         color: "border-l-blue-400 bg-blue-50" },
  { time: "10:00", name: "Аня С.",   theme: "Дыхательная гимнастика", color: "border-l-green-400 bg-green-50" },
  { time: "10:30", name: "Дима В.",  theme: "Дифференциация [С]-[З]", color: "border-l-yellow-400 bg-yellow-50" },
  { time: "11:00", name: "Оля Т.",   theme: "Развитие фонематики",    color: "border-l-purple-400 bg-purple-50" },
  { time: "11:30", name: "Коля Н.",  theme: "Звуко-буквенный анализ", color: "border-l-orange-400 bg-orange-50" },
];

const REPORTS = [
  { month: "Март 2026",    students: 8, sessions: 24, progress: 87, trend: "+12%", color: "bg-gradient-to-br from-purple-400 to-pink-400" },
  { month: "Февраль 2026", students: 8, sessions: 22, progress: 75, trend: "+8%",  color: "bg-gradient-to-br from-blue-400 to-purple-400" },
  { month: "Январь 2026",  students: 7, sessions: 20, progress: 67, trend: "+5%",  color: "bg-gradient-to-br from-green-400 to-teal-400" },
];

const GALLERY_ITEMS = [
  { title: "Артикуляционная гимнастика", date: "20 марта", emoji: "🤸", color: "bg-gradient-to-br from-pink-200 to-orange-200" },
  { title: "Игра с кубиками-буквами",    date: "18 марта", emoji: "🔤", color: "bg-gradient-to-br from-yellow-200 to-green-200" },
  { title: "Дыхательная гимнастика",     date: "15 марта", emoji: "🌬️", color: "bg-gradient-to-br from-blue-200 to-purple-200" },
  { title: "Занятие со звуком [Р]",      date: "12 марта", emoji: "🦁", color: "bg-gradient-to-br from-orange-200 to-red-200" },
  { title: "Логопедический массаж",      date: "10 марта", emoji: "🖐️", color: "bg-gradient-to-br from-green-200 to-teal-200" },
  { title: "Театр на пальчиках",         date: "7 марта",  emoji: "🎭", color: "bg-gradient-to-br from-purple-200 to-pink-200" },
];

const WEEK_SCHEDULE = [
  { day: "Пн", slots: ["Маша К.", "Вася П.", "Аня С."] },
  { day: "Вт", slots: ["Дима В.", "Оля Т."] },
  { day: "Ср", slots: ["Маша К.", "Коля Н.", "Вася П.", "Аня С."] },
  { day: "Чт", slots: ["Дима В.", "Оля Т.", "Коля Н."] },
  { day: "Пт", slots: ["Маша К.", "Аня С."] },
];

const COLORS_WEEK = [
  "bg-pink-200 text-pink-800",
  "bg-blue-200 text-blue-800",
  "bg-green-200 text-green-800",
  "bg-yellow-200 text-yellow-800",
  "bg-purple-200 text-purple-800",
  "bg-orange-200 text-orange-800",
];

function SectionHeader({ emoji, title, subtitle, color }: { emoji: string; title: string; subtitle: string; color: string }) {
  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-2">
        <div className="text-5xl animate-float">{emoji}</div>
        <div>
          <h1 className={`font-caveat text-3xl md:text-4xl font-bold ${color}`}>{title}</h1>
          <p className="text-gray-500 text-sm font-semibold">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

function DirectionTabs({ active, onChange }: { active: Direction; onChange: (d: Direction) => void }) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {DIRECTIONS.map((d) => (
        <button
          key={d.id}
          onClick={() => onChange(d.id)}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-sm font-bold border-2 transition-all duration-200 ${
            active === d.id
              ? `${d.bg} ${d.border} ${d.color} shadow-md scale-105`
              : "bg-white/70 border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-white"
          }`}
        >
          <span>{d.emoji}</span>
          <span>{d.label}</span>
        </button>
      ))}
    </div>
  );
}

export default function Index() {
  const [active, setActive] = useState<Section>("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [exDir, setExDir] = useState<Direction>("articulation");
  const [gameDir, setGameDir] = useState<Direction>("articulation");
  const [qrOpen, setQrOpen] = useState<number | null>(null);

  const currentDir = DIRECTIONS.find(d => d.id === exDir)!;
  const currentGameDir = DIRECTIONS.find(d => d.id === gameDir)!;

  return (
    <div className="min-h-screen font-nunito" style={{ background: "linear-gradient(135deg, #fff9e6 0%, #fce7f3 50%, #ede9fe 100%)" }}>
      {/* Floating decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-10 left-8 text-5xl animate-float opacity-20">⭐</div>
        <div className="absolute top-32 right-12 text-4xl animate-float opacity-20" style={{ animationDelay: "1s" }}>🌟</div>
        <div className="absolute bottom-20 left-16 text-4xl animate-float opacity-20" style={{ animationDelay: "2s" }}>✨</div>
        <div className="absolute bottom-40 right-20 text-5xl animate-float opacity-20" style={{ animationDelay: "0.5s" }}>🌈</div>
        <div className="absolute top-1/2 left-4 text-3xl animate-float opacity-15" style={{ animationDelay: "1.5s" }}>💫</div>
      </div>

      {/* Header */}
      <header className="relative z-10 sticky top-0" style={{ background: "rgba(255,255,255,0.88)", backdropFilter: "blur(16px)", borderBottom: "3px solid #f9a8d4" }}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center text-2xl shadow-lg">🦋</div>
            <div>
              <div className="font-caveat text-2xl font-bold text-purple-700 leading-tight">Анастасия Романовна</div>
              <div className="text-xs text-pink-500 font-semibold tracking-wide uppercase">Дневник логопеда</div>
            </div>
          </div>
          <nav className="hidden xl:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => setActive(item.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-bold transition-all duration-200 ${
                  active === item.id ? `${item.color} text-white shadow-md scale-105` : "text-gray-600 hover:bg-white hover:shadow-sm hover:scale-105"
                }`}
              >
                <span>{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
          <button className="xl:hidden w-10 h-10 rounded-xl bg-pink-100 flex items-center justify-center" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={20} className="text-pink-600" />
          </button>
        </div>
        {menuOpen && (
          <div className="xl:hidden bg-white border-t border-pink-100 px-4 py-3 grid grid-cols-4 gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => { setActive(item.id); setMenuOpen(false); }}
                className={`flex flex-col items-center gap-1 p-2 rounded-xl text-xs font-bold transition-all ${
                  active === item.id ? `${item.color} text-white` : "bg-gray-50 text-gray-600"
                }`}
              >
                <span className="text-xl">{item.emoji}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </header>

      {/* QR Modal */}
      {qrOpen !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={() => setQrOpen(null)}>
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full animate-bounce-in" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <div className="text-3xl mb-1">{VIDEO_LESSONS[qrOpen].emoji}</div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">{VIDEO_LESSONS[qrOpen].title}</h3>
                <p className="text-sm text-gray-500 mt-1">{VIDEO_LESSONS[qrOpen].subtitle}</p>
              </div>
              <button onClick={() => setQrOpen(null)} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors ml-2 flex-shrink-0">
                <Icon name="X" size={16} className="text-gray-600" />
              </button>
            </div>
            <div className="flex justify-center mb-4">
              <div className={`p-3 rounded-2xl bg-gradient-to-br ${VIDEO_LESSONS[qrOpen].color}`}>
                <img
                  src={VIDEO_LESSONS[qrOpen].qr}
                  alt="QR-код"
                  className="w-40 h-40 rounded-xl"
                />
              </div>
            </div>
            <p className="text-center text-sm text-gray-500 font-semibold">Наведи камеру телефона на QR-код, чтобы открыть видео</p>
            <div className="mt-3 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Icon name="Clock" size={12} />
              <span>Длительность: {VIDEO_LESSONS[qrOpen].duration}</span>
            </div>
            {VIDEO_LESSONS[qrOpen].url && (
              <a
                href={VIDEO_LESSONS[qrOpen].url}
                target="_blank"
                rel="noopener noreferrer"
                className={`mt-4 w-full py-3 rounded-2xl bg-gradient-to-r ${VIDEO_LESSONS[qrOpen].color} text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity shadow-md`}
              >
                <Icon name="Play" size={16} />
                Открыть на Рутубе
              </a>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 py-8">

        {/* HOME */}
        {active === "home" && (
          <div className="animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden mb-8 shadow-2xl" style={{ background: "linear-gradient(135deg, #f9a8d4, #c084fc, #818cf8)" }}>
              <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 80%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
              <div className="relative flex flex-col md:flex-row items-center gap-6 p-8">
                <div className="flex-1 text-white">
                  <div className="inline-block bg-white/20 rounded-full px-4 py-1 text-sm font-bold mb-4 backdrop-blur-sm">🌟 Дошкольное образование</div>
                  <h1 className="font-caveat text-4xl md:text-5xl font-bold mb-3 leading-tight">Дневник<br/>логопеда</h1>
                  <p className="text-white/90 text-lg font-semibold mb-6">Упражнения, игры и задания<br/>для маленьких говорунов! 🗣️</p>
                  <div className="flex flex-wrap gap-3">
                    {[{ label: "8 детей", icon: "👶" }, { label: "24 занятия", icon: "📚" }, { label: "87% прогресс", icon: "🚀" }].map((stat) => (
                      <div key={stat.label} className="bg-white/20 backdrop-blur-sm rounded-2xl px-4 py-2 font-bold text-sm">{stat.icon} {stat.label}</div>
                    ))}
                  </div>
                </div>
                <div className="w-56 h-56 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/40 flex-shrink-0 animate-bounce-in">
                  <img src={HERO_IMAGE} alt="Логопед" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>

            {/* Directions */}
            <h2 className="font-caveat text-3xl font-bold text-purple-700 mb-4">Направления работы 🎯</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-8">
              {DIRECTIONS.map((d, i) => (
                <button
                  key={d.id}
                  onClick={() => { setExDir(d.id); setActive("exercises"); }}
                  className={`group rounded-3xl p-4 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl ${d.bg} border-2 ${d.border} shadow-sm animate-fade-in`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className="text-4xl mb-2 group-hover:animate-wiggle inline-block">{d.emoji}</div>
                  <div className={`font-bold text-sm ${d.color}`}>{d.label}</div>
                  <div className="text-xs text-gray-500 mt-1 leading-tight">{d.desc}</div>
                </button>
              ))}
            </div>

            <h2 className="font-caveat text-3xl font-bold text-purple-700 mb-4">Быстрый доступ ✨</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {NAV_ITEMS.filter(n => n.id !== "home").map((item, i) => (
                <button
                  key={item.id}
                  onClick={() => setActive(item.id)}
                  className="group relative rounded-3xl p-5 text-left transition-all duration-300 hover:scale-105 hover:shadow-xl bg-white/70 backdrop-blur-sm border-2 border-white shadow-md animate-fade-in"
                  style={{ animationDelay: `${i * 0.06}s` }}
                >
                  <div className={`w-11 h-11 rounded-2xl ${item.color} flex items-center justify-center text-xl mb-2 shadow-md group-hover:scale-110 transition-transform`}>{item.emoji}</div>
                  <div className="font-bold text-gray-800 text-sm">{item.label}</div>
                </button>
              ))}
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border-2 border-yellow-200 shadow-lg">
              <h3 className="font-caveat text-2xl font-bold text-yellow-700 mb-4">📅 Сегодня, 25 марта</h3>
              <div className="grid md:grid-cols-2 gap-3">
                {SCHEDULE.slice(0, 4).map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl border-l-4 ${item.color}`}>
                    <div className="font-bold text-gray-500 text-sm w-12">{item.time}</div>
                    <div>
                      <div className="font-bold text-gray-800 text-sm">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.theme}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* EXERCISES */}
        {active === "exercises" && (
          <div className="animate-fade-in">
            <SectionHeader emoji="👄" title="Упражнения" subtitle="Выбери направление и занимайся!" color="text-orange-600" />
            <DirectionTabs active={exDir} onChange={setExDir} />
            <div className={`flex items-center gap-3 mb-5 px-4 py-3 rounded-2xl border-2 ${currentDir.bg} ${currentDir.border}`}>
              <span className="text-3xl">{currentDir.emoji}</span>
              <div>
                <div className={`font-bold text-base ${currentDir.color}`}>{currentDir.label}</div>
                <div className="text-xs text-gray-500">{currentDir.desc}</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {EXERCISES_BY_DIR[exDir].map((ex, i) => (
                <div
                  key={i}
                  className={`group rounded-3xl p-6 border-2 ${currentDir.bg} ${currentDir.border} bg-white/80 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-105 animate-fade-in`}
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  <div className="text-5xl mb-4 group-hover:animate-wiggle inline-block">{ex.emoji}</div>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-xl text-gray-800">{ex.title}</h3>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                      ex.level === "Лёгкое" ? "bg-green-200 text-green-700" :
                      ex.level === "Среднее" ? "bg-yellow-200 text-yellow-700" : "bg-red-200 text-red-700"
                    }`}>{ex.level}</span>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{ex.desc}</p>
                  <button className={`mt-4 w-full py-2 rounded-2xl ${currentDir.bg.replace("100","400").replace("bg-","bg-")} ${currentDir.color.replace("700","900")} font-bold text-sm transition-opacity hover:opacity-80 shadow-sm border ${currentDir.border}`}>
                    Начать упражнение →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GAMES */}
        {active === "games" && (
          <div className="animate-fade-in">
            <SectionHeader emoji="🎮" title="Логопедические игры" subtitle="Играем и учимся говорить правильно!" color="text-yellow-600" />
            <DirectionTabs active={gameDir} onChange={setGameDir} />
            <div className={`flex items-center gap-3 mb-5 px-4 py-3 rounded-2xl border-2 ${currentGameDir.bg} ${currentGameDir.border}`}>
              <span className="text-3xl">{currentGameDir.emoji}</span>
              <div>
                <div className={`font-bold text-base ${currentGameDir.color}`}>{currentGameDir.label}</div>
                <div className="text-xs text-gray-500">{currentGameDir.desc}</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {GAMES_BY_DIR[gameDir].map((game, i) => (
                <div
                  key={i}
                  className="group rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-bounce-in"
                  style={{ animationDelay: `${i * 0.08}s` }}
                >
                  <div className={`bg-gradient-to-br ${game.color} p-10 flex items-center justify-center`}>
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300 inline-block">{game.emoji}</span>
                  </div>
                  <div className="bg-white/90 p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-lg text-gray-800">{game.title}</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-full">{game.age}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{game.desc}</p>
                    <button className="w-full py-2 rounded-2xl bg-gradient-to-r from-yellow-400 to-orange-400 text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-sm">
                      Играть! 🎉
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEOS */}
        {active === "videos" && (
          <div className="animate-fade-in">
            <SectionHeader emoji="📹" title="Видеозанятия" subtitle="Сканируй QR-код и смотри занятие на телефоне!" color="text-red-600" />
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200 rounded-3xl p-5 mb-6 flex items-start gap-4">
              <div className="text-3xl">📱</div>
              <div>
                <div className="font-bold text-red-700 mb-1">Как использовать QR-коды?</div>
                <div className="text-sm text-gray-600">Откройте камеру телефона, наведите на QR-код — видео откроется автоматически. Можно смотреть дома с ребёнком или распечатать карточку.</div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {VIDEO_LESSONS.map((video, i) => {
                const dir = DIRECTIONS.find(d => d.id === video.dir)!;
                return (
                  <div
                    key={i}
                    className={`group rounded-3xl border-2 ${video.cardBg} overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in`}
                    style={{ animationDelay: `${i * 0.08}s` }}
                  >
                    {/* Top gradient strip */}
                    <div className={`h-2 bg-gradient-to-r ${video.color}`} />
                    <div className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <span className={`text-xs font-bold px-2 py-1 rounded-full ${dir.bg} ${dir.color} border ${dir.border}`}>
                            {dir.emoji} {dir.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 font-semibold">
                          <Icon name="Clock" size={12} />
                          {video.duration}
                        </div>
                      </div>
                      <div className="text-3xl mb-2">{video.emoji}</div>
                      <h3 className="font-bold text-gray-800 text-base mb-1">{video.title}</h3>
                      <p className="text-xs text-gray-500 mb-4 leading-relaxed">{video.subtitle}</p>

                      {/* QR preview */}
                      <div
                        className="flex items-center gap-3 cursor-pointer group/qr"
                        onClick={() => setQrOpen(i)}
                      >
                        <div className={`rounded-2xl p-1.5 bg-gradient-to-br ${video.color} shadow-md group-hover/qr:scale-110 transition-transform`}>
                          <img src={video.qr} alt="QR" className="w-14 h-14 rounded-xl block" />
                        </div>
                        <div>
                          <div className="font-bold text-gray-700 text-sm">QR-код урока</div>
                          <div className="text-xs text-gray-400">Нажми для увеличения</div>
                          <div className="flex items-center gap-1 text-xs text-blue-500 font-semibold mt-1 group-hover/qr:underline">
                            <Icon name="ZoomIn" size={12} />
                            Открыть
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => setQrOpen(i)}
                          className={`flex-1 py-2.5 rounded-2xl bg-gradient-to-r ${video.color} text-white font-bold text-sm hover:opacity-90 transition-opacity shadow-sm flex items-center justify-center gap-2`}
                        >
                          <Icon name="QrCode" size={16} />
                          QR-код
                        </button>
                        {video.url && (
                          <a
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 rounded-2xl bg-white border-2 border-gray-200 text-gray-700 font-bold text-sm hover:border-gray-300 hover:shadow-sm transition-all flex items-center justify-center gap-2"
                          >
                            <Icon name="Play" size={16} />
                            Смотреть
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TASKS */}
        {active === "tasks" && (
          <div className="animate-fade-in">
            <SectionHeader emoji="📝" title="Домашние задания" subtitle="Задания для самостоятельной работы дома" color="text-green-600" />
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-green-100 mb-6">
              <div className="flex items-center justify-between mb-5">
                <div className="font-bold text-gray-700">Задания на неделю</div>
                <button className="flex items-center gap-2 bg-green-400 text-white px-4 py-2 rounded-2xl text-sm font-bold hover:bg-green-500 transition-colors shadow-sm">
                  <Icon name="Plus" size={16} />
                  Добавить задание
                </button>
              </div>
              <div className="space-y-3">
                {TASKS.map((task, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-200 animate-fade-in ${
                      task.done ? "bg-green-50 border-green-200" : "bg-white border-gray-100 hover:border-green-200"
                    }`}
                    style={{ animationDelay: `${i * 0.07}s` }}
                  >
                    <div className="text-3xl">{task.emoji}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-800">{task.student}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${task.done ? "bg-green-200 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {task.done ? "✅ Выполнено" : "⏳ В работе"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">{task.task}</div>
                    </div>
                    <div className="text-xs text-gray-400 font-semibold">{task.due}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Всего заданий", value: TASKS.length,                          color: "bg-blue-100 text-blue-700",   emoji: "📋" },
                { label: "Выполнено",     value: TASKS.filter(t => t.done).length,      color: "bg-green-100 text-green-700", emoji: "✅" },
                { label: "В работе",      value: TASKS.filter(t => !t.done).length,     color: "bg-yellow-100 text-yellow-700", emoji: "⏳" },
              ].map((stat, i) => (
                <div key={i} className={`${stat.color} rounded-2xl p-4 text-center`}>
                  <div className="text-3xl mb-1">{stat.emoji}</div>
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-xs font-semibold opacity-80">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SCHEDULE */}
        {active === "schedule" && (
          <div className="animate-fade-in">
            <SectionHeader emoji="📅" title="Расписание занятий" subtitle="График работы с дошколятами" color="text-blue-600" />
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-blue-100 mb-6">
              <h3 className="font-bold text-gray-700 mb-4 text-lg">Неделя 24–28 марта 2026</h3>
              <div className="grid grid-cols-5 gap-3">
                {WEEK_SCHEDULE.map((day, di) => (
                  <div key={di} className="text-center">
                    <div className={`font-bold text-sm py-2 px-1 rounded-xl mb-2 ${di === 0 ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600"}`}>{day.day}</div>
                    <div className="space-y-1.5">
                      {day.slots.map((slot, si) => (
                        <div key={si} className={`text-xs font-semibold py-1.5 px-2 rounded-xl ${COLORS_WEEK[si % COLORS_WEEK.length]}`}>{slot}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <h3 className="font-caveat text-2xl font-bold text-blue-700 mb-4">Сегодня подробно 🕐</h3>
            <div className="space-y-3">
              {SCHEDULE.map((item, i) => (
                <div key={i} className={`flex items-center gap-4 p-4 rounded-2xl border-l-4 shadow-sm hover:shadow-md transition-all animate-fade-in ${item.color}`} style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="font-bold text-gray-500 w-14 text-sm">{item.time}</div>
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-bold text-gray-700 text-sm">
                    {item.name.split(" ")[0][0]}{item.name.split(" ")[1]?.[0]}
                  </div>
                  <div className="flex-1">
                    <div className="font-bold text-gray-800">{item.name}</div>
                    <div className="text-sm text-gray-500">{item.theme}</div>
                  </div>
                  <button className="text-xs bg-white rounded-xl px-3 py-1.5 font-bold text-gray-600 hover:shadow-md transition-shadow">Подробнее</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* REPORTS */}
        {active === "reports" && (
          <div className="animate-fade-in">
            <SectionHeader emoji="📊" title="Отчёты и прогресс" subtitle="Результаты работы с каждым ребёнком" color="text-purple-600" />
            <div className="grid md:grid-cols-3 gap-5 mb-8">
              {REPORTS.map((rep, i) => (
                <div key={i} className={`${rep.color} rounded-3xl p-6 text-white shadow-xl animate-bounce-in`} style={{ animationDelay: `${i * 0.1}s` }}>
                  <div className="text-lg font-bold mb-4 opacity-90">{rep.month}</div>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-white/20 rounded-2xl p-3 text-center"><div className="text-2xl font-bold">{rep.students}</div><div className="text-xs opacity-80">детей</div></div>
                    <div className="bg-white/20 rounded-2xl p-3 text-center"><div className="text-2xl font-bold">{rep.sessions}</div><div className="text-xs opacity-80">занятий</div></div>
                  </div>
                  <div className="bg-white/20 rounded-2xl p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold">Прогресс</span>
                      <span className="text-sm font-bold">{rep.progress}% {rep.trend}</span>
                    </div>
                    <div className="bg-white/20 rounded-full h-2.5">
                      <div className="bg-white rounded-full h-2.5" style={{ width: `${rep.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-lg border-2 border-purple-100">
              <h3 className="font-bold text-gray-700 text-lg mb-5">Прогресс по детям</h3>
              <div className="space-y-4">
                {[
                  { name: "Маша К.",  emoji: "👧", progress: 92, sound: "[Р]", color: "bg-pink-400" },
                  { name: "Вася П.",  emoji: "👦", progress: 78, sound: "[Ш]", color: "bg-blue-400" },
                  { name: "Аня С.",   emoji: "👧", progress: 85, sound: "[Л]", color: "bg-green-400" },
                  { name: "Дима В.",  emoji: "👦", progress: 65, sound: "[Ц]", color: "bg-yellow-400" },
                  { name: "Оля Т.",   emoji: "👧", progress: 70, sound: "[З]", color: "bg-purple-400" },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
                    <span className="text-2xl">{s.emoji}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-800 text-sm">{s.name}</span>
                        <span className="text-xs bg-gray-100 rounded-full px-2 py-0.5 text-gray-500 font-semibold">{s.sound}</span>
                        <span className="font-bold text-gray-700 text-sm">{s.progress}%</span>
                      </div>
                      <div className="bg-gray-100 rounded-full h-3">
                        <div className={`${s.color} rounded-full h-3`} style={{ width: `${s.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GALLERY */}
        {active === "gallery" && (
          <div className="animate-fade-in">
            <SectionHeader emoji="🖼️" title="Фотогалерея" subtitle="Наши занятия в фотографиях" color="text-rose-600" />
            <div className="flex gap-3 mb-6 flex-wrap">
              {["Все", "Март 2026", "Февраль 2026", "Январь 2026"].map((filter) => (
                <button key={filter} className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all ${filter === "Все" ? "bg-rose-400 text-white shadow-md" : "bg-white/70 text-gray-600 hover:bg-rose-100 hover:text-rose-600"}`}>{filter}</button>
              ))}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              {GALLERY_ITEMS.map((item, i) => (
                <div key={i} className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-bounce-in cursor-pointer" style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className={`${item.color} h-44 flex items-center justify-center`}>
                    <span className="text-7xl group-hover:scale-110 transition-transform duration-300 inline-block">{item.emoji}</span>
                  </div>
                  <div className="bg-white/90 p-4">
                    <div className="font-bold text-gray-800 text-sm mb-1">{item.title}</div>
                    <div className="text-xs text-gray-400 flex items-center gap-1"><Icon name="Calendar" size={12} />{item.date}</div>
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-3xl flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white rounded-full p-3 shadow-lg">
                      <Icon name="ZoomIn" size={20} className="text-gray-700" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-4 rounded-3xl text-rose-500 font-bold text-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2" style={{ border: "3px dashed #fda4af" }}>
              <Icon name="Upload" size={18} />
              Загрузить фото или видео
            </button>
          </div>
        )}

      </main>

      {/* Bottom nav mobile */}
      <nav className="xl:hidden fixed bottom-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-md border-t-2 border-pink-100 px-2 py-2">
        <div className="flex justify-around">
          {NAV_ITEMS.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => setActive(item.id)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-2xl transition-all ${active === item.id ? `${item.color} text-white scale-110` : "text-gray-400"}`}
            >
              <span className="text-lg">{item.emoji}</span>
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
      <div className="h-20 xl:h-0" />
    </div>
  );
}