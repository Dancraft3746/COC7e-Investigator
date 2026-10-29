import { Component, createSignal, For, Show } from 'solid-js';
import { activeChar, setActiveChar } from '../stores/characterStore';
import type { EntityItem } from '../types/investigator';
import { EncounterSanityModal } from './EncounterSanityModal';

const OFFICIAL_BESTIARY_PRESETS = [
  { name: '食屍鬼 (Ghoul)', category: '神話生物/眷族', sanSuccess: '0', sanFailure: '1D6', notes: '犬首人形、橡膠質皮膚、長居地下墓穴與腐屍堆中。' },
  { name: '深潛者 (Deep One)', category: '神話生物/眷族', sanSuccess: '0', sanFailure: '1D6', notes: '兩棲人形魚怪，眼瞼不閉，散發強烈魚腥味，信奉大袞與克蘇魯。' },
  { name: '米·戈 (Mi-Go)', category: '神話生物/眷族', sanSuccess: '0', sanFailure: '1D6', notes: '來自冥王星的甲殼質真菌生物，擁有膜翼，精通外科腦髓缸移植手術。' },
  { name: '修格斯 (Shoggoth)', category: '神話生物/眷族', sanSuccess: '1D6', sanFailure: '1D20', notes: '原生質多眼惡臭肉塊，伴隨「泰克利-利！」尖嘯席捲一切。' },
  { name: '廷達洛斯之獵犬 (Hound of Tindalos)', category: '神話生物/眷族', sanSuccess: '1D3', sanFailure: '1D20', notes: '棲於非歐幾里德角維度之捕食者，穿透小於120度的牆角獵殺時間旅人。' },
  { name: '拜亞基 (Byakhee)', category: '神話生物/眷族', sanSuccess: '1', sanFailure: '1D6', notes: '星際飛行眷族，似蝠又似鳥的腐爛肉翼生物，侍奉哈斯塔。' },
  { name: '黑山羊幼崽 (Dark Young)', category: '神話生物/眷族', sanSuccess: '1D3', sanFailure: '1D10', notes: '莎布·尼古拉絲之嗣，粗壯黑蹄與觸手形成的恐怖蠕動森林。' },
  { name: '偉大的克蘇魯 (Great Cthulhu)', category: '舊日支配者/外神', sanSuccess: '1D10', sanFailure: '1D100', notes: '沉睡於南太平洋拉萊耶古城之舊日支配者，夢境干涉全人類心靈。' },
  { name: '奈亞拉托提普 (Nyarlathotep)', category: '舊日支配者/外神', sanSuccess: '1D10', sanFailure: '1D100', notes: '千面伏行之混沌，外神之信使與意志，熱衷誘使人類走向狂亂。' },
];

export const MythosCodexTab: Component = () => {
  const [filter, setFilter] = createSignal('全部');
  const [selectedEntityForSan, setSelectedEntityForSan] = createSignal<EntityItem | null>(null);
  const [showAddCustom, setShowAddCustom] = createSignal(false);

  // New Custom Entity Form
  const [newName, setNewName] = createSignal('');
  const [newCat, setNewCat] = createSignal('神話生物/眷族');
  const [newSanSuccess, setNewSanSuccess] = createSignal('0');
  const [newSanFailure, setNewSanFailure] = createSignal('1D6');
  const [newNotes, setNewNotes] = createSignal('');

  const categories = ['全部', '舊日支配者/外神', '神話生物/眷族', '邪教組織', '神話造物與神器'];

  const filteredEntities = () => {
    if (filter() === '全部') return activeChar.entities;
    return activeChar.entities.filter((e) => e.category === filter());
  };

  const handleAddPreset = (preset: typeof OFFICIAL_BESTIARY_PRESETS[0]) => {
    const exists = activeChar.entities.some((e) => e.name.includes(preset.name.split(' ')[0]));
    if (exists) {
      alert(`⚠️【${preset.name}】已存在於神話圖鑑中！`);
      return;
    }
    const item: EntityItem = {
      id: `entity_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: preset.name,
      category: preset.category,
      sanLossSuccess: preset.sanSuccess,
      sanLossFailure: preset.sanFailure,
      notes: preset.notes,
    };
    setActiveChar('entities', (prev) => [...prev, item]);
  };

  const handleAddCustom = () => {
    if (!newName().trim()) return;
    const item: EntityItem = {
      id: `entity_${Date.now()}`,
      name: newName().trim(),
      category: newCat(),
      sanLossSuccess: newSanSuccess().trim(),
      sanLossFailure: newSanFailure().trim(),
      notes: newNotes().trim(),
    };
    setActiveChar('entities', (prev) => [...prev, item]);
    setNewName('');
    setNewNotes('');
    setShowAddCustom(false);
  };

  return (
    <div class="space-y-4">
      {/* Action Bar & Filter */}
      <div class="flex flex-wrap items-center justify-between gap-2 p-3 bg-parchment-200 rounded border border-parchment-400">
        <div class="flex flex-wrap items-center gap-1.5">
          <span class="text-xs font-bold text-sepia-800">分類:</span>
          <For each={categories}>
            {(cat) => (
              <button
                onClick={() => setFilter(cat)}
                class={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition ${
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
        <button
          onClick={() => setShowAddCustom(true)}
          class="bg-eldritch-green hover:bg-emerald-700 text-amber-100 px-3 py-1 rounded text-xs font-bold cursor-pointer transition shadow-xs"
        >
          ➕ 新增自訂實體
        </button>
      </div>

      {/* Official Bestiary Quick-Add Drawer */}
      <div class="bg-parchment-100 p-2.5 rounded border border-parchment-300">
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-[11px] font-bold text-sepia-900">
            📚 官方神話怪物圖鑑快速收錄 (第七版核心規則書第 14 章):
          </span>
        </div>
        <div class="flex flex-wrap gap-1.5">
          <For each={OFFICIAL_BESTIARY_PRESETS}>
            {(preset) => (
              <button
                onClick={() => handleAddPreset(preset)}
                class="text-[10px] font-bold bg-parchment-200 hover:bg-parchment-300 text-sepia-900 px-2 py-0.5 rounded border border-parchment-400 cursor-pointer transition flex items-center gap-1"
                title={`收錄 ${preset.name} (${preset.sanSuccess}/${preset.sanFailure})`}
              >
                <span>➕</span>
                <span>{preset.name.split(' ')[0]}</span>
              </button>
            )}
          </For>
        </div>
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
                <div class="my-2 p-1 bg-parchment-200 rounded font-mono text-[10px] flex justify-between items-center text-purple-900 font-bold">
                  <span>SAN 損耗:</span>
                  <span>{entity.sanLossSuccess || '0'} / {entity.sanLossFailure || '1D6'}</span>
                </div>
                <p class="text-xs text-sepia-800 leading-relaxed">
                  {entity.notes || '見證於戰役深淵。'}
                </p>
              </div>

              <div class="mt-3 pt-2 border-t border-parchment-300 flex justify-end">
                <button
                  onClick={() => setSelectedEntityForSan(entity)}
                  class="bg-red-950 hover:bg-black text-amber-100 text-xs px-2.5 py-1 rounded font-bold cursor-pointer transition shadow-xs flex items-center gap-1"
                >
                  <span>👁️ 直面遭遇 (SAN Check)</span>
                </button>
              </div>
            </div>
          )}
        </For>
      </div>

      {/* Add Custom Entity Modal */}
      <Show when={showAddCustom()}>
        <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div class="bg-[#FAF5EB] p-5 rounded-lg max-w-sm w-full vintage-border shadow-2xl space-y-3 text-sepia-900">
            <h3 class="text-sm font-bold font-title text-sepia-900 border-b border-sepia-800 pb-2">
              ➕ 收錄神話實體 / 邪教 / 神器
            </h3>
            <div>
              <label class="block text-xs font-bold text-sepia-700">名稱</label>
              <input
                type="text"
                placeholder="例如: 盲目水母 (Flying Polyp)"
                value={newName()}
                onInput={(e) => setNewName(e.currentTarget.value)}
                class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs font-bold"
              />
            </div>
            <div>
              <label class="block text-xs font-bold text-sepia-700">分類</label>
              <select
                value={newCat()}
                onChange={(e) => setNewCat(e.currentTarget.value)}
                class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs"
              >
                <option value="神話生物/眷族">神話生物/眷族</option>
                <option value="舊日支配者/外神">舊日支配者/外神</option>
                <option value="邪教組織">邪教組織</option>
                <option value="神話造物與神器">神話造物與神器</option>
              </select>
            </div>
            <div class="grid grid-cols-2 gap-2">
              <div>
                <label class="block text-[11px] font-bold text-sepia-700">檢定成功 SAN 損耗</label>
                <input
                  type="text"
                  value={newSanSuccess()}
                  onInput={(e) => setNewSanSuccess(e.currentTarget.value)}
                  class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs font-mono text-center"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-sepia-700">檢定失敗 SAN 損耗</label>
                <input
                  type="text"
                  value={newSanFailure()}
                  onInput={(e) => setNewSanFailure(e.currentTarget.value)}
                  class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs font-mono text-center"
                />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-sepia-700">筆記特徵</label>
              <textarea
                rows="2"
                value={newNotes()}
                onInput={(e) => setNewNotes(e.currentTarget.value)}
                class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs"
              />
            </div>
            <div class="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddCustom(false)}
                class="px-3 py-1.5 rounded text-xs font-bold bg-parchment-300 text-sepia-900 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleAddCustom}
                class="px-3 py-1.5 rounded text-xs font-bold bg-eldritch-purple text-amber-100 cursor-pointer"
              >
                確認收錄
              </button>
            </div>
          </div>
        </div>
      </Show>

      {/* Interactive Sanity Encounter Modal */}
      <EncounterSanityModal
        entity={selectedEntityForSan()}
        isOpen={selectedEntityForSan() !== null}
        onClose={() => setSelectedEntityForSan(null)}
      />
    </div>
  );
};
