import { useState, useEffect } from "react";
import {
  Sparkles,
  Check,
  Clock,
  RotateCcw,
  Plus,
  X,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  Undo2,
  Home,
  CalendarDays,
  LogOut,
  Settings,
  Pencil,
  Trash2,
  Flame,
} from "lucide-react";

const GLOBAL_STYLE = `
@import url('https://fonts.googleapis.com/css2?family=Gaegu:wght@400;700&family=Gowun+Dodum&family=IBM+Plex+Sans+KR:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500&display=swap');
@keyframes planCardIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes popIn { from { opacity: 0; transform: scale(0.85); } to { opacity: 1; transform: scale(1); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes berryFloat { 0%,100% { transform: translateY(0) rotate(-4deg); } 50% { transform: translateY(-4px) rotate(2deg); } }
@keyframes softPulse { 0%,100% { transform: scale(1); } 50% { transform: scale(1.035); } }
@keyframes ribbonSway { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
.pretty-card { position: relative; box-shadow: 0 8px 24px -18px rgba(112,73,70,.45); }
.pretty-card::after { content:''; }
.gingham { background-image:none; }
button { -webkit-tap-highlight-color: transparent; }
button:active { transform: scale(.98); }
* { box-sizing: border-box; }
button, input, select { font-family: inherit; }
::-webkit-scrollbar { width: 0; height: 0; }

/* Pencil-doodle icon treatment: preserves every button/action while making
   the existing SVG icon set feel hand-drawn instead of like phone emoji. */
svg.lucide { stroke:#9A7772; stroke-width:1.55; filter:drop-shadow(.25px .35px 0 rgba(168,144,120,.20)); }

`;

const LIGHT_COLORS = {
  page: "#FBECEF",
  paper: "#FFF7F8",
  card: "#FFFBFC",
  ruleLine: "#EED9DE",
  ink: "#574443",
  muted: "#A18480",
  yellow: "#F4D58D",
  coral: "#E8A7B2",
  mint: "#A9C7B2",
  strawberry: "#D98795",
  leaf: "#8EAF8F",
};
const DARK_COLORS = {
  page: "#221720",
  paper: "#2C1E29",
  card: "#3A2733",
  ruleLine: "#4A3540",
  ink: "#FDEDF1",
  muted: "#C79FB0",
  yellow: "#FFD166",
  coral: "#FF8080",
  mint: "#3BD6C6",
};

const RANK_LABELS = ["1순위", "2순위", "3순위"];
const WEEKDAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];
const DAY_ORDER = ["월", "화", "수", "목", "금", "토", "일"];
const DOW_TO_DAY = { 0: "일", 1: "월", 2: "화", 3: "수", 4: "목", 5: "금", 6: "토" };

const SUPABASE_URL = "https://vmwypncwbxgcyyvtprag.supabase.co";
const SUPABASE_KEY = "sb_publishable_Lv_yeQVMU-XuEW5Fu7_2IQ_EzJZ3Z2T";
const SB_REFRESH_KEY = "sb-refresh-token-v1";
const DARK_MODE_KEY = "dark-mode-v1";
const NOTIF_DATE_KEY = "last-notif-date-v1";
const MILESTONES = [7, 30, 100, 365];

const CHORE_PRESETS = [
  { name: "빨래 개기", estMin: 15 },
  { name: "설거지", estMin: 10 },
  { name: "청소기 돌리기", estMin: 20 },
  { name: "분리수거", estMin: 10 },
  { name: "침구 정리", estMin: 10 },
];

const CLASS_TYPES = ["수업", "알바", "동아리", "기타"];


function StrawberryDoodle({ size = 42, style = {} }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} style={style} aria-hidden="true">
      <path d="M18 20c5-6 23-6 28 0 5 7-1 28-14 36C19 48 13 27 18 20Z" fill="#E8AAB5" stroke="#A89078" strokeWidth="1.7" strokeLinejoin="round"/>
      <path d="M23 18c1-6 5-10 9-11-1 5 0 8 1 10 4-5 9-6 13-4-3 4-7 6-12 7-5 0-8 0-11-2Z" fill="#B8C8AD" stroke="#A89078" strokeWidth="1.7" strokeLinejoin="round"/>
      <g fill="#FBE8B7">
        <ellipse cx="25" cy="29" rx="1.5" ry="2"/><ellipse cx="37" cy="27" rx="1.5" ry="2"/>
        <ellipse cx="31" cy="37" rx="1.5" ry="2"/><ellipse cx="22" cy="39" rx="1.5" ry="2"/><ellipse cx="39" cy="40" rx="1.5" ry="2"/>
      </g>
    </svg>
  );
}

function TinyFlower({ style = {} }) {
  return <svg viewBox="0 0 28 28" width="18" height="18" style={{position:'absolute',...style}} aria-hidden="true">
    <g fill="none" stroke="#A89078" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 13c-7-8-12-1-6 3-5 5 2 10 6 3 4 7 11 2 6-3 6-4 1-11-6-3Z" fill="#F5D9DF"/>
      <circle cx="14" cy="16" r="2.2" fill="#F3D9A8"/>
    </g>
  </svg>;
}

function WashiTape({ children, style = {} }) {
  return <span style={{ display:'inline-block', padding:'5px 13px', background:'#F6E2D1', color:'#765B57', transform:'rotate(-1.5deg)', fontFamily:"'Gaegu', cursive", fontSize:15, boxShadow:'0 2px 0 rgba(118,91,87,.08)', ...style }}>{children}</span>;
}

function RibbonDoodle({ size = 44, style = {} }) {
  return (
    <svg viewBox="0 0 80 52" width={size} style={style} aria-hidden="true">
      <path d="M40 26C29 8 11 9 10 19c-1 9 14 12 30 7Z" fill="#F3C7C5" stroke="#A89078" strokeWidth="2"/>
      <path d="M40 26C51 8 69 9 70 19c1 9-14 12-30 7Z" fill="#F3C7C5" stroke="#A89078" strokeWidth="2"/>
      <path d="M35 29 24 48l16-8 7 9 1-21Z" fill="#F7D8D4" stroke="#A89078" strokeWidth="2" strokeLinejoin="round"/>
      <ellipse cx="40" cy="26" rx="8" ry="7" fill="#F8DDD8" stroke="#A89078" strokeWidth="2"/>
    </svg>
  );
}

function BerrySprig({ style = {} }) {
  return <div aria-hidden="true" style={{display:'flex',alignItems:'center',gap:2,...style}}><StrawberryDoodle size={25}/><StrawberryDoodle size={18} style={{transform:'rotate(12deg)',marginLeft:-8,marginTop:15}}/><svg viewBox="0 0 24 24" width="15" height="15" style={{marginLeft:-3}} aria-hidden="true"><path d="M3 17c6-1 9-5 12-12M10 10c-4-1-6 1-7 4 3 1 6 0 7-4Zm3-3c1-4 4-5 7-4 0 3-2 6-7 4Z" fill="none" stroke="#91AF91" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg></div>;
}

function signInWithGoogle() {
  const redirectTo = window.location.origin + window.location.pathname;
  window.location.href = `${SUPABASE_URL}/auth/v1/authorize?provider=google&apikey=${SUPABASE_KEY}&redirect_to=${encodeURIComponent(redirectTo)}`;
}
async function supabaseRefresh(refreshToken) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error("세션이 만료됐어요.");
  return json;
}
async function fetchSupabaseUser(accessToken) {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error("사용자 정보를 가져오지 못했어요.");
  return json;
}
async function fetchUserRow(accessToken) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_data?select=*`, {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${accessToken}` },
  });
  const json = await res.json();
  if (!res.ok) throw new Error("데이터를 불러오지 못했어요.");
  return json[0] || null;
}
async function upsertUserRow(accessToken, userId, payload) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/user_data?on_conflict=user_id`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify({ user_id: userId, ...payload }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error("저장하지 못했어요.");
  return json[0];
}

function toKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function todayKey() {
  return toKey(new Date());
}
function yesterdayKey() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return toKey(d);
}
function todayLabel() {
  const d = new Date();
  return `${d.getMonth() + 1}월 ${d.getDate()}일 (${WEEKDAY_LABELS[d.getDay()]})`;
}
function todayDayName() {
  return DOW_TO_DAY[new Date().getDay()];
}
function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}
function timeToMin(t) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function minToTime(m) {
  const h = Math.floor(m / 60).toString().padStart(2, "0");
  const mm = (m % 60).toString().padStart(2, "0");
  return `${h}:${mm}`;
}
function classesForWeekday(classes, dayName) {
  return classes.filter((c) => (!c.dayMode || c.dayMode === "weekday") && c.day === dayName);
}
function computeGapsForDay(classes, dayName, dateKey, dayStart = "09:00", dayEnd = "22:00", minGap = 20) {
  const dayClasses = classes
    .filter((c) => {
      if (c.dayMode === "daily") return true;
      if (c.dayMode === "date") return c.date === dateKey;
      if (c.dayMode === "none") return false;
      return c.day === dayName;
    })
    .sort((a, b) => timeToMin(a.start) - timeToMin(b.start));
  const gaps = [];
  let cursor = timeToMin(dayStart);
  const end = timeToMin(dayEnd);
  for (const c of dayClasses) {
    const s = timeToMin(c.start);
    const e = timeToMin(c.end);
    if (s > cursor && s - cursor >= minGap) gaps.push({ start: minToTime(cursor), end: minToTime(s) });
    cursor = Math.max(cursor, e);
  }
  if (end - cursor >= minGap) gaps.push({ start: minToTime(cursor), end: minToTime(end) });
  return gaps;
}
function classMinutesForDay(classes, dayName) {
  const list = classes.filter((c) => c.dayMode === "daily" || ((!c.dayMode || c.dayMode === "weekday") && c.day === dayName));
  return list.reduce((sum, c) => sum + (timeToMin(c.end) - timeToMin(c.start)), 0);
}
function daysUntil(dueStr) {
  const [y, m, d] = dueStr.split("-").map(Number);
  const due = new Date(y, m - 1, d);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((due - startOfToday) / 86400000);
}
function ddayLabel(diff) {
  if (diff === 0) return "D-DAY";
  if (diff > 0) return `D-${diff}`;
  return `D+${-diff}`;
}
function ddayColor(diff) {
  if (diff <= 0) return COLORS.coral;
  if (diff <= 2) return COLORS.coral;
  if (diff <= 5) return COLORS.yellow;
  return COLORS.muted;
}
function bumpStreak(streak) {
  const today = todayKey();
  const s = streak || { count: 0, lastDate: null };
  if (s.lastDate === today) return s;
  if (s.lastDate === yesterdayKey()) return { count: s.count + 1, lastDate: today };
  return { count: 1, lastDate: today };
}

function defaultUserData() {
  return {
    classes: [],
    tasks: [],
    completed: {},
    postponed: {},
    plan: null,
    streak: { count: 0, lastDate: null },
    totalCompleted: 0,
    choreHistory: {},
    completionLog: {},
    celebratedMilestones: [],
  };
}

function StatusIcons({ colors }) {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="17" height="11" viewBox="0 0 18 12" fill="none">
        <rect x="0" y="8" width="3" height="4" rx="0.5" fill={colors.ink} />
        <rect x="5" y="5" width="3" height="7" rx="0.5" fill={colors.ink} />
        <rect x="10" y="2" width="3" height="10" rx="0.5" fill={colors.ink} />
        <rect x="15" y="0" width="3" height="12" rx="0.5" fill={colors.ink} opacity="0.35" />
      </svg>
      <svg width="15" height="11" viewBox="0 0 16 12" fill="none">
        <path d="M1 4C5 0 11 0 15 4" stroke={colors.ink} strokeWidth="1.6" strokeLinecap="round" />
        <path d="M3.5 7C6 4.5 10 4.5 12.5 7" stroke={colors.ink} strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="8" cy="10" r="1.2" fill={colors.ink} />
      </svg>
      <svg width="22" height="11" viewBox="0 0 24 12" fill="none">
        <rect x="0.5" y="0.5" width="20" height="11" rx="2.5" stroke={colors.ink} strokeWidth="1" />
        <rect x="21.5" y="4" width="2" height="4" rx="1" fill={colors.ink} />
        <rect x="2" y="2" width="17" height="8" rx="1.2" fill={colors.ink} />
      </svg>
    </div>
  );
}

export default function TodayGapPlanner() {
  const [auth, setAuth] = useState(undefined);
  const [data, setData] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    try { return localStorage.getItem(DARK_MODE_KEY) === "1"; } catch (e) { return false; }
  });
  const [notifPermission, setNotifPermission] = useState(() => {
    try { return typeof Notification !== "undefined" ? Notification.permission : "default"; } catch (e) { return "default"; }
  });
  const [celebrateMilestone, setCelebrateMilestone] = useState(null);

  const COLORS = darkMode ? DARK_COLORS : LIGHT_COLORS;
  const RANK_COLORS = [COLORS.yellow, COLORS.coral, COLORS.mint];
  const TYPE_COLOR = { 수업: COLORS.mint, 알바: COLORS.coral, 동아리: COLORS.yellow, 기타: COLORS.muted };

  function toggleDarkMode() {
    setDarkMode((v) => {
      const next = !v;
      try { localStorage.setItem(DARK_MODE_KEY, next ? "1" : "0"); } catch (e) {}
      return next;
    });
  }
  function requestNotifPermission() {
    if (typeof Notification === "undefined") return;
    Notification.requestPermission().then((perm) => setNotifPermission(perm));
  }

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [saveWarning, setSaveWarning] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showTomorrow, setShowTomorrow] = useState(false);
  const [taskSearch, setTaskSearch] = useState("");
  const [hideCompleted, setHideCompleted] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [statsRange, setStatsRange] = useState(7);
  const [newTask, setNewTask] = useState({ name: "", due: "", start: todayKey(), estMin: "", noDue: false, estUnknown: false });
  const [newClass, setNewClass] = useState({ name: "", day: todayDayName(), date: todayKey(), start: "", end: "", type: "수업", dayMode: "weekday" });
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", due: "", start: "", estMin: "", noDue: false, estUnknown: false });

  async function loadOrInitRow(authObj) {
    setDataLoading(true);
    setError(null);
    try {
      const row = await fetchUserRow(authObj.accessToken);
      if (row) {
        setData({
          classes: row.classes || [],
          tasks: row.tasks || [],
          completed: row.completed || {},
          postponed: row.postponed || {},
          plan: row.plan || null,
          streak: row.streak || { count: 0, lastDate: null },
          totalCompleted: row.totalCompleted || 0,
          choreHistory: row.choreHistory || {},
          completionLog: row.completionLog || {},
          celebratedMilestones: row.celebratedMilestones || [],
        });
      } else {
        const d = defaultUserData();
        await upsertUserRow(authObj.accessToken, authObj.userId, d);
        setData(d);
      }
    } catch (e) {
      setError(e?.message || "데이터를 불러오지 못했어요.");
    } finally {
      setDataLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      try {
        if (window.location.hash && window.location.hash.includes("access_token")) {
          const params = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = params.get("access_token");
          const refreshToken = params.get("refresh_token");
          if (accessToken && refreshToken) {
            try {
              const user = await fetchSupabaseUser(accessToken);
              const newAuth = { accessToken, refreshToken, userId: user.id, username: (user.email || "").split("@")[0] };
              window.history.replaceState(null, "", window.location.pathname);
              setAuth(newAuth);
              try { localStorage.setItem(SB_REFRESH_KEY, refreshToken); } catch (e) {}
              await loadOrInitRow(newAuth);
              return;
            } catch (e) {}
          }
        }
        const stored = localStorage.getItem(SB_REFRESH_KEY);
        if (stored) {
          try {
            const refreshed = await supabaseRefresh(stored);
            const newAuth = {
              accessToken: refreshed.access_token,
              refreshToken: refreshed.refresh_token,
              userId: refreshed.user.id,
              username: (refreshed.user.email || "").split("@")[0],
            };
            setAuth(newAuth);
            try { localStorage.setItem(SB_REFRESH_KEY, refreshed.refresh_token); } catch (e) {}
            await loadOrInitRow(newAuth);
            return;
          } catch (e) {}
        }
      } catch (e) {}
      setAuth(null);
    })();
  }, []);

  useEffect(() => {
    if (!data || notifPermission !== "granted") return;
    try {
      const key = todayKey();
      const lastNotified = localStorage.getItem(NOTIF_DATE_KEY);
      if (lastNotified === key) return;
      const urgent = data.tasks.filter((t) => t.due && !data.completed[t.id] && daysUntil(t.due) <= 1 && daysUntil(t.due) >= 0);
      if (urgent.length > 0) {
        const names = urgent.map((t) => t.name).join(", ");
        new Notification("오늘의 틈", { body: `마감 임박: ${names}` });
        localStorage.setItem(NOTIF_DATE_KEY, key);
      }
    } catch (e) {}
  }, [data, notifPermission]);

  function updateData(updater) {
    setData((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persist(next);
      return next;
    });
  }
  async function persist(next) {
    try {
      await upsertUserRow(auth.accessToken, auth.userId, next);
      setSaveWarning(false);
    } catch (e) {
      setSaveWarning(true);
    }
  }

  async function logout() {
    setAuth(null);
    setData(null);
    try { localStorage.removeItem(SB_REFRESH_KEY); } catch (e) {}
  }

  if (auth === undefined) {
    return (
      <div style={{ background: COLORS.page, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Sans KR', sans-serif", color: COLORS.muted }}>
        <style>{GLOBAL_STYLE}</style>
        로그인 확인 중...
      </div>
    );
  }
  if (auth && dataLoading) {
    return (
      <div style={{ background: COLORS.page, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Sans KR', sans-serif", color: COLORS.muted }}>
        <style>{GLOBAL_STYLE}</style>
        데이터를 불러오는 중...
      </div>
    );
  }
  if (auth && !dataLoading && !data) {
    return (
      <div style={{ background: COLORS.page, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontFamily: "'IBM Plex Sans KR', sans-serif", color: COLORS.muted, padding: 24, textAlign: "center" }}>
        <style>{GLOBAL_STYLE}</style>
        <div className="mb-3" style={{ color: "#B3261E" }}>{error || "데이터를 불러오지 못했어요."}</div>
        <button
          onClick={() => loadOrInitRow(auth)}
          className="px-4 py-2 rounded-full text-sm text-white"
          style={{ background: COLORS.ink }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  const today = todayKey();
  const activeTasks = data
    ? data.tasks.filter((t) => {
        if (t.due && data.completed[t.id]) return false;
        if (data.postponed[t.id] === today) return false;
        return true;
      })
    : [];
  const todayGaps = data ? computeGapsForDay(data.classes, todayDayName(), today) : [];
  const tomorrowDateObj = new Date();
  tomorrowDateObj.setDate(tomorrowDateObj.getDate() + 1);
  const tomorrowDayName = DOW_TO_DAY[tomorrowDateObj.getDay()];
  const tomorrowDateKey = toKey(tomorrowDateObj);
  const tomorrowGaps = data ? computeGapsForDay(data.classes, tomorrowDayName, tomorrowDateKey) : [];

  const weekDays = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    const key = toKey(d);
    const load = activeTasks.filter((t) => t.due === key).reduce((sum, t) => sum + (t.estMin || 0), 0);
    return { key, label: WEEKDAY_LABELS[d.getDay()], load, isToday: i === 0 };
  });
  const maxLoad = Math.max(...weekDays.map((w) => w.load), 60);
  function loadColor(load) {
    if (load === 0) return COLORS.ruleLine;
    if (load <= 60) return COLORS.mint;
    if (load <= 150) return COLORS.yellow;
    return COLORS.coral;
  }


  async function generatePlan() {
    setLoading(true);
    setError(null);
    try {
      const dueTasks = activeTasks.filter((t) => t.due);
      const choreTasks = activeTasks.filter((t) => !t.due);
      const estText = (t) => (t.estMin ? `${t.estMin}분` : "모름, 적당히 추정해줘");
      let taskList = dueTasks.map((t) => `- ${t.name} (마감: ${t.due}, 예상 소요시간: ${estText(t)})`).join("\n");
      if (choreTasks.length > 0) {
        taskList += (taskList ? "\n" : "") + "생활 루틴 (마감 없음, 짧은 틈에 넣기 좋음):\n" + choreTasks.map((t) => `- ${t.name} (예상 소요시간: ${estText(t)})`).join("\n");
      }
      const slotList = todayGaps.map((s) => `- ${s.start}~${s.end}`).join("\n");

      const prompt = `너는 대학생을 위한 시간관리 AI야. 아래 과제/할일 목록과 오늘의 공강(시간표 기반으로 계산된 빈 시간) 목록을 보고, 오늘 처리하면 가장 좋은 항목을 최대 3개까지 우선순위대로 골라줘. 마감이 있는 과제를 우선하되, 짧은 공강에는 생활 루틴을 배치해도 좋아.

목록:
${taskList || "(없음)"}

오늘의 공강:
${slotList || "(없음)"}

오늘 날짜: ${todayLabel()}

다음 JSON 형식으로만 답해. 다른 설명, 마크다운, 코드블록 없이 순수 JSON만 출력해:
{
  "top3": [
    {
      "task": "항목 이름 (위 목록에 있는 이름 그대로)",
      "slot": "13:00~14:00",
      "durationMin": 20,
      "reason": "지금 해야 하는 이유, 15자~30자 한 줄",
      "ifSkipped": "오늘 안 하면 어떻게 되는지, 20자 내외 한 줄"
    }
  ],
  "weekImpact": "오늘 이 계획대로 하면 이번 주가 어떻게 편해지는지 한 줄, 30자 내외"
}

원칙: durationMin은 해당 공강 길이를 넘지 않게 잡아. 시작 부담을 줄이도록 작은 단위로 제안하고, 말투는 다정하고 담백하게.`;

      const response = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || "계획을 만들지 못했어요.");
      const text = (resData.content || []).map((b) => b.text || "").join("\n");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      updateData((prev) => ({ ...prev, plan: parsed }));
    } catch (e) {
      setError("계획을 만들지 못했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  function markComplete(taskName) {
    const t = data.tasks.find((x) => x.name === taskName);
    if (!t) return;
    const newStreak = bumpStreak(data.streak);
    const alreadyCelebrated = (data.celebratedMilestones || []).includes(newStreak.count);
    const hitMilestone = MILESTONES.includes(newStreak.count) && !alreadyCelebrated;
    if (hitMilestone) setCelebrateMilestone(newStreak.count);
    updateData((prev) => {
      const completionLog = { ...(prev.completionLog || {}) };
      completionLog[today] = (completionLog[today] || 0) + 1;
      const celebratedMilestones = hitMilestone ? [...(prev.celebratedMilestones || []), newStreak.count] : (prev.celebratedMilestones || []);
      if (!t.due) {
        const history = { ...(prev.choreHistory || {}) };
        const arr = history[t.id] ? [...history[t.id]] : [];
        arr.push(today);
        history[t.id] = arr;
        return { ...prev, choreHistory: history, streak: newStreak, totalCompleted: (prev.totalCompleted || 0) + 1, completionLog, celebratedMilestones };
      }
      return {
        ...prev,
        completed: { ...prev.completed, [t.id]: today },
        streak: newStreak,
        totalCompleted: (prev.totalCompleted || 0) + 1,
        completionLog,
        celebratedMilestones,
      };
    });
  }
  function undoComplete(taskId) {
    updateData((prev) => {
      const next = { ...prev.completed };
      delete next[taskId];
      return { ...prev, completed: next, totalCompleted: Math.max(0, (prev.totalCompleted || 0) - 1) };
    });
  }
  function undoLastChoreLog(taskId) {
    updateData((prev) => {
      const history = { ...(prev.choreHistory || {}) };
      if (history[taskId] && history[taskId].length > 0) {
        history[taskId] = history[taskId].slice(0, -1);
      }
      return { ...prev, choreHistory: history, totalCompleted: Math.max(0, (prev.totalCompleted || 0) - 1) };
    });
  }
  function markPostpone(taskName) {
    const t = data.tasks.find((x) => x.name === taskName);
    if (!t) return;
    updateData((prev) => ({ ...prev, postponed: { ...prev.postponed, [t.id]: todayKey() } }));
  }
  function undoPostpone(taskId) {
    updateData((prev) => {
      const next = { ...prev.postponed };
      delete next[taskId];
      return { ...prev, postponed: next };
    });
  }
  function deleteTask(taskId) {
    updateData((prev) => {
      const completed = { ...prev.completed };
      const postponed = { ...prev.postponed };
      delete completed[taskId];
      delete postponed[taskId];
      return { ...prev, tasks: prev.tasks.filter((t) => t.id !== taskId), completed, postponed };
    });
    setEditingTaskId(null);
  }
  function startEditTask(t) {
    setEditingTaskId(t.id);
    setEditForm({ name: t.name, due: t.due || "", start: t.start || t.due || todayKey(), estMin: t.estMin ? String(t.estMin) : "", noDue: !t.due, estUnknown: !t.estMin });
  }
  function saveEditTask() {
    if (!editForm.name.trim()) return;
    updateData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) =>
        t.id === editingTaskId
          ? { ...t, name: editForm.name.trim(), due: editForm.noDue ? null : editForm.due, start: editForm.noDue ? null : (editForm.start || editForm.due), estMin: editForm.estUnknown ? null : (Number(editForm.estMin) || 30) }
          : t
      ),
    }));
    setEditingTaskId(null);
  }
  function addTask() {
    if (!newTask.name.trim()) return;
    if (!newTask.noDue && !newTask.due) return;
    const t = {
      id: `t${Date.now()}`,
      name: newTask.name.trim(),
      due: newTask.noDue ? null : newTask.due,
      start: newTask.noDue ? null : (newTask.start || todayKey()),
      estMin: newTask.estUnknown ? null : (Number(newTask.estMin) || 30),
    };
    updateData((prev) => ({ ...prev, tasks: [...prev.tasks, t] }));
    setNewTask({ name: "", due: "", start: todayKey(), estMin: "", noDue: false, estUnknown: false });
    setShowAddTask(false);
  }
  function quickAddChore(preset) {
    const t = { id: `t${Date.now()}`, name: preset.name, due: null, estMin: preset.estMin };
    updateData((prev) => ({ ...prev, tasks: [...prev.tasks, t] }));
  }
  function addClass() {
    if (!newClass.name.trim() || !newClass.start || !newClass.end) return;
    if (newClass.dayMode === "weekday" && !newClass.day) return;
    if (newClass.dayMode === "date" && !newClass.date) return;
    const c = {
      id: `c${Date.now()}`,
      name: newClass.name.trim(),
      start: newClass.start,
      end: newClass.end,
      type: newClass.type,
      dayMode: newClass.dayMode,
      day: newClass.dayMode === "weekday" ? newClass.day : null,
      date: newClass.dayMode === "date" ? newClass.date : null,
    };
    updateData((prev) => ({ ...prev, classes: [...prev.classes, c] }));
    setNewClass({ name: "", day: todayDayName(), date: todayKey(), start: "", end: "", type: "수업", dayMode: "weekday" });
    setShowAddClass(false);
  }
  function removeClass(id) {
    updateData((prev) => ({ ...prev, classes: prev.classes.filter((c) => c.id !== id) }));
  }
  function resetAll() {
    updateData(() => defaultUserData());
  }

  const inputStyle = { borderColor: COLORS.ruleLine, background: COLORS.paper };
  const plan = data ? data.plan : null;
  const top3Done = plan?.top3
    ? plan.top3.filter((item) => {
        const t = data.tasks.find((x) => x.name === item.task);
        return t && data.completed[t.id];
      }).length
    : 0;
  const top3Total = plan?.top3 ? plan.top3.length : 0;
  const todayName = todayDayName();
  const streakCount = data?.streak?.count || 0;

  return (
    <div style={{ background: `linear-gradient(rgba(255,255,255,.26) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.26) 1px, transparent 1px), radial-gradient(circle at 18% 8%, #FFF9F5 0 90px, transparent 91px), radial-gradient(circle at 85% 28%, #F2D8D5 0 75px, transparent 76px), ${COLORS.page}`, backgroundSize: "22px 22px, 22px 22px, auto, auto, auto", minHeight: "100vh", padding: "24px 12px", position: "relative", overflow: "hidden" }}>
      <StrawberryDoodle size={72} style={{ position: "fixed", left: "max(18px, calc(50% - 270px))", top: 58, opacity: .72, animation: "berryFloat 4s ease-in-out infinite" }} />
      <TinyFlower style={{ left: "max(28px, calc(50% - 245px))", top: 155 }} />
      <TinyFlower style={{ right: "max(24px, calc(50% - 250px))", top: 105, fontSize: 22, opacity: .65 }} />
      <RibbonDoodle size={54} style={{ position:"fixed", right:"max(14px, calc(50% - 280px))", top:180, opacity:.8, animation:"ribbonSway 5s ease-in-out infinite" }} />
      <RibbonDoodle size={54} style={{ position: "fixed", right: "max(14px, calc(50% - 275px))", top: 176, opacity: .78, animation: "ribbonSway 5s ease-in-out infinite" }} />
      <style>{GLOBAL_STYLE}</style>
      <div style={{ width: 410, maxWidth: "100%", margin: "0 auto", background: "rgba(255,253,252,.76)", border: "1px solid rgba(143,111,105,.16)", borderRadius: 38, padding: 8, boxShadow: "0 26px 70px -28px rgba(102,71,68,.42)", backdropFilter: "blur(12px)" }}>
        <div className="gingham" style={{ backgroundColor: COLORS.paper, borderRadius: 31, overflow: "hidden", position: "relative", minHeight: 760, display: "flex", flexDirection: "column", fontFamily: "'Gowun Dodum', 'IBM Plex Sans KR', sans-serif", color: COLORS.ink, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.75)" }}>
          <div style={{ position: "absolute", top: 9, left: "50%", transform: "translateX(-50%)", width: 76, height: 20, background: "#5C4A48", borderRadius: 14, zIndex: 20, opacity: .92 }} />
          <div className="flex items-center justify-between px-6 pt-3.5 pb-1">
            <span className="text-xs font-medium" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{nowHHMM()}</span>
            <StatusIcons colors={COLORS} />
          </div>

          {!auth ? (
            <div className="flex-1 flex flex-col items-center justify-center px-8 text-center" style={{ animation: "fadeIn 0.4s ease both" }}>
              <div className="mb-2" style={{ animation: "softPulse 3s ease-in-out infinite", position:"relative" }}><StrawberryDoodle size={68} /><RibbonDoodle size={38} style={{position:"absolute",right:-28,top:-8}} /></div>
              <div style={{ fontFamily: "'Gaegu', cursive", fontSize: 32, fontWeight: 700, color: COLORS.ink }} className="mb-1">오늘의 틈</div>
              <div className="text-sm mb-5" style={{ color: COLORS.muted }}>오늘, 뭐부터 하면 될지 정해드릴게요</div>

              <button
                onClick={signInWithGoogle}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium w-full mb-3 transition-transform active:scale-95"
                style={{ background: "#fff", border: `1px solid ${COLORS.ruleLine}`, color: COLORS.ink }}
              >
                <svg width="16" height="16" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.6 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
                  <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.5 6.1 29.5 4 24 4 16.3 4 9.6 8.3 6.3 14.7z" />
                  <path fill="#4CAF50" d="M24 44c5.3 0 10.2-2 13.9-5.4l-6.4-5.4C29.4 34.9 26.8 36 24 36c-5.3 0-9.8-3.4-11.4-8.1l-6.6 5.1C9.5 39.6 16.2 44 24 44z" />
                  <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.6l6.4 5.4C39.9 36.5 44 30.9 44 24c0-1.3-.1-2.7-.4-3.5z" />
                </svg>
                Google로 계속하기
              </button>
              <div className="text-xs mt-4 leading-relaxed" style={{ color: COLORS.muted }}>
                구글 계정으로 안전하게 로그인돼요.
              </div>
            </div>
          ) : (
          <div className="px-4 pb-3 flex-1 overflow-y-auto">
          {activeTab === "home" && (
            <>
            {celebrateMilestone && (
              <div
                className="flex items-center justify-between rounded-2xl p-3.5 mb-3"
                style={{ background: COLORS.coral, color: "#fff", animation: "popIn 0.4s ease both" }}
              >
                <span className="text-sm font-semibold">🎉 {celebrateMilestone}일 연속 달성! 대단해요</span>
                <button onClick={() => setCelebrateMilestone(null)} style={{ color: "#fff" }}><X size={16} /></button>
              </div>
            )}
            <div className="flex items-center justify-between mt-2 mb-3" style={{background:"rgba(255,249,245,.82)", marginLeft:-4, marginRight:-4, padding:"10px 10px 8px", borderRadius:18, border:`1px dashed ${COLORS.ruleLine}`}}>
              <div>
                <div className="flex items-center gap-2"><BerrySprig /><div style={{ fontFamily: "'Gaegu', cursive", fontSize: 24, fontWeight: 700 }}>오늘의 틈</div></div>
                <div className="text-xs" style={{ color: COLORS.muted }}>
                  {todayLabel()} · {auth.username}님 · 과제 {data.tasks.length}개
                </div>
              </div>
              {streakCount > 0 && (
                <div className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}`, color: COLORS.coral }}>
                  <Flame size={13} /> {streakCount}일 연속
                </div>
              )}
            </div>

            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}` }} className="pretty-card rounded-2xl p-4 mb-3 shadow-sm">
              <h1 style={{ fontFamily: "'Gaegu', cursive", lineHeight: 1.35 }} className="text-2xl font-bold">
                {plan?.weekImpact ? plan.weekImpact : "오늘, 뭐부터 하면 될지 정해드릴게요"}
              </h1>
              {top3Total > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1" style={{ color: COLORS.muted }}>
                    <span>오늘 진행률</span>
                    <span>{top3Done}/{top3Total} 완료 · 누적 {data.totalCompleted || 0}개</span>
                  </div>
                  <div style={{ background: COLORS.ruleLine, height: 6, borderRadius: 4, overflow: "hidden" }}>
                    <div style={{ width: `${top3Total ? (top3Done / top3Total) * 100 : 0}%`, background: COLORS.mint, height: "100%", transition: "width 0.4s ease" }} />
                  </div>
                </div>
              )}
            </div>


            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}` }} className="pretty-card rounded-2xl p-3.5 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold">이번 주 마감 부담</span>
                <span className="text-xs" style={{ color: COLORS.muted }}>많을수록 몰려있어요</span>
              </div>
              <div className="flex items-end justify-between gap-1.5" style={{ height: 56 }}>
                {weekDays.map((w) => (
                  <div key={w.key} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                    <div style={{ width: "100%", height: `${Math.max(10, (w.load / maxLoad) * 100)}%`, background: loadColor(w.load), borderRadius: 4, transition: "height 0.4s ease" }} />
                    <span className="text-xs" style={{ color: w.isToday ? COLORS.ink : COLORS.muted, fontWeight: w.isToday ? 700 : 400 }}>{w.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}` }} className="pretty-card rounded-2xl p-3.5 mb-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold">오늘({todayName}) 공강 · 시간표 기준</span>
                <button onClick={() => setShowTomorrow((v) => !v)} className="text-xs flex items-center gap-0.5" style={{ color: COLORS.muted }}>
                  내일 미리보기 {showTomorrow ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {todayGaps.map((s, idx) => (
                  <span key={idx} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full" style={{ background: COLORS.paper, border: `1px solid ${COLORS.ruleLine}`, fontFamily: "'IBM Plex Mono', monospace" }}>
                    <Clock size={11} style={{ color: COLORS.muted }} /> {s.start}~{s.end}
                  </span>
                ))}
                {todayGaps.length === 0 && <span className="text-xs" style={{ color: COLORS.muted }}>오늘은 수업이 꽉 차 있어요</span>}
              </div>
              {showTomorrow && (
                <div className="mt-3 pt-3" style={{ borderTop: `1px dashed ${COLORS.ruleLine}` }}>
                  <div className="text-xs mb-1.5" style={{ color: COLORS.muted }}>내일({tomorrowDayName}) 공강</div>
                  <div className="flex flex-wrap gap-1.5">
                    {tomorrowGaps.map((s, idx) => (
                      <span key={idx} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full" style={{ background: COLORS.paper, border: `1px solid ${COLORS.ruleLine}`, fontFamily: "'IBM Plex Mono', monospace" }}>
                        <Clock size={11} style={{ color: COLORS.muted }} /> {s.start}~{s.end}
                      </span>
                    ))}
                    {tomorrowGaps.length === 0 && <span className="text-xs" style={{ color: COLORS.muted }}>내일은 수업이 꽉 차 있어요</span>}
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-2">
              <button onClick={() => setShowAddTask((v) => !v)} className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs transition-transform active:scale-95" style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}` }}>
                <Plus size={13} /> 과제/할일
              </button>
              <button onClick={generatePlan} disabled={loading || activeTasks.length === 0} className="flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-medium ml-auto disabled:opacity-50 transition-transform active:scale-95" style={{ background: COLORS.ink, color: "#fff" }}>
                <Sparkles size={13} /> {loading ? "생각 중..." : "오늘 계획 만들기"}
              </button>
            </div>

            {showAddTask && (
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}` }} className="pretty-card gingham rounded-2xl p-4 mb-3">
                <div className="flex items-center justify-between mb-2"><WashiTape>새 할 일 적기 ♡</WashiTape><StrawberryDoodle size={34} /></div>
                <div className="text-xs mb-1.5" style={{ color: COLORS.muted }}>빠른 추가 · 생활 할일</div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {CHORE_PRESETS.map((p) => (
                    <button key={p.name} onClick={() => quickAddChore(p)} className="text-xs px-2.5 py-1 rounded-full transition-transform active:scale-95" style={{ background: COLORS.paper, border: `1px solid ${COLORS.ruleLine}` }}>+ {p.name}</button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 items-end">
                  <div className="flex flex-col">
                    <label className="text-xs mb-1" style={{ color: COLORS.muted }}>이름</label>
                    <input value={newTask.name} onChange={(e) => setNewTask({ ...newTask, name: e.target.value })} className="border rounded px-2 py-1.5 text-sm" style={inputStyle} placeholder="예: 통계 과제" />
                  </div>
                  {!newTask.noDue && (
                    <div className="flex flex-col">
                      <label className="text-xs mb-1" style={{ color: COLORS.muted }}>시작일</label>
                      <input type="date" value={newTask.start} onChange={(e) => setNewTask({ ...newTask, start: e.target.value })} className="border rounded px-2 py-1.5 text-sm" style={inputStyle} />
                    </div>
                  )}
                  {!newTask.noDue && (
                    <div className="flex flex-col">
                      <label className="text-xs mb-1" style={{ color: COLORS.muted }}>마감일</label>
                      <input type="date" value={newTask.due} onChange={(e) => setNewTask({ ...newTask, due: e.target.value })} className="border rounded px-2 py-1.5 text-sm" style={inputStyle} />
                    </div>
                  )}
                  {!newTask.estUnknown && (
                    <div className="flex flex-col">
                      <label className="text-xs mb-1" style={{ color: COLORS.muted }}>예상 분</label>
                      <input type="number" value={newTask.estMin} onChange={(e) => setNewTask({ ...newTask, estMin: e.target.value })} className="border rounded px-2 py-1.5 text-sm w-20" style={inputStyle} placeholder="60" />
                    </div>
                  )}
                  <button onClick={addTask} className="px-3 py-1.5 rounded text-sm text-white" style={{ background: COLORS.strawberry, borderRadius: 999, boxShadow:"0 5px 12px -8px rgba(217,104,114,.8)" }}>딸기 바구니에 담기</button>
                </div>
                <div className="flex flex-wrap gap-3 mt-2">
                  <label className="flex items-center gap-1.5 text-xs" style={{ color: COLORS.muted }}>
                    <input type="checkbox" checked={newTask.noDue} onChange={(e) => setNewTask({ ...newTask, noDue: e.target.checked })} /> 마감일 없음 (생활 루틴)
                  </label>
                  <label className="flex items-center gap-1.5 text-xs" style={{ color: COLORS.muted }}>
                    <input type="checkbox" checked={newTask.estUnknown} onChange={(e) => setNewTask({ ...newTask, estUnknown: e.target.checked })} /> 예상시간 모름
                  </label>
                </div>
              </div>
            )}

            {error && <div className="flex items-center gap-2 text-sm rounded-lg p-3 mb-3" style={{ background: "#FFE8E8", color: "#B3261E" }}><AlertCircle size={16} /> {error}</div>}

            {loading && (
              <div className="flex flex-col gap-2 mb-4">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="rounded-xl p-4 animate-pulse" style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}` }}>
                    <div style={{ width: 48, height: 16, background: COLORS.ruleLine, borderRadius: 8 }} />
                    <div style={{ width: "70%", height: 14, background: COLORS.ruleLine, borderRadius: 6, marginTop: 10 }} />
                    <div style={{ width: "50%", height: 12, background: COLORS.ruleLine, borderRadius: 6, marginTop: 8 }} />
                  </div>
                ))}
              </div>
            )}

            {!loading && plan && plan.top3 && plan.top3.length > 0 && (
              <div className="mb-4">
                <div className="text-xs uppercase tracking-wide mb-2" style={{ color: COLORS.muted }}>오늘의 우선순위</div>
                <div className="flex flex-col gap-2">
                  {plan.top3.map((item, i) => {
                    const t = data.tasks.find((x) => x.name === item.task);
                    const isChore = t && !t.due;
                    const isDone = t && t.due && data.completed[t.id];
                    const isPostponed = t && data.postponed[t.id] === today;
                    const choreLog = isChore ? (data.choreHistory?.[t.id] || []) : [];
                    return (
                      <div key={i} style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}`, borderLeft: `6px solid ${RANK_COLORS[i] || COLORS.mint}`, animation: "planCardIn 0.4s ease both", animationDelay: `${i * 90}ms` }} className="rounded-xl p-4">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: RANK_COLORS[i] || COLORS.mint, color: COLORS.ink }}>{RANK_LABELS[i] || `${i + 1}순위`}</span>
                        <div className="font-semibold text-base mt-1.5">{item.task}</div>
                        <div className="flex items-center gap-1.5 text-xs mt-1" style={{ color: COLORS.muted, fontFamily: "'IBM Plex Mono', monospace" }}>
                          <Clock size={12} /> {item.slot} · {item.durationMin}분
                        </div>
                        <div style={{ fontFamily: "'Gaegu', cursive", color: COLORS.ink }} className="text-lg mt-2">"{item.reason}"</div>
                        {item.ifSkipped && <div className="text-xs mt-1" style={{ color: COLORS.muted }}>오늘 안 하면 → {item.ifSkipped}</div>}
                        {isChore && choreLog.length > 0 && (
                          <div className="text-xs mt-1" style={{ color: COLORS.muted }}>최근 {choreLog[choreLog.length - 1]} · 총 {choreLog.length}회 기록</div>
                        )}
                        {isDone ? (
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs font-medium" style={{ color: COLORS.mint, animation: "popIn 0.3s ease both" }}>완료했어요 🎉</span>
                            <button onClick={() => undoComplete(t.id)} className="text-xs" style={{ color: COLORS.muted }}>되돌리기</button>
                          </div>
                        ) : isPostponed ? (
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs" style={{ color: COLORS.muted, animation: "popIn 0.3s ease both" }}>내일 다시 추천해줄게요</span>
                            <button onClick={() => undoPostpone(t.id)} className="text-xs" style={{ color: COLORS.muted }}>되돌리기</button>
                          </div>
                        ) : (
                          <div className="flex gap-2 mt-3">
                            <button
                              onClick={() => markComplete(item.task)}
                              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-medium transition-transform active:scale-95"
                              style={{ background: COLORS.mint, color: "#fff" }}
                            >
                              <Check size={12} /> {isChore ? "기록하기" : "완료"}
                            </button>
                            <button
                              onClick={() => markPostpone(item.task)}
                              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full transition-transform active:scale-95"
                              style={{ background: COLORS.paper, border: `1px solid ${COLORS.ruleLine}`, color: COLORS.muted }}
                            >
                              <Undo2 size={12} /> 못 하겠어요
                            </button>
                            {isChore && choreLog.length > 0 && (
                              <button onClick={() => undoLastChoreLog(t.id)} className="text-xs ml-auto" style={{ color: COLORS.muted }}>기록 취소</button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!loading && plan && (!plan.top3 || plan.top3.length === 0) && (
              <div className="text-sm rounded-xl p-4 mb-4 text-center" style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}`, color: COLORS.muted }}>
                오늘은 공강에 맞는 할 일이 없어요. 과제나 시간표를 확인해 보세요.
              </div>
            )}

            {data.tasks.length > 0 && (
              <div className="mb-3">
                <button onClick={() => setShowAll((v) => !v)} className="flex items-center gap-1 text-xs" style={{ color: COLORS.muted }}>
                  {showAll ? <ChevronUp size={14} /> : <ChevronDown size={14} />} 등록된 항목 전체 {data.tasks.length}개 {showAll ? "접기" : "보기"}
                </button>
                {showAll && (
                  <div className="mt-2">
                    <div className="flex gap-1.5 mb-2">
                      <input
                        value={taskSearch}
                        onChange={(e) => setTaskSearch(e.target.value)}
                        placeholder="과제 검색"
                        className="border rounded-full px-3 py-1.5 text-xs flex-1"
                        style={{ borderColor: COLORS.ruleLine, background: COLORS.paper }}
                      />
                      <button
                        onClick={() => setHideCompleted((v) => !v)}
                        className="text-xs px-2.5 py-1.5 rounded-full whitespace-nowrap"
                        style={{ background: hideCompleted ? COLORS.ink : COLORS.card, color: hideCompleted ? "#fff" : COLORS.muted, border: `1px solid ${COLORS.ruleLine}` }}
                      >
                        완료 숨기기
                      </button>
                    </div>
                    <div className="flex flex-col gap-1">
                    {data.tasks
                      .filter((t) => t.name.toLowerCase().includes(taskSearch.trim().toLowerCase()))
                      .filter((t) => !(hideCompleted && t.due && data.completed[t.id]))
                      .map((t) =>
                      editingTaskId === t.id ? (
                        <div key={t.id} className="rounded-lg p-2.5" style={{ background: COLORS.card, border: `1px solid ${COLORS.ink}` }}>
                          <input value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="border rounded px-2 py-1 text-sm w-full mb-1.5" style={inputStyle} />
                          <div className="flex flex-wrap gap-1.5 items-end">
                            {!editForm.noDue && (
                              <input type="date" value={editForm.start} onChange={(e) => setEditForm({ ...editForm, start: e.target.value })} className="border rounded px-2 py-1 text-xs" style={inputStyle} title="시작일" />
                            )}
                            {!editForm.noDue && (
                              <input type="date" value={editForm.due} onChange={(e) => setEditForm({ ...editForm, due: e.target.value })} className="border rounded px-2 py-1 text-xs" style={inputStyle} title="마감일" />
                            )}
                            {!editForm.estUnknown && (
                              <input type="number" value={editForm.estMin} onChange={(e) => setEditForm({ ...editForm, estMin: e.target.value })} className="border rounded px-2 py-1 text-xs w-16" style={inputStyle} />
                            )}
                            <label className="flex items-center gap-1 text-xs" style={{ color: COLORS.muted }}>
                              <input type="checkbox" checked={editForm.noDue} onChange={(e) => setEditForm({ ...editForm, noDue: e.target.checked })} /> 마감없음
                            </label>
                            <label className="flex items-center gap-1 text-xs" style={{ color: COLORS.muted }}>
                              <input type="checkbox" checked={editForm.estUnknown} onChange={(e) => setEditForm({ ...editForm, estUnknown: e.target.checked })} /> 시간모름
                            </label>
                          </div>
                          <div className="flex gap-1.5 mt-2">
                            <button onClick={saveEditTask} className="text-xs px-2.5 py-1 rounded-full text-white" style={{ background: COLORS.ink }}>저장</button>
                            <button onClick={() => setEditingTaskId(null)} className="text-xs px-2.5 py-1 rounded-full" style={{ background: COLORS.paper, border: `1px solid ${COLORS.ruleLine}` }}>취소</button>
                            <button onClick={() => deleteTask(t.id)} className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full ml-auto" style={{ color: "#B3261E" }}><Trash2 size={12} /> 삭제</button>
                          </div>
                        </div>
                      ) : (
                        <div
                          key={t.id}
                          className="flex items-center justify-between text-sm rounded-lg px-3 py-2"
                          style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}`, opacity: t.due && data.completed[t.id] ? 0.5 : 1 }}
                        >
                          <span style={{ textDecoration: t.due && data.completed[t.id] ? "line-through" : "none" }}>{t.name}</span>
                          <div className="flex items-center gap-2">
                            <span style={{ color: COLORS.muted, fontFamily: "'IBM Plex Mono', monospace" }} className="text-xs">
                              {t.due ? (
                                <>
                                  <span style={{ color: ddayColor(daysUntil(t.due)), fontWeight: 600 }}>{ddayLabel(daysUntil(t.due))} </span>
                                  {t.due} · {t.estMin ? `${t.estMin}분` : "시간 모름"}
                                </>
                              ) : (
                                <>
                                  {data.choreHistory?.[t.id]?.length
                                    ? `최근 ${data.choreHistory[t.id][data.choreHistory[t.id].length - 1]} · 총 ${data.choreHistory[t.id].length}회`
                                    : "아직 기록 없음"}
                                </>
                              )}
                            </span>
                            {!t.due && (
                              <button onClick={() => markComplete(t.name)} className="text-xs px-2 py-0.5 rounded-full" style={{ background: COLORS.mint, color: "#fff" }}>+ 기록</button>
                            )}
                            {!t.due && data.choreHistory?.[t.id]?.length > 0 && (
                              <button onClick={() => undoLastChoreLog(t.id)} style={{ color: COLORS.muted }}><Undo2 size={13} /></button>
                            )}
                            <button onClick={() => startEditTask(t)} style={{ color: COLORS.muted }}><Pencil size={13} /></button>
                            <button onClick={() => deleteTask(t.id)} style={{ color: COLORS.muted }}><Trash2 size={13} /></button>
                          </div>
                        </div>
                      )
                    )}
                    </div>
                  </div>
                )}
              </div>
            )}
            {data.tasks.length === 0 && (
              <div className="text-sm rounded-xl p-4 mb-3 text-center" style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}`, color: COLORS.muted }}>
                아직 등록된 과제/할일이 없어요. 위 "+ 과제/할일" 버튼으로 추가해보세요.
              </div>
            )}
            </>
          )}

          {activeTab === "calendar" && (
            <div style={{ animation: "fadeIn 0.3s ease both" }}>
              <div className="mt-2 mb-3">
                <div className="flex items-center gap-2"><div style={{ fontFamily: "'Gaegu', cursive", fontSize: 24, fontWeight: 700 }}>시간표</div><span style={{fontSize:15,color:COLORS.strawberry}}>♡</span><StrawberryDoodle size={27}/></div>
                <div className="text-xs" style={{ color: COLORS.muted }}>요일별 일정을 등록하면 공강이 자동으로 계산돼요</div>
              </div>

              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}` }} className="pretty-card rounded-2xl p-3.5 mb-3">
                <div className="text-xs font-semibold mb-2">진행 중인 일정 · 오늘부터 마감까지</div>
                <div className="flex gap-1 overflow-x-auto pb-1">
                  {Array.from({ length: 14 }).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() + i);
                    const key = toKey(d);
                    const inRange = data.tasks.some((t) => t.due && key <= t.due && key >= (t.start || t.due));
                    const isToday = i === 0;
                    return (
                      <div
                        key={key}
                        className="flex flex-col items-center justify-center rounded-lg flex-shrink-0"
                        style={{
                          minWidth: 34,
                          height: 44,
                          background: inRange ? COLORS.coral : COLORS.paper,
                          color: inRange ? "#fff" : COLORS.muted,
                          border: isToday ? `2px solid ${COLORS.ink}` : `1px solid ${COLORS.ruleLine}`,
                        }}
                      >
                        <span className="text-xs font-semibold">{d.getDate()}</span>
                        <span style={{ fontSize: 10 }}>{WEEKDAY_LABELS[d.getDay()]}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-2 mb-3">
                {DAY_ORDER.map((day) => {
                  const dayClasses = classesForWeekday(data.classes, day).sort((a, b) => timeToMin(a.start) - timeToMin(b.start));
                  const totalMin = classMinutesForDay(data.classes, day);
                  return (
                    <div key={day} style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}` }} className="pretty-card rounded-2xl p-3">
                      <div className="flex items-start gap-2">
                        <span className="text-xs w-7 h-7 flex items-center justify-center font-semibold" style={{ color: day === todayName ? "#fff" : COLORS.muted, background: day === todayName ? COLORS.strawberry : COLORS.paper, borderRadius: "50%", border:`1px solid ${day === todayName ? COLORS.strawberry : COLORS.ruleLine}` }}>{day}</span>
                        <div className="flex-1">
                          <div className="flex flex-wrap gap-1">
                            {dayClasses.length === 0 && <span className="text-xs py-1" style={{ color: COLORS.muted }}>-</span>}
                            {dayClasses.map((c) => (
                              <span key={c.id} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ background: COLORS.paper, border: `1px solid ${COLORS.ruleLine}` }}>
                                <span style={{ width: 6, height: 6, borderRadius: 3, background: TYPE_COLOR[c.type] || TYPE_COLOR["기타"], display: "inline-block" }} />
                                {c.name} {c.start}-{c.end}
                                <button onClick={() => removeClass(c.id)} style={{ color: COLORS.muted }}><X size={10} /></button>
                              </span>
                            ))}
                          </div>
                          {totalMin > 0 && <div className="text-xs mt-1" style={{ color: COLORS.muted }}>총 {Math.round(totalMin / 60 * 10) / 10}시간</div>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {data.classes.some((c) => c.dayMode === "daily") && (
                <div style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}` }} className="rounded-xl p-3 mb-3">
                  <div className="text-xs font-semibold mb-1.5">매일 반복</div>
                  <div className="flex flex-wrap gap-1">
                    {data.classes.filter((c) => c.dayMode === "daily").map((c) => (
                      <span key={c.id} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ background: COLORS.paper, border: `1px solid ${COLORS.ruleLine}` }}>
                        <span style={{ width: 6, height: 6, borderRadius: 3, background: TYPE_COLOR[c.type] || TYPE_COLOR["기타"], display: "inline-block" }} />
                        {c.name} {c.start}-{c.end}
                        <button onClick={() => removeClass(c.id)} style={{ color: COLORS.muted }}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {data.classes.some((c) => c.dayMode === "date") && (
                <div style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}` }} className="rounded-xl p-3 mb-3">
                  <div className="text-xs font-semibold mb-1.5">특정 날짜</div>
                  <div className="flex flex-col gap-1">
                    {data.classes.filter((c) => c.dayMode === "date").sort((a, b) => (a.date < b.date ? -1 : 1)).map((c) => (
                      <div key={c.id} className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1">
                          <span style={{ width: 6, height: 6, borderRadius: 3, background: TYPE_COLOR[c.type] || TYPE_COLOR["기타"], display: "inline-block" }} />
                          {c.name} {c.start}-{c.end}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <span style={{ color: COLORS.muted, fontFamily: "'IBM Plex Mono', monospace" }}>{c.date}</span>
                          <button onClick={() => removeClass(c.id)} style={{ color: COLORS.muted }}><X size={11} /></button>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {data.classes.some((c) => c.dayMode === "none") && (
                <div style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}` }} className="rounded-xl p-3 mb-3">
                  <div className="text-xs font-semibold mb-1.5">미정 (공강 계산에는 포함 안 됨)</div>
                  <div className="flex flex-wrap gap-1">
                    {data.classes.filter((c) => c.dayMode === "none").map((c) => (
                      <span key={c.id} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full" style={{ background: COLORS.paper, border: `1px solid ${COLORS.ruleLine}` }}>
                        {c.name} {c.start}-{c.end}
                        <button onClick={() => removeClass(c.id)} style={{ color: COLORS.muted }}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setShowAddClass((v) => !v)} className="flex items-center gap-1 text-xs mb-2 px-3 py-1.5 rounded-full transition-transform active:scale-95" style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}` }}>
                <Plus size={12} /> 일정 추가
              </button>
              {showAddClass && (
                <div className="rounded-xl p-3 mb-3" style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}` }}>
                  <input value={newClass.name} onChange={(e) => setNewClass({ ...newClass, name: e.target.value })} className="border rounded px-2 py-1.5 text-sm w-full mb-2" style={{ borderColor: COLORS.ruleLine, background: COLORS.paper }} placeholder="이름 (예: 통계학개론, 카페 알바)" />
                  <div className="flex flex-wrap gap-1 mb-2">
                    {CLASS_TYPES.map((type) => (
                      <button key={type} onClick={() => setNewClass({ ...newClass, type })} className="text-xs px-2.5 py-1 rounded-full flex items-center gap-1" style={{ background: newClass.type === type ? COLORS.ink : COLORS.paper, color: newClass.type === type ? "#fff" : COLORS.ink, border: `1px solid ${COLORS.ruleLine}` }}>
                        <span style={{ width: 6, height: 6, borderRadius: 3, background: TYPE_COLOR[type], display: "inline-block" }} />
                        {type}
                      </button>
                    ))}
                  </div>

                  <div className="text-xs mb-1" style={{ color: COLORS.muted }}>반복 방식</div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {[
                      { key: "weekday", label: "요일 반복" },
                      { key: "daily", label: "매일 반복" },
                      { key: "date", label: "특정 날짜" },
                      { key: "none", label: "선택 안 함" },
                    ].map((m) => (
                      <button key={m.key} onClick={() => setNewClass({ ...newClass, dayMode: m.key })} className="text-xs px-2.5 py-1 rounded-full" style={{ background: newClass.dayMode === m.key ? COLORS.ink : COLORS.paper, color: newClass.dayMode === m.key ? "#fff" : COLORS.ink, border: `1px solid ${COLORS.ruleLine}` }}>
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {newClass.dayMode === "weekday" && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {DAY_ORDER.map((day) => (
                        <button key={day} onClick={() => setNewClass({ ...newClass, day })} className="text-xs px-2.5 py-1 rounded-full" style={{ background: newClass.day === day ? COLORS.ink : COLORS.paper, color: newClass.day === day ? "#fff" : COLORS.ink, border: `1px solid ${COLORS.ruleLine}` }}>
                          {day}
                        </button>
                      ))}
                    </div>
                  )}
                  {newClass.dayMode === "date" && (
                    <div className="mb-2">
                      <input type="date" value={newClass.date} onChange={(e) => setNewClass({ ...newClass, date: e.target.value })} className="border rounded px-2 py-1.5 text-sm" style={{ borderColor: COLORS.ruleLine, background: COLORS.paper }} />
                    </div>
                  )}

                  <div className="flex gap-2 items-end">
                    <div className="flex flex-col">
                      <label className="text-xs mb-1" style={{ color: COLORS.muted }}>시작</label>
                      <input type="time" value={newClass.start} onChange={(e) => setNewClass({ ...newClass, start: e.target.value })} className="border rounded px-2 py-1.5 text-sm" style={{ borderColor: COLORS.ruleLine, background: COLORS.paper }} />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-xs mb-1" style={{ color: COLORS.muted }}>종료</label>
                      <input type="time" value={newClass.end} onChange={(e) => setNewClass({ ...newClass, end: e.target.value })} className="border rounded px-2 py-1.5 text-sm" style={{ borderColor: COLORS.ruleLine, background: COLORS.paper }} />
                    </div>
                    <button onClick={addClass} className="px-3 py-1.5 rounded text-sm text-white" style={{ background: COLORS.ink }}>추가</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div style={{ animation: "fadeIn 0.3s ease both" }}>
              <div className="mt-2 mb-4">
                <div style={{ fontFamily: "'Gaegu', cursive", fontSize: 22, fontWeight: 700 }}>설정</div>
                <div className="text-xs" style={{ color: COLORS.muted }}>{auth.username}님으로 로그인됨</div>
              </div>
              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}`, color: COLORS.muted }} className="rounded-xl p-3 mb-3 text-xs">
                누적 완료 {data.totalCompleted || 0}개 · 연속 {streakCount}일
              </div>

              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}` }} className="pretty-card rounded-2xl p-3.5 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold">완료 통계</span>
                  <div className="flex gap-1">
                    {[7, 30].map((r) => (
                      <button key={r} onClick={() => setStatsRange(r)} className="text-xs px-2 py-0.5 rounded-full" style={{ background: statsRange === r ? COLORS.ink : COLORS.paper, color: statsRange === r ? "#fff" : COLORS.muted, border: `1px solid ${COLORS.ruleLine}` }}>
                        {r}일
                      </button>
                    ))}
                  </div>
                </div>
                {(() => {
                  const days = Array.from({ length: statsRange }).map((_, i) => {
                    const d = new Date();
                    d.setDate(d.getDate() - (statsRange - 1 - i));
                    const key = toKey(d);
                    return { key, count: (data.completionLog && data.completionLog[key]) || 0, isToday: key === today };
                  });
                  const maxCount = Math.max(...days.map((d) => d.count), 1);
                  return (
                    <div className="flex items-end gap-0.5" style={{ height: 56 }}>
                      {days.map((d) => (
                        <div key={d.key} className="flex flex-col items-center gap-1" style={{ flex: 1 }}>
                          <div style={{ width: "100%", height: `${Math.max(4, (d.count / maxCount) * 100)}%`, background: d.count > 0 ? COLORS.mint : COLORS.ruleLine, borderRadius: 3, transition: "height 0.3s ease" }} title={`${d.key}: ${d.count}개`} />
                          {statsRange <= 7 && <span className="text-xs" style={{ color: d.isToday ? COLORS.ink : COLORS.muted, fontWeight: d.isToday ? 700 : 400 }}>{WEEKDAY_LABELS[new Date(d.key).getDay()]}</span>}
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}` }} className="pretty-card rounded-2xl p-3.5 mb-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm">다크모드</span>
                  <button onClick={toggleDarkMode} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: darkMode ? COLORS.ink : COLORS.paper, color: darkMode ? "#fff" : COLORS.muted, border: `1px solid ${COLORS.ruleLine}` }}>
                    {darkMode ? "켜짐" : "꺼짐"}
                  </button>
                </div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm">마감 임박 브라우저 알림</span>
                  {notifPermission === "granted" ? (
                    <span className="text-xs px-2.5 py-1 rounded-full" style={{ background: COLORS.mint, color: "#fff" }}>켜짐</span>
                  ) : (
                    <button onClick={requestNotifPermission} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: COLORS.paper, color: COLORS.muted, border: `1px solid ${COLORS.ruleLine}` }}>
                      {notifPermission === "denied" ? "브라우저 설정에서 허용 필요" : "켜기"}
                    </button>
                  )}
                </div>
              </div>

              <button onClick={resetAll} className="flex items-center gap-2 text-sm w-full px-4 py-3 rounded-xl mb-2 transition-transform active:scale-95" style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}`, color: COLORS.ink }}>
                <RotateCcw size={16} /> 모든 데이터 초기화
              </button>
              <button onClick={logout} className="flex items-center gap-2 text-sm w-full px-4 py-3 rounded-xl transition-transform active:scale-95" style={{ background: COLORS.card, border: `1px solid ${COLORS.ruleLine}`, color: "#B3261E" }}>
                <LogOut size={16} /> 로그아웃
              </button>
            </div>
          )}
          </div>
          )}

          <div style={{ borderTop: `1px solid ${COLORS.ruleLine}`, background: "rgba(255,253,252,.94)", boxShadow: "0 -8px 24px rgba(119,84,80,.05)" }} className="flex items-center justify-around py-3">
            <button onClick={() => setActiveTab("home")} className="flex flex-col items-center gap-0.5" style={{ color: activeTab === "home" ? COLORS.ink : COLORS.muted, opacity: activeTab === "home" ? 1 : 0.5 }}>
              <Home size={19} /><span className="text-xs font-medium">홈</span>
            </button>
            <button onClick={() => setActiveTab("calendar")} className="flex flex-col items-center gap-0.5" style={{ color: activeTab === "calendar" ? COLORS.ink : COLORS.muted, opacity: activeTab === "calendar" ? 1 : 0.5 }}>
              <CalendarDays size={19} /><span className="text-xs">캘린더</span>
            </button>
            <button onClick={() => setActiveTab("settings")} className="flex flex-col items-center gap-0.5" style={{ color: activeTab === "settings" ? COLORS.ink : COLORS.muted, opacity: activeTab === "settings" ? 1 : 0.5 }}>
              <Settings size={19} /><span className="text-xs">설정</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
