import { Component, createSignal, Show, createMemo } from 'solid-js';
import { activeChar, setActiveChar, maxSanity } from '../stores/characterStore';
import { triggerSanityCheck } from '../stores/sanityStore';
import type { EntityItem } from '../types/investigator';

interface EncounterSanityModalProps {
  entity: EntityItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EncounterSanityModal: Component<EncounterSanityModalProps> = (props) => {
  const [firstEncounter, setFirstEncounter] = createSignal(true);
  const [rollResult, setRollResult] = createSignal<{
    roll: number;
    outcomeText: string;
    isSuccess: boolean;
    isFumble: boolean;
    isCritical: boolean;
    sanLost: number;
    mythosAwarded: number;
  } | null>(null);

  // Derive formula for this entity
  const defaultFormula = createMemo(() => {
    if (!props.entity) return { success: '0', failure: '1D6' };
    if (props.entity.sanLossSuccess && props.entity.sanLossFailure) {
      return { success: props.entity.sanLossSuccess, failure: props.entity.sanLossFailure };
    }

    const n = props.entity.name.toLowerCase();
    const cat = props.entity.category;

    if (n.includes('克蘇魯') || n.includes('cthulhu') || n.includes('阿撒托斯') || n.includes('azathoth') || n.includes('奈亞') || n.includes('nyarlathotep') || n.includes('哈斯塔') || n.includes('hastur') || n.includes('莎布') || n.includes('shub')) {
      return { success: '1D10', failure: '1D100' };
    }
    if (n.includes('修格斯') || n.includes('shoggoth') || n.includes('星之眷族') || n.includes('star spawn') || n.includes('鑽地魔蟲') || n.includes('chthonian')) {
      return { success: '1D6', failure: '1D20' };
    }
    if (n.includes('廷達洛斯') || n.includes('tindalos') || n.includes('黑山羊幼崽') || n.includes('dark young')) {
      return { success: '1D3', failure: '1D10' };
    }
    if (n.includes('達貢') || n.includes('dagon') || n.includes('海德拉') || n.includes('hydra') || n.includes('水母') || n.includes('polyp') || n.includes('恐怖獵手')) {
      return { success: '1', failure: '1D10' };
    }
    if (n.includes('拜亞基') || n.includes('byakhee') || n.includes('活屍') || n.includes('zombie')) {
      return { success: '1', failure: '1D6' };
    }
    if (cat.includes('舊日支配者') || cat.includes('外神')) {
      return { success: '1D10', failure: '1D100' };
    }
    if (cat.includes('邪教組織')) {
      return { success: '0', failure: '1D3' };
    }
    return { success: '0', failure: '1D6' };
  });

  const rollFormula = (formula: string, isFumbleMax = false): number => {
    const trimmed = formula.trim().toUpperCase();
    if (!trimmed.includes('D')) {
      return parseInt(trimmed, 10) || 0;
    }
    const [cStr, sStr] = trimmed.split('D');
    const count = parseInt(cStr, 10) || 1;
    const sides = parseInt(sStr, 10) || 6;

    if (isFumbleMax) {
      return count * sides; // Maximum possible damage on fumble!
    }

    let sum = 0;
    for (let i = 0; i < count; i++) {
      sum += Math.floor(Math.random() * sides) + 1;
    }
    return sum;
  };

  const handlePerformSanityCheck = () => {
    if (!props.entity) return;

    const currentSAN = activeChar.investigator.san;
    const roll = Math.floor(Math.random() * 100) + 1;
    const fumble = currentSAN < 50 ? 96 : 100;

    let outcomeText = '';
    let isSuccess = false;
    let isFumble = false;
    let isCritical = false;
    let sanLost = 0;

    const formula = defaultFormula();

    if (roll === 1) {
      outcomeText = '🌟 理智大成功 (Critical 01)！意志如鋼鐵般堅不可摧！';
      isSuccess = true;
      isCritical = true;
      sanLost = 0;
    } else if (roll >= fumble) {
      outcomeText = `💀 理智大失敗 (${roll})！心智直接撕裂，承受最大極限損失！`;
      isSuccess = false;
      isFumble = true;
      sanLost = rollFormula(formula.failure, true);
    } else if (roll <= Math.floor(currentSAN / 5)) {
      outcomeText = `🟣 理智極限成功 (${roll} <= ${Math.floor(currentSAN / 5)})！`;
      isSuccess = true;
      sanLost = rollFormula(formula.success);
    } else if (roll <= Math.floor(currentSAN / 2)) {
      outcomeText = `🔵 理智困難成功 (${roll} <= ${Math.floor(currentSAN / 2)})！`;
      isSuccess = true;
      sanLost = rollFormula(formula.success);
    } else if (roll <= currentSAN) {
      outcomeText = `🟢 理智常規成功 (${roll} <= ${currentSAN})！`;
      isSuccess = true;
      sanLost = rollFormula(formula.success);
    } else {
      outcomeText = `❌ 理智檢定失敗 (${roll} > ${currentSAN})！理智崩解！`;
      isSuccess = false;
      sanLost = rollFormula(formula.failure);
    }

    // Apply SAN loss
    const newSAN = Math.max(0, currentSAN - sanLost);
    setActiveChar('investigator', 'san', newSAN);

    // Apply First Encounter Cthulhu Mythos Gain (Core Rulebook p.169)
    let mythosAwarded = 0;
    if (firstEncounter() && sanLost > 0) {
      mythosAwarded = 1;
      const mythosSkillIndex = activeChar.skills.findIndex((s) => s.name.includes('克蘇魯神話'));
      if (mythosSkillIndex >= 0) {
        const cur = activeChar.skills[mythosSkillIndex].total;
        setActiveChar('skills', mythosSkillIndex, 'total', cur + mythosAwarded);
        setActiveChar('skills', mythosSkillIndex, 'growth', (g) => g + mythosAwarded);
      }
      setActiveChar('entities', (e) => e.id === props.entity!.id, 'hasEncountered', true);
    }

    setRollResult({
      roll,
      outcomeText,
      isSuccess,
      isFumble,
      isCritical,
      sanLost,
      mythosAwarded,
    });

    // If Sanity loss >= 5 in a single event: trigger acute panic check
    if (sanLost >= 5) {
      triggerSanityCheck(sanLost);
    }
  };

  const copyDiscordEncounterReport = () => {
    if (!props.entity || !rollResult()) return;
    const r = rollResult()!;
    const text = `👁️【${activeChar.investigator.name} 直面神話實體：${props.entity.name}】
理智檢定: 1D100 = ${r.roll} (目標 ${activeChar.investigator.san + r.sanLost}) ➜ ${r.outcomeText}
理智代價: 失去 ${r.sanLost} 點 SAN (損失公式: ${defaultFormula().success}/${defaultFormula().failure})
${r.mythosAwarded > 0 ? `✨ 首次直面宇宙真相: 獲得 +${r.mythosAwarded}% 克蘇魯神話知識！\n` : ''}當前理智: 🧠 SAN ${activeChar.investigator.san}/${maxSanity()}${r.sanLost >= 5 ? ' ⚠️ 陷入急性瘋狂/5F應激！' : ''}`;
    navigator.clipboard.writeText(text);
    alert('✅ 已複製神話遭遇檢定戰報至剪貼簿！');
  };

  return (
    <Show when={props.isOpen && props.entity}>
      <div class="fixed inset-0 z-50 bg-black/65 flex items-center justify-center p-4 backdrop-blur-xs">
        <div class="bg-[#FAF5EB] p-5 rounded-lg max-w-md w-full vintage-border shadow-2xl space-y-4 text-sepia-900">
          {/* Header */}
          <div class="flex justify-between items-start border-b border-sepia-800 pb-2.5">
            <div>
              <span class="text-[10px] uppercase font-bold tracking-wider text-red-950 bg-red-100 px-2 py-0.5 rounded border border-red-300">
                👁️ 神話遭遇理智檢定 (Core p.142)
              </span>
              <h3 class="text-base font-title font-bold text-sepia-900 mt-1">
                {props.entity?.name}
              </h3>
            </div>
            <button
              onClick={props.onClose}
              class="text-sepia-600 hover:text-sepia-900 text-lg font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Entity Profile Brief */}
          <div class="bg-parchment-200 p-2.5 rounded border border-parchment-400 space-y-1.5 text-xs">
            <div class="flex justify-between items-center">
              <span class="font-bold text-sepia-900">類別: {props.entity?.category}</span>
              <span class="font-mono font-bold text-red-900 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                SAN 損耗: {defaultFormula().success} / {defaultFormula().failure}
              </span>
            </div>
            <p class="text-[11px] text-sepia-800 italic leading-relaxed">
              {props.entity?.notes || '不可名狀之宇宙恐懼，超越人類心智常軌。'}
            </p>
          </div>

          {/* Investigator Current SAN */}
          <div class="bg-purple-50 p-2.5 rounded border border-purple-200 flex justify-between items-center text-xs">
            <div>
              <span class="font-bold text-purple-950 block">🧠 調查員當前理智值 (SAN)</span>
              <span class="text-[10px] text-stone-500">上限: {maxSanity()} 點</span>
            </div>
            <span class="text-base font-mono font-black text-purple-900">
              {activeChar.investigator.san}
            </span>
          </div>

          {/* First Encounter Toggle (Core p.169) */}
          <label class="flex items-center gap-2 p-2 bg-parchment-100 rounded border border-parchment-300 cursor-pointer">
            <input
              type="checkbox"
              checked={firstEncounter()}
              onChange={(e) => setFirstEncounter(e.currentTarget.checked)}
              class="rounded text-eldritch-green focus:ring-0"
            />
            <span class="text-xs text-sepia-900 font-bold">
              ✨ 首次遭遇直面 (Core p.169：初次目睹損失 SAN 即獲 +1% 神話)
            </span>
          </label>

          {/* Action Roll Button */}
          <Show when={!rollResult()}>
            <button
              onClick={handlePerformSanityCheck}
              class="w-full py-2.5 bg-red-950 hover:bg-black text-amber-100 font-bold rounded cursor-pointer transition shadow text-xs flex items-center justify-center gap-2"
            >
              <span>🎲 進行 1D100 理智檢定 (SAN Check)</span>
            </button>
          </Show>

          {/* Roll Result Display */}
          <Show when={rollResult()}>
            <div class="space-y-2 bg-parchment-100 p-3 rounded border border-parchment-300 text-xs">
              <div class={`p-2 rounded text-center font-mono font-bold ${
                rollResult()?.isSuccess
                  ? 'bg-green-100 text-green-900 border border-green-300'
                  : 'bg-red-100 text-red-900 border border-red-300'
              }`}>
                {rollResult()?.outcomeText}
              </div>

              <div class="grid grid-cols-2 gap-2 text-center font-mono">
                <div class="bg-red-50 p-2 rounded border border-red-200">
                  <span class="text-[10px] text-stone-500 block">理智損失 (SAN Loss)</span>
                  <span class="text-sm font-black text-red-950">-{rollResult()?.sanLost} 點</span>
                </div>
                <div class="bg-purple-50 p-2 rounded border border-purple-200">
                  <span class="text-[10px] text-stone-500 block">剩餘理智 (Remaining)</span>
                  <span class="text-sm font-black text-purple-900">{activeChar.investigator.san} 點</span>
                </div>
              </div>

              <Show when={(rollResult()?.mythosAwarded || 0) > 0}>
                <div class="p-1.5 bg-amber-100 rounded border border-amber-300 text-center text-[11px] font-bold text-amber-950">
                  🌟 獲得 +{rollResult()?.mythosAwarded}% 克蘇魯神話知識 (理智上限隨之調整)！
                </div>
              </Show>

              <Show when={(rollResult()?.sanLost || 0) >= 5}>
                <div class="p-1.5 bg-red-200 rounded border border-red-400 text-center text-[11px] font-bold text-red-950 animate-pulse">
                  ⚠️ 單次理智損失達 5 點！已觸發急性瘋狂與 5F 應激反應！
                </div>
              </Show>

              <div class="flex justify-between items-center pt-2">
                <button
                  onClick={copyDiscordEncounterReport}
                  class="bg-eldritch-gold hover:bg-amber-600 text-stone-900 px-3 py-1.5 rounded text-xs font-bold cursor-pointer transition shadow-xs"
                >
                  📋 複製戰報
                </button>
                <button
                  onClick={props.onClose}
                  class="bg-stone-800 hover:bg-stone-900 text-amber-100 px-4 py-1.5 rounded text-xs font-bold cursor-pointer transition shadow-xs"
                >
                  確認結算
                </button>
              </div>
            </div>
          </Show>

          <Show when={!rollResult()}>
            <div class="flex justify-end pt-1">
              <button
                onClick={props.onClose}
                class="px-3 py-1.5 rounded text-xs font-bold bg-parchment-300 hover:bg-parchment-400 text-sepia-900 cursor-pointer"
              >
                取消
              </button>
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
};
