import { Component, createSignal, createMemo, For, Show } from 'solid-js';
import occupationsData from '../data/occupations.json';
import {
  defaultEdwardPierce,
} from '../data/defaultData';
import {
  saveInvestigatorToDB,
  setActiveCharacterId,
} from '../lib/storage';
import {
  switchCharacter,
  setIsDrawerOpen,
} from '../stores/characterStore';
import type { Characteristics, InvestigatorData } from '../types/investigator';

interface OccupationDef {
  category: string;
  name: string;
  formula: string;
  skills: string;
  cr: string;
  notes: string;
}

export const [isWizardOpen, setIsWizardOpen] = createSignal(false);

export const CreationWizardModal: Component = () => {
  // Bio fields
  const [name, setName] = createSignal('新調查員');
  const [player, setPlayer] = createSignal('');
  const [age, setAge] = createSignal(28);
  const [gender, setGender] = createSignal('男');
  const [era, setEra] = createSignal('1920s 美國麻州');

  // Generation method
  const [method, setMethod] = createSignal<'480' | 'classic' | 'quickfire'>('480');

  // Characteristics
  const [chars, setChars] = createSignal<Characteristics>({
    STR: 50,
    CON: 50,
    DEX: 50,
    APP: 50,
    POW: 50,
    INT: 60,
    SIZ: 60,
    EDU: 60,
    LUCK: 50,
  });

  const updateChar = (key: keyof Characteristics, val: number) => {
    setChars((prev) => ({ ...prev, [key]: Math.max(1, Math.min(99, val)) }));
  };

  const charTotal = createMemo(() => {
    const c = chars();
    return c.STR + c.CON + c.DEX + c.APP + c.POW + c.INT + c.SIZ + c.EDU + c.LUCK;
  });

  // Roll Classic 3D6/2D6+6
  const rollClassic = () => {
    const r3d6 = () =>
      (Math.floor(Math.random() * 6) +
        1 +
        Math.floor(Math.random() * 6) +
        1 +
        Math.floor(Math.random() * 6) +
        1) *
      5;
    const r2d6plus6 = () =>
      (Math.floor(Math.random() * 6) + 1 + Math.floor(Math.random() * 6) + 1 + 6) * 5;

    setChars({
      STR: r3d6(),
      CON: r3d6(),
      DEX: r3d6(),
      APP: r3d6(),
      POW: r3d6(),
      INT: r2d6plus6(),
      SIZ: r2d6plus6(),
      EDU: r2d6plus6(),
      LUCK: r3d6(),
    });
  };

  // Apply Quick Fire
  const applyQuickFire = () => {
    const r3d6 = () =>
      (Math.floor(Math.random() * 6) +
        1 +
        Math.floor(Math.random() * 6) +
        1 +
        Math.floor(Math.random() * 6) +
        1) *
      5;
    setChars({
      STR: 60,
      CON: 60,
      DEX: 70,
      APP: 50,
      POW: 80,
      INT: 60,
      SIZ: 50,
      EDU: 60,
      LUCK: r3d6(),
    });
  };

  // Occupations
  const occupations = occupationsData as OccupationDef[];
  const [selectedCategory, setSelectedCategory] = createSignal('全部');
  const [selectedOccName, setSelectedOccName] = createSignal(occupations[0]?.name || '私家偵探');

  const categories = createMemo(() => {
    const set = new Set(occupations.map((o) => o.category));
    return ['全部', ...Array.from(set)];
  });

  const filteredOccupations = createMemo(() => {
    const cat = selectedCategory();
    if (cat === '全部') return occupations;
    return occupations.filter((o) => o.category === cat);
  });

  const currentOcc = createMemo(() => {
    return occupations.find((o) => o.name === selectedOccName()) || occupations[0];
  });

  // Calculate Occupational Skill Points based on formula & characteristics
  const occPoints = createMemo(() => {
    const f = currentOcc()?.formula || 'EDU';
    const c = chars();
    if (f.includes('EDU') && (f.includes('STR') || f.includes('DEX'))) {
      return c.EDU * 2 + Math.max(c.STR, c.DEX) * 2;
    }
    if (f.includes('EDU') && f.includes('APP')) {
      return c.EDU * 2 + c.APP * 2;
    }
    if (f.includes('EDU') && f.includes('INT')) {
      return c.EDU * 2 + c.INT * 2;
    }
    if (f.includes('EDU') && f.includes('DEX')) {
      return c.EDU * 2 + c.DEX * 2;
    }
    // Default 4 * EDU
    return c.EDU * 4;
  });

  const interestPoints = createMemo(() => chars().INT * 2);

  // Finish Character Creation
  const handleFinalize = async () => {
    const newId = `char_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const c = chars();
    const hp = Math.floor((c.CON + c.SIZ) / 10);
    const mp = Math.floor(c.POW / 5);
    const san = c.POW;

    // Parse CR start
    let defaultCR = 25;
    if (currentOcc()?.cr) {
      const match = currentOcc().cr.match(/\d+/);
      if (match) defaultCR = parseInt(match[0], 10);
    }

    const template: InvestigatorData = {
      ...JSON.parse(JSON.stringify(defaultEdwardPierce)),
      id: newId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      investigator: {
        name: name(),
        player: player(),
        job: currentOcc().name,
        age: age(),
        gender: gender(),
        era: era(),
        hp,
        mp,
        san,
        luck: c.LUCK,
        majorWound: false,
        tempInsanity: false,
        indefInsanity: false,
        shock: false,
        changed: false,
      },
      characteristics: { ...c },
      skills: defaultEdwardPierce.skills.map((s) => {
        if (s.name === '信用評級 (Credit Rating)') {
          return {
            ...s,
            occ: defaultCR,
            total: s.base + defaultCR,
          };
        }
        return { ...s };
      }),
    };

    await saveInvestigatorToDB(template);
    await switchCharacter(newId);
    setIsWizardOpen(false);
    setIsDrawerOpen(false);
  };

  return (
    <Show when={isWizardOpen()}>
      <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        <div class="bg-[#FAF5EB] max-w-2xl w-full rounded-xl vintage-border shadow-2xl p-5 my-8 space-y-5 text-sepia-900 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div class="flex justify-between items-center border-b-2 border-sepia-800 pb-2.5">
            <div>
              <h2 class="text-base sm:text-lg font-bold font-title text-sepia-900 flex items-center gap-2">
                <span>🕯️ 官方第七版創角導引精靈 (Investigator Creation Wizard)</span>
              </h2>
              <p class="text-xs text-sepia-700">
                支援 480 點守密人伴侶購點、經典隨機骰與速選陣列 • 整合 100+ 種官方職業庫
              </p>
            </div>
            <button
              onClick={() => setIsWizardOpen(false)}
              class="w-7 h-7 rounded bg-sepia-800 text-parchment-100 flex items-center justify-center font-bold text-xs hover:bg-sepia-900 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Step 1: Basic Bio */}
          <div class="bg-parchment-100 p-3 rounded-lg border border-parchment-300 space-y-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-sepia-800 font-title">
              第一步：調查員基本履歷 (Identity Dossier)
            </h4>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div>
                <label class="block text-[11px] font-bold text-sepia-700">姓名</label>
                <input
                  type="text"
                  value={name()}
                  onInput={(e) => setName(e.currentTarget.value)}
                  class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs font-bold"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-sepia-700">操縱玩家</label>
                <input
                  type="text"
                  value={player()}
                  onInput={(e) => setPlayer(e.currentTarget.value)}
                  class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-sepia-700">年齡</label>
                <input
                  type="number"
                  value={age()}
                  onInput={(e) => setAge(Number(e.currentTarget.value))}
                  class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs text-center font-bold"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-sepia-700">性別</label>
                <select
                  value={gender()}
                  onChange={(e) => setGender(e.currentTarget.value)}
                  class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs"
                >
                  <option>男</option>
                  <option>女</option>
                  <option>其他</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 2: Characteristics Generator */}
          <div class="bg-parchment-100 p-3 rounded-lg border border-parchment-300 space-y-3">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <h4 class="text-xs font-bold uppercase tracking-wider text-sepia-800 font-title">
                第二步：九大特徵值生成 (Characteristics Generation)
              </h4>
              <div class="flex gap-1.5">
                <button
                  onClick={() => {
                    setMethod('480');
                  }}
                  class={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition ${
                    method() === '480'
                      ? 'bg-amber-900 text-amber-100 shadow-xs'
                      : 'bg-parchment-200 text-sepia-800 hover:bg-parchment-300'
                  }`}
                >
                  480點購點
                </button>
                <button
                  onClick={() => {
                    setMethod('classic');
                    rollClassic();
                  }}
                  class={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition ${
                    method() === 'classic'
                      ? 'bg-amber-900 text-amber-100 shadow-xs'
                      : 'bg-parchment-200 text-sepia-800 hover:bg-parchment-300'
                  }`}
                >
                  🎲 經典搖骰
                </button>
                <button
                  onClick={() => {
                    setMethod('quickfire');
                    applyQuickFire();
                  }}
                  class={`px-2 py-1 rounded text-[11px] font-bold cursor-pointer transition ${
                    method() === 'quickfire'
                      ? 'bg-amber-900 text-amber-100 shadow-xs'
                      : 'bg-parchment-200 text-sepia-800 hover:bg-parchment-300'
                  }`}
                >
                  ⚡ 速選數列
                </button>
              </div>
            </div>

            {/* Total Points Ticker */}
            <div class="flex justify-between items-center text-xs font-mono font-bold bg-parchment-200 p-2 rounded border border-parchment-400">
              <span>當前九項特徵總和：{charTotal()} 點</span>
              <span class={charTotal() === 480 ? 'text-green-800' : 'text-amber-800'}>
                {method() === '480'
                  ? charTotal() === 480
                    ? '✅ 完美符合 480 點規範'
                    : charTotal() < 480
                    ? `剩餘 ${480 - charTotal()} 點可自由分配`
                    : `超額 ${charTotal() - 480} 點！請調降`
                  : '自由/隨機數值模式'}
              </span>
            </div>

            {/* 9 Inputs */}
            <div class="grid grid-cols-3 sm:grid-cols-9 gap-1.5 text-center">
              {(
                [
                  'STR',
                  'CON',
                  'DEX',
                  'APP',
                  'POW',
                  'INT',
                  'SIZ',
                  'EDU',
                  'LUCK',
                ] as (keyof Characteristics)[]
              ).map((k) => (
                <div class="bg-parchment-50 p-1.5 rounded border border-parchment-300">
                  <span class="block text-[11px] font-bold text-sepia-800">{k}</span>
                  <input
                    type="number"
                    value={chars()[k]}
                    onInput={(e) => updateChar(k, Number(e.currentTarget.value))}
                    class="w-full text-center text-sm font-black bg-parchment-100 border border-parchment-300 rounded py-0.5 mt-0.5 text-sepia-900"
                  />
                  <span class="block text-[9px] text-stone-500 font-mono">
                    {Math.floor(chars()[k] / 2)} | {Math.floor(chars()[k] / 5)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 3: Occupation & Skill Points Budget */}
          <div class="bg-parchment-100 p-3 rounded-lg border border-parchment-300 space-y-3">
            <h4 class="text-xs font-bold uppercase tracking-wider text-sepia-800 font-title">
              第三步：職業選擇與技能點數核算 (Occupation & Skill Budget)
            </h4>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] font-bold text-sepia-700 mb-1">
                  選擇職業類別：
                </label>
                <div class="flex flex-wrap gap-1 mb-2">
                  <For each={categories()}>
                    {(cat) => (
                      <button
                        onClick={() => setSelectedCategory(cat)}
                        class={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition ${
                          selectedCategory() === cat
                            ? 'bg-sepia-800 text-parchment-100'
                            : 'bg-parchment-200 text-sepia-800 hover:bg-parchment-300'
                        }`}
                      >
                        {cat}
                      </button>
                    )}
                  </For>
                </div>

                <label class="block text-[11px] font-bold text-sepia-700 mb-1">
                  選擇職業：
                </label>
                <select
                  value={selectedOccName()}
                  onChange={(e) => setSelectedOccName(e.currentTarget.value)}
                  class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1.5 text-xs font-bold cursor-pointer"
                >
                  <For each={filteredOccupations()}>
                    {(o) => <option value={o.name}>{o.name} ({o.category})</option>}
                  </For>
                </select>
              </div>

              {/* Occupation Card Details */}
              <div class="bg-white/80 p-2.5 rounded border border-parchment-400 space-y-1.5 text-xs">
                <div class="flex justify-between items-center border-b border-parchment-300 pb-1">
                  <strong class="text-sepia-900 font-title text-sm">
                    {currentOcc()?.name}
                  </strong>
                  <span class="text-[10px] font-mono bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                    建議 CR: {currentOcc()?.cr}%
                  </span>
                </div>
                <div class="text-[11px] text-stone-700">
                  <strong>本職技能公式：</strong> {currentOcc()?.formula}
                </div>
                <div class="text-[11px] text-stone-600 line-clamp-2">
                  <strong>推薦本職技能：</strong> {currentOcc()?.skills}
                </div>

                {/* Point Budget Ticker */}
                <div class="grid grid-cols-2 gap-2 pt-1 font-mono text-center font-bold">
                  <div class="bg-blue-50 border border-blue-200 p-1.5 rounded text-blue-900">
                    <span class="block text-[10px]">本職技能點 (OCC)</span>
                    <span class="text-base">{occPoints()} 點</span>
                  </div>
                  <div class="bg-amber-50 border border-amber-200 p-1.5 rounded text-amber-900">
                    <span class="block text-[10px]">興趣技能點 (INT×2)</span>
                    <span class="text-base">{interestPoints()} 點</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div class="flex justify-end gap-2 pt-2 border-t border-sepia-800">
            <button
              onClick={() => setIsWizardOpen(false)}
              class="px-4 py-2 rounded text-xs font-bold bg-stone-300 text-stone-800 hover:bg-stone-400 cursor-pointer transition"
            >
              取消
            </button>
            <button
              onClick={handleFinalize}
              class="px-5 py-2 rounded text-xs font-bold bg-eldritch-gold text-amber-950 hover:bg-yellow-500 shadow-md cursor-pointer transition flex items-center gap-1.5 font-title"
            >
              <span>✨ 完成並誕生調查員 (Finalize PC)</span>
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};
