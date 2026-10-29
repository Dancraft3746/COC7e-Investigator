import { Component, createSignal, Show, createMemo } from 'solid-js';
import { activeChar, setActiveChar, maxHP, majorWoundThreshold } from '../stores/characterStore';

interface MedicalTreatmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MedicalTreatmentModal: Component<MedicalTreatmentModalProps> = (props) => {
  const [treatmentLog, setTreatmentLog] = createSignal<string>('');
  const [lastRoll, setLastRoll] = createSignal<{ roll: number; target: number; outcome: string; success: boolean } | null>(null);

  const firstAidSkill = createMemo(() => {
    const s = activeChar.skills.find((sk) => sk.name.includes('急救'));
    return s ? s.total : 30;
  });

  const medicineSkill = createMemo(() => {
    const s = activeChar.skills.find((sk) => sk.name.includes('醫學'));
    return s ? s.total : 1;
  });

  const conValue = createMemo(() => activeChar.characteristics.CON || 50);

  // 1. First Aid Action (Core p.111)
  const applyFirstAid = () => {
    const target = firstAidSkill();
    const roll = Math.floor(Math.random() * 100) + 1;
    const fumble = target < 50 ? 96 : 100;
    const isSuccess = roll <= target && roll < fumble;

    let outcome = '';
    if (roll === 1) outcome = '🌟 急救大成功 (01)！包紮精湛止血！';
    else if (roll >= fumble) outcome = `💀 急救大失敗 (${roll})！傷口惡化感染！`;
    else if (roll <= Math.floor(target / 5)) outcome = `🟣 極限成功 (${roll} <= ${Math.floor(target / 5)})！快速止血鎮痛！`;
    else if (roll <= Math.floor(target / 2)) outcome = `🔵 困難成功 (${roll} <= ${Math.floor(target / 2)})！順利完成緊急處置！`;
    else if (roll <= target) outcome = `🟢 常規成功 (${roll} <= ${target})！止血穩定！`;
    else outcome = `❌ 急救失敗 (${roll} > ${target})！未能有效控制傷情！`;

    setLastRoll({ roll, target, outcome, success: isSuccess });

    if (isSuccess) {
      const currentHP = activeChar.investigator.hp;
      const isDying = currentHP <= 0 && activeChar.investigator.majorWound;
      
      let newHP = currentHP + 1;
      if (isDying) {
        newHP = 1; // Stabilize dying patient at 1 HP
      }
      newHP = Math.min(maxHP(), newHP);
      setActiveChar('investigator', 'hp', newHP);

      const log = `🩹【急救成功】擲出 ${roll} <= ${target} (${outcome})！${isDying ? '成功將瀕死調查員自死亡邊緣搶救復甦，穩定至 1 HP！' : `成功恢復 1 點生命值！(HP: ${currentHP} ➜ ${newHP})`}`;
      setTreatmentLog(log);
    } else {
      setTreatmentLog(`❌【急救失敗】擲出 ${roll} > ${target}！未能發揮急救效果。`);
    }
  };

  // 2. Medicine Action (Core p.111)
  const applyMedicine = () => {
    const target = medicineSkill();
    const roll = Math.floor(Math.random() * 100) + 1;
    const fumble = target < 50 ? 96 : 100;
    const isSuccess = roll <= target && roll < fumble;

    let outcome = '';
    if (roll === 1) outcome = '🌟 醫學大成功 (01)！高超醫術完美治癒！';
    else if (roll >= fumble) outcome = `💀 醫學大失敗 (${roll})！手術失誤或藥物劇毒反噬！`;
    else if (roll <= Math.floor(target / 5)) outcome = `🟣 極限成功 (${roll} <= ${Math.floor(target / 5)})！精準縫合用藥！`;
    else if (roll <= Math.floor(target / 2)) outcome = `🔵 困難成功 (${roll} <= ${Math.floor(target / 2)})！專業診斷調養！`;
    else if (roll <= target) outcome = `🟢 常規成功 (${roll} <= ${target})！順利治療！`;
    else outcome = `❌ 醫學失敗 (${roll} > ${target})！療程無顯著起色！`;

    setLastRoll({ roll, target, outcome, success: isSuccess });

    if (isSuccess) {
      const healAmount = Math.floor(Math.random() * 3) + 1; // 1D3 HP
      const currentHP = activeChar.investigator.hp;
      const newHP = Math.min(maxHP(), currentHP + healAmount);
      setActiveChar('investigator', 'hp', newHP);

      const log = `🩺【醫學治療成功】擲出 ${roll} <= ${target} (${outcome})！擲 1D3 回復 ${healAmount} 點生命值！(HP: ${currentHP} ➜ ${newHP}/${maxHP()})`;
      setTreatmentLog(log);
    } else if (roll >= fumble) {
      const harm = Math.floor(Math.random() * 3) + 1;
      const currentHP = activeChar.investigator.hp;
      const newHP = Math.max(0, currentHP - harm);
      setActiveChar('investigator', 'hp', newHP);
      setTreatmentLog(`💀【醫學大失敗反噬】醫療失誤造成 ${harm} 點額外傷害！(HP: ${currentHP} ➜ ${newHP})`);
    } else {
      setTreatmentLog(`❌【醫學失敗】擲出 ${roll} > ${target}！治療未能奏效。`);
    }
  };

  // 3. Weekly Major Wound Convalescence Check (Core p.112)
  const rollWeeklyConCheck = () => {
    const target = conValue();
    const roll = Math.floor(Math.random() * 100) + 1;
    const fumble = target < 50 ? 96 : 100;
    const isSuccess = roll <= target && roll < fumble;

    let outcome = '';
    if (roll === 1) outcome = '🌟 體質大成功 (01)！骨肉神經奇蹟般超速癒合！';
    else if (roll >= fumble) outcome = `💀 體質大失敗 (${roll})！傷口並發化膿壞死！`;
    else if (roll <= Math.floor(target / 5)) outcome = `🟣 極限成功 (${roll} <= ${Math.floor(target / 5)})！傷勢徹底復原且元氣恢復！`;
    else if (roll <= Math.floor(target / 2)) outcome = `🔵 困難成功 (${roll} <= ${Math.floor(target / 2)})！順利跨越危險期！`;
    else if (roll <= target) outcome = `🟢 常規成功 (${roll} <= ${target})！傷勢逐漸癒合！`;
    else outcome = `❌ 體質失敗 (${roll} > ${target})！重傷未見好轉，需繼續臥床休養！`;

    setLastRoll({ roll, target, outcome, success: isSuccess });

    if (isSuccess) {
      setActiveChar('investigator', 'majorWound', false);
      let bonusHeal = 0;
      if (roll <= Math.floor(target / 5) || roll === 1) {
        bonusHeal = Math.floor(Math.random() * 6) + 2; // 2D3 or bonus
        const newHP = Math.min(maxHP(), activeChar.investigator.hp + bonusHeal);
        setActiveChar('investigator', 'hp', newHP);
      }
      setTreatmentLog(`🏥【重傷康復】體質檢定擲出 ${roll} <= ${target} (${outcome})！成功消除重傷標記 (Major Wound)！${bonusHeal > 0 ? `極限成功額外恢復 ${bonusHeal} HP！` : ''}`);
    } else if (roll >= fumble) {
      const harm = Math.floor(Math.random() * 3) + 1;
      const newHP = Math.max(0, activeChar.investigator.hp - harm);
      setActiveChar('investigator', 'hp', newHP);
      setTreatmentLog(`💀【重傷惡化】體質大失敗！併發感染失去 ${harm} 點生命值！`);
    } else {
      setTreatmentLog(`❌【康復未成】體質檢定擲出 ${roll} > ${target}！重傷狀態持續，本週無法自然復原。`);
    }
  };

  // 4. Natural Daily Rest (+1 HP)
  const applyDailyRest = () => {
    if (activeChar.investigator.majorWound) {
      alert('⚠️ 處於重傷狀態下無法直接自然復原！需先通過每週體質 (CON) 檢定消除重傷標記！');
      return;
    }
    const currentHP = activeChar.investigator.hp;
    if (currentHP >= maxHP()) {
      alert('💚 調查員生命值已達上限，無需休養！');
      return;
    }
    const newHP = Math.min(maxHP(), currentHP + 1);
    setActiveChar('investigator', 'hp', newHP);
    setTreatmentLog(`🛌【臥床休養一日】經過充沛睡眠與療養，自然恢復 1 點生命值！(HP: ${currentHP} ➜ ${newHP}/${maxHP()})`);
  };

  const copyLogToClipboard = () => {
    if (!treatmentLog()) return;
    const text = `🏥【${activeChar.investigator.name} 醫療護理處置報告】\n${treatmentLog()}\n當前生理狀態: ❤️ HP ${activeChar.investigator.hp}/${maxHP()} | 重傷標記: ${activeChar.investigator.majorWound ? '🩹 是' : '💚 否'}`;
    navigator.clipboard.writeText(text);
    alert('✅ 已複製醫療戰報至剪貼簿！');
  };

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
        <div class="bg-[#FAF5EB] p-5 rounded-lg max-w-md w-full vintage-border shadow-2xl space-y-4 text-sepia-900">
          {/* Header */}
          <div class="flex justify-between items-start border-b border-sepia-800 pb-2.5">
            <div>
              <span class="text-[10px] uppercase font-bold tracking-wider text-red-950 bg-red-100 px-2 py-0.5 rounded border border-red-300">
                🏥 戰地醫療、救護與休養站 (Core p.111-112)
              </span>
              <h3 class="text-base font-title font-bold text-sepia-900 mt-1">
                傷患：{activeChar.investigator.name}
              </h3>
            </div>
            <button
              onClick={props.onClose}
              class="text-sepia-600 hover:text-sepia-900 text-lg font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Vitals Summary */}
          <div class="grid grid-cols-3 gap-2 font-mono text-center text-xs">
            <div class="bg-red-50 p-2 rounded border border-red-200">
              <span class="text-[10px] text-stone-500 block">生命值 (HP)</span>
              <span class="text-base font-black text-red-950">{activeChar.investigator.hp} / {maxHP()}</span>
            </div>
            <div class="bg-parchment-200 p-2 rounded border border-parchment-300">
              <span class="text-[10px] text-stone-500 block">重傷閾值 (MW)</span>
              <span class="text-sm font-bold text-sepia-900">{majorWoundThreshold()} 點</span>
            </div>
            <div class="bg-parchment-200 p-2 rounded border border-parchment-300">
              <span class="text-[10px] text-stone-500 block">重傷狀態</span>
              <span class={`text-xs font-black ${activeChar.investigator.majorWound ? 'text-red-700' : 'text-green-800'}`}>
                {activeChar.investigator.majorWound ? '🩹 重傷中' : '💚 無重傷'}
              </span>
            </div>
          </div>

          {/* Treatment Actions */}
          <div class="space-y-2.5">
            {/* 1. First Aid */}
            <div class="bg-parchment-100 p-2.5 rounded border border-parchment-300 flex justify-between items-center text-xs">
              <div>
                <span class="font-bold text-sepia-900 flex items-center gap-1">
                  <span>🩹 急救處置 (First Aid +1 HP)</span>
                </span>
                <span class="text-[10px] text-stone-500 block">
                  受傷 1 小時內施展 · 技能目標: {firstAidSkill()}% (瀕死時可搶救復甦)
                </span>
              </div>
              <button
                onClick={applyFirstAid}
                class="bg-red-800 hover:bg-red-900 text-white font-bold px-3 py-1.5 rounded cursor-pointer transition shadow-xs"
              >
                實施急救
              </button>
            </div>

            {/* 2. Medicine */}
            <div class="bg-parchment-100 p-2.5 rounded border border-parchment-300 flex justify-between items-center text-xs">
              <div>
                <span class="font-bold text-sepia-900 flex items-center gap-1">
                  <span>🩺 醫學治療 (Medicine +1D3 HP)</span>
                </span>
                <span class="text-[10px] text-stone-500 block">
                  耗時 1 小時以上 · 技能目標: {medicineSkill()}% (需醫療包或診所)
                </span>
              </div>
              <button
                onClick={applyMedicine}
                class="bg-blue-900 hover:bg-blue-950 text-white font-bold px-3 py-1.5 rounded cursor-pointer transition shadow-xs"
              >
                施展醫學
              </button>
            </div>

            {/* 3. Major Wound CON check */}
            <div class="bg-parchment-100 p-2.5 rounded border border-parchment-300 flex justify-between items-center text-xs">
              <div>
                <span class="font-bold text-red-900 flex items-center gap-1">
                  <span>🏥 重傷每週康復檢定 (CON Check)</span>
                </span>
                <span class="text-[10px] text-stone-500 block">
                  臥床每週體質檢定 · 目標: {conValue()}% (成功即解除重傷標記)
                </span>
              </div>
              <button
                onClick={rollWeeklyConCheck}
                class="bg-stone-800 hover:bg-stone-900 text-amber-100 font-bold px-3 py-1.5 rounded cursor-pointer transition shadow-xs"
              >
                體質檢定
              </button>
            </div>

            {/* 4. Daily Natural Rest */}
            <div class="bg-parchment-100 p-2.5 rounded border border-parchment-300 flex justify-between items-center text-xs">
              <div>
                <span class="font-bold text-green-950 flex items-center gap-1">
                  <span>🛌 臥床休養一日 (+1 HP)</span>
                </span>
                <span class="text-[10px] text-stone-500 block">
                  非重傷情況下，每充足休養一日自然恢復 1 點生命值
                </span>
              </div>
              <button
                onClick={applyDailyRest}
                class="bg-eldritch-green hover:bg-emerald-700 text-amber-100 font-bold px-3 py-1.5 rounded cursor-pointer transition shadow-xs"
              >
                自然休養
              </button>
            </div>
          </div>

          {/* Action Feedback Log */}
          <Show when={treatmentLog()}>
            <div class="p-3 bg-amber-50 border border-amber-300 rounded space-y-2 text-xs">
              <p class="text-amber-950 font-bold leading-relaxed">{treatmentLog()}</p>
              <div class="flex justify-end gap-2">
                <button
                  onClick={copyLogToClipboard}
                  class="bg-parchment-200 hover:bg-parchment-300 text-sepia-900 text-xs px-2.5 py-1 rounded font-bold cursor-pointer transition"
                >
                  📋 複製醫療報告
                </button>
              </div>
            </div>
          </Show>

          {/* Close */}
          <div class="flex justify-end pt-2 border-t border-parchment-300">
            <button
              onClick={props.onClose}
              class="px-3 py-1.5 rounded text-xs font-bold bg-parchment-300 hover:bg-parchment-400 text-sepia-900 cursor-pointer"
            >
              完成返回
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};
