import { Component, Show, createSignal, For } from 'solid-js';
import {
  activeChar,
  setActiveChar,
  maxSanity,
} from '../stores/characterStore';
import type { ChronicleItem } from '../types/investigator';

export const [isDevPhaseOpen, setIsDevPhaseOpen] = createSignal(false);

interface SkillGrowthResult {
  skillId: string;
  name: string;
  prevTotal: number;
  roll: number;
  success: boolean;
  gain: number;
  newTotal: number;
  hit90Milestone: boolean;
}

export const DevelopmentPhaseModal: Component = () => {
  const [results, setResults] = createSignal<SkillGrowthResult[]>([]);
  const [luckRoll, setLuckRoll] = createSignal<{ roll: number; target: number; success: boolean; gain: number } | null>(null);
  const [sanMasteryGain, setSanMasteryGain] = createSignal(0);
  const [isResolved, setIsResolved] = createSignal(false);
  const [copied, setCopied] = createSignal(false);

  const checkedSkills = () => activeChar.skills.filter((s) => s.checked);

  // Run full official development phase
  const runDevelopmentResolution = () => {
    const list = checkedSkills();
    if (list.length === 0) {
      alert('⚠️ 目前沒有任何技能被標記成長（☑）！\n請先在技能分頁中勾選本場跑團成功的技能。');
      return;
    }

    const growthResults: SkillGrowthResult[] = [];
    let totalSanGain = 0;

    list.forEach((skill) => {
      const roll = Math.floor(Math.random() * 100) + 1;
      const success = roll > skill.total || roll >= 96;
      let gain = 0;
      let hit90 = false;

      if (success) {
        gain = Math.floor(Math.random() * 10) + 1;
        const newTotal = skill.total + gain;
        if (skill.total < 90 && newTotal >= 90) {
          hit90 = true;
          // 2D6 SAN reward for 90% Mastery
          const sanRoll = Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1;
          totalSanGain += sanRoll;
        }

        // Apply growth to skill
        setActiveChar('skills', (s) => s.id === skill.id, (prev) => ({
          ...prev,
          growth: prev.growth + gain,
          total: prev.total + gain,
          checked: false,
        }));
      } else {
        // Uncheck even if failed
        setActiveChar('skills', (s) => s.id === skill.id, 'checked', false);
      }

      growthResults.push({
        skillId: skill.id,
        name: skill.name,
        prevTotal: skill.total,
        roll,
        success,
        gain,
        newTotal: skill.total + gain,
        hit90Milestone: hit90,
      });
    });

    // Optional Luck Recovery (Core p.99) - Only if NOT Changed
    let luckRes = null;
    let luckGain = 0;
    if (!activeChar.investigator.changed) {
      const currentLuck = activeChar.investigator.luck;
      const lRoll = Math.floor(Math.random() * 100) + 1;
      const lSuccess = lRoll > currentLuck;
      if (lSuccess) {
        luckGain = Math.floor(Math.random() * 10) + 1;
        setActiveChar('investigator', 'luck', Math.min(99, currentLuck + luckGain));
      }
      luckRes = {
        roll: lRoll,
        target: currentLuck,
        success: lSuccess,
        gain: luckGain,
      };
    }

    // Apply SAN gain if any 90% milestone reached
    if (totalSanGain > 0) {
      const currentSan = activeChar.investigator.san;
      setActiveChar('investigator', 'san', Math.min(maxSanity(), currentSan + totalSanGain));
    }

    // Append to chronicles log
    const successfulSkills = growthResults.filter((r) => r.success);
    const summaryNotes = successfulSkills.length > 0
      ? `技能成長：${successfulSkills.map((s) => `${s.name}+${s.gain}%(現${s.newTotal}%)`).join('、')}。${
          luckGain > 0 ? ` 幸運恢復+${luckGain}。` : ''
        }${totalSanGain > 0 ? ` 達成90%大師里程碑，理智恢復+${totalSanGain}！` : ''}`
      : '本場結算無技能突破成長。';

    const newChronicle: ChronicleItem = {
      id: `dev_${Date.now()}`,
      title: '第 N 次模組結算 • 團後成長階段 (Development Phase)',
      type: '團後休整',
      kp: 'KP',
      date: new Date().toLocaleDateString('zh-TW'),
      sanReward: totalSanGain > 0 ? `+${totalSanGain}` : '0',
      mythosGain: 0,
      luckGain,
      notes: summaryNotes,
    };

    setActiveChar('chronicles', (prev) => [newChronicle, ...prev]);

    setResults(growthResults);
    setLuckRoll(luckRes);
    setSanMasteryGain(totalSanGain);
    setIsResolved(true);
  };

  const copyDevelopmentReport = () => {
    const p = activeChar.investigator;
    let text = `📜【${p.name} · 團後技能成長結算報告 (Development Phase)】\n`;
    text += `守密人 (KP) 您好，以下為本次模組公開結算日誌：\n`;
    text += `----------------------------------------\n`;
    results().forEach((r) => {
      text += `• ${r.name} (原 ${r.prevTotal}%) ➜ 擲出 ${r.roll} ➜ ${
        r.success ? `✅ 成長 +${r.gain}% ➜ 提升至 ${r.newTotal}%！` : `❌ 未能突破`
      }${r.hit90Milestone ? ' 🌟 首次達到 90% 大師里程碑！' : ''}\n`;
    });

    if (luckRoll()) {
      text += `• 幸運恢復檢定 (目標 > ${luckRoll()!.target}) ➜ 擲出 ${luckRoll()!.roll} ➜ ${
        luckRoll()!.success ? `✅ 成功！幸運恢復 +${luckRoll()!.gain} 點！` : `❌ 未恢復`
      }\n`;
    }

    if (sanMasteryGain() > 0) {
      text += `🌟 精神昇華：因達成 90% 技能大師，理智值額外回復 +${sanMasteryGain()} 點 (2D6)！\n`;
    }
    text += `----------------------------------------\n當前狀態：HP ${p.hp} | SAN ${p.san} | LUCK ${p.luck}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Show when={isDevPhaseOpen()}>
      <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        <div class="bg-[#FAF5EB] max-w-xl w-full rounded-xl vintage-border shadow-2xl p-5 my-8 space-y-4 text-sepia-900 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div class="flex justify-between items-center border-b-2 border-sepia-800 pb-2.5">
            <div>
              <h3 class="font-title font-bold text-base text-sepia-900 flex items-center gap-1.5">
                <span>📈 官方團後成長階段全自動結算輪盤 (Development Phase)</span>
              </h3>
              <p class="text-xs text-sepia-700">
                依據第七版核心規則書 p.94–99 與守密人伴侶修訂版
              </p>
            </div>
            <button
              onClick={() => setIsDevPhaseOpen(false)}
              class="w-6 h-6 rounded bg-sepia-800 text-parchment-100 flex items-center justify-center font-bold text-xs hover:bg-sepia-900 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Intro Rule Card */}
          <div class="bg-parchment-100 p-3 rounded-lg border border-parchment-300 text-xs text-sepia-800 space-y-1.5">
            <p>
              <strong>結算流程：</strong>
              凡在劇本中常規檢定成功的技能均可打勾。結算時擲 <strong>1D100 &gt; 當前技能</strong>（或 96–100），成功者擲 <strong>1D10</strong> 永久增加技能值！
            </p>
            <p class="text-amber-900 font-bold">
              🌟 90% 大師里程碑：技能首次達 90%，立即獲得 +2D6 理智獎勵！
            </p>
          </div>

          {/* Pending Skills List */}
          <Show
            when={isResolved()}
            fallback={
              <div class="space-y-3">
                <div class="flex justify-between items-center text-xs font-bold text-sepia-900">
                  <span>待結算技能清單 (共 {checkedSkills().length} 項)：</span>
                </div>

                <div class="max-h-48 overflow-y-auto space-y-1.5 p-2 bg-parchment-50 rounded border border-parchment-300">
                  <Show
                    when={checkedSkills().length > 0}
                    fallback={
                      <div class="text-center py-6 text-sepia-600 italic text-xs">
                        目前沒有已標記成長的技能。請在「🎯 技能清單」中勾選欲成長的技能！
                      </div>
                    }
                  >
                    <For each={checkedSkills()}>
                      {(s) => (
                        <div class="flex justify-between items-center bg-parchment-100 p-2 rounded text-xs border border-parchment-200">
                          <span class="font-bold text-sepia-900">{s.name}</span>
                          <span class="font-mono text-stone-700">目前值: {s.total}% (需擲 &gt; {s.total})</span>
                        </div>
                      )}
                    </For>
                  </Show>
                </div>

                <button
                  onClick={runDevelopmentResolution}
                  disabled={checkedSkills().length === 0}
                  class={`w-full py-2.5 rounded text-xs font-bold shadow-md cursor-pointer transition flex items-center justify-center gap-1.5 font-title ${
                    checkedSkills().length > 0
                      ? 'bg-eldritch-green hover:bg-opacity-90 text-amber-100'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <span>🎲 一鍵自動執行全體技能成長與幸運回復</span>
                </button>
              </div>
            }
          >
            {/* Resolution Results */}
            <div class="space-y-3">
              <div class="text-xs font-bold text-sepia-900">
                結算結果 (已自動寫入角色卡與編年史日誌)：
              </div>

              <div class="max-h-60 overflow-y-auto space-y-1.5 p-2 bg-parchment-50 rounded border border-parchment-300">
                <For each={results()}>
                  {(r) => (
                    <div
                      class={`p-2 rounded text-xs border flex items-center justify-between font-mono ${
                        r.success
                          ? 'bg-green-50 border-green-300 text-green-950 font-bold'
                          : 'bg-parchment-100 border-parchment-200 text-stone-700'
                      }`}
                    >
                      <span>{r.name} (原 {r.prevTotal}%) ➜ 擲出: {r.roll}</span>
                      <div class="flex items-center gap-2">
                        {r.success ? (
                          <span class="bg-green-700 text-white px-2 py-0.5 rounded text-[11px]">
                            + {r.gain}% ➜ {r.newTotal}%
                          </span>
                        ) : (
                          <span class="text-stone-500 text-[11px]">未成長</span>
                        )}
                        {r.hit90Milestone && (
                          <span class="bg-amber-400 text-amber-950 px-1.5 py-0.5 rounded text-[10px] font-black animate-bounce">
                            🌟 90%大師!
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </For>

                <Show when={luckRoll()}>
                  <div
                    class={`p-2 rounded text-xs border flex items-center justify-between font-mono ${
                      luckRoll()!.success
                        ? 'bg-amber-50 border-amber-300 text-amber-950 font-bold'
                        : 'bg-parchment-100 border-parchment-200 text-stone-700'
                    }`}
                  >
                    <span>🍀 幸運值團後恢復檢定 (擲出 {luckRoll()!.roll} &gt; {luckRoll()!.target})</span>
                    <span>
                      {luckRoll()!.success
                        ? `✅ 恢復 +${luckRoll()!.gain} 點 (新幸運: ${activeChar.investigator.luck})`
                        : '❌ 未能恢復'}
                    </span>
                  </div>
                </Show>

                <Show when={sanMasteryGain() > 0}>
                  <div class="p-2.5 rounded text-xs bg-purple-900 text-amber-100 font-bold border border-purple-950 flex items-center justify-between">
                    <span>🧠 90% 技能大師心靈突破獎勵 (+2D6)</span>
                    <span class="text-sm font-mono font-black text-amber-300">+{sanMasteryGain()} 點 SAN！</span>
                  </div>
                </Show>
              </div>

              {/* Action Buttons */}
              <div class="flex gap-2 pt-2 border-t border-sepia-800">
                <button
                  onClick={copyDevelopmentReport}
                  class="flex-1 bg-eldritch-purple hover:bg-opacity-90 text-amber-100 py-2 rounded text-xs font-bold shadow cursor-pointer transition flex items-center justify-center gap-1"
                >
                  <span>{copied() ? '✅ 已複製！' : '📋 複製成長報告至 Discord'}</span>
                </button>
                <button
                  onClick={() => setIsDevPhaseOpen(false)}
                  class="px-4 py-2 rounded text-xs font-bold bg-sepia-800 text-parchment-100 hover:bg-sepia-900 cursor-pointer"
                >
                  完成並關閉
                </button>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
};
