import { createSignal, createMemo, createEffect } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import type {
  InvestigatorData,
  CharacterSummary,
  VitalsState,
  SanityState,
  DiceBotPrefix,
  Characteristics,
  SkillItem,
  TomeItem,
  SpellItem,
  EntityItem,
  ContactItem,
  ChronicleItem,
} from '../types/investigator';
import {
  saveInvestigatorToDB,
  loadInvestigatorFromDB,
  getAllInvestigatorSummaries,
  deleteInvestigatorFromDB,
  getActiveCharacterId,
  setActiveCharacterId,
} from '../lib/storage';
import { defaultEdwardPierce, defaultNormanNobody } from '../data/defaultData';

// Active Character Store
const [activeChar, setActiveChar] = createStore<InvestigatorData>(
  JSON.parse(JSON.stringify(defaultEdwardPierce))
);

// UI Global Signals
export const [activeTab, setActiveTab] = createSignal<
  'core' | 'skills' | 'grimoire' | 'mythos' | 'contacts' | 'chronicles'
>('core');
export const [isDrawerOpen, setIsDrawerOpen] = createSignal(false);
export const [isDiscordModalOpen, setIsDiscordModalOpen] = createSignal(false);
export const [isPanicModalOpen, setIsPanicModalOpen] = createSignal(false);
export const [discordBotPrefix, setDiscordBotPrefix] = createSignal<DiceBotPrefix>('.ra');
export const [rosterSummaries, setRosterSummaries] = createSignal<CharacterSummary[]>([]);
export const [isInitialized, setIsInitialized] = createSignal(false);

// Derived Reactive Metrics (Pure Memos)
export const maxHP = createMemo(() => {
  const con = activeChar.characteristics.CON || 50;
  const siz = activeChar.characteristics.SIZ || 50;
  return Math.floor((con + siz) / 10);
});

export const majorWoundThreshold = createMemo(() => Math.floor(maxHP() / 2));

export const maxMP = createMemo(() => {
  const pow = activeChar.characteristics.POW || 50;
  return Math.floor(pow / 5);
});

export const creditRating = createMemo(() => {
  const cr = activeChar.skills.find((s) => s.name.includes('信用評級'));
  return cr ? cr.total : 25;
});

export const maxSanity = createMemo(() => {
  const mythos = activeChar.skills.find((s) => s.name.includes('克蘇魯神話'));
  const mythosVal = mythos ? mythos.total : 0;
  return Math.max(0, 99 - mythosVal);
});

export const charSum = createMemo(() => {
  const c = activeChar.characteristics;
  return c.STR + c.CON + c.DEX + c.APP + c.POW + c.INT + c.SIZ + c.EDU;
});

export const buildAndDB = createMemo(() => {
  const sum = (activeChar.characteristics.STR || 0) + (activeChar.characteristics.SIZ || 0);
  if (sum < 65) return { build: -2, db: '-2' };
  if (sum < 85) return { build: -1, db: '-1' };
  if (sum < 125) return { build: 0, db: '0' };
  if (sum < 165) return { build: 1, db: '+1D4' };
  if (sum < 205) return { build: 2, db: '+1D6' };
  if (sum < 285) return { build: 3, db: '+2D6' };
  return { build: 4, db: '+3D6' };
});

export const moveRate = createMemo(() => {
  const { STR, DEX, SIZ } = activeChar.characteristics;
  let base = 8;
  if (STR < SIZ && DEX < SIZ) base = 7;
  else if (STR > SIZ && DEX > SIZ) base = 9;

  const age = activeChar.investigator.age || 30;
  let penalty = 0;
  if (age >= 80) penalty = 5;
  else if (age >= 70) penalty = 4;
  else if (age >= 60) penalty = 3;
  else if (age >= 50) penalty = 2;
  else if (age >= 40) penalty = 1;

  return Math.max(1, base - penalty);
});

// 100% Reversible Vitals State Machine
export const hpState = createMemo((): { text: string; bgClass: string; isPulse: boolean } => {
  const hp = activeChar.investigator.hp;
  const max = maxHP();
  const mw = activeChar.investigator.majorWound;

  if (hp <= -max) {
    return { text: '💀 瞬間致死 (Instant Death)', bgClass: 'bg-red-950 text-white', isPulse: true };
  }
  if (hp <= 0 && mw) {
    return { text: '⚠️ 瀕死 (Dying · 每輪CON檢定)', bgClass: 'bg-red-800 text-white', isPulse: true };
  }
  if (hp <= 0) {
    return { text: '💤 昏迷 (Unconscious · 1小時甦醒)', bgClass: 'bg-amber-800 text-white', isPulse: false };
  }
  if (mw) {
    return { text: '🩹 重傷受創 (Major Wound · 休養每週恢復)', bgClass: 'bg-red-100 text-red-900 border border-red-300', isPulse: false };
  }
  if (hp < max) {
    return { text: '🤕 輕傷微恙 (Minor Injury · 每日恢復1點)', bgClass: 'bg-amber-50 text-amber-900 border border-amber-200', isPulse: false };
  }
  return { text: '💚 健康健全 (Healthy)', bgClass: 'bg-green-100 text-green-900 border border-green-300', isPulse: false };
});

// 100% Reversible Sanity State Machine
export const sanState = createMemo((): { text: string; bgClass: string; isPulse: boolean } => {
  const san = activeChar.investigator.san;
  const pow = activeChar.characteristics.POW || 60;

  if (san <= 0) {
    return { text: '💀 永久瘋狂 (SAN歸零 · 角色退場)', bgClass: 'bg-purple-950 text-white', isPulse: true };
  }
  if (activeChar.investigator.changed) {
    return { text: '🌀 心智質變 (Changed · 幸運凍結)', bgClass: 'bg-purple-200 text-purple-950 border border-purple-400', isPulse: false };
  }
  if (activeChar.investigator.shock) {
    return { text: '⚡ 震懾餘波 (Aftershock · 易生幻覺)', bgClass: 'bg-amber-100 text-amber-900 border border-amber-300', isPulse: false };
  }
  if (san < pow) {
    return { text: `⚠️ 理智損耗 (損耗 ${pow - san} 點)`, bgClass: 'bg-amber-50 text-purple-900 border border-purple-200', isPulse: false };
  }
  return { text: '🧠 心智健全 (Sane)', bgClass: 'bg-green-100 text-green-900 border border-green-300', isPulse: false };
});

// Actions
export async function refreshRoster(): Promise<void> {
  const list = await getAllInvestigatorSummaries();
  setRosterSummaries(list);
}

export async function initApp(): Promise<void> {
  if (typeof window === 'undefined') return;

  // Check URL Hash first
  const hash = window.location.hash;
  if (hash.startsWith('#investigator=')) {
    try {
      const decoded = decodeURIComponent(hash.replace('#investigator=', ''));
      const parsed = JSON.parse(decoded) as InvestigatorData;
      if (parsed && parsed.investigator && parsed.characteristics) {
        if (!parsed.id) parsed.id = `char_${Date.now()}`;
        setActiveChar(reconcile(parsed));
        await saveInvestigatorToDB(parsed);
        await setActiveCharacterId(parsed.id);
        await refreshRoster();
        setIsInitialized(true);
        return;
      }
    } catch (e) {
      console.warn('URL hash parse failed', e);
    }
  }

  // Load from IndexedDB
  await refreshRoster();
  const summaries = rosterSummaries();
  let targetId = await getActiveCharacterId();

  if (!targetId || !summaries.some((s) => s.id === targetId)) {
    if (summaries.length > 0) {
      targetId = summaries[0].id;
    } else {
      // Seed default Pierce and Norman into DB
      await saveInvestigatorToDB(defaultEdwardPierce);
      await saveInvestigatorToDB(defaultNormanNobody);
      targetId = defaultEdwardPierce.id;
      await refreshRoster();
    }
  }

  const loaded = await loadInvestigatorFromDB(targetId);
  if (loaded) {
    setActiveChar(reconcile(loaded));
    await setActiveCharacterId(targetId);
  }
  setIsInitialized(true);
}

// Auto-save whenever activeChar changes
createEffect(() => {
  if (!isInitialized()) return;
  const data = JSON.parse(JSON.stringify(activeChar)) as InvestigatorData;
  saveInvestigatorToDB(data).then(() => {
    refreshRoster();
  });
});

export async function switchCharacter(id: string): Promise<void> {
  const loaded = await loadInvestigatorFromDB(id);
  if (loaded) {
    setActiveChar(reconcile(loaded));
    await setActiveCharacterId(id);
    setIsDrawerOpen(false);
  }
}

export async function createNewCharacter(): Promise<void> {
  const newId = `char_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const template: InvestigatorData = {
    ...JSON.parse(JSON.stringify(defaultEdwardPierce)),
    id: newId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    investigator: {
      ...defaultEdwardPierce.investigator,
      name: '新調查員 (New Investigator)',
    },
  };
  await saveInvestigatorToDB(template);
  await switchCharacter(newId);
}

export async function duplicateCurrentCharacter(): Promise<void> {
  const newId = `char_${Date.now()}_copy`;
  const copy: InvestigatorData = {
    ...JSON.parse(JSON.stringify(activeChar)),
    id: newId,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    investigator: {
      ...activeChar.investigator,
      name: `${activeChar.investigator.name} (副本)`,
    },
  };
  await saveInvestigatorToDB(copy);
  await switchCharacter(newId);
}

export async function deleteCurrentCharacter(id: string): Promise<void> {
  await deleteInvestigatorFromDB(id);
  const remaining = rosterSummaries().filter((s) => s.id !== id);
  if (remaining.length > 0) {
    await switchCharacter(remaining[0].id);
  } else {
    await saveInvestigatorToDB(defaultEdwardPierce);
    await switchCharacter(defaultEdwardPierce.id);
  }
}

export async function loadNormanNobodyProfile(): Promise<void> {
  await saveInvestigatorToDB(defaultNormanNobody);
  await switchCharacter(defaultNormanNobody.id);
}

export async function resetToDefaultPierce(): Promise<void> {
  await saveInvestigatorToDB(defaultEdwardPierce);
  await switchCharacter(defaultEdwardPierce.id);
}

// Discord Roll Formatter
export function formatDiceCommand(skillName: string, total: number): string {
  const prefix = discordBotPrefix();
  if (prefix === '.ra') return `.ra ${skillName} ${total}`;
  if (prefix === 'cc') return `cc ${total} ${skillName}`;
  return `.r 1d100<=${total} ${skillName}`;
}

export function generateDiscordStatusCard(): string {
  const p = activeChar.investigator;
  const b = buildAndDB();
  return `╭───【 ${p.name} · 調查員現況面板 】───╮
│ ❤️ HP: ${p.hp}/${maxHP()}  ✨ MP: ${p.mp}/${maxMP()}  🧠 SAN: ${p.san}/${maxSanity()}
│ 🩹 生理: ${hpState().text}
│ 🌀 心智: ${sanState().text}
│ 🍀 幸運: ${p.luck}  |  🏃 MOV: ${moveRate()}  |  🥊 DB: ${b.db} (體格 ${b.build})
│ 🔫 主要武器: .38 左輪手槍 (60%) 1D10  |  徒手鬥毆 (60%) 1D3
╰──────────────────────────────────────────╯`;
}

export function generateGrowthChecklist(): string {
  const checked = activeChar.skills.filter((s) => s.checked);
  if (checked.length === 0) return '';
  let text = `📋【${activeChar.investigator.name} 團後技能成長檢定清單】\n守密人 (KP) 您好，以下為本次模組成功發揮之技能：\n----------------------------------------\n`;
  checked.forEach((s, i) => {
    text += `${i + 1}. ${s.name} (目前 ${s.total}%) ➜ 擲 1D100 > ${s.total} 或 ≥96\n`;
  });
  text += `----------------------------------------\n（通過者請擲 1D10 增長點數！）`;
  return text;
}

export function copyShareURL(): string {
  const clean = JSON.parse(JSON.stringify(activeChar));
  const encoded = encodeURIComponent(JSON.stringify(clean));
  const url = `${window.location.origin}${window.location.pathname}#investigator=${encoded}`;
  navigator.clipboard.writeText(url);
  return url;
}

export function exportJSONFile(): void {
  const clean = JSON.parse(JSON.stringify(activeChar));
  const blob = new Blob([JSON.stringify(clean, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${activeChar.investigator.name}_COC7e_Codex.json`;
  a.click();
}

export async function importJSONFile(file: File): Promise<void> {
  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const data = JSON.parse(e.target?.result as string) as InvestigatorData;
      if (data && data.investigator && data.characteristics) {
        if (!data.id) data.id = `char_${Date.now()}`;
        await saveInvestigatorToDB(data);
        await switchCharacter(data.id);
        alert(`✅ 已成功匯入調查員【${data.investigator.name}】！`);
      }
    } catch (err) {
      alert('❌ 檔案解析失敗，請確認是否為合法的 COC 7e JSON 檔案。');
    }
  };
  reader.readAsText(file);
}


// Interactive In-App Dice Roller Engine
export interface DiceRollModalState {
  isOpen: boolean;
  title: string;
  target: number;
  skillId?: string;
  result: number | null;
  outcomeText: string;
  outcomeClass: string;
  isSuccess: boolean;
}

export const [activeDiceRoll, setActiveDiceRoll] = createStore<DiceRollModalState>({
  isOpen: false,
  title: '',
  target: 50,
  result: null,
  outcomeText: '',
  outcomeClass: '',
  isSuccess: false,
});

export function openDiceModal(title: string, target: number, skillId?: string) {
  setActiveDiceRoll({
    isOpen: true,
    title,
    target,
    skillId,
    result: null,
    outcomeText: '',
    outcomeClass: '',
    isSuccess: false,
  });
}

export function closeDiceModal() {
  setActiveDiceRoll('isOpen', false);
}

export function rollCurrentDice() {
  const result = Math.floor(Math.random() * 100) + 1;
  const target = activeDiceRoll.target;
  const fumbleThreshold = target < 50 ? 96 : 100;

  let outcomeText = '';
  let outcomeClass = '';
  let isSuccess = false;

  if (result === 1) {
    outcomeText = '🌟 大成功 (Critical Success · 01)';
    outcomeClass = 'bg-amber-400 text-stone-950 font-black';
    isSuccess = true;
  } else if (result >= fumbleThreshold) {
    outcomeText = `💀 大失敗 (Fumble · ${result})`;
    outcomeClass = 'bg-red-950 text-white animate-pulse font-black';
    isSuccess = false;
  } else if (result <= Math.floor(target / 5)) {
    outcomeText = '🟣 極限成功 (Extreme Success)';
    outcomeClass = 'bg-purple-800 text-amber-100 font-bold';
    isSuccess = true;
  } else if (result <= Math.floor(target / 2)) {
    outcomeText = '🔵 困難成功 (Hard Success)';
    outcomeClass = 'bg-blue-800 text-white font-bold';
    isSuccess = true;
  } else if (result <= target) {
    outcomeText = '🟢 常規成功 (Regular Success)';
    outcomeClass = 'bg-green-800 text-white font-bold';
    isSuccess = true;
  } else {
    outcomeText = '❌ 失敗 (Failure)';
    outcomeClass = 'bg-stone-300 text-stone-800 font-bold';
    isSuccess = false;
  }

  // If skillId and success, auto-check growth!
  if (isSuccess && activeDiceRoll.skillId) {
    setActiveChar('skills', (s) => s.id === activeDiceRoll.skillId, 'checked', true);
  }

  setActiveDiceRoll({
    result,
    outcomeText,
    outcomeClass,
    isSuccess,
  });
}

export function copyLastRollDiscord() {
  const { title, target, result, outcomeText } = activeDiceRoll;
  const text = `🎲【${activeChar.investigator.name} · ${title}】\n目標: ${target}% | 擲出: ${result} ➜ ${outcomeText}！`;
  navigator.clipboard.writeText(text);
  alert('✅ 已複製擲骰結果至剪貼簿！直接在 Discord 貼上即可發布！');
}


// 5F Acute Panic & Bout State
export interface PanicState {
  fiveF: string;
  fiveFDesc: string;
  symptom: string;
  symptomDesc: string;
  durationRounds: number;
  phobiaMania: string;
}

export const [activePanic, setActivePanic] = createStore<PanicState>({
  fiveF: '',
  fiveFDesc: '',
  symptom: '',
  symptomDesc: '',
  durationRounds: 0,
  phobiaMania: '',
});

export { activeChar, setActiveChar };
