import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Calculator, Delete, ArrowLeftRight, TrendingUp, TrendingDown, Ghost, Fingerprint, Lock,
  Radar, Workflow, PieChart, Swords, DoorOpen, Plus, Coins, Users, Zap, Check, Clock,
  ArrowRight, AlertTriangle, ShieldCheck, Copy, Eye, EyeOff, Wallet, Server, Building2,
  Github, Bot, FileText, Globe, X, Sparkles, RotateCcw, Target, Timer, Crown, KeyRound,
  Handshake, BadgeDollarSign, Banknote, Send, CheckCircle2, Activity, Ban, CornerUpLeft,
  Settings, Database, Smartphone, UserCircle2, Save,
} from 'lucide-react';

/* =====================================================================
   GHOST VENTURE STUDIO — yopiq startap fabrikasi
   Kirish nuqtasi: Ghost-Lock (valyuta kalkulyatori niqobi), kod: 7700 =
   ===================================================================== */

const STORE_PREFIX = 'gvs:v1:';
const DEFAULT_PINS = { sardor: '7700', temur: '1122', malika: '3344', javohir: '5566', bekzod: '7788' };
const FALLBACK_HASH = '#A9F-8821';
const watermarkText = (code) => `MAXFIY • ID: ${code} • IP LOGGED`;
const OPS = ['+', '−', '×', '÷'];
const STAKE_STEP = 25;
const PENALTY_SHARE = 0.02;
const INVITE_TTL_MS = 15 * 60 * 1000;
const DAY_MS = 86400000;
const HOUR_MS = 3600000;

const ROLES = {
  arxitektor: { label: 'Arxitektor', member: 'sardor' },
  backend: { label: 'Backend', member: 'temur' },
  dizayner: { label: 'Dizayner', member: 'malika' },
  marketing: { label: 'Marketing', member: 'javohir' },
  sotuvchi: { label: 'Sotuvchi', member: 'bekzod' },
};

const MEMBER_SEED = [
  {
    id: 'sardor', name: 'Sardor', founder: true, code: 'FOUNDER-01', role: 'Venture Architect', roleUz: 'Venchur arxitektor',
    points: 1450, reliability: 100, inactiveDays: 0, lastActive: 'Hozir onlayn', color: '#f59e0b',
    stats: { Strategiya: 98, Kod: 62, Dizayn: 55, Sotuv: 81, Trafik: 70 },
    perk: 'Studiya fondi va exit muzokaralarini boshqaradi',
  },
  {
    id: 'temur', name: 'Temur', code: 'BACKEND-02', role: 'Full-Stack AI Engineer', roleUz: 'Full-stack AI muhandis',
    points: 1180, reliability: 96, inactiveDays: 0, lastActive: '12 daqiqa oldin', color: '#10b981',
    stats: { Strategiya: 70, Kod: 97, Dizayn: 48, Sotuv: 35, Trafik: 40 },
    perk: 'LLM agentlar, Payme va Click integratsiyasi',
  },
  {
    id: 'malika', name: 'Malika', code: 'DESIGN-03', role: 'UI/UX & No-Code Master', roleUz: 'UI/UX va no-code ustasi',
    points: 860, reliability: 92, inactiveDays: 0, lastActive: '1 soat oldin', color: '#22d3ee',
    stats: { Strategiya: 64, Kod: 58, Dizayn: 96, Sotuv: 42, Trafik: 61 },
    perk: 'Figma maketidan WebAppgacha 48 soatda',
  },
  {
    id: 'javohir', name: 'Javohir', code: 'GROWTH-04', role: 'Growth & Traffic Hacker', roleUz: 'O‘sish va trafik xakeri',
    points: 720, reliability: 89, inactiveDays: 1, lastActive: 'Kecha, 22:40', color: '#a78bfa',
    stats: { Strategiya: 66, Kod: 44, Dizayn: 57, Sotuv: 72, Trafik: 95 },
    perk: '38 ta Telegram kanaldan iborat reklama tarmog‘i',
  },
  {
    id: 'bekzod', name: 'Bekzod', code: 'SALES-05', role: 'B2B Closer (Sotuvchi)', roleUz: 'B2B sotuvchi',
    points: 390, reliability: 74, inactiveDays: 5, lastActive: '5 kun oldin', color: '#fb7185',
    stats: { Strategiya: 50, Kod: 12, Dizayn: 20, Sotuv: 88, Trafik: 46 },
    perk: 'Klinika rahbarlari bilan bevosita aloqa',
  },
];

const IDEA_SEED = [
  {
    id: 'dent', title: 'Stomatologiyalar uchun AI-Sotuvchi va Mini-CRM',
    audience: 'Xususiy stomatologiya klinikalari', price: 49, exit: 35000, mvpDays: 21,
    desc: 'Telegram va Instagramdagi murojaatlarga 24/7 javob beradi, bemorni qabulga yozadi va eslatma yuboradi.',
    clients: ['Dr. Alisher Klinikasi', 'Smile Line Dental', 'Oq Marvarid Stomatologiyasi'],
    stakes: 340, myStakes: { sardor: 100, temur: 120, malika: 60, bekzod: 60 }, status: 'konveyerda', author: 'Sardor',
  },
  {
    id: 'edu', title: 'O‘quv markazlari uchun Davomat va To‘lov Nazorati',
    audience: 'Xususiy o‘quv markazlari va IELTS kurslari', price: 29, exit: 30000, mvpDays: 21,
    desc: 'O‘quvchi davomati, oylik to‘lov qarzdorligi va ota-onaga avtomatik Telegram hisobot.',
    clients: ['Bilim Plus o‘quv markazi', 'IELTS Pro Akademiyasi', 'Kelajak Ta’lim'],
    stakes: 210, myStakes: { sardor: 50, malika: 110, javohir: 50 }, status: 'ochilgan', author: 'Malika',
  },
  {
    id: 'auto', title: 'Avtosalonlar uchun Telegram Lead-Bot',
    audience: 'Avtosalonlar va avtoservis tarmoqlari', price: 39, exit: 28000, mvpDays: 21,
    desc: 'Kredit kalkulyatori, test-drayvga yozilish va menejerga issiq lead yuborish.',
    clients: ['Avto Lider Sergeli', 'Motor City Servis'],
    stakes: 180, myStakes: { sardor: 25, javohir: 105, bekzod: 50 }, status: 'sinovda', author: 'Javohir',
  },
  {
    id: 'cargo', title: 'Logistika firmalari uchun Yuk Kuzatuv Paneli',
    audience: 'Yuk tashuvchi va ekspeditorlik kompaniyalari', price: 59, exit: 40000, mvpDays: 21,
    desc: 'Haydovchi Telegram orqali joylashuvni yuboradi, mijoz yuk holatini havola orqali kuzatadi.',
    clients: ['Silk Cargo Express', 'Tez Yuk Logistika'],
    stakes: 150, myStakes: { temur: 100, javohir: 50 }, status: 'sinovda', author: 'Temur',
  },
  {
    id: 'build', title: 'Qurilish mollari do‘konlari uchun Ombor-Bot',
    audience: 'Qurilish mollari do‘konlari va bozor rastalari', price: 35, exit: 25000, mvpDays: 21,
    desc: 'Qoldiq nazorati, nasiya daftari va ulgurji mijozlarga narx-navo tarqatish.',
    clients: ['Usta Qurilish Mollari'],
    stakes: 90, myStakes: { bekzod: 65, malika: 25 }, status: 'sinovda', author: 'Bekzod',
  },
  {
    id: 'resto', title: 'Restoranlar uchun QR-Menyu va Sharh Yig‘uvchi',
    audience: 'Kafe, choyxona va restoran tarmoqlari', price: 25, exit: 22000, mvpDays: 21,
    desc: 'Stol ustidagi QR orqali menyu, ofitsiantni chaqirish va salbiy sharhni ichkarida ushlab qolish.',
    clients: [],
    stakes: 40, myStakes: { javohir: 40 }, status: 'sinovda', author: 'Javohir',
  },
];

const PRESALE_POOL = [
  'Rayhon Milliy Taomlar', 'Baraka Market', 'Navro‘z Mebel', 'Darvoza Avto Servis', 'Yangi Avlod Maktabi',
  'Shifo Med Klinikasi', 'Toshkent Logistik Markaz', 'Grand Qurilish', 'Mega Avto Servis', 'Lazzat Kafe Tarmog‘i',
  'Oltin Vodiy Agro', 'Iqbol Ta’lim Markazi',
];

const TASK_SEED = [
  { id: 't1', projectId: 'dent', title: 'Bemorlarni Telegram orqali qabulga yozuvchi AI-dialog oqimi', role: 'backend', points: 120, column: 'progress' },
  { id: 't2', projectId: 'dent', title: 'Klinika ma’muri uchun bemorlar kartasi sahifasi', role: 'dizayner', points: 80, column: 'progress' },
  { id: 't3', projectId: 'dent', title: 'Chilonzordagi 5 ta klinikada demo uchrashuv o‘tkazish', role: 'sotuvchi', points: 100, column: 'progress' },
  { id: 't4', projectId: 'dent', title: 'Payme va Click to‘lov webhooklarini ulash', role: 'backend', points: 90, column: 'review' },
  { id: 't5', projectId: 'dent', title: 'Instagram Reels: “AI-administrator 24/7” kampaniyasi', role: 'marketing', points: 70, column: 'review' },
  { id: 't6', projectId: 'dent', title: 'MVP arxitekturasi va ma’lumotlar sxemasi', role: 'arxitektor', points: 150, column: 'done' },
  { id: 't7', projectId: 'dent', title: 'Landing sahifa dizayni va tarif bloklari', role: 'dizayner', points: 60, column: 'done' },
];

const AI_TASK_POOL = [
  { title: 'Mijozlar uchun onboarding Telegram-bot ssenariysi', role: 'backend', points: 110 },
  { title: 'Admin panelda kunlik tushum grafigi', role: 'backend', points: 95 },
  { title: 'SMS-eslatma xizmatini ulash va shablonlar', role: 'backend', points: 85 },
  { title: 'Server xarajatlarini optimallashtirish (VPS → serverless)', role: 'backend', points: 100 },
  { title: 'Mobil WebApp uchun qorong‘i rejim interfeysi', role: 'dizayner', points: 70 },
  { title: 'Narxlar sahifasi uchun 3 ta tarif kartasi', role: 'dizayner', points: 60 },
  { title: 'Demo-video ssenariysi va montaji (90 soniya)', role: 'dizayner', points: 75 },
  { title: '10 ta potensial mijozga sovuq qo‘ng‘iroq va uchrashuv belgilash', role: 'sotuvchi', points: 100 },
  { title: 'Pilot shartnoma shablonini tayyorlash', role: 'sotuvchi', points: 75 },
  { title: 'Birinchi 3 mijozdan video-sharh olish', role: 'sotuvchi', points: 90 },
  { title: 'Toshkent bo‘yicha 50 ta lead bazasini yig‘ish', role: 'marketing', points: 80 },
  { title: 'Telegram kanallarda reklama A/B testi', role: 'marketing', points: 90 },
  { title: 'Google Maps profillari orqali raqobatchilar tahlili', role: 'marketing', points: 65 },
  { title: 'Mijoz fikrini yig‘ish uchun NPS so‘rovnomasi', role: 'marketing', points: 55 },
  { title: 'Unit-iqtisodiyot: CAC va LTV hisob-kitobi', role: 'arxitektor', points: 85 },
  { title: 'Investor uchun 10 slayddan iborat pitch-deck', role: 'arxitektor', points: 90 },
];

const PAYMENT_SEED = [
  { id: 'p1', client: 'Dr. Alisher Klinikasi', amount: 500000, method: 'Payme', time: '09:14' },
  { id: 'p2', client: 'Smile Line Dental (Yunusobod)', amount: 750000, method: 'Click', time: '09:52' },
  { id: 'p3', client: 'Oq Marvarid Stomatologiyasi', amount: 600000, method: 'Payme', time: '10:31' },
  { id: 'p4', client: 'Dental Pro Samarqand', amount: 990000, method: 'Click', time: '11:08' },
  { id: 'p5', client: 'Dr. Nodira Klinikasi', amount: 450000, method: 'Payme', time: '12:45' },
  { id: 'p6', client: 'Family Dent (Sergeli)', amount: 750000, method: 'Click', time: '14:20' },
];

const PAYMENT_CLIENTS = [
  'Dr. Alisher Klinikada', 'Dr. Kamola Stomatologiyasi', 'Tabassum Dental (Mirobod)', 'Oq Tish Klinikasi',
  'Implant Markazi Buxoro', 'Dr. Rustam Ortodontiya', 'Shifo Dent (Namangan)', 'Premium Smile Toshkent',
  'Dental Lux Andijon', 'Bolalar Stomatologiyasi “Quvonch”',
];
const PAYMENT_AMOUNTS = [350000, 450000, 500000, 600000, 750000, 990000, 1200000];

const EVENT_SEED = [
  { id: 'e1', time: '08:40', text: 'Sardor: “MVP arxitekturasi” tayyor', delta: 150, color: '#f59e0b' },
  { id: 'e2', time: '10:05', text: 'Malika: “Landing sahifa dizayni” tayyor', delta: 60, color: '#22d3ee' },
  { id: 'e3', time: '11:30', text: 'Bekzod: 3 kunlik nofaollik ogohlantirishi', delta: 0, color: '#fb7185' },
];

const INVITE_SEED = [
  { id: 'i0', code: 'GVS-M7QK-24XA', tgId: '584120377', role: 'Dizayner', createdAt: Date.now() - 9 * DAY_MS, expiresAt: Date.now() - 9 * DAY_MS + INVITE_TTL_MS, status: 'ishlatilgan', usedBy: '@malika_ux' },
];

const INVESTORS = [
  { name: 'Turon Angel Club', note: 'SaaS va B2B avtomatlashtirishga ixtisoslashgan' },
  { name: 'Zarafshon Ventures', note: 'Markaziy Osiyo bo‘yicha erta bosqich fondi' },
  { name: 'Navoiy Tech Fund', note: 'Tayyor biznes sotib oluvchi strategik investor' },
  { name: 'Orient Bridge Capital', note: 'Diaspora tadbirkorlari sindikati' },
];

const MRR_HISTORY = [
  { m: 'May', v: 980 }, { m: 'Iyun', v: 1420 }, { m: 'Iyul', v: 1860 },
  { m: 'Avg', v: 2310 }, { m: 'Sen', v: 2780 }, { m: 'Okt', v: 3150 },
];

const SALE_ASSETS = [
  { icon: Github, title: 'GitHub repozitoriy', detail: 'Monorepo, 1 240 ta commit, CI/CD sozlangan' },
  { icon: Bot, title: 'Telegram Bot + WebApp', detail: '@DentAI_bot, 3 860 faol foydalanuvchi' },
  { icon: FileText, title: 'Mijoz shartnomalari', detail: '42 ta imzolangan B2B shartnoma' },
  { icon: Globe, title: 'Domen va brend', detail: 'dentai.uz, logotip va brendbuk' },
];

const RATES = [
  { code: 'USD', name: 'AQSh dollari', rate: 12650.4, change: 0.12 },
  { code: 'EUR', name: 'Yevro', rate: 13718.25, change: -0.08 },
  { code: 'RUB', name: 'Rossiya rubli', rate: 128.36, change: 0.21 },
  { code: 'KZT', name: 'Qozog‘iston tengesi', rate: 24.87, change: -0.03 },
  { code: 'GBP', name: 'Angliya funti', rate: 16024.1, change: 0.05 },
  { code: 'CNY', name: 'Xitoy yuani', rate: 1774.6, change: 0.02 },
];

const TABS = [
  { id: 'radar', label: 'Radar', sub: 'G‘oyalar Bunkeri', icon: Radar },
  { id: 'konveyer', label: 'Konveyer', sub: '21-kunlik sprint', icon: Workflow },
  { id: 'cap', label: 'Cap-Table', sub: 'Ulush va Kassa', icon: PieChart },
  { id: 'squad', label: 'Squad RPG', sub: 'Oltin Jamoa', icon: Swords },
  { id: 'exit', label: 'Exit Room', sub: 'Investor vitrini', icon: DoorOpen },
];

/* ----------------------------- Yordamchilar ----------------------------- */

const uid = (p) => `${p}${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
const groupDigits = (n) => Math.round(n).toLocaleString('en-US').replace(/,/g, ' ');
const fmtUZS = (n) => `${groupDigits(n)} UZS`;
const fmtUSD = (n) => `$${Math.round(n).toLocaleString('en-US')}`;
const pad2 = (n) => String(n).padStart(2, '0');
const clockNow = () => { const d = new Date(); return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`; };
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomCode = (len) => {
  const abc = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < len; i += 1) out += abc[Math.floor(Math.random() * abc.length)];
  return out;
};
const splitDuration = (ms) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  return { d: Math.floor(s / 86400), h: Math.floor((s % 86400) / 3600), m: Math.floor((s % 3600) / 60), s: s % 60 };
};
const memberColor = (members, id) => (members.find((m) => m.id === id) || {}).color || '#94a3b8';

function readStore(key, fallback) {
  try {
    const raw = window.localStorage.getItem(STORE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    return fallback;
  }
}
function writeStore(key, value) {
  try { window.localStorage.setItem(STORE_PREFIX + key, JSON.stringify(value)); return true; } catch (e) { return false; }
}
function clearStore() {
  try {
    const keys = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith(STORE_PREFIX)) keys.push(k);
    }
    keys.forEach((k) => window.localStorage.removeItem(k));
    return true;
  } catch (e) {
    return false;
  }
}
function storageAvailable() {
  try {
    const k = `${STORE_PREFIX}__probe`;
    window.localStorage.setItem(k, '1');
    window.localStorage.removeItem(k);
    return true;
  } catch (e) {
    return false;
  }
}
function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => readStore(key, typeof initial === 'function' ? initial() : initial));
  useEffect(() => { writeStore(key, value); }, [key, value]);
  return [value, setValue];
}

function fnv1a(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}
function computeDeviceFingerprint() {
  try {
    const nav = window.navigator || {};
    const scr = window.screen || {};
    let canvasSig = '';
    try {
      const c = document.createElement('canvas');
      c.width = 220; c.height = 40;
      const ctx = c.getContext('2d');
      if (ctx) {
        ctx.textBaseline = 'top';
        ctx.font = '16px Arial';
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(10, 5, 90, 22);
        ctx.fillStyle = '#10b981';
        ctx.fillText('Ghost-Lock ✓ 7700', 4, 12);
        canvasSig = c.toDataURL();
      }
    } catch (e) {
      canvasSig = 'no-canvas';
    }
    let tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { tz = ''; }
    const parts = [
      nav.userAgent, nav.language, (nav.languages || []).join(','), nav.platform, nav.hardwareConcurrency,
      nav.deviceMemory, nav.maxTouchPoints, scr.width, scr.height, scr.colorDepth, window.devicePixelRatio, tz, canvasSig,
    ].join('|');
    const a = fnv1a(parts).toString(16).toUpperCase().padStart(8, '0');
    const b = fnv1a(`${parts}#salt`).toString(16).toUpperCase().padStart(8, '0');
    return { hash: `#${a.slice(0, 3)}-${b.slice(0, 4)}`, components: [
      { k: 'Brauzer', v: (nav.userAgent || '').split(') ')[0].replace('(', '').slice(0, 48) || 'Noma’lum' },
      { k: 'Ekran', v: `${scr.width || '?'}×${scr.height || '?'} @${window.devicePixelRatio || 1}x` },
      { k: 'Til / vaqt mintaqasi', v: `${nav.language || '?'} · ${tz || '?'}` },
      { k: 'Protsessor yadrolari', v: String(nav.hardwareConcurrency || '?') },
      { k: 'Canvas imzosi', v: fnv1a(canvasSig).toString(16).toUpperCase() },
    ] };
  } catch (e) {
    return { hash: FALLBACK_HASH, components: [] };
  }
}

function useNow(interval = 1000) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), interval);
    return () => clearInterval(t);
  }, [interval]);
  return now;
}

function evaluateExpression(expr) {
  const tokens = [];
  let num = '';
  for (const ch of expr) {
    if (/[0-9.]/.test(ch)) { num += ch; continue; }
    if (num) { tokens.push(num); num = ''; }
    if (ch === '%') { tokens.push('%'); continue; }
    if (OPS.includes(ch)) {
      const prev = tokens[tokens.length - 1];
      if (ch === '−' && (prev === undefined || OPS.includes(prev))) { num = '-'; continue; }
      tokens.push(ch);
    }
  }
  if (num) tokens.push(num);
  const prec = { '+': 1, '−': 1, '×': 2, '÷': 2 };
  const output = [];
  const stack = [];
  for (const t of tokens) {
    if (t === '%') { output.push('%'); continue; }
    if (OPS.includes(t)) {
      while (stack.length && prec[stack[stack.length - 1]] >= prec[t]) output.push(stack.pop());
      stack.push(t);
    } else {
      const v = parseFloat(t);
      if (Number.isNaN(v)) return null;
      output.push(v);
    }
  }
  while (stack.length) output.push(stack.pop());
  const values = [];
  for (const t of output) {
    if (typeof t === 'number') { values.push(t); continue; }
    if (t === '%') { if (!values.length) return null; values.push(values.pop() / 100); continue; }
    if (values.length < 2) return null;
    const b = values.pop();
    const a = values.pop();
    if (t === '+') values.push(a + b);
    else if (t === '−') values.push(a - b);
    else if (t === '×') values.push(a * b);
    else values.push(b === 0 ? NaN : a / b);
  }
  return values.length === 1 ? values[0] : null;
}

const watermarkUrl = (code) => `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="420" height="220"><text x="10" y="130" transform="rotate(-24 210 110)" font-family="monospace" font-size="15" letter-spacing="2" fill="rgba(16,185,129,0.075)">${watermarkText(code)}</text></svg>`,
)}")`;

/* --------------------------- Umumiy UI bo‘laklari --------------------------- */

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Chakra+Petch:wght@500;600;700&family=IBM+Plex+Sans:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
.gvs-root{font-family:'IBM Plex Sans',ui-sans-serif,system-ui,-apple-system,'Segoe UI',sans-serif}
.f-display{font-family:'Chakra Petch','IBM Plex Sans',ui-sans-serif,system-ui,sans-serif;letter-spacing:.02em}
.f-mono{font-family:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-variant-numeric:tabular-nums}
.tnum{font-variant-numeric:tabular-nums}
@keyframes gvsFadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
@keyframes gvsGlow{0%,100%{box-shadow:0 0 0 0 rgba(16,185,129,.55),0 0 18px rgba(16,185,129,.35)}50%{box-shadow:0 0 0 6px rgba(16,185,129,0),0 0 28px rgba(16,185,129,.6)}}
@keyframes gvsScan{from{transform:translateY(-100%)}to{transform:translateY(100vh)}}
@keyframes gvsBar{from{width:0}to{width:100%}}
@keyframes gvsLine{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:none}}
@keyframes gvsFlash{0%{background:rgba(16,185,129,.25)}100%{background:transparent}}
@keyframes gvsSpin{to{transform:rotate(360deg)}}
.gvs-in{animation:gvsFadeUp .35s ease both}
.gvs-glow{animation:gvsGlow 1.8s ease-in-out infinite}
.gvs-flash{animation:gvsFlash 1.6s ease-out both}
.gvs-spin{animation:gvsSpin 1s linear infinite}
.gvs-line{opacity:0;animation:gvsLine .3s ease forwards}
.gvs-scan{animation:gvsScan 1.6s linear infinite}
.gvs-bar{animation:gvsBar 1.5s cubic-bezier(.6,.1,.3,1) forwards}
.gvs-scroll::-webkit-scrollbar{width:6px;height:6px}
.gvs-scroll::-webkit-scrollbar-thumb{background:#1e293b;border-radius:6px}
.gvs-root button:focus-visible,.gvs-root input:focus-visible,.gvs-root select:focus-visible,.gvs-root textarea:focus-visible{outline:2px solid #10b981;outline-offset:2px}
input[type=range].gvs-range{accent-color:#f59e0b}
@media (prefers-reduced-motion: reduce){.gvs-in,.gvs-glow,.gvs-flash,.gvs-line,.gvs-scan,.gvs-bar,.gvs-spin{animation:none!important;opacity:1!important}}
`;

const glass = 'bg-slate-900/60 backdrop-blur-xl border border-slate-800/80';

function Panel({ className = '', children }) {
  return <section className={`${glass} rounded-xl ${className}`}>{children}</section>;
}

function PanelTitle({ icon: Icon, title, hint, right }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <div className="flex items-center gap-2.5 min-w-0">
        {Icon && <Icon className="w-4 h-4 text-emerald-400 shrink-0" />}
        <div className="min-w-0">
          <h3 className="f-display text-slate-100 text-sm font-semibold uppercase tracking-wider">{title}</h3>
          {hint && <p className="text-xs text-slate-500 mt-0.5">{hint}</p>}
        </div>
      </div>
      {right}
    </div>
  );
}

function Stat({ label, value, sub, tone = 'slate' }) {
  const tones = { slate: 'text-slate-100', emerald: 'text-emerald-400', gold: 'text-amber-400', rose: 'text-rose-400' };
  return (
    <div className={`${glass} rounded-xl px-4 py-3 min-w-0`}>
      <div className="text-[11px] uppercase tracking-wider text-slate-500">{label}</div>
      <div className={`f-mono text-lg sm:text-xl font-bold mt-1 truncate ${tones[tone]}`}>{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-0.5 truncate">{sub}</div>}
    </div>
  );
}

function Btn({ children, onClick, variant = 'ghost', disabled, className = '', type = 'button', title }) {
  const variants = {
    primary: 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-semibold',
    gold: 'bg-amber-400 text-slate-950 hover:bg-amber-300 font-semibold',
    ghost: 'bg-slate-800/70 text-slate-200 hover:bg-slate-700/80 border border-slate-700/70',
    outline: 'border border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10',
    danger: 'bg-rose-500/15 text-rose-300 border border-rose-500/40 hover:bg-rose-500/25',
  };
  return (
    <button
      type={type}
      title={title}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm transition disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

function Chip({ children, tone = 'slate', className = '' }) {
  const tones = {
    slate: 'bg-slate-800 text-slate-300 border-slate-700',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/40',
    gold: 'bg-amber-400/10 text-amber-300 border-amber-400/40',
    rose: 'bg-rose-500/10 text-rose-300 border-rose-500/40',
    cyan: 'bg-cyan-400/10 text-cyan-300 border-cyan-400/40',
  };
  return <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${tones[tone]} ${className}`}>{children}</span>;
}

function Bar({ value, color = '#10b981', height = 'h-2' }) {
  return (
    <div className={`w-full ${height} rounded-full bg-slate-800 overflow-hidden`}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.max(0, Math.min(100, value))}%`, background: color }} />
    </div>
  );
}

function Avatar({ member, size = 'w-10 h-10 text-sm' }) {
  return (
    <div
      className={`${size} rounded-lg grid place-items-center f-display font-bold shrink-0`}
      style={{ background: `${member.color}22`, color: member.color, border: `1px solid ${member.color}66` }}
    >
      {member.name.slice(0, 2).toUpperCase()}
    </div>
  );
}

function Modal({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/80 backdrop-blur-sm p-4" onMouseDown={onClose}>
      <div className={`${glass} bg-slate-900/95 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto gvs-scroll gvs-in`} onMouseDown={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800">
          <h3 className="f-display text-slate-100 font-semibold uppercase tracking-wider text-sm">{title}</h3>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-100 p-1 rounded" aria-label="Yopish"><X className="w-4 h-4" /></button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ id, label, error, children }) {
  return (
    <label htmlFor={id} className="block">
      <span className="text-xs uppercase tracking-wider text-slate-400">{label}</span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="text-xs text-rose-400 mt-1 block">{error}</span>}
    </label>
  );
}

const inputCls = 'w-full rounded-lg bg-slate-950/80 border border-slate-700 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:border-emerald-500 outline-none';

function CopyField({ id, value, onCopied, onFallback, label = 'Nusxalash' }) {
  const ref = useRef(null);
  const copy = () => {
    const done = () => onCopied && onCopied();
    const fallback = () => { if (ref.current) { ref.current.focus(); ref.current.select(); } if (onFallback) onFallback(); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(value).then(done).catch(fallback);
    else fallback();
  };
  return (
    <div className="flex gap-2 min-w-0">
      <input id={id} ref={ref} readOnly value={value} className={`${inputCls} f-mono text-xs min-w-0`} onFocus={(e) => e.target.select()} />
      <Btn variant="outline" onClick={copy} className="shrink-0"><Copy className="w-4 h-4" />{label}</Btn>
    </div>
  );
}

function Toasts({ items }) {
  return (
    <div className="fixed z-[70] right-4 left-4 sm:left-auto sm:w-96 flex flex-col gap-2 pointer-events-none" style={{ bottom: 'calc(env(safe-area-inset-bottom, 0px) + 88px)' }}>
      {items.map((t) => (
        <div key={t.id} className={`gvs-in ${glass} bg-slate-900/95 rounded-lg px-4 py-3 text-sm flex items-start gap-2.5 shadow-xl shadow-black/40`}>
          {t.tone === 'warn' ? <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />}
          <span className="text-slate-200">{t.text}</span>
        </div>
      ))}
    </div>
  );
}

/* ============================ 1. GHOST-LOCK ============================ */

const KEYPAD = [
  ['C', '⌫', '%', '÷'],
  ['7', '8', '9', '×'],
  ['4', '5', '6', '−'],
  ['1', '2', '3', '+'],
  ['00', '0', '.', '='],
];

function GhostLock({ onUnlock }) {
  const [expr, setExpr] = useState('');
  const [history, setHistory] = useState('');
  const [fresh, setFresh] = useState(false);
  const [amount, setAmount] = useState('100');
  const [currency, setCurrency] = useState('USD');
  const [toUzs, setToUzs] = useState(true);
  const today = new Date();
  const dateLabel = `${pad2(today.getDate())}.${pad2(today.getMonth() + 1)}.${today.getFullYear()}`;

  const exprRef = useRef(expr);
  exprRef.current = expr;
  const freshRef = useRef(fresh);
  freshRef.current = fresh;

  const press = (k) => {
    const current = exprRef.current;
    if (k === 'C') { setExpr(''); setHistory(''); setFresh(false); return; }
    if (k === '⌫') {
      if (freshRef.current) { setExpr(''); setFresh(false); return; }
      setExpr(current.slice(0, -1));
      return;
    }
    if (k === '=') {
      const pins = readStore('pins', DEFAULT_PINS);
      const memberId = Object.keys(pins).find((id) => pins[id] === current);
      if (memberId) { onUnlock(memberId); return; }
      if (!current) return;
      const v = evaluateExpression(current);
      setHistory(`${current} =`);
      setExpr(v === null || !Number.isFinite(v) ? 'Xato' : String(parseFloat(v.toPrecision(12))));
      setFresh(true);
      return;
    }
    let base = current;
    if (freshRef.current) base = (OPS.includes(k) || k === '%') && current !== 'Xato' ? current : '';
    if (base === 'Xato') base = '';
    setFresh(false);
    if (base.length >= 18) { setExpr(base); return; }
    const last = base.slice(-1);
    let next = base;
    if (OPS.includes(k)) {
      if (!base) next = k === '−' ? '−' : '';
      else if (OPS.includes(last)) next = base.length === 1 ? (k === '−' ? '−' : '') : base.slice(0, -1) + k;
      else next = base + k;
    } else if (k === '%') {
      if (base && !OPS.includes(last) && last !== '%') next = `${base}%`;
    } else if (k === '.') {
      const seg = base.split(/[+−×÷]/).pop();
      if (!seg.includes('.')) next = base + (seg === '' ? '0.' : '.');
    } else {
      next = last === '%' ? `${base}×${k}` : base + k;
    }
    setExpr(next);
  };

  useEffect(() => {
    const map = { '*': '×', '/': '÷', '-': '−', '+': '+', Enter: '=', '=': '=', Backspace: '⌫', Escape: 'C', '%': '%', '.': '.', ',': '.' };
    const onKey = (e) => {
      if (e.target && ['INPUT', 'SELECT', 'TEXTAREA'].includes(e.target.tagName)) return;
      const k = /^[0-9]$/.test(e.key) ? e.key : map[e.key];
      if (k) { e.preventDefault(); press(k); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const rate = RATES.find((r) => r.code === currency).rate;
  const numericAmount = parseFloat(String(amount).replace(/\s/g, '').replace(',', '.')) || 0;
  const converted = toUzs ? numericAmount * rate : numericAmount / rate;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 gvs-root" style={{ paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))', paddingRight: 'max(16px, env(safe-area-inset-right, 0px))' }}>
      <div className="max-w-5xl mx-auto py-6 sm:py-10">
        <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-500/30 grid place-items-center"><Calculator className="w-5 h-5 text-sky-400" /></div>
            <div>
              <h1 className="text-lg font-semibold text-slate-100">Valyuta Kurslari va Kalkulyator</h1>
              <p className="text-xs text-slate-500">Kunlik kurslar va oddiy hisob-kitob</p>
            </div>
          </div>
          <span className="text-xs text-slate-500 f-mono">{dateLabel} · yangilangan 09:00</span>
        </header>

        <div className="grid gap-5 lg:grid-cols-[1fr_380px]">
          <div className="grid gap-5 min-w-0 content-start">
            <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5">
              <h2 className="text-sm font-medium text-slate-300 mb-3">Bugungi kurslar (1 birlik = UZS)</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {RATES.map((r) => (
                  <button
                    type="button"
                    key={r.code}
                    onClick={() => setCurrency(r.code)}
                    className={`text-left rounded-xl px-3 py-2.5 border transition ${currency === r.code ? 'border-sky-500/60 bg-sky-500/10' : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-slate-100">{r.code}</span>
                      <span className={`text-[11px] f-mono flex items-center gap-0.5 ${r.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {r.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}{r.change > 0 ? '+' : ''}{r.change.toFixed(2)}%
                      </span>
                    </div>
                    <div className="f-mono text-base text-slate-200 mt-1">{r.rate.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).replace(/,/g, ' ')}</div>
                    <div className="text-[11px] text-slate-500 truncate">{r.name}</div>
                  </button>
                ))}
              </div>
            </section>

            <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5">
              <h2 className="text-sm font-medium text-slate-300 mb-3">Valyuta konvertori</h2>
              <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr] items-end">
                <label htmlFor="conv-amount" className="block min-w-0">
                  <span className="text-xs text-slate-500">{toUzs ? currency : 'UZS'} miqdori</span>
                  <input id="conv-amount" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2.5 f-mono text-slate-100 outline-none focus:border-sky-500" />
                </label>
                <button type="button" onClick={() => setToUzs((v) => !v)} className="h-11 w-11 justify-self-center rounded-lg border border-slate-700 bg-slate-950 grid place-items-center text-slate-300 hover:text-sky-400" aria-label="Yo‘nalishni almashtirish">
                  <ArrowLeftRight className="w-4 h-4" />
                </button>
                <div className="min-w-0">
                  <span className="text-xs text-slate-500">Natija ({toUzs ? 'UZS' : currency})</span>
                  <div className="mt-1 rounded-lg bg-slate-950 border border-slate-800 px-3 py-2.5 f-mono text-sky-300 truncate">
                    {converted.toLocaleString('en-US', { maximumFractionDigits: 2 }).replace(/,/g, ' ')}
                  </div>
                </div>
              </div>
              <label htmlFor="conv-currency" className="block mt-3">
                <span className="text-xs text-slate-500">Valyuta</span>
                <select id="conv-currency" value={currency} onChange={(e) => setCurrency(e.target.value)} className="mt-1 w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2.5 text-sm text-slate-100 outline-none focus:border-sky-500">
                  {RATES.map((r) => <option key={r.code} value={r.code}>{r.code} — {r.name}</option>)}
                </select>
              </label>
            </section>
          </div>

          <section className="rounded-2xl bg-slate-900 border border-slate-800 p-4 sm:p-5 self-start">
            <div className="rounded-xl bg-slate-950 border border-slate-800 px-4 py-4 mb-4 text-right min-h-[96px] flex flex-col justify-end">
              <div className="text-xs text-slate-500 f-mono h-4 truncate">{history}</div>
              <div className="f-mono text-3xl sm:text-4xl text-slate-100 mt-1 break-all" aria-live="polite">{expr || '0'}</div>
            </div>
            <div className="grid grid-cols-4 gap-2.5">
              {KEYPAD.flat().map((k) => {
                const isOp = OPS.includes(k) || k === '%';
                const isEq = k === '=';
                const isFn = k === 'C' || k === '⌫';
                return (
                  <button
                    type="button"
                    key={k}
                    onClick={() => press(k)}
                    className={`h-14 sm:h-16 rounded-xl text-xl f-mono transition active:scale-95 ${isEq ? 'bg-sky-500 text-slate-950 hover:bg-sky-400 font-bold' : isOp ? 'bg-slate-800 text-sky-300 hover:bg-slate-700' : isFn ? 'bg-slate-800 text-rose-300 hover:bg-slate-700' : 'bg-slate-950 border border-slate-800 text-slate-100 hover:bg-slate-800'}`}
                    aria-label={k === '⌫' ? 'O‘chirish' : k}
                  >
                    {k === '⌫' ? <Delete className="w-5 h-5 mx-auto" /> : k}
                  </button>
                );
              })}
            </div>
          </section>
        </div>
        <p className="text-center text-[11px] text-slate-600 mt-8">Kurslar ma’lumot uchun ko‘rsatilgan. Bank va almashtirish shoxobchalaridagi kurs farq qilishi mumkin.</p>
      </div>
    </div>
  );
}

function UnlockSequence({ member, deviceHash }) {
  const lines = [
    `Qurilma izi tekshirilmoqda… ${deviceHash}`,
    `Taklif kaliti tasdiqlandi: ${member.code}`,
    'Shifrlangan kanal ochildi (AES-256)',
    `Profil yuklanmoqda: ${member.name} · ${member.role}`,
  ];
  return (
    <div className="fixed inset-0 z-[80] bg-slate-950 grid place-items-center overflow-hidden gvs-root">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-emerald-500/0 via-emerald-500/10 to-emerald-500/0 gvs-scan pointer-events-none" />
      <div className="w-full max-w-md px-6">
        <div className="flex items-center gap-3 mb-6">
          <Ghost className="w-8 h-8 text-emerald-400" />
          <div className="f-display text-xl text-slate-100 font-bold tracking-widest">GHOST-LOCK</div>
        </div>
        <div className="f-mono text-sm space-y-2">
          {lines.map((l, i) => (
            <div key={l} className="gvs-line flex items-center gap-2 text-emerald-300" style={{ animationDelay: `${i * 0.3}s` }}>
              <span className="text-amber-400">&gt;</span>{l}
            </div>
          ))}
        </div>
        <div className="mt-6 h-1 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 gvs-bar" /></div>
      </div>
    </div>
  );
}

/* ============================ 2. RADAR ============================ */

const IDEA_STATUS = {
  sinovda: { label: 'Pre-sale sinovida', tone: 'slate' },
  ochilgan: { label: 'OCHILGAN', tone: 'emerald' },
  konveyerda: { label: 'Konveyerda', tone: 'gold' },
};

function NewIdeaModal({ author, onClose, onSave }) {
  const [form, setForm] = useState({ title: '', audience: '', price: '39', exit: '30000', mvpDays: '21', desc: '' });
  const [errors, setErrors] = useState({});
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const submit = (e) => {
    e.preventDefault();
    const next = {};
    if (form.title.trim().length < 6) next.title = 'Nom kamida 6 belgidan iborat bo‘lsin';
    if (form.audience.trim().length < 3) next.audience = 'Kim to‘lashini aniq yozing';
    if (!(Number(form.price) > 0)) next.price = 'Oylik narx musbat son bo‘lishi kerak';
    if (!(Number(form.exit) >= 1000)) next.exit = 'Sotuv narxi kamida $1 000';
    const days = Number(form.mvpDays);
    if (!(days >= 7 && days <= 60)) next.mvpDays = 'MVP muddati 7 dan 60 kungacha';
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave({
      id: uid('idea'), title: form.title.trim(), audience: form.audience.trim(), price: Number(form.price),
      exit: Number(form.exit), mvpDays: days, desc: form.desc.trim() || 'Muammo va yechim pre-sale suhbatlarida aniqlashtiriladi.',
      clients: [], stakes: 0, myStakes: {}, status: 'sinovda', author,
    });
  };
  return (
    <Modal title="Yangi g‘oya" onClose={onClose}>
      <form onSubmit={submit} className="grid gap-4">
        <Field id="idea-title" label="G‘oya nomi" error={errors.title}>
          <input id="idea-title" className={inputCls} value={form.title} onChange={set('title')} placeholder="Masalan: Dorixonalar uchun buyurtma-bot" />
        </Field>
        <Field id="idea-aud" label="Kim to‘laydi?" error={errors.audience}>
          <input id="idea-aud" className={inputCls} value={form.audience} onChange={set('audience')} placeholder="Masalan: Viloyatdagi xususiy dorixonalar" />
        </Field>
        <div className="grid grid-cols-3 gap-3">
          <Field id="idea-price" label="Oylik ($)" error={errors.price}>
            <input id="idea-price" type="number" min="1" className={`${inputCls} f-mono`} value={form.price} onChange={set('price')} />
          </Field>
          <Field id="idea-exit" label="Sotuv ($)" error={errors.exit}>
            <input id="idea-exit" type="number" min="1000" step="1000" className={`${inputCls} f-mono`} value={form.exit} onChange={set('exit')} />
          </Field>
          <Field id="idea-days" label="MVP (kun)" error={errors.mvpDays}>
            <input id="idea-days" type="number" min="7" max="60" className={`${inputCls} f-mono`} value={form.mvpDays} onChange={set('mvpDays')} />
          </Field>
        </div>
        <Field id="idea-desc" label="Muammo va yechim">
          <textarea id="idea-desc" rows={3} className={inputCls} value={form.desc} onChange={set('desc')} placeholder="Mijozning og‘rig‘i nima va biz uni qanday hal qilamiz?" />
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <Btn onClick={onClose}>Bekor qilish</Btn>
          <Btn type="submit" variant="primary"><Plus className="w-4 h-4" />Bunkerga qo‘shish</Btn>
        </div>
      </form>
    </Modal>
  );
}

function RadarTab({ me, ideas, setIdeas, stakeBalance, setStakeBalances, onPromote, onOpenProject, notify }) {
  const [filter, setFilter] = useState('all');
  const [showNew, setShowNew] = useState(false);
  const filters = [
    { id: 'all', label: 'Barchasi' },
    { id: 'sinovda', label: 'Sinovda' },
    { id: 'ochilgan', label: 'Ochilgan' },
    { id: 'konveyerda', label: 'Konveyerda' },
  ];
  const visible = ideas.filter((i) => filter === 'all' || i.status === filter);
  const unlocked = ideas.filter((i) => i.clients.length >= 3).length;
  const pipelineValue = ideas.reduce((a, i) => a + i.exit, 0);

  const stake = (id) => {
    if (stakeBalance < STAKE_STEP) { notify('Tikish balansi tugadi. Vazifa bajarib yangi ball yig‘ing.', 'warn'); return; }
    setStakeBalances((b) => ({ ...b, [me.id]: (b[me.id] ?? 500) - STAKE_STEP }));
    setIdeas((list) => list.map((i) => (i.id === id ? { ...i, stakes: i.stakes + STAKE_STEP, myStakes: { ...(i.myStakes || {}), [me.id]: ((i.myStakes || {})[me.id] || 0) + STAKE_STEP } } : i)));
  };

  const addClient = (id) => {
    const idea = ideas.find((i) => i.id === id);
    if (!idea || idea.clients.length >= 3) return;
    const used = new Set(ideas.flatMap((i) => i.clients));
    const pool = PRESALE_POOL.filter((c) => !used.has(c));
    const name = pool.length ? pick(pool) : `Mijoz #${Math.floor(100 + Math.random() * 900)}`;
    const clients = [...idea.clients, name];
    setIdeas((list) => list.map((i) => (i.id === id ? { ...i, clients, status: clients.length >= 3 && i.status === 'sinovda' ? 'ochilgan' : i.status } : i)));
    notify(clients.length >= 3 ? `“${idea.title}” ochildi: 3/3 mijoz oldindan rozi bo‘ldi` : `${name} pre-sale shartiga rozi bo‘ldi (${clients.length}/3)`);
  };

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="f-display text-2xl sm:text-3xl font-bold text-slate-100">Radar <span className="text-emerald-400">/</span> G‘oyalar Bunkeri</h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">Har bir g‘oya kod yozilishidan oldin 3 ta haqiqiy mijozning oldindan roziligini olishi shart. 3/3 bo‘lmaguncha konveyer yopiq.</p>
        </div>
        <Btn variant="primary" onClick={() => setShowNew(true)}><Plus className="w-4 h-4" />Yangi G‘oya</Btn>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Stat label="Bunkerdagi g‘oyalar" value={ideas.length} sub="B2B mikro-startaplar" />
        <Stat label="Pre-sale ochilgan" value={`${unlocked} ta`} sub="3/3 mijoz tasdiqlagan" tone="emerald" />
        <Stat label="Sizning tikish balansingiz" value={`${stakeBalance} ball`} sub={`Har tikish: ${STAKE_STEP} ball`} tone="gold" />
        <Stat label="Portfel exit qiymati" value={fmtUSD(pipelineValue)} sub="Maqsadli sotuv narxlari" />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f.id === 'all' ? ideas.length : ideas.filter((i) => i.status === f.id).length;
          return (
            <button type="button" key={f.id} onClick={() => setFilter(f.id)} className={`rounded-lg px-3 py-1.5 text-xs border transition ${filter === f.id ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300' : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-slate-200'}`}>
              {f.label} <span className="f-mono ml-1 text-slate-500">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((idea) => {
          const n = idea.clients.length;
          const open = n >= 3;
          const st = IDEA_STATUS[idea.status];
          return (
            <Panel key={idea.id} className={`p-4 sm:p-5 flex flex-col gap-4 gvs-in ${open && idea.status !== 'konveyerda' ? 'border-emerald-500/40' : ''}`}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-slate-100 font-semibold leading-snug" style={{ textWrap: 'balance' }}>{idea.title}</h3>
                <Chip tone={st.tone}>{st.label}</Chip>
              </div>
              <p className="text-sm text-slate-400 leading-relaxed">{idea.desc}</p>
              <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-sm">
                <div className="col-span-2"><dt className="text-[11px] uppercase tracking-wider text-slate-500">Kim to‘laydi?</dt><dd className="text-slate-200">{idea.audience}</dd></div>
                <div><dt className="text-[11px] uppercase tracking-wider text-slate-500">Oylik narx</dt><dd className="f-mono text-slate-100">${idea.price}/oy</dd></div>
                <div><dt className="text-[11px] uppercase tracking-wider text-slate-500">Sotuv narxi</dt><dd className="f-mono text-amber-400">{fmtUSD(idea.exit)}</dd></div>
                <div><dt className="text-[11px] uppercase tracking-wider text-slate-500">MVP muddati</dt><dd className="f-mono text-slate-100">{idea.mvpDays} kun</dd></div>
                <div><dt className="text-[11px] uppercase tracking-wider text-slate-500">Muallif</dt><dd className="text-slate-200">{idea.author}</dd></div>
              </dl>

              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5 text-slate-400"><Lock className="w-3.5 h-3.5" />Pre-Sale Qulfi (3 mijoz sinovi)</span>
                  <span className={`f-mono font-semibold ${open ? 'text-emerald-400' : 'text-slate-300'}`}>{n}/3 mijoz{open ? ' - OCHILGAN' : ''}</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className={`h-2 rounded-full transition-all duration-500 ${i < n ? (open ? 'bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,.6)]' : 'bg-amber-400') : 'bg-slate-800'}`} />
                  ))}
                </div>
                {n > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5">
                    {idea.clients.map((c) => <Chip key={c}><Check className="w-3 h-3 text-emerald-400" />{c}</Chip>)}
                  </div>
                )}
              </div>

              <div className="mt-auto grid gap-2">
                <div className="flex flex-wrap gap-2">
                  <Btn onClick={() => stake(idea.id)} className="flex-1" title={`${STAKE_STEP} ball tikish`}>
                    <Coins className="w-4 h-4 text-amber-400" />Ball tikish <span className="f-mono text-amber-300">{idea.stakes}</span>
                  </Btn>
                  <Btn onClick={() => addClient(idea.id)} disabled={open} className="flex-1">
                    <Users className="w-4 h-4 text-emerald-400" />+1 Pre-Sale Mijoz
                  </Btn>
                </div>
                {((idea.myStakes || {})[me.id] || 0) > 0 && <div className="text-[11px] text-slate-500">Sizning tikishingiz: <span className="f-mono text-amber-300">{idea.myStakes[me.id]} ball</span></div>}
                {open && idea.status !== 'konveyerda' && (
                  <Btn variant="primary" className="gvs-glow w-full" onClick={() => onPromote(idea.id)}>
                    <Zap className="w-4 h-4" />Konveyerga O‘tkazish<ArrowRight className="w-4 h-4" />
                  </Btn>
                )}
                {idea.status === 'konveyerda' && (
                  <Btn variant="outline" className="w-full" onClick={() => onOpenProject(idea.id)}>
                    <Workflow className="w-4 h-4" />Sprintni ko‘rish
                  </Btn>
                )}
              </div>
            </Panel>
          );
        })}
        {visible.length === 0 && (
          <Panel className="p-8 text-center md:col-span-2 xl:col-span-3">
            <Target className="w-6 h-6 text-slate-600 mx-auto mb-2" />
            <p className="text-slate-400 text-sm">Bu bo‘limda hozircha g‘oya yo‘q. Boshqa filtrni tanlang yoki yangi g‘oya qo‘shing.</p>
          </Panel>
        )}
      </div>

      {showNew && (
        <NewIdeaModal
          author={me.name}
          onClose={() => setShowNew(false)}
          onSave={(idea) => { setIdeas((list) => [idea, ...list]); setShowNew(false); setFilter('all'); notify(`“${idea.title}” bunkerga qo‘shildi. Endi 3 ta pre-sale mijoz toping.`); }}
        />
      )}
    </div>
  );
}

/* ============================ 3. KONVEYER ============================ */

const COLUMNS = [
  { id: 'progress', label: 'Bajarilmoqda', icon: Activity, tone: 'text-sky-400' },
  { id: 'review', label: 'Tekshiruvda', icon: Eye, tone: 'text-amber-400' },
  { id: 'done', label: 'Tayyor', icon: CheckCircle2, tone: 'text-emerald-400' },
];

function KonveyerTab({ me, ideas, projects, activeProjectId, setActiveProjectId, tasks, members, onMove, onComplete, onGenerate, aiBusy }) {
  const now = useNow(1000);
  const project = projects.find((p) => p.ideaId === activeProjectId);
  const idea = ideas.find((i) => i.id === activeProjectId);
  const projectTasks = tasks.filter((t) => t.projectId === activeProjectId);
  const totalPts = projectTasks.reduce((a, t) => a + t.points, 0);
  const donePts = projectTasks.filter((t) => t.column === 'done').reduce((a, t) => a + t.points, 0);
  const progress = totalPts ? Math.round((donePts / totalPts) * 100) : 0;
  const left = splitDuration(project ? project.deadline - now : 0);
  const totalWindow = idea ? idea.mvpDays * DAY_MS : 21 * DAY_MS;
  const elapsedPct = project ? Math.min(100, Math.max(0, ((totalWindow - (project.deadline - now)) / totalWindow) * 100)) : 0;

  if (!project || !idea) {
    return (
      <Panel className="p-8 text-center">
        <Workflow className="w-6 h-6 text-slate-600 mx-auto mb-2" />
        <p className="text-slate-400 text-sm">Konveyerda faol loyiha yo‘q. Radarda 3/3 mijozli g‘oyani konveyerga o‘tkazing.</p>
      </Panel>
    );
  }

  return (
    <div className="grid gap-5">
      <Panel className="p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        <div className="flex flex-wrap items-start justify-between gap-4 relative">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-emerald-400"><Zap className="w-3.5 h-3.5" />Faol loyiha · {idea.mvpDays} kunlik sprint</div>
            <h2 className="f-display text-xl sm:text-2xl font-bold text-slate-100 mt-1.5" style={{ textWrap: 'balance' }}>{idea.title}</h2>
            <p className="text-sm text-slate-400 mt-1">{idea.audience} · ${idea.price}/oy · maqsadli exit {fmtUSD(idea.exit)}</p>
          </div>
          <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 px-4 py-3 shrink-0">
            <div className="text-[11px] uppercase tracking-wider text-amber-300/80 flex items-center gap-1.5"><Timer className="w-3.5 h-3.5" />Sotuvgacha</div>
            <div className="f-mono text-lg sm:text-xl font-bold text-amber-300 mt-0.5">
              {left.d} kun : {pad2(left.h)} soat <span className="text-amber-400/60 text-sm">: {pad2(left.m)} daq : {pad2(left.s)}</span>
            </div>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4 mt-5 relative">
          <div>
            <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">Umumiy progress (ball bo‘yicha)</span><span className="f-mono text-emerald-400 font-semibold">{progress}%</span></div>
            <Bar value={progress} height="h-2.5" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1.5"><span className="text-slate-400">Sarflangan vaqt</span><span className="f-mono text-amber-300">{Math.round(elapsedPct)}%</span></div>
            <Bar value={elapsedPct} color="#f59e0b" height="h-2.5" />
          </div>
        </div>
        {projects.length > 1 && (
          <div className="flex flex-wrap items-center gap-2 mt-5 relative">
            <span className="text-xs text-slate-500">Konveyerdagi loyihalar:</span>
            {projects.map((p) => {
              const pi = ideas.find((i) => i.id === p.ideaId);
              return (
                <button type="button" key={p.ideaId} onClick={() => setActiveProjectId(p.ideaId)} className={`rounded-md px-2.5 py-1 text-xs border transition ${p.ideaId === activeProjectId ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-300' : 'border-slate-700 text-slate-400 hover:text-slate-200'}`}>
                  {pi ? pi.title : p.ideaId}
                </button>
              );
            })}
          </div>
        )}
      </Panel>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-400">
          <span className="f-mono text-slate-200">{projectTasks.filter((t) => t.column === 'done').length}/{projectTasks.length}</span> vazifa tayyor ·{' '}
          <span className="f-mono text-emerald-400">{donePts}</span> / <span className="f-mono">{totalPts}</span> ball taqsimlangan
        </div>
        <Btn variant="gold" onClick={onGenerate} disabled={aiBusy}>
          {aiBusy ? <RotateCcw className="w-4 h-4 gvs-spin" /> : <Zap className="w-4 h-4" />}
          {aiBusy ? 'AI-Menejer o‘ylamoqda…' : 'AI Vazifa Taqsimlash'}
        </Btn>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {COLUMNS.map((col) => {
          const list = projectTasks.filter((t) => t.column === col.id);
          return (
            <div key={col.id} className={`${glass} rounded-xl p-3 sm:p-4 min-w-0`}>
              <div className="flex items-center justify-between mb-3">
                <div className={`flex items-center gap-2 f-display text-sm font-semibold uppercase tracking-wider ${col.tone}`}><col.icon className="w-4 h-4" />{col.label}</div>
                <span className="f-mono text-xs text-slate-500">{list.length}</span>
              </div>
              <div className="grid gap-2.5">
                {list.map((t) => {
                  const role = ROLES[t.role];
                  const owner = members.find((m) => m.id === role.member);
                  const mine = owner.id === me.id;
                  return (
                    <article key={t.id} className={`rounded-lg border bg-slate-950/70 p-3 gvs-in ${t.column === 'done' ? 'border-emerald-500/25' : mine ? 'border-amber-400/50' : 'border-slate-800'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <p className={`text-sm leading-snug ${t.column === 'done' ? 'text-slate-400' : 'text-slate-100'}`}>{t.title}</p>
                        <div className="flex gap-1 shrink-0">
                          {mine && t.column !== 'done' && <Chip tone="gold">Sizniki</Chip>}
                          {t.ai && <Chip tone="gold"><Sparkles className="w-3 h-3" />AI</Chip>}
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-300">
                          <span className="w-2 h-2 rounded-full" style={{ background: owner.color }} />{role.label} · {owner.name}
                        </span>
                        <span className="f-mono text-xs text-amber-300 ml-auto">+{t.points} ball</span>
                      </div>
                      {t.column !== 'done' ? (
                        <div className="flex gap-2 mt-3">
                          {t.column === 'progress' ? (
                            <Btn className="flex-1 !py-1.5 text-xs" onClick={() => onMove(t.id, 'review')}><Eye className="w-3.5 h-3.5" />Tekshiruvga</Btn>
                          ) : (
                            <Btn className="flex-1 !py-1.5 text-xs" onClick={() => onMove(t.id, 'progress')}><CornerUpLeft className="w-3.5 h-3.5" />Qaytarish</Btn>
                          )}
                          <Btn variant="primary" className="flex-1 !py-1.5 text-xs" onClick={() => onComplete(t.id)}><Check className="w-3.5 h-3.5" />Bajarildi</Btn>
                        </div>
                      ) : (
                        <div className="text-[11px] text-emerald-400/80 mt-2 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />{owner.name}ga {t.points} ulush balli yozildi</div>
                      )}
                    </article>
                  );
                })}
                {list.length === 0 && <div className="text-xs text-slate-600 border border-dashed border-slate-800 rounded-lg p-4 text-center">Bu ustunda vazifa yo‘q</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================ 4. CAP-TABLE ============================ */

function CapTableTab({ me, members, shares, totalPoints, exitPrice, projectTitle, payments, onAddPayment, lastPaymentId, events }) {
  const total = payments.reduce((a, p) => a + p.amount, 0);
  const boxes = [
    { label: 'Reinvestitsiya va Server', pct: 30, icon: Server, color: '#22d3ee' },
    { label: 'Jamoa Dividendi', pct: 40, icon: Users, color: '#10b981' },
    { label: 'Studiya / Asoschi Fondi', pct: 30, icon: Crown, color: '#f59e0b' },
  ];
  const teamPot = total * 0.4;
  const sorted = [...members].sort((a, b) => b.points - a.points);
  return (
    <div className="grid gap-5">
      <div>
        <h2 className="f-display text-2xl sm:text-3xl font-bold text-slate-100">Cap-Table <span className="text-emerald-400">/</span> Dinamik Ulush</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">Ulush “Slicing Pie” usulida: har bir bajarilgan vazifa ball beradi, foiz esa jami balldan jonli hisoblanadi.</p>
      </div>

      <Panel className="p-4 sm:p-5">
        <PanelTitle icon={PieChart} title="Ulush taqsimoti" hint={`Jami: ${groupDigits(totalPoints)} ball · Exit bahosi: ${fmtUSD(exitPrice)} (${projectTitle})`} />
        <div className="flex h-5 w-full rounded-full overflow-hidden bg-slate-800">
          {sorted.map((m) => (
            <div key={m.id} className="h-full transition-all duration-700 first:rounded-l-full last:rounded-r-full" style={{ width: `${shares[m.id]}%`, background: m.color }} title={`${m.name}: ${shares[m.id].toFixed(2)}%`} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
          {sorted.map((m) => (
            <span key={m.id} className="text-xs text-slate-300 flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-sm" style={{ background: m.color }} />{m.name} <span className="f-mono text-slate-400">{shares[m.id].toFixed(1)}%</span></span>
          ))}
        </div>

        <div className="overflow-x-auto gvs-scroll mt-5 -mx-1">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-slate-800">
                <th className="py-2 px-2 font-medium">A’zo</th>
                <th className="py-2 px-2 font-medium">Rol</th>
                <th className="py-2 px-2 font-medium text-right">Ball</th>
                <th className="py-2 px-2 font-medium text-right">Jonli ulush</th>
                <th className="py-2 px-2 font-medium text-right">Loyiha sotilsa tegadigan ulush ($)</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((m) => (
                <tr key={m.id} className="border-b border-slate-800/60 last:border-0">
                  <td className="py-2.5 px-2"><div className="flex items-center gap-2.5"><Avatar member={m} size="w-8 h-8 text-xs" /><span className="text-slate-100">{m.name}{m.id === me.id ? ' (Siz)' : ''}</span></div></td>
                  <td className="py-2.5 px-2 text-slate-400">{m.role}</td>
                  <td className="py-2.5 px-2 text-right f-mono text-slate-200">{groupDigits(m.points)}</td>
                  <td className="py-2.5 px-2 text-right f-mono font-semibold" style={{ color: m.color }}>{shares[m.id].toFixed(2)}%</td>
                  <td className="py-2.5 px-2 text-right f-mono text-amber-300">{fmtUSD((shares[m.id] / 100) * exitPrice)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <Panel className="p-4 sm:p-5 min-w-0">
          <PanelTitle
            icon={Wallet}
            title="Jonli Kassa"
            hint="Payme va Click orqali tushgan to‘lovlar avtomatik 3 qutiga bo‘linadi"
            right={<Btn variant="primary" onClick={onAddPayment}><Plus className="w-4 h-4" />Yangi To‘lov (Simulyatsiya)</Btn>}
          />
          <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 px-4 py-4">
            <div className="text-[11px] uppercase tracking-wider text-emerald-300/80">Jami tushum (bugun)</div>
            <div className="f-mono text-2xl sm:text-3xl font-bold text-emerald-300 mt-1 break-all">{fmtUZS(total)}</div>
            <div className="text-xs text-slate-500 mt-1">{payments.length} ta to‘lov</div>
          </div>
          <div className="grid sm:grid-cols-3 gap-3 mt-3">
            {boxes.map((b) => (
              <div key={b.label} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3 min-w-0">
                <div className="flex items-center gap-2 text-xs text-slate-400"><b.icon className="w-4 h-4 shrink-0" style={{ color: b.color }} /><span className="truncate">{b.pct}% · {b.label}</span></div>
                <div className="f-mono text-base font-semibold mt-1.5 truncate" style={{ color: b.color }}>{fmtUZS((total * b.pct) / 100)}</div>
                <div className="mt-2"><Bar value={(b.pct / 40) * 100} color={b.color} height="h-1" /></div>
              </div>
            ))}
          </div>
          <div className="mt-4">
            <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2">Jamoa dividendi ulush bo‘yicha</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {sorted.map((m) => (
                <div key={m.id} className="rounded-lg bg-slate-950/60 border border-slate-800 px-2.5 py-2 min-w-0">
                  <div className="text-xs text-slate-400 truncate">{m.name}</div>
                  <div className="f-mono text-xs text-slate-100 truncate">{groupDigits((teamPot * shares[m.id]) / 100)}</div>
                </div>
              ))}
            </div>
          </div>
        </Panel>

        <Panel className="p-4 sm:p-5 min-w-0">
          <PanelTitle icon={Banknote} title="To‘lovlar lentasi" />
          <ul className="grid gap-1.5 max-h-[360px] overflow-y-auto gvs-scroll pr-1">
            {[...payments].reverse().map((p) => (
              <li key={p.id} className={`flex items-center gap-3 rounded-lg px-2.5 py-2 ${p.id === lastPaymentId ? 'gvs-flash' : ''}`}>
                <span className={`f-mono text-[10px] px-1.5 py-0.5 rounded border ${p.method === 'Payme' ? 'border-cyan-400/40 text-cyan-300' : 'border-sky-400/40 text-sky-300'}`}>{p.method}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-slate-200 truncate">{p.client}</div>
                  <div className="text-[11px] text-slate-500 f-mono">{p.time}</div>
                </div>
                <span className="f-mono text-sm text-emerald-400 whitespace-nowrap">+{groupDigits(p.amount)}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel className="p-4 sm:p-5">
        <PanelTitle icon={Activity} title="Ulush o‘zgarishlari jurnali" />
        <ul className="grid gap-1.5">
          {events.slice(0, 8).map((e) => (
            <li key={e.id} className="flex items-center gap-3 text-sm">
              <span className="f-mono text-[11px] text-slate-500 w-11 shrink-0">{e.time}</span>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: e.color }} />
              <span className="text-slate-300 flex-1 min-w-0">{e.text}</span>
              {e.delta !== 0 && <span className={`f-mono text-xs whitespace-nowrap ${e.delta > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>{e.delta > 0 ? '+' : ''}{groupDigits(e.delta)} ball</span>}
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

/* ============================ 5. SQUAD RPG ============================ */

function PinManager({ members, pins, onSave, devices, onUnbindDevice }) {
  const [draft, setDraft] = useState(pins);
  const [reveal, setReveal] = useState(false);
  const [errors, setErrors] = useState({});
  useEffect(() => { setDraft(pins); }, [pins]);
  const dirty = members.some((m) => draft[m.id] !== pins[m.id]);

  const save = (e) => {
    e.preventDefault();
    const next = {};
    const seen = {};
    members.forEach((m) => {
      const v = (draft[m.id] || '').trim();
      if (!/^\d{4}$/.test(v)) next[m.id] = 'Aniq 4 ta raqam kiriting';
      else if (seen[v]) { next[m.id] = `Bu PIN ${seen[v]}da band`; }
      else seen[v] = m.name;
    });
    setErrors(next);
    if (Object.keys(next).length) return;
    onSave(Object.fromEntries(members.map((m) => [m.id, draft[m.id].trim()])));
  };

  return (
    <Panel className="p-4 sm:p-5 md:col-span-2 xl:col-span-3 border-emerald-500/30">
      <PanelTitle
        icon={Fingerprint}
        title="Kalkulyator PIN-kodlari va qurilmalar"
        hint="Har bir a’zo Ghost-Lock kalkulyatorida o‘z PIN-kodini terib “=” bosadi va o‘z profiliga kiradi. Birinchi kirishda qurilma izi profilga bog‘lanadi."
        right={<Btn onClick={() => setReveal((v) => !v)}>{reveal ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}{reveal ? 'Yashirish' : 'Ko‘rsatish'}</Btn>}
      />
      <form onSubmit={save} className="grid gap-3">
        <div className="grid gap-2.5 md:grid-cols-2 xl:grid-cols-3">
          {members.map((m) => {
            const bound = devices[m.id];
            return (
              <div key={m.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 grid gap-2.5 min-w-0">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Avatar member={m} size="w-9 h-9 text-xs" />
                  <div className="min-w-0 flex-1">
                    <div className="text-sm text-slate-100 truncate">{m.name}{m.founder ? ' · Asoschi' : ''}</div>
                    <div className="f-mono text-[11px] text-slate-500 truncate">Watermark ID: {m.code}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor={`pin-${m.id}`} className="sr-only">{m.name} PIN-kodi</label>
                  <input
                    id={`pin-${m.id}`}
                    type={reveal ? 'text' : 'password'}
                    inputMode="numeric"
                    autoComplete="off"
                    maxLength={4}
                    value={draft[m.id] || ''}
                    onChange={(e) => setDraft((d) => ({ ...d, [m.id]: e.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    className={`${inputCls} f-mono tracking-[0.4em] text-center text-base`}
                  />
                  <span className="f-mono text-lg text-emerald-400 shrink-0">=</span>
                </div>
                {errors[m.id] && <span className="text-xs text-rose-400">{errors[m.id]}</span>}
                <div className="flex items-center justify-between gap-2 text-xs">
                  <span className="flex items-center gap-1.5 text-slate-400 min-w-0">
                    <Smartphone className="w-3.5 h-3.5 shrink-0" />
                    {bound ? <span className="f-mono text-slate-200 truncate">{bound.hash}</span> : <span className="text-slate-500">Qurilma bog‘lanmagan</span>}
                  </span>
                  {bound && <button type="button" onClick={() => onUnbindDevice(m.id)} className="text-rose-300 hover:text-rose-200 shrink-0">Ajratish</button>}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-slate-500">{dirty ? 'Saqlanmagan o‘zgarishlar bor' : 'Barcha PIN-kodlar saqlangan'}</span>
          <div className="flex gap-2">
            <Btn onClick={() => { setDraft(pins); setErrors({}); }} disabled={!dirty}>Bekor qilish</Btn>
            <Btn type="submit" variant="primary" disabled={!dirty}><Save className="w-4 h-4" />PIN-kodlarni saqlash</Btn>
          </div>
        </div>
      </form>
    </Panel>
  );
}

function SquadTab({ me, members, shares, onPenalty, invites, onCreateInvite, onRevokeInvite, notify, pins, onSavePins, devices, onUnbindDevice }) {
  const now = useNow(1000);
  const isFounder = !!me.founder;
  const [confirmId, setConfirmId] = useState(null);
  const [tgId, setTgId] = useState('');
  const [inviteRole, setInviteRole] = useState('Backend');
  const [tgError, setTgError] = useState('');

  const generate = (e) => {
    e.preventDefault();
    if (!/^\d{6,12}$/.test(tgId.trim())) { setTgError('Telegram ID 6–12 ta raqamdan iborat bo‘ladi'); return; }
    setTgError('');
    onCreateInvite(tgId.trim(), inviteRole);
    setTgId('');
  };

  return (
    <div className="grid gap-5">
      <div>
        <h2 className="f-display text-2xl sm:text-3xl font-bold text-slate-100">Squad RPG <span className="text-emerald-400">/</span> Oltin Jamoa</h2>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">Anti-Dangasa tizimi: 5 kun nofaol bo‘lgan a’zodan 2% ulush olinib, faol a’zolarga ballari nisbatida taqsimlanadi.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {members.map((m) => {
          const level = Math.floor(m.points / 250) + 1;
          const xp = ((m.points % 250) / 250) * 100;
          const warn = m.reliability < 80;
          return (
            <Panel key={m.id} className={`p-4 sm:p-5 flex flex-col gap-4 ${warn ? 'border-rose-500/40' : ''} ${m.id === me.id ? 'border-amber-400/40' : ''}`}>
              <div className="flex items-start gap-3">
                <Avatar member={m} size="w-12 h-12 text-base" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="f-display text-lg font-bold text-slate-100">{m.name}{m.id === me.id ? ' (Siz)' : ''}</h3>
                    {m.founder && <Crown className="w-4 h-4 text-amber-400" />}
                  </div>
                  <div className="text-sm italic" style={{ color: m.color }}>{m.role}</div>
                  <div className="text-xs text-slate-500">{m.roleUz}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase tracking-wider text-slate-500">Daraja</div>
                  <div className="f-mono text-xl font-bold text-amber-300">{level}</div>
                </div>
              </div>

              <div className="grid gap-2.5">
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Ishonchlilik</span><span className={`f-mono font-semibold ${warn ? 'text-rose-400' : 'text-emerald-400'}`}>{m.reliability}%{warn ? ' · Ogohlantirish' : ''}</span></div>
                  <Bar value={m.reliability} color={warn ? '#fb7185' : '#10b981'} />
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1"><span className="text-slate-400">Keyingi darajagacha XP</span><span className="f-mono text-slate-400">{Math.round(m.points % 250)}/250</span></div>
                  <Bar value={xp} color="#f59e0b" height="h-1.5" />
                </div>
              </div>

              <div className="grid grid-cols-5 gap-1.5">
                {Object.entries(m.stats).map(([k, v]) => (
                  <div key={k} className="rounded-md bg-slate-950/70 border border-slate-800 px-1 py-1.5 text-center min-w-0">
                    <div className="f-mono text-sm text-slate-100">{v}</div>
                    <div className="text-[9px] uppercase tracking-wide text-slate-500 truncate">{k}</div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div><div className="text-slate-500">Ulush</div><div className="f-mono text-slate-100 font-semibold">{shares[m.id].toFixed(2)}%</div></div>
                <div><div className="text-slate-500">Ball</div><div className="f-mono text-slate-100">{groupDigits(m.points)}</div></div>
                <div><div className="text-slate-500">Faollik</div><div className={`truncate ${m.inactiveDays >= 5 ? 'text-rose-400' : 'text-slate-300'}`}>{m.lastActive}</div></div>
              </div>
              <p className="text-xs text-slate-500 flex items-start gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-500 mt-px shrink-0" />{m.perk}</p>

              <div className="mt-auto">
                {m.founder ? (
                  <div className="text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg px-3 py-2 text-center">Asoschi: jarima, PIN va takliflarni boshqaradi</div>
                ) : !isFounder ? (
                  <div className="text-xs text-slate-500 border border-dashed border-slate-800 rounded-lg px-3 py-2 text-center">{m.id === me.id ? 'Bu sizning profilingiz' : 'Jarimani faqat asoschi qo‘llaydi'}</div>
                ) : confirmId === m.id ? (
                  <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3">
                    <p className="text-xs text-rose-200 mb-2">{m.name}dan 2% ulush olinib, qolgan 4 a’zoga taqsimlansinmi?</p>
                    <div className="flex gap-2">
                      <Btn variant="danger" className="flex-1 !py-1.5 text-xs" onClick={() => { onPenalty(m.id); setConfirmId(null); }}>Ha, jarima qo‘llash</Btn>
                      <Btn className="flex-1 !py-1.5 text-xs" onClick={() => setConfirmId(null)}>Yo‘q</Btn>
                    </div>
                  </div>
                ) : (
                  <Btn variant="danger" className="w-full" disabled={shares[m.id] < 2} onClick={() => setConfirmId(m.id)}>
                    <AlertTriangle className="w-4 h-4" />5 Kunlik Nofaollik Jarimasi
                  </Btn>
                )}
              </div>
            </Panel>
          );
        })}

        <Panel className="p-4 sm:p-5 md:col-span-2 xl:col-span-1 border-amber-400/30">
          <PanelTitle icon={KeyRound} title="Maxfiy Taklif (Invite Token)" hint="15 daqiqalik, bir martalik, Telegram ID ga bog‘langan havola" />
          {!isFounder ? (
            <p className="text-sm text-slate-400 flex items-start gap-2"><Lock className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />Taklif tokenlarini faqat asoschi (Sardor) yaratadi. Yangi a’zoni tavsiya qilmoqchi bo‘lsangiz, unga yozing.</p>
          ) : (
          <>
          <form onSubmit={generate} className="grid gap-3">
            <Field id="inv-tg" label="Telegram ID" error={tgError}>
              <input id="inv-tg" inputMode="numeric" className={`${inputCls} f-mono`} value={tgId} onChange={(e) => setTgId(e.target.value)} placeholder="Masalan: 731204958" />
            </Field>
            <Field id="inv-role" label="Rol">
              <select id="inv-role" className={inputCls} value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}>
                {['Backend', 'Dizayner', 'Sotuvchi', 'Marketing', 'Kuzatuvchi (faqat o‘qish)'].map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </Field>
            <Btn type="submit" variant="gold"><KeyRound className="w-4 h-4" />Token yaratish</Btn>
          </form>
          <ul className="grid gap-2.5 mt-4">
            {invites.map((inv) => {
              const remaining = inv.expiresAt - now;
              const status = inv.status === 'faol' && remaining <= 0 ? 'muddati' : inv.status;
              const t = splitDuration(remaining);
              const link = `https://t.me/GhostVSBot?start=inv_${inv.code}_${inv.tgId}`;
              return (
                <li key={inv.id} className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 grid gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="f-mono text-sm text-slate-100">{inv.code}</span>
                    {status === 'faol' && <Chip tone="emerald"><Clock className="w-3 h-3" />{pad2(t.m)}:{pad2(t.s)} qoldi</Chip>}
                    {status === 'muddati' && <Chip tone="slate">Muddati o‘tdi</Chip>}
                    {status === 'bekor' && <Chip tone="rose">Bekor qilindi</Chip>}
                    {status === 'ishlatilgan' && <Chip tone="cyan">Ishlatilgan · {inv.usedBy}</Chip>}
                  </div>
                  <div className="text-xs text-slate-500">TG ID: <span className="f-mono text-slate-300">{inv.tgId}</span> · {inv.role}</div>
                  {status === 'faol' && (
                    <>
                      <CopyField id={`inv-link-${inv.id}`} value={link} label="" onCopied={() => notify('Taklif havolasi nusxalandi')} onFallback={() => notify('Havola belgilandi, nusxalash uchun Ctrl+C bosing', 'warn')} />
                      <Btn variant="danger" className="!py-1.5 text-xs" onClick={() => onRevokeInvite(inv.id)}><Ban className="w-3.5 h-3.5" />Bekor qilish</Btn>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
          </>
          )}
        </Panel>

        {isFounder ? (
          <PinManager members={members} pins={pins} onSave={onSavePins} devices={devices} onUnbindDevice={onUnbindDevice} />
        ) : (
          <Panel className="p-4 sm:p-5 md:col-span-2 xl:col-span-3">
            <PanelTitle icon={Fingerprint} title="Kalkulyator PIN-kodlari" />
            <p className="text-sm text-slate-400">PIN-kodlarni faqat asoschi boshqaradi. Sizning profilingiz: <span className="f-mono text-slate-200">{me.code}</span>{devices[me.id] ? <> · qurilma <span className="f-mono text-slate-200">{devices[me.id].hash}</span></> : null}</p>
          </Panel>
        )}
      </div>
    </div>
  );
}

/* ============================ 6. EXIT ROOM ============================ */

function MrrChart({ data }) {
  const w = 340; const h = 140; const padL = 40; const padR = 12; const padT = 12; const padB = 24;
  const max = 3500;
  const x = (i) => padL + (i * (w - padL - padR)) / (data.length - 1);
  const y = (v) => padT + (1 - v / max) * (h - padT - padB);
  const line = data.map((d, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(d.v).toFixed(1)}`).join(' ');
  const area = `${line} L${x(data.length - 1)},${y(0)} L${x(0)},${y(0)} Z`;
  const last = data[data.length - 1];
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label="Oylik takroriy daromad dinamikasi">
      <defs>
        <linearGradient id="mrrFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity="0.35" /><stop offset="100%" stopColor="#10b981" stopOpacity="0" /></linearGradient>
      </defs>
      {[0, 1000, 2000, 3000].map((v) => (
        <g key={v}>
          <line x1={padL} x2={w - padR} y1={y(v)} y2={y(v)} stroke="#1e293b" strokeWidth="1" />
          <text x={padL - 6} y={y(v) + 3} textAnchor="end" fontSize="9" fill="#64748b" fontFamily="JetBrains Mono, monospace">${v / 1000}k</text>
        </g>
      ))}
      <path d={area} fill="url(#mrrFill)" />
      <path d={line} fill="none" stroke="#10b981" strokeWidth="2" strokeLinejoin="round" />
      {data.map((d, i) => <text key={d.m} x={x(i)} y={h - 6} textAnchor="middle" fontSize="9" fill="#64748b">{d.m}</text>)}
      <circle cx={x(data.length - 1)} cy={y(last.v)} r="4" fill="#f59e0b" stroke="#020617" strokeWidth="2" />
      <text x={x(data.length - 1) - 6} y={y(last.v) - 8} textAnchor="end" fontSize="10" fill="#fbbf24" fontFamily="JetBrains Mono, monospace">${last.v.toLocaleString('en-US')}</text>
    </svg>
  );
}

function ExitTab({ exit, setExit, members, shares, idea, notify }) {
  const ro = exit.investorMode;
  const margin = exit.mrr > 0 ? (exit.profit / exit.mrr) * 100 : 0;
  const ratio = exit.cac > 0 ? exit.ltv / exit.cac : 0;
  const valuation = exit.profit * exit.multiplier;
  const saleLink = `https://dataroom.ghostvs.uz/d/A9F-8821-${(idea ? idea.id : 'dent')}`;
  const setNum = (k) => (e) => setExit((s) => ({ ...s, [k]: Math.max(0, Number(e.target.value) || 0) }));

  const requestOffer = () => {
    setExit((s) => ({ ...s, offerLoading: true, offer: null }));
    setTimeout(() => {
      const inv = pick(INVESTORS);
      const factor = 0.82 + Math.random() * 0.3;
      setExit((s) => ({
        ...s, offerLoading: false,
        offer: { id: uid('o'), investor: inv.name, note: inv.note, amount: Math.round((s.profit * s.multiplier * factor) / 500) * 500, status: 'yangi', upfront: pick([60, 70, 80]), round: 1 },
      }));
    }, 1200);
  };
  const accept = () => { setExit((s) => ({ ...s, offer: { ...s.offer, status: 'qabul' } })); notify('Taklif qabul qilindi. Shartnoma loyihasi tayyorlanmoqda.'); };
  const reject = () => { setExit((s) => ({ ...s, offer: { ...s.offer, status: 'rad' } })); notify('Taklif rad etildi', 'warn'); };
  const counter = () => {
    setExit((s) => ({ ...s, offer: { ...s.offer, status: 'muzokara' } }));
    setTimeout(() => {
      setExit((s) => {
        if (!s.offer || s.offer.status !== 'muzokara') return s;
        const raised = Math.round((s.offer.amount * (1.04 + Math.random() * 0.05)) / 500) * 500;
        return { ...s, offer: { ...s.offer, amount: raised, status: 'yangi', round: s.offer.round + 1 } };
      });
      notify('Investor qarshi taklifga javob berdi: narx oshirildi');
    }, 1300);
  };

  const metrics = [
    { label: 'MRR (oylik takroriy daromad)', value: fmtUSD(exit.mrr), tone: 'emerald', key: 'mrr' },
    { label: 'Sof foyda', value: `${margin.toFixed(1)}%`, sub: `${fmtUSD(exit.profit)} / oy`, tone: 'gold' },
    { label: 'Faol B2B mijozlar', value: `${exit.clients} ta`, sub: 'imzolangan shartnoma bilan', key: 'clients' },
    { label: 'CAC va LTV', value: `1 : ${ratio.toFixed(1)}`, sub: `CAC ${fmtUSD(exit.cac)} · LTV ${fmtUSD(exit.ltv)}`, tone: ratio >= 3 ? 'emerald' : 'rose' },
  ];

  return (
    <div className="grid gap-5">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="f-display text-2xl sm:text-3xl font-bold text-slate-100">Exit Room <span className="text-emerald-400">/</span> Xaridor Vitrini</h2>
          <p className="text-sm text-slate-400 mt-1">{idea ? idea.title : 'Faol loyiha'} · sotuvga tayyor aktivlar va ko‘rsatkichlar</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={ro}
          onClick={() => setExit((s) => ({ ...s, investorMode: !s.investorMode }))}
          className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition ${ro ? 'border-amber-400/50 bg-amber-400/10' : 'border-slate-700 bg-slate-900/60'}`}
        >
          {ro ? <Eye className="w-4 h-4 text-amber-300" /> : <EyeOff className="w-4 h-4 text-slate-400" />}
          <span className="text-sm text-slate-200 text-left">Investor Ko‘rgazma Rejimi<span className="block text-[11px] text-slate-500">Read-Only Data Room</span></span>
          <span className={`w-10 h-6 rounded-full relative transition ${ro ? 'bg-amber-400' : 'bg-slate-700'}`}>
            <span className={`absolute top-1 w-4 h-4 rounded-full bg-slate-950 transition-all ${ro ? 'left-5' : 'left-1'}`} />
          </span>
        </button>
      </div>

      {ro && (
        <div className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-4 py-3 text-sm text-amber-200 flex items-start gap-2.5 gvs-in">
          <Eye className="w-4 h-4 mt-0.5 shrink-0" />
          Siz investor ko‘rinishidasiz: barcha raqamlar faqat o‘qish uchun, jamoa ichki ma’lumotlari va tahrirlash yashirilgan.
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {metrics.map((m) => <Stat key={m.label} label={m.label} value={m.value} sub={m.sub} tone={m.tone} />)}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Panel className="p-4 sm:p-5 min-w-0">
          <PanelTitle icon={TrendingUp} title="MRR dinamikasi" hint="So‘nggi 6 oy, AQSh dollarida" />
          <MrrChart data={MRR_HISTORY.map((d, i) => (i === MRR_HISTORY.length - 1 ? { ...d, v: exit.mrr } : d))} />
          {!ro && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
              <Field id="ex-mrr" label="MRR ($)"><input id="ex-mrr" type="number" className={`${inputCls} f-mono`} value={exit.mrr} onChange={setNum('mrr')} /></Field>
              <Field id="ex-clients" label="Mijozlar"><input id="ex-clients" type="number" className={`${inputCls} f-mono`} value={exit.clients} onChange={setNum('clients')} /></Field>
              <Field id="ex-cac" label="CAC ($)"><input id="ex-cac" type="number" className={`${inputCls} f-mono`} value={exit.cac} onChange={setNum('cac')} /></Field>
              <Field id="ex-ltv" label="LTV ($)"><input id="ex-ltv" type="number" className={`${inputCls} f-mono`} value={exit.ltv} onChange={setNum('ltv')} /></Field>
            </div>
          )}
        </Panel>

        <Panel className="p-4 sm:p-5 min-w-0 border-amber-400/30">
          <PanelTitle icon={BadgeDollarSign} title="Avtomatik baholash kalkulyatori" />
          <div className="rounded-xl bg-slate-950/70 border border-slate-800 p-4 f-mono text-sm sm:text-base leading-relaxed">
            <span className="text-slate-400">Oylik foyda</span> <span className="text-slate-100">({fmtUSD(exit.profit)})</span>
            <span className="text-slate-500"> × </span>
            <span className="text-slate-100">{exit.multiplier}x</span> <span className="text-slate-400">Multiplikator</span>
            <span className="text-slate-500"> = </span>
            <div className="text-2xl sm:text-3xl font-bold text-amber-300 mt-2">{fmtUSD(valuation)} <span className="text-sm font-normal text-slate-400">Sotuv Bahosi</span></div>
          </div>
          {!ro && (
            <div className="grid gap-4 mt-4">
              <Field id="ex-profit" label={`Oylik sof foyda: ${fmtUSD(exit.profit)}`}>
                <input id="ex-profit" type="range" min="500" max="6000" step="100" value={exit.profit} onChange={setNum('profit')} className="w-full gvs-range" />
              </Field>
              <Field id="ex-mult" label={`Multiplikator: ${exit.multiplier}x`}>
                <input id="ex-mult" type="range" min="10" max="40" step="1" value={exit.multiplier} onChange={setNum('multiplier')} className="w-full gvs-range" />
              </Field>
            </div>
          )}
          <div className="text-xs text-slate-500 mt-3">Mikro-SaaS bozorida oylik foydaning 20–36 baravari odatiy narx hisoblanadi.</div>
        </Panel>
      </div>

      <Panel className="p-4 sm:p-5">
        <PanelTitle icon={Building2} title="Sotuvga kiruvchi aktivlar" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {SALE_ASSETS.map((a) => (
            <div key={a.title} className="rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 flex gap-3 min-w-0">
              <a.icon className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div className="min-w-0">
                <div className="text-sm text-slate-100 flex items-center gap-1.5">{a.title}<Check className="w-3.5 h-3.5 text-emerald-400" /></div>
                <div className="text-xs text-slate-500 mt-0.5">{a.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <div className="grid gap-5 lg:grid-cols-2">
        <Panel className="p-4 sm:p-5 min-w-0">
          <PanelTitle icon={Send} title="Sotuv havolasi" hint="Data Room havolasini potensial xaridorga yuboring" />
          <CopyField id="sale-link" value={saleLink} label="Sotuv Linkini Nusxalash" onCopied={() => notify('Sotuv havolasi nusxalandi')} onFallback={() => notify('Havola belgilandi, nusxalash uchun Ctrl+C bosing', 'warn')} />
          <p className="text-xs text-slate-500 mt-3">Havola 72 soat amal qiladi va har bir ochilish Device Hash bilan jurnalga yoziladi.</p>
        </Panel>

        <Panel className="p-4 sm:p-5 min-w-0">
          <PanelTitle icon={Handshake} title="Investor taklifi" />
          {ro ? (
            <p className="text-sm text-slate-400">Investor rejimida takliflar bo‘limi yopiq. Taklif berish uchun sotuvchi bilan bog‘laning.</p>
          ) : (
            <div className="grid gap-3">
              {!exit.offer && !exit.offerLoading && (
                <Btn variant="gold" onClick={requestOffer}><Handshake className="w-4 h-4" />Investordan Taklif (Offer) Qabul Qilish</Btn>
              )}
              {exit.offerLoading && (
                <div className="flex items-center gap-2 text-sm text-amber-300"><RotateCcw className="w-4 h-4 gvs-spin" />Investor data roomni ko‘rib chiqmoqda…</div>
              )}
              {exit.offer && (
                <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 gvs-in">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <div className="text-slate-100 font-semibold">{exit.offer.investor}</div>
                      <div className="text-xs text-slate-500">{exit.offer.note}</div>
                    </div>
                    {exit.offer.status === 'qabul' && <Chip tone="emerald">Qabul qilindi</Chip>}
                    {exit.offer.status === 'rad' && <Chip tone="rose">Rad etildi</Chip>}
                    {exit.offer.status === 'muzokara' && <Chip tone="gold">Muzokara</Chip>}
                    {exit.offer.status === 'yangi' && <Chip tone="cyan">{exit.offer.round}-taklif</Chip>}
                  </div>
                  <div className="f-mono text-2xl font-bold text-amber-300 mt-3">{fmtUSD(exit.offer.amount)}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    Bahodan {((exit.offer.amount / Math.max(1, valuation)) * 100).toFixed(0)}% · {exit.offer.upfront}% oldindan, {100 - exit.offer.upfront}% 3 oy ichida
                  </div>
                  {exit.offer.status === 'yangi' && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      <Btn variant="primary" className="flex-1" onClick={accept}><Check className="w-4 h-4" />Qabul qilish</Btn>
                      <Btn className="flex-1" onClick={counter}><ArrowLeftRight className="w-4 h-4" />Qarshi taklif</Btn>
                      <Btn variant="danger" className="flex-1" onClick={reject}><X className="w-4 h-4" />Rad etish</Btn>
                    </div>
                  )}
                  {exit.offer.status === 'muzokara' && <div className="flex items-center gap-2 text-sm text-amber-300 mt-3"><RotateCcw className="w-4 h-4 gvs-spin" />Qarshi taklif yuborildi, javob kutilmoqda…</div>}
                  {exit.offer.status === 'qabul' && (
                    <div className="mt-4 grid gap-1.5">
                      <div className="text-[11px] uppercase tracking-wider text-slate-500">Jamoaga to‘lov (jonli ulush bo‘yicha)</div>
                      {members.map((m) => (
                        <div key={m.id} className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2 text-slate-300"><span className="w-2 h-2 rounded-full" style={{ background: m.color }} />{m.name} <span className="f-mono text-xs text-slate-500">{shares[m.id].toFixed(1)}%</span></span>
                          <span className="f-mono text-emerald-300">{fmtUSD((exit.offer.amount * shares[m.id]) / 100)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {(exit.offer.status === 'qabul' || exit.offer.status === 'rad') && (
                    <Btn className="w-full mt-4" onClick={requestOffer}><RotateCcw className="w-4 h-4" />Yangi taklif so‘rash</Btn>
                  )}
                </div>
              )}
            </div>
          )}
        </Panel>
      </div>
    </div>
  );
}

/* ============================ STUDIYA QOBIG‘I ============================ */

const EXIT_SEED = { investorMode: false, mrr: 3150, profit: 2200, multiplier: 20, clients: 42, cac: 120, ltv: 1350, offer: null, offerLoading: false };
const STAKE_SEED = { sardor: 500, temur: 500, malika: 500, javohir: 500, bekzod: 500 };
const projectSeed = () => [{ ideaId: 'dent', deadline: Date.now() + 14 * DAY_MS + 8 * HOUR_MS + 12 * 60000 }];

function SettingsModal({ me, device, deviceStatus, storageOk, onReset, onClose }) {
  const [confirm, setConfirm] = useState(false);
  return (
    <Modal title="Sozlamalar" onClose={onClose}>
      <div className="grid gap-5">
        <div className="flex items-center gap-3">
          <Avatar member={me} size="w-11 h-11 text-sm" />
          <div className="min-w-0">
            <div className="text-slate-100 font-semibold">{me.name} · {me.role}</div>
            <div className="f-mono text-xs text-slate-500">Watermark ID: {me.code}</div>
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5"><Fingerprint className="w-3.5 h-3.5" />Qurilma izi</div>
          <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 grid gap-1.5">
            <div className="flex items-center justify-between gap-2 text-sm">
              <span className="f-mono text-slate-100">{device.hash}</span>
              <Chip tone={deviceStatus === 'notanish' ? 'gold' : 'emerald'}>{deviceStatus === 'notanish' ? 'Notanish qurilma' : 'Profilga bog‘langan'}</Chip>
            </div>
            {device.components.map((c) => (
              <div key={c.k} className="flex justify-between gap-3 text-xs">
                <span className="text-slate-500 shrink-0">{c.k}</span>
                <span className="f-mono text-slate-300 truncate text-right">{c.v}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="text-[11px] uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5"><Database className="w-3.5 h-3.5" />Ma’lumotlar</div>
          <p className="text-sm text-slate-400">
            {storageOk
              ? 'G‘oyalar, vazifalar, ballar, ulushlar, kassa, takliflar va PIN-kodlar shu brauzerda saqlanadi. Sahifani yangilasangiz ham yo‘qolmaydi.'
              : 'Bu brauzer ma’lumot saqlashga ruxsat bermayapti (masalan, maxfiy oyna). O‘zgarishlar sahifa yopilguncha saqlanadi.'}
          </p>
          {confirm ? (
            <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-3 mt-3">
              <p className="text-xs text-rose-200 mb-2">Barcha o‘zgarishlar o‘chib, namunaviy ma’lumotlar qaytadi. PIN-kodlar standart holatga (7700, 1122, 3344, 5566, 7788) qaytadi va qurilmalar ajratiladi.</p>
              <div className="flex gap-2">
                <Btn variant="danger" className="flex-1" onClick={onReset}><RotateCcw className="w-4 h-4" />Ha, tiklash</Btn>
                <Btn className="flex-1" onClick={() => setConfirm(false)}>Yo‘q</Btn>
              </div>
            </div>
          ) : (
            <Btn variant="danger" className="mt-3" onClick={() => setConfirm(true)}><RotateCcw className="w-4 h-4" />Reset Demo Data</Btn>
          )}
        </div>
      </div>
    </Modal>
  );
}

function Studio({ userId, device, onPanic, onReset, justReset }) {
  const [tab, setTab] = useState('radar');
  const [members, setMembers] = usePersistentState('members', MEMBER_SEED);
  const [ideas, setIdeas] = usePersistentState('ideas', IDEA_SEED);
  const [projects, setProjects] = usePersistentState('projects', projectSeed);
  const [activeProjectId, setActiveProjectId] = usePersistentState('activeProjectId', 'dent');
  const [tasks, setTasks] = usePersistentState('tasks', TASK_SEED);
  const [payments, setPayments] = usePersistentState('payments', PAYMENT_SEED);
  const [events, setEvents] = usePersistentState('events', EVENT_SEED);
  const [stakeBalances, setStakeBalances] = usePersistentState('stakeBalances', STAKE_SEED);
  const [invites, setInvites] = usePersistentState('invites', INVITE_SEED);
  const [exit, setExit] = usePersistentState('exit', EXIT_SEED);
  const [pins, setPins] = usePersistentState('pins', DEFAULT_PINS);
  const [devices, setDevices] = usePersistentState('devices', {});
  const [lastPaymentId, setLastPaymentId] = useState(null);
  const [aiBusy, setAiBusy] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [storageOk] = useState(storageAvailable);
  const [deviceStatus] = useState(() => {
    const bound = devices[userId];
    if (!bound) return 'yangi';
    return bound.hash === device.hash ? 'tasdiqlangan' : 'notanish';
  });
  const mainRef = useRef(null);

  const me = members.find((m) => m.id === userId) || members[0];

  const notify = (text, tone = 'ok') => {
    const id = uid('n');
    setToasts((t) => [...t.slice(-2), { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };
  const log = (text, delta, color) => setEvents((ev) => [{ id: uid('e'), time: clockNow(), text, delta, color }, ...ev].slice(0, 60));

  useEffect(() => {
    setExit((s) => ({ ...s, offerLoading: false, offer: s.offer && s.offer.status === 'muzokara' ? { ...s.offer, status: 'yangi' } : s.offer }));
    if (deviceStatus === 'yangi') {
      setDevices((d) => ({ ...d, [userId]: { hash: device.hash, at: Date.now() } }));
      log(`${me.name}: qurilma ${device.hash} profilga bog‘landi`, 0, me.color);
    } else if (deviceStatus === 'notanish') {
      log(`${me.name}: notanish qurilmadan kirish (${device.hash})`, 0, '#f59e0b');
      notify(`Diqqat: ${me.name} profiliga boshqa qurilmadan kirildi`, 'warn');
    }
    if (justReset) notify('Demo ma’lumotlar tiklandi');
  }, []);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape' && e.shiftKey) onPanic(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onPanic]);

  useEffect(() => { if (mainRef.current) mainRef.current.scrollTo({ top: 0 }); window.scrollTo({ top: 0 }); }, [tab]);

  const totalPoints = members.reduce((a, m) => a + m.points, 0);
  const shares = useMemo(() => Object.fromEntries(members.map((m) => [m.id, totalPoints ? (m.points / totalPoints) * 100 : 0])), [members, totalPoints]);
  const activeIdea = ideas.find((i) => i.id === activeProjectId);

  const pickAiTasks = (projectId, existing) => {
    const usedTitles = new Set(existing.filter((t) => t.projectId === projectId).map((t) => t.title));
    let pool = AI_TASK_POOL.filter((t) => !usedTitles.has(t.title));
    let suffix = '';
    if (pool.length < 3) { pool = AI_TASK_POOL.slice(); suffix = ' (2-bosqich)'; }
    const chosen = [];
    const roles = new Set();
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    for (const t of shuffled) { if (chosen.length < 3 && !roles.has(t.role)) { chosen.push(t); roles.add(t.role); } }
    for (const t of shuffled) { if (chosen.length < 3 && !chosen.includes(t)) chosen.push(t); }
    return chosen.map((t) => ({ id: uid('t'), projectId, title: t.title + (usedTitles.has(t.title) ? suffix : ''), role: t.role, points: t.points, column: 'progress', ai: true }));
  };

  const generateTasks = () => {
    if (aiBusy) return;
    setAiBusy(true);
    setTimeout(() => {
      setTasks((ts) => [...ts, ...pickAiTasks(activeProjectId, ts)]);
      setAiBusy(false);
      notify('AI-Menejer 3 ta yangi vazifani jamoaga taqsimladi');
    }, 1100);
  };

  const moveTask = (id, column) => setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, column } : t)));

  const completeTask = (id) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || task.column === 'done') return;
    const memberId = ROLES[task.role].member;
    const member = members.find((m) => m.id === memberId);
    setTasks((ts) => ts.map((t) => (t.id === id ? { ...t, column: 'done' } : t)));
    setMembers((ms) => ms.map((m) => (m.id === memberId ? { ...m, points: m.points + task.points, reliability: Math.min(100, m.reliability + 1), inactiveDays: 0, lastActive: 'Hozir faol' } : m)));
    log(`${member.name}: “${task.title}” tayyor`, task.points, member.color);
    notify(`${member.name} +${task.points} ball oldi. Cap-Table yangilandi.`);
  };

  const applyPenalty = (id) => {
    if (!me.founder) return;
    const target = members.find((m) => m.id === id);
    const cut = Math.min(target.points, totalPoints * PENALTY_SHARE);
    const othersTotal = totalPoints - target.points;
    if (cut <= 0 || othersTotal <= 0) return;
    setMembers((ms) => ms.map((m) => (m.id === id
      ? { ...m, points: m.points - cut, reliability: Math.max(0, m.reliability - 6) }
      : { ...m, points: m.points + cut * (m.points / othersTotal) })));
    log(`${target.name}: 5 kunlik nofaollik jarimasi (−2% ulush)`, -cut, '#fb7185');
    notify(`${target.name}dan 2% ulush olinib, 4 faol a’zoga taqsimlandi`, 'warn');
  };

  const promoteIdea = (ideaId) => {
    const idea = ideas.find((i) => i.id === ideaId);
    setIdeas((list) => list.map((i) => (i.id === ideaId ? { ...i, status: 'konveyerda' } : i)));
    setProjects((ps) => [...ps, { ideaId, deadline: Date.now() + idea.mvpDays * DAY_MS }]);
    setTasks((ts) => [...ts, ...pickAiTasks(ideaId, ts)]);
    setActiveProjectId(ideaId);
    setTab('konveyer');
    log(`“${idea.title}” konveyerga o‘tkazildi`, 0, '#10b981');
    notify(`“${idea.title}” uchun ${idea.mvpDays} kunlik sprint boshlandi`);
  };

  const openProject = (ideaId) => { setActiveProjectId(ideaId); setTab('konveyer'); };

  const addPayment = () => {
    const p = { id: uid('p'), client: pick(PAYMENT_CLIENTS), amount: pick(PAYMENT_AMOUNTS), method: pick(['Payme', 'Click']), time: clockNow() };
    setPayments((ps) => [...ps, p]);
    setLastPaymentId(p.id);
    notify(`+${groupDigits(p.amount)} UZS - ${p.client} (${p.method})`);
  };

  const createInvite = (tgId, role) => {
    const now = Date.now();
    const inv = { id: uid('i'), code: `GVS-${randomCode(4)}-${randomCode(4)}`, tgId, role, createdAt: now, expiresAt: now + INVITE_TTL_MS, status: 'faol' };
    setInvites((list) => [inv, ...list]);
    notify(`Token ${inv.code} yaratildi, 15 daqiqa amal qiladi`);
  };
  const revokeInvite = (id) => { setInvites((list) => list.map((i) => (i.id === id ? { ...i, status: 'bekor' } : i))); notify('Token bekor qilindi', 'warn'); };

  const savePins = (next) => {
    setPins(next);
    log('Asoschi kalkulyator PIN-kodlarini yangiladi', 0, '#f59e0b');
    notify('PIN-kodlar saqlandi. Endi har bir a’zo o‘z PIN-kodi bilan kiradi.');
  };
  const unbindDevice = (id) => {
    const m = members.find((x) => x.id === id);
    setDevices((d) => { const next = { ...d }; delete next[id]; return next; });
    log(`${m.name}: qurilma ajratildi`, 0, '#94a3b8');
    notify(`${m.name} qurilmasi ajratildi. Keyingi kirishda yangi qurilma bog‘lanadi.`, 'warn');
  };

  const gutter = { paddingLeft: 'max(16px, env(safe-area-inset-left, 0px))', paddingRight: 'max(16px, env(safe-area-inset-right, 0px))' };
  const deviceLabel = deviceStatus === 'notanish' ? 'Notanish qurilma' : 'Tasdiqlangan';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 gvs-root gvs-in relative">
      <div className="pointer-events-none fixed inset-0 z-0 opacity-60" style={{ background: 'radial-gradient(900px 500px at 85% -10%, rgba(16,185,129,.10), transparent 60%), radial-gradient(700px 400px at -10% 110%, rgba(245,158,11,.07), transparent 60%)' }} />

      <header className="sticky z-30 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl" style={{ top: 'env(safe-area-inset-top, 0px)' }}>
        <div className="flex items-center justify-between gap-2 sm:gap-3 py-2.5 sm:py-3 max-w-[1500px] mx-auto" style={gutter}>
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg border border-emerald-500/40 bg-emerald-500/10 grid place-items-center shrink-0"><Ghost className="w-5 h-5 text-emerald-400" /></div>
            <div className="min-w-0">
              <div className="f-display font-bold text-slate-100 tracking-[0.14em] sm:tracking-[0.18em] text-xs sm:text-base truncate">GHOST VENTURE <span className="text-amber-400">STUDIO</span></div>
              <div className="text-[11px] text-slate-500 truncate flex items-center gap-1"><UserCircle2 className="w-3 h-3 shrink-0" />{me.name} · {me.role}</div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <span className={`hidden lg:inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs f-mono ${deviceStatus === 'notanish' ? 'border-amber-400/50 bg-amber-400/10 text-amber-300' : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'}`}>
              <Fingerprint className="w-3.5 h-3.5" />Device Hash: {device.hash} ({deviceLabel})
            </span>
            <button type="button" onClick={() => setShowSettings(true)} className={`hidden sm:inline-flex lg:hidden items-center gap-1 rounded-lg border px-2 py-1.5 text-[11px] f-mono ${deviceStatus === 'notanish' ? 'border-amber-400/50 text-amber-300' : 'border-emerald-500/40 text-emerald-300'}`} aria-label={`Device Hash: ${device.hash} (${deviceLabel})`}>
              <Fingerprint className="w-3.5 h-3.5" />{device.hash}
            </button>
            <button type="button" onClick={() => setShowSettings(true)} className="h-9 w-9 grid place-items-center rounded-lg border border-slate-700 text-slate-300 hover:text-slate-100 hover:bg-slate-800" aria-label="Sozlamalar">
              <Settings className="w-4 h-4" />
            </button>
            <Btn variant="danger" onClick={onPanic} title="Shift + Esc" className="!px-2.5 sm:!px-3"><Lock className="w-4 h-4" /><span className="hidden sm:inline">Panic Lock (Yopish)</span><span className="sm:hidden">Yopish</span></Btn>
          </div>
        </div>
      </header>

      <div className="relative z-10 max-w-[1500px] mx-auto md:flex">
        <nav className="hidden md:flex flex-col gap-1 w-60 shrink-0 py-6 pl-4 pr-2 sticky self-start" style={{ top: 'calc(env(safe-area-inset-top, 0px) + 72px)' }} aria-label="Asosiy bo‘limlar">
          {TABS.map((t) => (
            <button type="button" key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-left transition border ${tab === t.id ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-900'}`}>
              <t.icon className="w-4 h-4 shrink-0" />
              <span className="min-w-0"><span className="block text-sm font-medium">{t.label}</span><span className="block text-[11px] text-slate-500 truncate">{t.sub}</span></span>
            </button>
          ))}
          <div className={`${glass} rounded-xl p-3 mt-6`}>
            <div className="text-[11px] uppercase tracking-wider text-slate-500">Sizning ulushingiz</div>
            <div className="f-mono text-xl font-bold text-amber-300 mt-1">{shares[me.id].toFixed(2)}%</div>
            <div className="text-[11px] text-slate-500 mt-0.5">{fmtUSD((shares[me.id] / 100) * (activeIdea ? activeIdea.exit : 0))} exitda</div>
          </div>
          <button type="button" onClick={() => setShowSettings(true)} className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 px-3 py-2 mt-1">
            <Settings className="w-3.5 h-3.5" />Sozlamalar va ma’lumotlar
          </button>
        </nav>

        <main ref={mainRef} className="flex-1 min-w-0 pt-5 md:pt-6 md:pb-10" style={{ ...gutter, paddingBottom: undefined }}>
          <div className="md:hidden mb-4 rounded-xl border border-slate-800 bg-slate-900/60 px-3 py-2 grid gap-1.5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs text-slate-400">Sizning ulushingiz</span>
              <span className="f-mono text-sm font-bold text-amber-300">{shares[me.id].toFixed(2)}% · {fmtUSD((shares[me.id] / 100) * (activeIdea ? activeIdea.exit : 0))}</span>
            </div>
            <div className={`sm:hidden flex items-center gap-1.5 text-[11px] f-mono ${deviceStatus === 'notanish' ? 'text-amber-300' : 'text-emerald-300'}`}>
              <Fingerprint className="w-3.5 h-3.5 shrink-0" /><span className="truncate">Device Hash: {device.hash} ({deviceLabel})</span>
            </div>
          </div>
          {tab === 'radar' && <RadarTab me={me} ideas={ideas} setIdeas={setIdeas} stakeBalance={stakeBalances[me.id] ?? 500} setStakeBalances={setStakeBalances} onPromote={promoteIdea} onOpenProject={openProject} notify={notify} />}
          {tab === 'konveyer' && <KonveyerTab me={me} ideas={ideas} projects={projects} activeProjectId={activeProjectId} setActiveProjectId={setActiveProjectId} tasks={tasks} members={members} onMove={moveTask} onComplete={completeTask} onGenerate={generateTasks} aiBusy={aiBusy} />}
          {tab === 'cap' && <CapTableTab me={me} members={members} shares={shares} totalPoints={totalPoints} exitPrice={activeIdea ? activeIdea.exit : 0} projectTitle={activeIdea ? activeIdea.title : ''} payments={payments} onAddPayment={addPayment} lastPaymentId={lastPaymentId} events={events} />}
          {tab === 'squad' && <SquadTab me={me} members={members} shares={shares} onPenalty={applyPenalty} invites={invites} onCreateInvite={createInvite} onRevokeInvite={revokeInvite} notify={notify} pins={pins} onSavePins={savePins} devices={devices} onUnbindDevice={unbindDevice} />}
          {tab === 'exit' && <ExitTab exit={exit} setExit={setExit} members={members} shares={shares} idea={activeIdea} notify={notify} />}
          <div className="md:hidden" style={{ height: 'calc(env(safe-area-inset-bottom, 0px) + 96px)' }} aria-hidden="true" />
        </main>
      </div>

      <nav
        className="md:hidden fixed bottom-0 inset-x-0 z-40"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 10px)', paddingLeft: 'max(10px, env(safe-area-inset-left, 0px))', paddingRight: 'max(10px, env(safe-area-inset-right, 0px))' }}
        aria-label="Asosiy bo‘limlar"
      >
        <div className="grid grid-cols-5 rounded-2xl border border-slate-700/70 bg-slate-900/85 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,.45)] px-1 py-1">
          {TABS.map((t) => {
            const active = tab === t.id;
            return (
              <button type="button" key={t.id} onClick={() => setTab(t.id)} aria-current={active ? 'page' : undefined} className="flex flex-col items-center gap-0.5 py-1.5 min-w-0">
                <span className={`grid place-items-center h-8 w-12 rounded-full transition-all ${active ? 'bg-emerald-500/15 text-emerald-400' : 'text-slate-500'}`}>
                  <t.icon className={`w-5 h-5 transition-transform ${active ? 'scale-110' : ''}`} />
                </span>
                <span className={`text-[10px] leading-tight truncate max-w-full px-0.5 ${active ? 'text-emerald-300 font-semibold' : 'text-slate-500'}`}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="pointer-events-none fixed inset-0 z-[60]" aria-hidden="true" style={{ backgroundImage: watermarkUrl(me.code), backgroundRepeat: 'repeat' }} />
      <Toasts items={toasts} />
      {showSettings && <SettingsModal me={me} device={device} deviceStatus={deviceStatus} storageOk={storageOk} onReset={onReset} onClose={() => setShowSettings(false)} />}
    </div>
  );
}

/* ============================ ILOVA ============================ */

export default function App() {
  const [phase, setPhase] = useState('locked');
  const [userId, setUserId] = useState('sardor');
  const [device] = useState(computeDeviceFingerprint);
  const [studioKey, setStudioKey] = useState(0);
  const [justReset, setJustReset] = useState(false);
  const timer = useRef(null);

  const unlock = (memberId) => {
    setUserId(memberId);
    setJustReset(false);
    setPhase('unlocking');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setPhase('unlocked'), 1500);
  };
  const panic = () => {
    clearTimeout(timer.current);
    setPhase('locked');
  };
  const reset = () => {
    clearStore();
    setJustReset(true);
    setStudioKey((k) => k + 1);
  };
  useEffect(() => () => clearTimeout(timer.current), []);

  const unlockingMember = (readStore('members', MEMBER_SEED).find((m) => m.id === userId)) || MEMBER_SEED[0];

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      {phase === 'locked' && <GhostLock onUnlock={unlock} />}
      {phase === 'unlocking' && <UnlockSequence member={unlockingMember} deviceHash={device.hash} />}
      {phase === 'unlocked' && <Studio key={studioKey} userId={userId} device={device} onPanic={panic} onReset={reset} justReset={justReset} />}
    </>
  );
}
