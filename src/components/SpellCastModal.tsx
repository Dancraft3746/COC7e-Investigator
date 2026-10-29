import { Component, createSignal, Show, createMemo } from 'solid-js';
import { activeChar, setActiveChar, maxHP, maxMP, maxSanity, majorWoundThreshold } from '../stores/characterStore';
import { triggerSanityCheck } from '../stores/sanityStore';
import type { SpellItem } from '../types/investigator';

interface SpellCastModalProps {
  spell: SpellItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SpellCastModal: Component<SpellCastModalProps> = (props) => {
  const [mpToSpend, setMpToSpend] = createSignal<number>(1);
  const [hpToBurn, setHpToBurn] = createSignal<number>(0);
  const [sanToLose, setSanToLose] = createSignal<number>(1);
  const [rollDiceResult, setRollDiceResult] = createSignal<number | null>(null);
  const [powRollResult, setPowRollResult] = createSignal<{ roll: number; text: string; success: boolean } | null>(null);
  const [copiedNotification, setCopiedNotification] = createSignal(false);

  // Parse costs from spell.cost string
  createMemo(() => {
    if (!props.spell) return;
    const costStr = props.spell.cost || '';
    
    // Extract MP
    const mpMatch = costStr.match(/(\d+)\s*MP/i);
    const parsedMP = mpMatch ? parseInt(mpMatch[1], 10) : 1;
    
    const currMP = activeChar.investigator.mp;
    if (currMP >= parsedMP) {
      setMpToSpend(parsedMP);
      setHpToBurn(0);
    } else {
      setMpToSpend(currMP);
      setHpToBurn(parsedMP - currMP);
    }

    // Extract SAN
    const sanMatch = costStr.match(/(\d+D\d+|\d+)\s*SAN/i);
    if (sanMatch) {
      const sanExpr = sanMatch[1].toUpperCase();
      if (sanExpr.includes('D')) {
        const [count, sides] = sanExpr.split('D').map(Number);
        setSanToLose(Math.ceil((count * (sides + 1)) / 2));
      } else {
        setSanToLose(parseInt(sanExpr, 10));
      }
    } else {
      setSanToLose(1);
    }

    setRollDiceResult(null);
    setPowRollResult(null);
    setCopiedNotification(false);
  });

  const rollSanityLoss = () => {
    if (!props.spell) return;
    const costStr = props.spell.cost || '';
    const sanMatch = costStr.match(/(\d+D\d+|\d+)\s*SAN/i);
    if (sanMatch && sanMatch[1].toUpperCase().includes('D')) {
      const [countStr, sidesStr] = sanMatch[1].toUpperCase().split('D');
      const count = parseInt(countStr, 10) || 1;
      const sides = parseInt(sidesStr, 10) || 6;
      let total = 0;
      for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * sides) + 1;
      }
      setRollDiceResult(total);
      setSanToLose(total);
    } else {
      setRollDiceResult(sanToLose());
    }
  };

  const rollPowCheck = () => {
    const roll = Math.floor(Math.random() * 100) + 1;
    const pow = activeChar.characteristics.POW || 50;
    const fumble = pow < 50 ? 96 : 100;
    
    let text = '';
    let success = false;
    if (roll === 1) {
      text = '🌟 施法大成功 (Critical 01)！法術完美湧現！';
      success = true;
    } else if (roll >= fumble) {
      text = `💀 施法大失敗 (${roll})！魔法反噬或引來不可名狀之物！`;
      success = false;
    } else if (roll <= Math.floor(pow / 5)) {
      text = `🟣 極限成功 (${roll} <= ${Math.floor(pow / 5)})！意志高度集中！`;
      success = true;
    } else if (roll <= Math.floor(pow / 2)) {
      text = `🔵 困難成功 (${roll} <= ${Math.floor(pow / 2)})！順利引導魔力！`;
      success = true;
    } else if (roll <= pow) {
      text = `🟢 常規成功 (${roll} <= ${pow})！法術構建完成！`;
      success = true;
    } else {
      text = `❌ 施法失敗 (${roll} > ${pow})！法術未能成形！`;
      success = false;
    }
    setPowRollResult({ roll, text, success });
  };

  const executeSpellCasting = () => {
    if (!props.spell) return;

    const mpCost = mpToSpend();
    const hpCost = hpToBurn();
    const sanCost = sanToLose();

    // Deduct MP
    const newMP = Math.max(0, activeChar.investigator.mp - mpCost);
    setActiveChar('investigator', 'mp', newMP);

    // Deduct HP if blood magic used
    if (hpCost > 0) {
      const newHP = activeChar.investigator.hp - hpCost;
      setActiveChar('investigator', 'hp', newHP);
      if (hpCost >= majorWoundThreshold()) {
        setActiveChar('investigator', 'majorWound', true);
      }
    }

    // Deduct SAN
    const newSAN = Math.max(0, activeChar.investigator.san - sanCost);
    setActiveChar('investigator', 'san', newSAN);

    // Check for acute panic if sanCost >= 5
    if (sanCost >= 5) {
      triggerSanityCheck(sanCost);
    }

    // Copy casting announcement to clipboard
    const bloodNote = hpCost > 0 ? ` (🔥 核心規則 p.177 鮮血魔法: 獻祭 ${hpCost} HP 補足差額)` : '';
    const powNote = powRollResult() ? `\n意志檢定: ${powRollResult()?.text}` : '';
    const text = `🔮【${activeChar.investigator.name} 施放法術: ${props.spell.name}】\n消耗: ${mpCost} MP${bloodNote} · 失去 ${sanCost} 點理智 (SAN)\n施法時間: ${props.spell.castTime} | 出處: ${props.spell.source}${powNote}\n當前狀態: ❤️ HP ${activeChar.investigator.hp}/${maxHP()} | ✨ MP ${activeChar.investigator.mp}/${maxMP()} | 🧠 SAN ${activeChar.investigator.san}/${maxSanity()}`;
    
    try {
      navigator.clipboard.writeText(text);
      setCopiedNotification(true);
      setTimeout(() => {
        setCopiedNotification(false);
        props.onClose();
      }, 1500);
    } catch {
      props.onClose();
    }
  };

  return (
    <Show when={props.isOpen && props.spell}>
      <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
        <div class="bg-[#FAF5EB] p-5 rounded-lg max-w-md w-full vintage-border shadow-2xl space-y-4 text-sepia-900">
          {/* Header */}
          <div class="flex justify-between items-start border-b border-sepia-800 pb-2.5">
            <div>
              <span class="text-[10px] uppercase font-bold tracking-wider text-purple-900 bg-purple-100 px-2 py-0.5 rounded border border-purple-300">
                🔮 奧術詠唱與施法檢定
              </span>
              <h3 class="text-base font-title font-bold text-sepia-900 mt-1">
                {props.spell?.name}
              </h3>
            </div>
            <button
              onClick={props.onClose}
              class="text-sepia-600 hover:text-sepia-900 text-lg font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Spell Description Brief */}
          <div class="bg-parchment-200 p-2.5 rounded border border-parchment-400 text-xs text-sepia-800">
            <div class="flex justify-between font-mono font-bold text-[11px] mb-1 text-purple-900">
              <span>標稱耗損: {props.spell?.cost}</span>
              <span>施法時間: {props.spell?.castTime}</span>
            </div>
            <p class="italic text-[11px] leading-relaxed">
              {props.spell?.desc || '古老儀式，記載於神話殘卷中。'}
            </p>
          </div>

          {/* Current Vitals Status */}
          <div class="grid grid-cols-3 gap-2 font-mono text-center text-xs">
            <div class="bg-red-50 p-2 rounded border border-red-200">
              <span class="block text-[10px] text-red-700 font-bold">❤️ 當前 HP</span>
              <span class="text-sm font-black text-red-900">{activeChar.investigator.hp} / {maxHP()}</span>
            </div>
            <div class="bg-blue-50 p-2 rounded border border-blue-200">
              <span class="block text-[10px] text-blue-700 font-bold">✨ 當前 MP</span>
              <span class="text-sm font-black text-blue-900">{activeChar.investigator.mp} / {maxMP()}</span>
            </div>
            <div class="bg-purple-50 p-2 rounded border border-purple-200">
              <span class="block text-[10px] text-purple-700 font-bold">🧠 當前 SAN</span>
              <span class="text-sm font-black text-purple-900">{activeChar.investigator.san} / {maxSanity()}</span>
            </div>
          </div>

          {/* Spellcasting Costs Config */}
          <div class="space-y-3 bg-parchment-100 p-3 rounded border border-parchment-300 text-xs">
            {/* MP Consumption */}
            <div class="flex justify-between items-center">
              <div>
                <span class="font-bold text-blue-950">✨ 消耗法力值 (MP):</span>
                <span class="text-[10px] text-stone-500 block">現有 {activeChar.investigator.mp} 點</span>
              </div>
              <input
                type="number"
                min="0"
                max={activeChar.investigator.mp}
                value={mpToSpend()}
                onInput={(e) => setMpToSpend(Math.max(0, parseInt(e.currentTarget.value) || 0))}
                class="w-16 bg-white border border-parchment-400 rounded px-2 py-1 text-center font-mono font-bold text-blue-900"
              />
            </div>

            {/* Blood Magic HP Burning (Core Rulebook p.177) */}
            <div class="pt-2 border-t border-parchment-300">
              <div class="flex justify-between items-center">
                <div>
                  <span class="font-bold text-red-800 flex items-center gap-1">
                    <span>🩸 鮮血魔法 (Blood Magic · Burn HP)</span>
                  </span>
                  <span class="text-[10px] text-red-700 block">
                    核心規則 p.177: 法力不足時可以 1:1 消耗 HP 代替
                  </span>
                </div>
                <input
                  type="number"
                  min="0"
                  max={activeChar.investigator.hp}
                  value={hpToBurn()}
                  onInput={(e) => setHpToBurn(Math.max(0, parseInt(e.currentTarget.value) || 0))}
                  class="w-16 bg-red-50 border border-red-300 rounded px-2 py-1 text-center font-mono font-bold text-red-900"
                />
              </div>
              <Show when={hpToBurn() > 0}>
                <div class="mt-1.5 p-2 bg-red-100/80 rounded border border-red-300 text-[11px] text-red-900 font-bold space-y-0.5">
                  <p>🔥 燃燒 {hpToBurn()} 點生命值換取等額法力！</p>
                  <Show when={hpToBurn() >= majorWoundThreshold()}>
                    <p class="text-red-700">⚠️ 獻祭量達重傷閾值 ({majorWoundThreshold()})，施法後將陷入重傷！</p>
                  </Show>
                  <Show when={activeChar.investigator.hp - hpToBurn() <= 0}>
                    <p class="text-red-950 font-black">💀 警告：剩餘生命值將歸零或致死！</p>
                  </Show>
                </div>
              </Show>
            </div>

            {/* Sanity Loss Calculation */}
            <div class="pt-2 border-t border-parchment-300">
              <div class="flex justify-between items-center">
                <div>
                  <span class="font-bold text-purple-900">🧠 失去理智值 (SAN):</span>
                  <span class="text-[10px] text-stone-500 block">
                    標記耗損: {props.spell?.cost.match(/(\d+D\d+|\d+)\s*SAN/i)?.[1] || '1D4'}
                  </span>
                </div>
                <div class="flex items-center gap-1.5">
                  <button
                    onClick={rollSanityLoss}
                    class="bg-purple-800 hover:bg-purple-900 text-amber-100 text-[10px] font-bold px-2 py-1 rounded cursor-pointer transition shadow-xs"
                  >
                    🎲 擲骰
                  </button>
                  <input
                    type="number"
                    min="0"
                    value={sanToLose()}
                    onInput={(e) => setSanToLose(Math.max(0, parseInt(e.currentTarget.value) || 0))}
                    class="w-16 bg-purple-50 border border-purple-300 rounded px-2 py-1 text-center font-mono font-bold text-purple-900"
                  />
                </div>
              </div>
              <Show when={rollDiceResult() !== null}>
                <span class="text-[11px] font-mono text-purple-800 font-bold mt-1 block">
                  🎯 骰出理智損耗: {rollDiceResult()} 點
                  <Show when={(rollDiceResult() || 0) >= 5}>
                    <span class="text-red-700 ml-1">⚠️ 達 5 點將自動觸發 5F 應激檢定！</span>
                  </Show>
                </span>
              </Show>
            </div>
          </div>

          {/* POW Casting Test (Optional) */}
          <div class="bg-parchment-200 p-2.5 rounded border border-parchment-300 text-xs">
            <div class="flex justify-between items-center">
              <div>
                <span class="font-bold text-sepia-900">📜 意志檢定 (POW Check · 目標 {activeChar.characteristics.POW})</span>
                <span class="text-[10px] text-sepia-700 block">首次施法或極端施法情境專用</span>
              </div>
              <button
                onClick={rollPowCheck}
                class="bg-stone-800 hover:bg-stone-900 text-amber-100 text-[10px] font-bold px-2.5 py-1 rounded cursor-pointer transition shadow-xs"
              >
                🎲 檢定 1D100
              </button>
            </div>
            <Show when={powRollResult()}>
              <div class={`mt-2 p-1.5 rounded font-mono font-bold text-[11px] text-center ${powRollResult()?.success ? 'bg-green-100 text-green-900 border border-green-300' : 'bg-red-100 text-red-900 border border-red-300'}`}>
                {powRollResult()?.text}
              </div>
            </Show>
          </div>

          {/* Action Buttons */}
          <div class="flex justify-between items-center pt-2 border-t border-parchment-300">
            <button
              onClick={props.onClose}
              class="px-3 py-1.5 rounded text-xs font-bold bg-parchment-300 hover:bg-parchment-400 text-sepia-900 cursor-pointer transition"
            >
              取消
            </button>
            <button
              onClick={executeSpellCasting}
              class="px-4 py-2 rounded text-xs font-bold bg-eldritch-purple hover:bg-purple-900 text-amber-100 cursor-pointer transition shadow flex items-center gap-1.5"
            >
              <span>🔮 詠唱完成並扣除代價</span>
            </button>
          </div>

          <Show when={copiedNotification()}>
            <div class="bg-green-700 text-white text-xs font-bold text-center py-1.5 rounded shadow animate-bounce">
              ✅ 施法完成！宣告與狀態已複製至剪貼簿！
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
};
