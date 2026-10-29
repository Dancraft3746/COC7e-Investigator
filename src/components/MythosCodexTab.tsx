import { Component, createSignal, For } from 'solid-js';
import { activeChar, setActiveChar } from '../stores/characterStore';
import type { EntityItem } from '../types/investigator';

export const MythosCodexTab: Component = () => {
  const [filter, setFilter] = createSignal('全部');

  const categories = ['全部', '舊日支配者/外神', '神話生物/眷族', '邪教組織', '神話造物與神器'];

  const filteredEntities = () => {
    if (filter() === '全部') return activeChar.entities;
    return activeChar.entities.filter((e) => e.category === filter());
  };

  return (
    <div class="space-y-4">
      {/* Category Filter Pills */}
      <div class="flex flex-wrap items-center gap-2 p-3 bg-parchment-200 rounded border border-parchment-400">
        <span class="text-xs font-bold text-sepia-800">分類篩選:</span>
        <For each={categories}>
          {(cat) => (
            <button
              onClick={() => setFilter(cat)}
              class={`px-3 py-1 rounded text-xs font-bold cursor-pointer transition ${
                filter() === cat
                  ? 'bg-eldritch-purple text-amber-100 shadow'
                  : 'bg-parchment-100 text-sepia-800 hover:bg-parchment-300'
              }`}
            >
              {cat}
            </button>
          )}
        </For>
      </div>

      {/* Entities Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <For each={filteredEntities()}>
          {(entity) => (
            <div class="p-3 bg-parchment-50 rounded border border-parchment-300 shadow-xs flex flex-col justify-between">
              <div>
                <div class="flex justify-between items-start">
                  <h4 class="font-bold text-xs text-sepia-900">{entity.name}</h4>
                  <span class="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                    {entity.category}
                  </span>
                </div>
                <p class="text-xs text-sepia-800 mt-2 leading-relaxed">
                  {entity.notes || '見證於戰役深淵。'}
                </p>
              </div>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
