import { Component, For } from 'solid-js';
import {
  activeChar,
  setActiveChar,
  charSum,
  openDiceModal,
} from '../stores/characterStore';
import type { Characteristics } from '../types/investigator';

export const CharacteristicsGrid: Component = () => {
  const p = () => activeChar.investigator;
  const c = () => activeChar.characteristics;

  const charKeys: (keyof Characteristics)[] = [
    'STR', 'CON', 'DEX', 'APP', 'POW', 'INT', 'SIZ', 'EDU', 'LUCK'
  ];

  const charLabels: Record<keyof Characteristics, { zh: string; en: string }> = {
    STR: { zh: '力量', en: 'Strength' },
    CON: { zh: '體質', en: 'Constitution' },
    DEX: { zh: '敏捷', en: 'Dexterity' },
    APP: { zh: '外貌', en: 'Appearance' },
    POW: { zh: '意志', en: 'Power' },
    INT: { zh: '靈感', en: 'Idea' },
    SIZ: { zh: '體型', en: 'Size' },
    EDU: { zh: '教育', en: 'Education' },
    LUCK: { zh: '幸運', en: 'Luck' },
  };

  return (
    <div class="space-y-4">
      {/* 1. Investigator Basic Bio Banner */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-parchment-200 rounded border border-parchment-400">
        <div>
          <label class="block text-[11px] font-bold text-sepia-700 uppercase">
            調查員姓名 (PC Name)
          </label>
          <input
            type="text"
            value={p().name}
            onInput={(e) => setActiveChar('investigator', 'name', e.currentTarget.value)}
            class="w-full bg-parchment-50 border border-parchment-400 rounded px-2.5 py-1.5 font-bold text-sepia-900 focus:outline-none focus:ring-1 focus:ring-amber-600"
          />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-sepia-700 uppercase">
            調查員職業 (Occupation)
          </label>
          <input
            type="text"
            value={p().job}
            onInput={(e) => setActiveChar('investigator', 'job', e.currentTarget.value)}
            class="w-full bg-parchment-50 border border-parchment-400 rounded px-2.5 py-1.5 font-bold text-sepia-900 focus:outline-none"
          />
        </div>

        <div>
          <label class="block text-[11px] font-bold text-sepia-700 uppercase">
            玩家 / 操縱者 (Player)
          </label>
          <input
            type="text"
            value={p().player}
            onInput={(e) => setActiveChar('investigator', 'player', e.currentTarget.value)}
            class="w-full bg-parchment-50 border border-parchment-400 rounded px-2.5 py-1.5 text-sepia-900 focus:outline-none"
          />
        </div>

        <div class="grid grid-cols-3 gap-2">
          <div>
            <label class="block text-[11px] font-bold text-sepia-700">年齡</label>
            <input
              type="number"
              value={p().age}
              onInput={(e) => setActiveChar('investigator', 'age', Number(e.currentTarget.value))}
              class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1.5 text-center font-bold"
            />
          </div>
          <div>
            <label class="block text-[11px] font-bold text-sepia-700">性別</label>
            <select
              value={p().gender}
              onChange={(e) => setActiveChar('investigator', 'gender', e.currentTarget.value)}
              class="w-full bg-parchment-50 border border-parchment-400 rounded px-1.5 py-1.5 text-center text-xs"
            >
              <option>男</option>
              <option>女</option>
              <option>其他</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-bold text-sepia-700">時代</label>
            <input
              type="text"
              value={p().era}
              onInput={(e) => setActiveChar('investigator', 'era', e.currentTarget.value)}
              class="w-full bg-parchment-50 border border-parchment-400 rounded px-1 py-1.5 text-center text-xs"
            />
          </div>
        </div>
      </div>

      {/* 2. Characteristics 9-Grid */}
      <div class="bg-parchment-50 rounded border border-parchment-400 p-4 shadow-sm">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-3 border-b border-parchment-300 gap-2 mb-4">
          <div>
            <h3 class="font-title font-bold text-sepia-900 text-sm flex items-center gap-1.5">
              <span>⚖️ 九大基礎特徵值 (Nine Core Characteristics)</span>
            </h3>
            <p class="text-[11px] text-sepia-700">
              包含本值、困難成功（1/2）與極限成功（1/5）自動推算
            </p>
          </div>
          <div class="text-xs font-mono font-bold bg-parchment-200 px-3 py-1 rounded border border-parchment-400 text-sepia-900">
            特徵總和: {charSum()} / 480 點
            <span class="ml-1 text-[11px]">
              {charSum() === 480
                ? '✅ 合規'
                : charSum() < 480
                ? `(剩餘 ${480 - charSum()} 點)`
                : `(超額 ${charSum() - 480} 點)`}
            </span>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-2.5">
          <For each={charKeys}>
            {(key) => {
              const val = () => c()[key] || 0;
              const half = () => Math.floor(val() / 2);
              const fifth = () => Math.floor(val() / 5);
              return (
                <div class="bg-parchment-100 rounded border border-parchment-300 p-2 text-center shadow-xs">
                  <div class="text-xs font-title font-bold text-sepia-900">
                    {key} {charLabels[key].zh}
                  </div>
                  <div class="text-[10px] text-sepia-700 font-serif">
                    {charLabels[key].en}
                  </div>

                  <input
                    type="number"
                    value={val()}
                    onInput={(e) =>
                      setActiveChar('characteristics', key, Number(e.currentTarget.value))
                    }
                    class="w-full text-center text-xl font-black bg-parchment-50 border border-parchment-400 rounded my-1 text-sepia-900"
                  />

                  <div class="text-[11px] font-mono font-bold text-sepia-800 bg-parchment-200 py-0.5 rounded">
                    {key === 'LUCK' ? '幸運值' : `${half()} | ${fifth()}`}
                  </div>

                  <button
                    onClick={() =>
                      openDiceModal(`${key} ${charLabels[key].zh} 屬性檢定`, val())
                    }
                    class="mt-1.5 w-full bg-eldritch-purple hover:bg-opacity-90 text-amber-100 py-0.5 rounded text-[10px] font-bold cursor-pointer transition shadow-xs flex items-center justify-center gap-1 hover:scale-105"
                    title={`線上擲骰檢定 ${key} (${val()}%)`}
                  >
                    <span>🎲 檢定</span>
                  </button>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};
