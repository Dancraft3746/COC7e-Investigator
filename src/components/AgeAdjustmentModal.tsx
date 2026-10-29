import { Component, Show, createSignal, createMemo, For } from 'solid-js';
import {
  activeChar,
  setActiveChar,
  saveInvestigatorToDB,
} from '../stores/characterStore';
import type { Characteristics } from '../types/investigator';

export const [isAgeModalOpen, setIsAgeModalOpen] = createSignal(false);

interface EduCheckLog {
  checkNum: number;
  roll: number;
  target: number;
  success: boolean;
  gain: number;
}

export const AgeAdjustmentModal: Component = () => {
  const currentAge = () => activeChar.investigator.age || 30;
  const [targetAge, setTargetAge] = createSignal(activeChar.investigator.age || 30);
  const [eduLogs, setEduLogs] = createSignal<EduCheckLog[]>([]);
  const [applied, setApplied] = createSignal(false);

  // Determine age bracket rules based on Core Rulebook p.32-34
  const ageRule = createMemo(() => {
    const a = targetAge();
    if (a < 20) {
      return {
        bracket: '15–19 歲 (青少年)',
        strConDexPenalty: 0,
        appPenalty: 0,
        movPenalty: 0,
        eduChecks: 0,
        special: '力量 (STR) 或 體型 (SIZ) 扣除 5 點，教育 (EDU) 扣除 5 點。幸運可擲兩次 3D6*5 取較高者。',
      };
    }
    if (a <= 39) {
      return {
        bracket: '20–39 歲 (青年盛年)',
        strConDexPenalty: 0,
        appPenalty: 0,
        movPenalty: 0,
        eduChecks: 1,
        special: '進行 1 次 EDU 增長檢定。無生理懲罰。',
      };
    }
    if (a <= 49) {
      return {
        bracket: '40–49 歲 (中年初期)',
        strConDexPenalty: 5,
        appPenalty: 5,
        movPenalty: 1,
        eduChecks: 2,
        special: 'STR / CON / DEX 任選合計扣除 5 點；APP 扣除 5 點；MOV 減 1；進行 2 次 EDU 增長檢定。',
      };
    }
    if (a <= 59) {
      return {
        bracket: '50–59 歲 (成熟長者)',
        strConDexPenalty: 10,
        appPenalty: 10,
        movPenalty: 2,
        eduChecks: 3,
        special: 'STR / CON / DEX 任選合計扣除 10 點；APP 扣除 10 點；MOV 減 2；進行 3 次 EDU 增長檢定。',
      };
    }
    if (a <= 69) {
      return {
        bracket: '60–69 歲 (花甲老者)',
        strConDexPenalty: 20,
        appPenalty: 15,
        movPenalty: 3,
        eduChecks: 4,
        special: 'STR / CON / DEX 任選合計扣除 20 點；APP 扣除 15 點；MOV 減 3；進行 4 次 EDU 增長檢定。',
      };
    }
    if (a <= 79) {
      return {
        bracket: '70–79 歲 (古稀老人)',
        strConDexPenalty: 40,
        appPenalty: 20,
        movPenalty: 4,
        eduChecks: 4,
        special: 'STR / CON / DEX 任選合計扣除 40 點；APP 扣除 20 點；MOV 減 4；進行 4 次 EDU 增長檢定。',
      };
    }
    return {
      bracket: '80–89 歲 (耄耋高齡)',
      strConDexPenalty: 80,
      appPenalty: 25,
      movPenalty: 5,
      eduChecks: 4,
      special: 'STR / CON / DEX 任選合計扣除 80 點；APP 扣除 25 點；MOV 減 5；進行 4 次 EDU 增長檢定。',
    };
  });

  // Roll EDU improvement checks
  const rollEduChecks = () => {
    const times = ageRule().eduChecks;
    if (times === 0) {
      setEduLogs([]);
      return;
    }

    let tempEdu = activeChar.characteristics.EDU || 60;
    const logs: EduCheckLog[] = [];

    for (let i = 1; i <= times; i++) {
      const roll = Math.floor(Math.random() * 100) + 1;
      const success = roll > tempEdu || roll >= 96;
      let gain = 0;
      if (success) {
        gain = Math.floor(Math.random() * 10) + 1;
        tempEdu = Math.min(99, tempEdu + gain);
      }
      logs.push({
        checkNum: i,
        roll,
        target: tempEdu - (success ? gain : 0),
        success,
        gain,
      });
    }

    setEduLogs(logs);
  };

  // Apply to character
  const applyAgeAdjustments = () => {
    const rule = ageRule();
    const oldEdu = activeChar.characteristics.EDU || 60;
    const totalGain = eduLogs().reduce((acc, l) => acc + l.gain, 0);
    const newEdu = Math.min(99, oldEdu + totalGain);

    // Apply age
    setActiveChar('investigator', 'age', targetAge());

    // Apply EDU
    if (totalGain > 0) {
      setActiveChar('characteristics', 'EDU', newEdu);
    }

    // Apply APP penalty
    if (rule.appPenalty > 0) {
      const currentApp = activeChar.characteristics.APP || 50;
      setActiveChar('characteristics', 'APP', Math.max(1, currentApp - rule.appPenalty));
    }

    setApplied(true);
    setTimeout(() => {
      setIsAgeModalOpen(false);
      setApplied(false);
    }, 1500);
  };

  return (
    <Show when={isAgeModalOpen()}>
      <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
        <div class="bg-[#FAF5EB] max-w-lg w-full rounded-xl vintage-border shadow-2xl p-5 space-y-4 text-sepia-900 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div class="flex justify-between items-center border-b-2 border-sepia-800 pb-2.5">
            <div>
              <h3 class="font-title font-bold text-base text-sepia-900 flex items-center gap-1.5">
                <span>⏳ 官方年齡修正與教育增長計算器 (Age Adjuster)</span>
              </h3>
              <p class="text-xs text-sepia-700">
                依據第七版核心規則書 p.32–34 完整年齡生理衰退與人生履歷修正
              </p>
            </div>
            <button
              onClick={() => setIsAgeModalOpen(false)}
              class="w-6 h-6 rounded bg-sepia-800 text-parchment-100 flex items-center justify-center font-bold text-xs hover:bg-sepia-900 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Age Selection Input */}
          <div class="bg-parchment-100 p-3 rounded-lg border border-parchment-300 flex items-center justify-between">
            <div>
              <label class="block text-xs font-bold text-sepia-800">目標年齡 (Age):</label>
              <span class="text-xs text-sepia-600">當前角色年齡: {currentAge()} 歲</span>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="number"
                min="15"
                max="89"
                value={targetAge()}
                onInput={(e) => setTargetAge(Number(e.currentTarget.value))}
                class="w-20 text-center text-lg font-black bg-parchment-50 border border-parchment-400 rounded py-1 text-sepia-900"
              />
              <span class="text-xs font-bold">歲</span>
            </div>
          </div>

          {/* Age Bracket Rule Card */}
          <div class="bg-amber-50 p-3.5 rounded-lg border border-amber-300 space-y-2 text-xs">
            <div class="flex justify-between items-center border-b border-amber-200 pb-1">
              <strong class="font-title font-bold text-amber-950 text-sm">
                區間判定：{ageRule().bracket}
              </strong>
              <span class="font-mono font-bold bg-amber-200 text-amber-950 px-2 py-0.5 rounded">
                EDU 增長檢定: {ageRule().eduChecks} 次
              </span>
            </div>

            <p class="text-sepia-800 leading-relaxed font-serif">
              {ageRule().special}
            </p>

            <div class="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
              <div class="bg-parchment-200 p-1.5 rounded border border-parchment-400">
                <span class="block text-[10px] text-stone-600">STR/CON/DEX扣點</span>
                <span class="font-bold text-red-900">-{ageRule().strConDexPenalty} 點</span>
              </div>
              <div class="bg-parchment-200 p-1.5 rounded border border-parchment-400">
                <span class="block text-[10px] text-stone-600">APP 外貌衰退</span>
                <span class="font-bold text-red-900">-{ageRule().appPenalty} 點</span>
              </div>
              <div class="bg-parchment-200 p-1.5 rounded border border-parchment-400">
                <span class="block text-[10px] text-stone-600">MOV 移動力懲罰</span>
                <span class="font-bold text-stone-800">-{ageRule().movPenalty}</span>
              </div>
            </div>
          </div>

          {/* EDU Check Interactive Roller */}
          <Show when={ageRule().eduChecks > 0}>
            <div class="bg-parchment-100 p-3 rounded-lg border border-parchment-300 space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-xs font-bold text-sepia-900">
                  🎓 EDU 人生資歷成長檢定 (需擲出 &gt; 當前 EDU 或 ≥96)
                </span>
                <button
                  onClick={rollEduChecks}
                  class="bg-eldritch-purple hover:bg-opacity-90 text-amber-100 px-2.5 py-1 rounded text-xs font-bold shadow cursor-pointer transition flex items-center gap-1"
                >
                  <span>🎲 擲骰檢定 ({ageRule().eduChecks} 次)</span>
                </button>
              </div>

              <Show when={eduLogs().length > 0}>
                <div class="space-y-1.5 mt-2">
                  <For each={eduLogs()}>
                    {(log) => (
                      <div class="flex justify-between items-center bg-parchment-50 p-2 rounded border border-parchment-300 text-xs font-mono">
                        <span>第 {log.checkNum} 次檢定 (目標 &gt; {log.target}):</span>
                        <div class="flex items-center gap-2">
                          <span class="font-bold">擲出: {log.roll}</span>
                          <span
                            class={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              log.success
                                ? 'bg-green-700 text-white'
                                : 'bg-stone-300 text-stone-700'
                            }`}
                          >
                            {log.success ? `✅ 成功! EDU +${log.gain}` : '❌ 未成長'}
                          </span>
                        </div>
                      </div>
                    )}
                  </For>

                  <div class="text-xs font-bold text-green-950 bg-green-100 p-2 rounded border border-green-300 text-center">
                    EDU 總成長：+{eduLogs().reduce((acc, l) => acc + l.gain, 0)} 點！
                    (新 EDU = {Math.min(99, (activeChar.characteristics.EDU || 60) + eduLogs().reduce((acc, l) => acc + l.gain, 0))})
                  </div>
                </div>
              </Show>
            </div>
          </Show>

          {/* Actions */}
          <div class="flex justify-end gap-2 pt-2 border-t border-sepia-800">
            <button
              onClick={() => setIsAgeModalOpen(false)}
              class="px-3 py-1.5 rounded text-xs font-bold bg-stone-300 text-stone-800 hover:bg-stone-400 cursor-pointer"
            >
              取消
            </button>
            <button
              onClick={applyAgeAdjustments}
              class="px-4 py-1.5 rounded text-xs font-bold bg-eldritch-gold text-stone-950 hover:bg-yellow-500 shadow-md cursor-pointer transition flex items-center gap-1 font-title"
            >
              <span>{applied() ? '✅ 已套用年齡修正！' : '💾 確認套用年齡修正'}</span>
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};
