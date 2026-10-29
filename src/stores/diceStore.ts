import { createStore } from 'solid-js/store';
import { activeChar, setActiveChar } from './characterStore';

export interface DiceRollModalState {
  isOpen: boolean;
  title: string;
  target: number;
  skillId?: string;
  result: number | null;
  outcomeText: string;
  outcomeClass: string;
  isSuccess: boolean;
  isPushed?: boolean;
  burnedLuck?: number;
  canBurnLuck?: boolean;
  luckCost?: number;
}

export const [activeDiceRoll, setActiveDiceRoll] = createStore<DiceRollModalState>({
  isOpen: false,
  title: '',
  target: 50,
  result: null,
  outcomeText: '',
  outcomeClass: '',
  isSuccess: false,
  isPushed: false,
  burnedLuck: 0,
  canBurnLuck: false,
  luckCost: 0,
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
    isPushed: false,
    burnedLuck: 0,
    canBurnLuck: false,
    luckCost: 0,
  });
}

export function closeDiceModal() {
  setActiveDiceRoll('isOpen', false);
}

export function rollCurrentDice(isPush = false) {
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
    outcomeText = isPush ? '🟢 孤注一擲成功 (Pushed Success)' : '🟢 常規成功 (Regular Success)';
    outcomeClass = 'bg-green-800 text-white font-bold';
    isSuccess = true;
  } else {
    outcomeText = isPush ? '💀 孤注一擲失敗！請守密人降下嚴重代價！' : '❌ 失敗 (Failure)';
    outcomeClass = isPush ? 'bg-red-950 text-white font-black animate-pulse' : 'bg-stone-300 text-stone-800 font-bold';
    isSuccess = false;
  }

  // If skillId and success, auto-check growth!
  if (isSuccess && activeDiceRoll.skillId) {
    setActiveChar('skills', (s) => s.id === activeDiceRoll.skillId, 'checked', true);
  }

  const luckCost = result - target;
  const canBurnLuck =
    !isSuccess &&
    !isPush &&
    result < fumbleThreshold &&
    luckCost > 0 &&
    luckCost <= activeChar.investigator.luck &&
    !activeDiceRoll.title.includes('幸運') &&
    !activeDiceRoll.title.includes('理智');

  setActiveDiceRoll({
    result,
    outcomeText,
    outcomeClass,
    isSuccess,
    isPushed: isPush,
    canBurnLuck,
    luckCost: canBurnLuck ? luckCost : 0,
    burnedLuck: 0,
  });
}

export function burnLuckForSuccess() {
  const cost = activeDiceRoll.luckCost || 0;
  if (cost <= 0 || cost > activeChar.investigator.luck) return;

  const currentLuck = activeChar.investigator.luck;
  setActiveChar('investigator', 'luck', currentLuck - cost);

  if (activeDiceRoll.skillId) {
    setActiveChar('skills', (s) => s.id === activeDiceRoll.skillId, 'checked', true);
  }

  setActiveDiceRoll({
    isSuccess: true,
    canBurnLuck: false,
    burnedLuck: cost,
    outcomeText: `🔥 燃燒 ${cost} 點幸運 ➜ 常規成功！`,
    outcomeClass: 'bg-amber-500 text-stone-950 font-black',
  });
}

export function pushCurrentRoll() {
  rollCurrentDice(true);
}

export function copyLastRollDiscord() {
  const { title, target, result, outcomeText } = activeDiceRoll;
  const text = `🎲【${activeChar.investigator.name} · ${title}】\n目標: ${target}% | 擲出: ${result} ➜ ${outcomeText}！`;
  navigator.clipboard.writeText(text);
  alert('✅ 已複製擲骰結果至剪貼簿！直接在 Discord 貼上即可發布！');
}
