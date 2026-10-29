import { Component, createSignal, For, Show } from 'solid-js';
import { activeChar, setActiveChar } from '../stores/characterStore';
import type { TomeItem, SpellItem } from '../types/investigator';
import { SpellCastModal } from './SpellCastModal';

export const GrimoireTab: Component = () => {
  const [showAddTome, setShowAddTome] = createSignal(false);
  const [showAddSpell, setShowAddSpell] = createSignal(false);
  const [selectedSpellForCast, setSelectedSpellForCast] = createSignal<SpellItem | null>(null);

  // New Tome state
  const [tomeName, setTomeName] = createSignal('');
  const [tomeLang, setTomeLang] = createSignal('英語');
  const [tomeStatus, setTomeStatus] = createSignal('精讀完成');
  const [tomeSan, setTomeSan] = createSignal('1D4');
  const [tomeMythos, setTomeMythos] = createSignal(4);
  const [tomeWeeks, setTomeWeeks] = createSignal('12 週');
  const [tomeSpells, setTomeSpells] = createSignal('');

  // New Spell state
  const [spellName, setSpellName] = createSignal('');
  const [spellCost, setSpellCost] = createSignal('8 MP, 1D4 SAN');
  const [spellTime, setSpellTime] = createSignal('1 輪');
  const [spellSource, setSpellSource] = createSignal('神話典籍');
  const [spellDesc, setSpellDesc] = createSignal('');

  const handleCopySpellCast = (spell: SpellItem) => {
    const text = `🔮【${activeChar.investigator.name} 施放法術: ${spell.name}】\n消耗: ${spell.cost} | 施法時間: ${spell.castTime} | 出處: ${spell.source}\n.r 1d100 施法意志檢定`;
    navigator.clipboard.writeText(text);
    alert(`✅ 已複製施法宣告至剪貼簿！在 Discord 頻道貼上發布即可！`);
  };

  const handleAddTome = () => {
    if (!tomeName().trim()) return;
    const item: TomeItem = {
      id: `tome_${Date.now()}`,
      name: tomeName().trim(),
      language: tomeLang(),
      status: tomeStatus(),
      sanLoss: tomeSan(),
      mythosGain: tomeMythos(),
      studyTime: tomeWeeks(),
      spells: tomeSpells(),
    };
    setActiveChar('tomes', (prev) => [...prev, item]);
    setTomeName('');
    setShowAddTome(false);
  };

  const handleAddSpell = () => {
    if (!spellName().trim()) return;
    const item: SpellItem = {
      id: `spell_${Date.now()}`,
      name: spellName().trim(),
      cost: spellCost(),
      castTime: spellTime(),
      source: spellSource(),
      desc: spellDesc(),
    };
    setActiveChar('spells', (prev) => [...prev, item]);
    setSpellName('');
    setSpellDesc('');
    setShowAddSpell(false);
  };

  return (
    <div class="space-y-6">
      {/* 1. Arcane Tomes Section */}
      <div class="bg-parchment-50 rounded border border-parchment-400 p-4 shadow-sm">
        <div class="flex justify-between items-center pb-3 border-b border-parchment-300 mb-3">
          <div>
            <h3 class="font-title font-bold text-sepia-900 text-sm flex items-center gap-1.5">
              <span>📖 禁忌神話典籍庫 ({activeChar.tomes.length} 部)</span>
            </h3>
            <p class="text-[11px] text-sepia-700">
              記錄略讀／精讀進度、神話點數收穫與理智損失
            </p>
          </div>
          <button
            onClick={() => setShowAddTome(true)}
            class="bg-eldritch-green hover:bg-opacity-90 text-amber-100 px-3 py-1.5 rounded text-xs font-bold shadow cursor-pointer transition"
          >
            ➕ 新增典籍
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <For each={activeChar.tomes}>
            {(tome) => (
              <div class="p-3 bg-parchment-100 rounded border border-parchment-300 shadow-xs relative">
                <div class="flex justify-between items-start">
                  <h4 class="font-bold text-xs text-sepia-900">{tome.name}</h4>
                  <span class="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                    {tome.status}
                  </span>
                </div>
                <div class="grid grid-cols-3 gap-1 my-2 text-[10px] text-center font-mono">
                  <div class="bg-parchment-200 p-1 rounded">
                    <span class="block text-stone-500">語言</span>
                    <span class="font-bold">{tome.language}</span>
                  </div>
                  <div class="bg-parchment-200 p-1 rounded">
                    <span class="block text-stone-500">神話增長</span>
                    <span class="font-bold text-red-900">+{tome.mythosGain}%</span>
                  </div>
                  <div class="bg-parchment-200 p-1 rounded">
                    <span class="block text-stone-500">SAN 損失</span>
                    <span class="font-bold text-purple-900">{tome.sanLoss}</span>
                  </div>
                </div>
                <Show when={tome.spells}>
                  <p class="text-[11px] text-sepia-800 italic mt-1 line-clamp-2">
                    📜 記載法術: {tome.spells}
                  </p>
                </Show>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* 2. Spells Section */}
      <div class="bg-parchment-50 rounded border border-parchment-400 p-4 shadow-sm">
        <div class="flex justify-between items-center pb-3 border-b border-parchment-300 mb-3">
          <div>
            <h3 class="font-title font-bold text-sepia-900 text-sm flex items-center gap-1.5">
              <span>🔮 已習得法術與儀式 ({activeChar.spells.length} 門)</span>
            </h3>
            <p class="text-[11px] text-sepia-700">
              點擊「宣告施法」可一鍵複製 Discord 意志對抗與施法宣告
            </p>
          </div>
          <button
            onClick={() => setShowAddSpell(true)}
            class="bg-eldritch-purple hover:bg-opacity-90 text-amber-100 px-3 py-1.5 rounded text-xs font-bold shadow cursor-pointer transition"
          >
            ➕ 新增法術
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <For each={activeChar.spells}>
            {(spell) => (
              <div class="p-3 bg-parchment-100 rounded border border-parchment-300 shadow-xs flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start">
                    <h4 class="font-bold text-xs text-sepia-900 flex items-center gap-1.5">
                      <span>✨ {spell.name}</span>
                    </h4>
                    <span class="text-[10px] text-sepia-700 font-mono bg-parchment-200 px-1.5 py-0.5 rounded">
                      出處: {spell.source}
                    </span>
                  </div>
                  <div class="flex items-center gap-3 my-1.5 text-[11px] font-mono font-bold">
                    <span class="text-blue-900">耗損: {spell.cost}</span>
                    <span class="text-stone-600">施法: {spell.castTime}</span>
                  </div>
                  <p class="text-xs text-sepia-800 mt-1 leading-relaxed">
                    {spell.desc}
                  </p>
                </div>
                <div class="mt-3 pt-2 border-t border-parchment-300 flex justify-end gap-2">
                  <button
                    onClick={() => handleCopySpellCast(spell)}
                    class="bg-parchment-300 hover:bg-parchment-400 text-stone-800 text-xs px-2.5 py-1 rounded font-bold cursor-pointer transition shadow-xs"
                    title="一鍵複製 Discord 施法宣告"
                  >
                    📋 複製宣告
                  </button>
                  <button
                    onClick={() => setSelectedSpellForCast(spell)}
                    class="bg-eldritch-purple hover:bg-purple-900 text-amber-100 text-xs px-2.5 py-1 rounded font-bold cursor-pointer transition shadow-xs flex items-center gap-1"
                    title="進行法力消耗、鮮血魔法獻祭、理智損耗與意志檢定"
                  >
                    <span>🔮 詠唱施法 (Cast)</span>
                  </button>
                </div>
              </div>
            )}
          </For>
        </div>
      </div>

      {/* Add Tome Modal */}
      <Show when={showAddTome()}>
        <div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div class="bg-[#FAF5EB] p-5 rounded-lg max-w-sm w-full vintage-border shadow-2xl space-y-3">
            <h3 class="text-sm font-bold font-title text-sepia-900 border-b border-sepia-800 pb-2">
              ➕ 新增禁忌神話典籍
            </h3>
            <div>
              <label class="block text-xs font-bold text-sepia-700">典籍名稱</label>
              <input
                type="text"
                placeholder="例如: 《蠕蟲之秘密》"
                value={tomeName()}
                onInput={(e) => setTomeName(e.currentTarget.value)}
                class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs font-bold"
              />
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] font-bold text-sepia-700">語言</label>
                <input
                  type="text"
                  value={tomeLang()}
                  onInput={(e) => setTomeLang(e.currentTarget.value)}
                  class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-sepia-700">研讀狀態</label>
                <input
                  type="text"
                  value={tomeStatus()}
                  onInput={(e) => setTomeStatus(e.currentTarget.value)}
                  class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs"
                />
              </div>
            </div>
            <div class="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddTome(false)}
                class="px-3 py-1.5 rounded text-xs font-bold bg-parchment-300 text-sepia-900 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleAddTome}
                class="px-3 py-1.5 rounded text-xs font-bold bg-eldritch-green text-amber-100 cursor-pointer"
              >
                確認新增
              </button>
            </div>
          </div>
        </div>
      </Show>

      {/* Add Spell Modal */}
      <Show when={showAddSpell()}>
        <div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div class="bg-[#FAF5EB] p-5 rounded-lg max-w-sm w-full vintage-border shadow-2xl space-y-3">
            <h3 class="text-sm font-bold font-title text-sepia-900 border-b border-sepia-800 pb-2">
              ➕ 新增法術與儀式
            </h3>
            <div>
              <label class="block text-xs font-bold text-sepia-700">法術名稱</label>
              <input
                type="text"
                placeholder="例如: 召喚/束縛 拜亞基"
                value={spellName()}
                onInput={(e) => setSpellName(e.currentTarget.value)}
                class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs font-bold"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-sepia-700">消耗 (MP / SAN)</label>
              <input
                type="text"
                value={spellCost()}
                onInput={(e) => setSpellCost(e.currentTarget.value)}
                class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-sepia-700">法術效果描述</label>
              <textarea
                rows="2"
                value={spellDesc()}
                onInput={(e) => setSpellDesc(e.currentTarget.value)}
                class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs"
              />
            </div>
            <div class="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddSpell(false)}
                class="px-3 py-1.5 rounded text-xs font-bold bg-parchment-300 text-sepia-900 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleAddSpell}
                class="px-3 py-1.5 rounded text-xs font-bold bg-eldritch-purple text-amber-100 cursor-pointer"
              >
                確認新增
              </button>
            </div>
          </div>
        </div>
      </Show>

      {/* Interactive Spell Casting Engine Modal */}
      <SpellCastModal
        spell={selectedSpellForCast()}
        isOpen={selectedSpellForCast() !== null}
        onClose={() => setSelectedSpellForCast(null)}
      />
    </div>
  );
};
