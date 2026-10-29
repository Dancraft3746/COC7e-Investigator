import { Component, Show } from 'solid-js';
import {
  activeDiceRoll,
  closeDiceModal,
  rollCurrentDice,
  copyLastRollDiscord,
  burnLuckForSuccess,
  pushCurrentRoll,
  activeChar,
} from '../stores/characterStore';

export const DiceModal: Component = () => {
  const handlePushRoll = () => {
    const ok = confirm(
      '⚠️【孤注一擲 (Push the Roll)】\n依據第七版核心規則書 p.84：\n您必須向守密人陳述加倍冒險行動的理由。若此次再度失敗，守密人將施加不可逆的災難性後果！\n\n確定要孤注一擲嗎？'
    );
    if (ok) {
      pushCurrentRoll();
    }
  };

  return (
    <Show when={activeDiceRoll.isOpen}>
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-[#FAF5EB] p-5 sm:p-6 rounded-xl max-w-sm w-full vintage-border shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div class="flex justify-between items-center border-b border-sepia-800 pb-2">
            <h3 class="text-sm font-bold font-title text-sepia-900 truncate pr-2">
              🎲 {activeDiceRoll.title}
            </h3>
            <button
              onClick={closeDiceModal}
              class="w-6 h-6 rounded bg-sepia-800 text-parchment-100 flex items-center justify-center font-bold text-xs hover:bg-sepia-900 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div class="py-1">
            <span class="text-xs text-sepia-700">目標成功率 (Target):</span>
            <span class="text-2xl font-black font-mono ml-2 text-sepia-900">
              {activeDiceRoll.target}%
            </span>
          </div>

          {/* Dice Result Display */}
          <div class="p-4 bg-parchment-100 rounded-lg border-2 border-dashed border-sepia-400">
            <Show
              when={activeDiceRoll.result !== null}
              fallback={
                <div class="py-4 text-sepia-600 font-serif italic text-sm">
                  點擊下方按鈕進行 1D100 檢定
                </div>
              }
            >
              <div class="space-y-2">
                <div class="text-5xl font-black font-mono text-sepia-900 animate-bounce">
                  {activeDiceRoll.result}
                </div>
                <div
                  class={`inline-block px-3 py-1 rounded text-xs font-bold tracking-wider shadow-sm ${activeDiceRoll.outcomeClass}`}
                >
                  {activeDiceRoll.outcomeText}
                </div>
              </div>
            </Show>
          </div>

          {/* Luck Burning Option (Core p.99) */}
          <Show when={activeDiceRoll.canBurnLuck}>
            <div class="p-2.5 bg-amber-50 rounded border border-amber-300 text-left space-y-1.5 animate-in fade-in">
              <div class="flex justify-between text-xs font-bold text-amber-950">
                <span>🍀 官方可選：燃燒幸運補正</span>
                <span class="font-mono">需扣除: {activeDiceRoll.luckCost} 點</span>
              </div>
              <p class="text-[10px] text-amber-800">
                當前幸運值：{activeChar.investigator.luck} 點。燃燒後剩餘：
                {activeChar.investigator.luck - (activeDiceRoll.luckCost || 0)} 點。
              </p>
              <button
                onClick={burnLuckForSuccess}
                class="w-full bg-amber-600 hover:bg-amber-700 text-stone-950 py-1.5 rounded text-xs font-black shadow-xs cursor-pointer transition flex items-center justify-center gap-1 font-title"
              >
                <span>🔥 燃燒 {activeDiceRoll.luckCost} 點幸運 ➜ 改判常規成功！</span>
              </button>
            </div>
          </Show>

          {/* Pushed Roll Option (Core p.84) */}
          <Show
            when={
              !activeDiceRoll.isSuccess &&
              activeDiceRoll.result !== null &&
              !activeDiceRoll.isPushed &&
              activeDiceRoll.result < (activeDiceRoll.target < 50 ? 96 : 100)
            }
          >
            <div class="pt-1">
              <button
                onClick={handlePushRoll}
                class="w-full bg-stone-800 hover:bg-stone-900 text-amber-200 py-1.5 rounded text-xs font-bold shadow-xs cursor-pointer transition flex items-center justify-center gap-1 border border-stone-700"
                title="向守密人陳述理由，承受更嚴重的後果重擲一次"
              >
                <span>🎲 孤注一擲 (Push the Roll · Core p.84)</span>
              </button>
            </div>
          </Show>

          {/* Action Buttons */}
          <div class="flex gap-2 justify-center pt-1">
            <button
              onClick={() => rollCurrentDice(false)}
              class="flex-1 bg-red-900 hover:bg-red-800 text-amber-100 py-2 rounded text-xs font-bold shadow-md cursor-pointer transition flex items-center justify-center gap-1.5 font-title"
            >
              <span>🎲 擲骰 (1D100)</span>
            </button>
            <Show when={activeDiceRoll.result !== null}>
              <button
                onClick={copyLastRollDiscord}
                class="bg-eldritch-purple hover:bg-opacity-90 text-amber-100 px-3 py-2 rounded text-xs font-bold shadow cursor-pointer transition"
                title="複製結果至 Discord"
              >
                📋 複製
              </button>
            </Show>
          </div>

          <Show when={activeDiceRoll.isSuccess && activeDiceRoll.skillId}>
            <div class="p-1.5 bg-green-50 rounded border border-green-300 text-center text-xs text-green-900 font-bold">
              檢定成功！已自動標記成長 ☑
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
};
