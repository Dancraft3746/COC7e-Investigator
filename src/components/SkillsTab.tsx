import { Component, createSignal, For, Show } from 'solid-js';
import {
  activeChar,
  setActiveChar,
  discordBotPrefix,
  setDiscordBotPrefix,
  formatDiceCommand,
} from '../stores/characterStore';
import type { SkillItem, DiceBotPrefix } from '../types/investigator';

export const SkillsTab: Component = () => {
  const [search, setSearch] = createSignal('');
  const [showAddModal, setShowAddModal] = createSignal(false);
  const [newSkillName, setNewSkillName] = createSignal('');
  const [newSkillBase, setNewSkillBase] = createSignal(1);
  const [newSkillOcc, setNewSkillOcc] = createSignal(0);
  const [newSkillInterest, setNewSkillInterest] = createSignal(0);

  const filteredSkills = () => {
    const q = search().toLowerCase().trim();
    if (!q) return activeChar.skills;
    return activeChar.skills.filter((s) => s.name.toLowerCase().includes(q));
  };

  const handleCopyRoll = (skill: SkillItem) => {
    const cmd = formatDiceCommand(skill.name, skill.total);
    navigator.clipboard.writeText(cmd);
    alert(`✅ 已複製 Discord 擲骰指令:\n${cmd}\n\n至 Discord 頻道貼上即可擲骰！`);
  };

  const handleAddSkill = () => {
    const name = newSkillName().trim();
    if (!name) return;
    const base = newSkillBase();
    const occ = newSkillOcc();
    const interest = newSkillInterest();
    const total = base + occ + interest;

    const newItem: SkillItem = {
      id: `sk_custom_${Date.now()}`,
      name: `${name} (自訂專精)`,
      category: 'Custom',
      base,
      occ,
      interest,
      growth: 0,
      total,
      checked: false,
    };

    setActiveChar('skills', (prev) => [...prev, newItem]);
    setNewSkillName('');
    setNewSkillBase(1);
    setNewSkillOcc(0);
    setNewSkillInterest(0);
    setShowAddModal(false);
  };

  return (
    <div class="space-y-4">
      {/* Top Controls Bar */}
      <div class="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 p-3 bg-parchment-200 rounded border border-parchment-400">
        <div class="flex items-center gap-2 flex-1 max-w-md">
          <span class="text-sm">🔍</span>
          <input
            type="text"
            placeholder="即時搜尋技能名稱 (例如: 偵查、射擊、心理學)..."
            value={search()}
            onInput={(e) => setSearch(e.currentTarget.value)}
            class="w-full bg-parchment-50 border border-parchment-400 rounded px-2.5 py-1 text-xs text-sepia-900 focus:outline-none"
          />
        </div>

        <div class="flex items-center gap-3">
          {/* Discord Bot Selector */}
          <div class="flex items-center gap-1.5 text-xs font-bold text-sepia-900">
            <span>🎲 格式:</span>
            {(['.ra', 'cc', '.r'] as DiceBotPrefix[]).map((p) => (
              <label class="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="botPrefix"
                  checked={discordBotPrefix() === p}
                  onChange={() => setDiscordBotPrefix(p)}
                  class="cursor-pointer"
                />
                <span class="font-mono text-xs">{p}</span>
              </label>
            ))}
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            class="bg-eldritch-green hover:bg-opacity-90 text-amber-100 px-3 py-1.5 rounded text-xs font-bold shadow flex items-center gap-1 cursor-pointer transition"
          >
            <span>➕ 新增技能</span>
          </button>
        </div>
      </div>

      {/* Skills 2-Column Responsive Grid */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <For each={filteredSkills()}>
          {(skill, idx) => {
            const half = () => Math.floor(skill.total / 2);
            const fifth = () => Math.floor(skill.total / 5);

            const updateSkillValue = (field: 'occ' | 'interest' | 'growth', val: number) => {
              setActiveChar('skills', (s) => s.id === skill.id, (prev) => {
                const nextOcc = field === 'occ' ? val : prev.occ;
                const nextInterest = field === 'interest' ? val : prev.interest;
                const nextGrowth = field === 'growth' ? val : prev.growth;
                return {
                  ...prev,
                  [field]: val,
                  total: prev.base + nextOcc + nextInterest + nextGrowth,
                };
              });
            };

            return (
              <div class="flex items-center justify-between p-2 bg-parchment-50 rounded border border-parchment-300 hover:bg-parchment-100 transition">
                {/* Growth Checkbox & Name */}
                <div class="flex items-center gap-2 flex-1 min-w-0 pr-2">
                  <input
                    type="checkbox"
                    checked={skill.checked}
                    onChange={(e) =>
                      setActiveChar(
                        'skills',
                        (s) => s.id === skill.id,
                        'checked',
                        e.currentTarget.checked
                      )
                    }
                    class="w-4 h-4 text-eldritch-gold rounded cursor-pointer"
                    title="勾選代表本次跑團成功發揮，團後進行成長檢定"
                  />
                  <span class="text-xs font-bold text-sepia-900 truncate">
                    {skill.name}
                  </span>
                </div>

                {/* Values & Quick Roll */}
                <div class="flex items-center gap-2 shrink-0">
                  <div class="flex items-center gap-1 text-[11px] font-mono">
                    <span class="text-stone-500 text-[10px]">本</span>
                    <input
                      type="number"
                      value={skill.occ}
                      onInput={(e) => updateSkillValue('occ', Number(e.currentTarget.value))}
                      class="w-8 text-center bg-parchment-200 rounded border border-parchment-400 py-0.5 text-xs font-bold"
                    />
                    <span class="text-stone-500 text-[10px]">趣</span>
                    <input
                      type="number"
                      value={skill.interest}
                      onInput={(e) => updateSkillValue('interest', Number(e.currentTarget.value))}
                      class="w-8 text-center bg-parchment-200 rounded border border-parchment-400 py-0.5 text-xs font-bold"
                    />
                  </div>

                  {/* Total & Half/Fifth */}
                  <div class="w-16 text-center font-mono font-bold bg-amber-100 text-amber-950 py-0.5 rounded border border-amber-300">
                    <span class="text-xs">{skill.total}%</span>
                    <span class="block text-[9px] text-amber-800">
                      {half()}|{fifth()}
                    </span>
                  </div>

                  {/* 1-Click Discord Roll Button */}
                  <button
                    onClick={() => handleCopyRoll(skill)}
                    class="bg-eldritch-purple hover:bg-opacity-90 text-amber-100 w-7 h-7 rounded flex items-center justify-center text-xs font-bold cursor-pointer transition shadow-xs"
                    title={`複製 ${formatDiceCommand(skill.name, skill.total)}`}
                  >
                    🎲
                  </button>
                </div>
              </div>
            );
          }}
        </For>
      </div>

      {/* Modal: Add Custom Skill */}
      <Show when={showAddModal()}>
        <div class="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div class="bg-[#FAF5EB] p-5 rounded-lg max-w-sm w-full vintage-border shadow-2xl space-y-3">
            <h3 class="text-base font-bold font-title text-sepia-900 border-b border-sepia-800 pb-2">
              ➕ 新增自訂技能 / 專業分支
            </h3>
            <div>
              <label class="block text-xs font-bold text-sepia-700">技能名稱</label>
              <input
                type="text"
                placeholder="例如: 駕駛（飛機）、外語（日語）"
                value={newSkillName()}
                onInput={(e) => setNewSkillName(e.currentTarget.value)}
                class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs font-bold text-sepia-900"
              />
            </div>
            <div class="grid grid-cols-3 gap-2">
              <div>
                <label class="block text-[11px] font-bold text-sepia-700">初始值</label>
                <input
                  type="number"
                  value={newSkillBase()}
                  onInput={(e) => setNewSkillBase(Number(e.currentTarget.value))}
                  class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-center text-xs font-bold"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-sepia-700">本職點</label>
                <input
                  type="number"
                  value={newSkillOcc()}
                  onInput={(e) => setNewSkillOcc(Number(e.currentTarget.value))}
                  class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-center text-xs font-bold"
                />
              </div>
              <div>
                <label class="block text-[11px] font-bold text-sepia-700">興趣點</label>
                <input
                  type="number"
                  value={newSkillInterest()}
                  onInput={(e) => setNewSkillInterest(Number(e.currentTarget.value))}
                  class="w-full bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-center text-xs font-bold"
                />
              </div>
            </div>
            <div class="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                class="px-3 py-1.5 rounded text-xs font-bold bg-parchment-300 text-sepia-900 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleAddSkill}
                class="px-3 py-1.5 rounded text-xs font-bold bg-eldritch-green text-amber-100 cursor-pointer"
              >
                確認新增
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};
