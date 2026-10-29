import { Component, Show, createSignal } from 'solid-js';
import {
  activeDiceRoll,
  closeDiceModal,
  rollCurrentDice,
  copyLastRollDiscord,
  activeChar,
  setActiveChar,
} from '../stores/characterStore';

export const DiceModal: Component = () => {
  return (
    <Show when={activeDiceRoll.isOpen}>
      <div class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-[#FAF5EB] p-6 rounded-xl max-w-sm w-full vintage-border shadow-2xl text-center space-y-4">
          <div class="flex justify-between items-center border-b border-sepia-800 pb-2">
            <h3 class="text-sm font-bold font-title text-sepia-900">
              🎲 {activeDiceRoll.title}
            </h3>
            <button
              onClick={closeDiceModal}
              class="w-6 h-6 rounded bg-sepia-800 text-parchment-100 flex items-center justify-center font-bold text-xs hover:bg-sepia-900 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div class="py-2">
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

          {/* Action Buttons */}
          <div class="flex gap-2 justify-center pt-2">
            <button
              onClick={rollCurrentDice}
              class="flex-1 bg-red-900 hover:bg-red-800 text-amber-100 py-2 rounded text-xs font-bold shadow-md cursor-pointer transition flex items-center justify-center gap-1.5"
            >
              <span>🎲 擲骰 (1D100)</span>
            </button>
            <Show when={activeDiceRoll.result !== null}>
              <button
                onClick={copyLastRollDiscord}
                class="bg-eldritch-purple hover:bg-opacity-90 text-amber-100 px-3 py-2 rounded text-xs font-bold shadow cursor-pointer transition"
                title="複製結果至 Discord"
              >
                📋 複製結果
              </button>
            </Show>
          </div>

          <Show when={activeDiceRoll.isSuccess && activeDiceRoll.skillId}>
            <div class="p-2 bg-amber-50 rounded border border-amber-300 text-left flex items-center justify-between text-xs">
              <span class="text-amber-900 font-bold">檢定成功！已自動標記成長 ☑</span>
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
};
