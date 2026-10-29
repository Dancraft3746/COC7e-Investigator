import { Component } from 'solid-js';
import {
  activeChar,
  setActiveChar,
  maxHP,
  majorWoundThreshold,
  maxMP,
  maxSanity,
  hpState,
  sanState,
  moveRate,
  buildAndDB,
  creditRating,
  setIsPanicModalOpen,
} from '../stores/characterStore';

export const VitalsPanel: Component = () => {
  const p = () => activeChar.investigator;

  const handleAnchorRecovery = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    const currentSan = activeChar.investigator.san;
    const newSan = Math.min(maxSanity(), currentSan + roll);
    setActiveChar('investigator', 'san', newSan);
    alert(`⚓ 與精神錨點心靈互動！回復 1D6 理智 (擲出 ${roll} 點)！\n理智值由 ${currentSan} 恢復至 ${newSan}！`);
  };

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. HP Card */}
      <div class="p-3.5 bg-parchment-50 rounded border-2 border-red-900/30 shadow-sm relative overflow-hidden">
        <div class="flex justify-between items-center mb-1.5">
          <span class="font-title font-bold text-red-900 flex items-center gap-1.5 text-sm">
            ❤️ 生命值 (Hit Points)
          </span>
          <span class="text-xs font-mono font-bold bg-red-100 text-red-900 px-2 py-0.5 rounded">
            重傷線: {majorWoundThreshold()} 點
          </span>
        </div>
        <div class="flex items-baseline justify-between my-2">
          <div class="flex items-center gap-1">
            <button
              onClick={() => setActiveChar('investigator', 'hp', Math.max(0, p().hp - 1))}
              class="w-7 h-7 bg-red-800 text-white rounded font-bold hover:bg-red-700 text-sm cursor-pointer"
            >
              -
            </button>
            <input
              type="number"
              value={p().hp}
              onInput={(e) => setActiveChar('investigator', 'hp', Number(e.currentTarget.value))}
              class="w-14 text-center text-2xl font-black bg-transparent border-b-2 border-red-900 text-sepia-900"
            />
            <button
              onClick={() => setActiveChar('investigator', 'hp', Math.min(maxHP(), p().hp + 1))}
              class="w-7 h-7 bg-red-800 text-white rounded font-bold hover:bg-red-700 text-sm cursor-pointer"
            >
              +
            </button>
          </div>
          <div class="text-right">
            <span class="text-xs text-sepia-700">上限:</span>
            <span class="text-xl font-bold ml-1">{maxHP()}</span>
          </div>
        </div>

        {/* Major Wound Checkbox */}
        <label class="flex items-center gap-2 text-xs font-bold text-sepia-900 mt-2 cursor-pointer bg-red-50 p-1.5 rounded border border-red-200">
          <input
            type="checkbox"
            checked={p().majorWound}
            onChange={(e) => setActiveChar('investigator', 'majorWound', e.currentTarget.checked)}
            class="w-4 h-4 text-red-800 rounded cursor-pointer"
          />
          <span>標記重傷 (Major Wound)</span>
        </label>

        {/* Dynamic Vitals State */}
        <div class={`mt-2 text-xs font-bold text-center py-1 rounded shadow-inner ${hpState().bgClass} ${hpState().isPulse ? 'animate-pulse' : ''}`}>
          {hpState().text}
        </div>
      </div>

      {/* 2. MP Card */}
      <div class="p-3.5 bg-parchment-50 rounded border-2 border-blue-900/30 shadow-sm">
        <div class="flex justify-between items-center mb-1.5">
          <span class="font-title font-bold text-blue-900 flex items-center gap-1.5 text-sm">
            ✨ 魔法值 (Magic Points)
          </span>
          <span class="text-[11px] text-blue-800">每小時+1點</span>
        </div>
        <div class="flex items-baseline justify-between my-2">
          <div class="flex items-center gap-1">
            <button
              onClick={() => setActiveChar('investigator', 'mp', Math.max(0, p().mp - 1))}
              class="w-7 h-7 bg-blue-800 text-white rounded font-bold hover:bg-blue-700 text-sm cursor-pointer"
            >
              -
            </button>
            <input
              type="number"
              value={p().mp}
              onInput={(e) => setActiveChar('investigator', 'mp', Number(e.currentTarget.value))}
              class="w-14 text-center text-2xl font-black bg-transparent border-b-2 border-blue-900 text-sepia-900"
            />
            <button
              onClick={() => setActiveChar('investigator', 'mp', Math.min(maxMP(), p().mp + 1))}
              class="w-7 h-7 bg-blue-800 text-white rounded font-bold hover:bg-blue-700 text-sm cursor-pointer"
            >
              +
            </button>
          </div>
          <div class="text-right">
            <span class="text-xs text-sepia-700">上限:</span>
            <span class="text-xl font-bold ml-1">{maxMP()}</span>
          </div>
        </div>
        <div class="mt-8 text-xs font-bold text-center py-1 rounded bg-blue-50 text-blue-900 border border-blue-200">
          {p().mp <= 0 ? '⚠️ 法力枯竭 (需燃燒HP)' : `✨ 法力充盈 (${p().mp}/${maxMP()})`}
        </div>
      </div>

      {/* 3. Sanity Card */}
      <div class="p-3.5 bg-parchment-50 rounded border-2 border-purple-900/30 shadow-sm">
        <div class="flex justify-between items-center mb-1.5">
          <span class="font-title font-bold text-purple-900 flex items-center gap-1.5 text-sm">
            🧠 理智值 (Sanity)
          </span>
          <span class="text-xs font-mono font-bold bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
            上限: {maxSanity()}
          </span>
        </div>
        <div class="flex items-baseline justify-between my-2">
          <div class="flex items-center gap-1">
            <button
              onClick={() => setActiveChar('investigator', 'san', Math.max(0, p().san - 1))}
              class="w-7 h-7 bg-purple-900 text-white rounded font-bold hover:bg-purple-800 text-sm cursor-pointer"
            >
              -
            </button>
            <input
              type="number"
              value={p().san}
              onInput={(e) => setActiveChar('investigator', 'san', Number(e.currentTarget.value))}
              class="w-14 text-center text-2xl font-black bg-transparent border-b-2 border-purple-900 text-sepia-900"
            />
            <button
              onClick={() => setActiveChar('investigator', 'san', Math.min(maxSanity(), p().san + 1))}
              class="w-7 h-7 bg-purple-900 text-white rounded font-bold hover:bg-purple-800 text-sm cursor-pointer"
            >
              +
            </button>
          </div>
          <button
            onClick={handleAnchorRecovery}
            class="text-[11px] font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-2 py-1 rounded border border-amber-300 cursor-pointer shadow-xs transition"
            title="休整時與精神錨點互動回復 1D6 SAN"
          >
            ⚓ 錨點休整
          </button>
        </div>

        {/* Shock & Changed Checkboxes */}
        <div class="grid grid-cols-2 gap-1 mt-2 text-[11px] font-bold">
          <label class="flex items-center gap-1.5 bg-amber-50 p-1 rounded border border-amber-200 cursor-pointer">
            <input
              type="checkbox"
              checked={p().shock}
              onChange={(e) => setActiveChar('investigator', 'shock', e.currentTarget.checked)}
              class="w-3.5 h-3.5 cursor-pointer"
            />
            <span>5F 震懾</span>
          </label>
          <label class="flex items-center gap-1.5 bg-purple-50 p-1 rounded border border-purple-200 cursor-pointer">
            <input
              type="checkbox"
              checked={p().changed}
              onChange={(e) => setActiveChar('investigator', 'changed', e.currentTarget.checked)}
              class="w-3.5 h-3.5 cursor-pointer"
            />
            <span>心智質變</span>
          </label>
        </div>

        {/* 5F Panic Resolver Button */}
        <button
          onClick={() => setIsPanicModalOpen(true)}
          class="w-full mt-2 bg-purple-950 hover:bg-purple-900 text-amber-200 py-1 rounded text-xs font-bold shadow-xs cursor-pointer transition flex items-center justify-center gap-1.5 border border-purple-800 hover:scale-[1.01]"
          title="開啟 5F 恐慌本能反應與 1D10 即時發狂解析輪盤"
        >
          <span>🩸 5F 恐慌與發狂輪盤</span>
        </button>

        {/* Dynamic Sanity State */}
        <div class={`mt-2 text-xs font-bold text-center py-1 rounded shadow-inner ${sanState().bgClass} ${sanState().isPulse ? 'animate-pulse' : ''}`}>
          {sanState().text}
        </div>
      </div>

      {/* 4. Luck & Movement */}
      <div class="p-3.5 bg-parchment-50 rounded border-2 border-stone-800/30 shadow-sm flex flex-col justify-between">
        <div class="flex justify-between items-center mb-1.5">
          <span class="font-title font-bold text-stone-900 flex items-center gap-1.5 text-sm">
            🍀 幸運與戰術指標
          </span>
          <span class="text-xs font-mono font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
            CR: {creditRating()}%
          </span>
        </div>

        <div class="grid grid-cols-3 gap-2 my-2 text-center">
          <div class="bg-parchment-200 p-1.5 rounded border border-parchment-400">
            <span class="block text-[10px] text-sepia-700 font-bold">當前幸運</span>
            <input
              type="number"
              value={p().luck}
              onInput={(e) => setActiveChar('investigator', 'luck', Number(e.currentTarget.value))}
              class="w-full text-center font-black text-lg bg-transparent text-amber-900"
            />
          </div>
          <div class="bg-parchment-200 p-1.5 rounded border border-parchment-400">
            <span class="block text-[10px] text-sepia-700 font-bold">移動力 (MOV)</span>
            <span class="block text-lg font-black text-sepia-900 mt-0.5">{moveRate()}</span>
          </div>
          <div class="bg-parchment-200 p-1.5 rounded border border-parchment-400">
            <span class="block text-[10px] text-sepia-700 font-bold">傷害加值/體格</span>
            <span class="block text-xs font-black text-sepia-900 mt-1">
              {buildAndDB().db} ({buildAndDB().build})
            </span>
          </div>
        </div>

        <div class="text-[11px] text-center bg-stone-100 text-stone-800 p-1 rounded font-bold border border-stone-200">
          🏃 每輪常規可行進 {moveRate() * 5} 碼
        </div>
      </div>
    </div>
  );
};
