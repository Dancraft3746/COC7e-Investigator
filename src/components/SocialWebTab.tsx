import { Component, For, Show, createSignal } from 'solid-js';
import {
  activeChar,
  setActiveChar,
  maxSanity,
} from '../stores/characterStore';
import type { BackstoryElement, ContactItem } from '../types/investigator';

export const SocialWebTab: Component = () => {
  const [subSection, setSubSection] = createSignal<'backstory' | 'contacts' | 'organization'>('backstory');
  const [rewriteIndex, setRewriteIndex] = createSignal<number | null>(null);
  const [rewrittenText, setRewrittenText] = createSignal('');

  // Default elements if character has none
  const backstoryElements = () => {
    if (activeChar.backstory && activeChar.backstory.length > 0) {
      return activeChar.backstory;
    }
    return [
      { title: '個人外貌特徵 (Personal Description)', content: '身材清瘦，習慣穿著風衣。' },
      { title: '意識形態與信念 (Ideology / Beliefs)', content: '理性與科學必能驅散世間迷霧。' },
      { title: '重要之人 (Significant People)', content: '恩師亨利博士。在迷惘時引導其走向學問的燈塔。' },
      { title: '意義非凡之地 (Meaningful Locations)', content: '波士頓古董二手書店。' },
      { title: '珍視之物 (Treasured Possessions)', content: '祖父所遺留的老舊懷錶。' },
      { title: '個人特質 (Traits)', content: '沈默寡言、對未知事物充滿探求欲。' },
      { title: '傷痕與疤痕 (Injuries & Scars)', content: '左肩有一道陳舊彈片擦傷疤痕。' },
      { title: '恐懼症與躁狂症 (Phobias & Manias)', content: '輕度幽閉恐懼症。' },
      { title: '神秘典籍與神器 (Arcane Tomes & Artifacts)', content: '手頭藏有《玄君七章秘經》殘篇。' },
      { title: '超自然實體接觸 (Encounters with Strange Entities)', content: '曾遠眺過夜魘黑影。' },
    ];
  };

  const keyIndex = () => activeChar.investigator.keyConnectionIndex ?? 2;

  const setKeyConnection = (idx: number) => {
    setActiveChar('investigator', 'keyConnectionIndex', idx);
    alert(`⚓ 已將第 ${idx + 1} 項「${backstoryElements()[idx].title}」指定為本角色的【精神錨點 (Key Connection)】！`);
  };

  const handleAnchorSelfHelp = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    const current = activeChar.investigator.san;
    const updated = Math.min(maxSanity(), current + roll);
    setActiveChar('investigator', 'san', updated);
    alert(`⚓ 與精神錨點心靈互動 (Self-Help)！\n回復 1D6 理智（擲出 ${roll} 點）！理智值恢復至 ${updated}！`);
  };

  const handleAnchorLoss = () => {
    const roll = Math.floor(Math.random() * 6) + 1;
    const current = activeChar.investigator.san;
    const updated = Math.max(0, current - roll);
    setActiveChar('investigator', 'san', updated);
    alert(`💔 精神錨點遭受摧毀或重大背叛！\n受到劇烈心靈創傷，喪失 1D6 理智（扣除 ${roll} 點）！理智值降至 ${updated}！`);
  };

  // Changed Corruption Resolution
  const startRewriteElement = (idx: number) => {
    setRewriteIndex(idx);
    setRewrittenText(backstoryElements()[idx].content);
  };

  const finalizeChangedRewrite = () => {
    const idx = rewriteIndex();
    if (idx === null || !rewrittenText().trim()) return;

    const list = [...backstoryElements()];
    list[idx] = {
      ...list[idx],
      content: rewrittenText().trim(),
      rewritten: `【心智質變改寫】${rewrittenText().trim()}`,
    };

    setActiveChar('backstory', list);
    // Cure Changed state!
    setActiveChar('investigator', 'changed', false);

    setRewriteIndex(null);
    setRewrittenText('');
    alert('🌀 心靈質變烙印已深植！該背景要素已永久改寫，【心智質變 (Changed)】狀態已成功解除，恢復正常幸運值恢復能力！');
  };

  return (
    <div class="space-y-4">
      {/* Navigation Sub-Tabs */}
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-parchment-200 rounded border border-parchment-400 gap-2">
        <div>
          <h3 class="text-sm font-bold font-title text-sepia-900 mb-0.5">
            👥 背景故事十要素、精神錨點與人際網絡 (Backstory & Social Web)
          </h3>
          <p class="text-xs text-sepia-700">
            落實核心規則書 p.157 官方背景十要素與守密人伴侶 p.85–96 心智質變重寫機制
          </p>
        </div>
        <div class="flex gap-1.5 font-title text-xs font-bold">
          <button
            onClick={() => setSubSection('backstory')}
            class={`px-3 py-1.5 rounded cursor-pointer transition ${
              subSection() === 'backstory'
                ? 'bg-sepia-800 text-parchment-100 shadow-xs'
                : 'bg-parchment-100 text-sepia-800 hover:bg-parchment-300'
            }`}
          >
            📜 官方背景十要素
          </button>
          <button
            onClick={() => setSubSection('contacts')}
            class={`px-3 py-1.5 rounded cursor-pointer transition ${
              subSection() === 'contacts'
                ? 'bg-sepia-800 text-parchment-100 shadow-xs'
                : 'bg-parchment-100 text-sepia-800 hover:bg-parchment-300'
            }`}
          >
            👥 人際接觸 ({activeChar.contacts.length})
          </button>
          <button
            onClick={() => setSubSection('organization')}
            class={`px-3 py-1.5 rounded cursor-pointer transition ${
              subSection() === 'organization'
                ? 'bg-sepia-800 text-parchment-100 shadow-xs'
                : 'bg-parchment-100 text-sepia-800 hover:bg-parchment-300'
            }`}
          >
            🏛️ 調查員組織
          </button>
        </div>
      </div>

      {/* Sub-Section 1: 10 Backstory Elements */}
      <Show when={subSection() === 'backstory'}>
        <div class="space-y-4">
          {/* Changed State Alert Banner (Companion p.92) */}
          <Show when={activeChar.investigator.changed}>
            <div class="p-3.5 bg-purple-950 text-amber-100 rounded-lg border-2 border-amber-400 shadow-md space-y-2 animate-pulse">
              <div class="flex justify-between items-center">
                <strong class="font-title text-sm text-amber-300 flex items-center gap-1.5">
                  <span>🌀 調查員處於【心智質變／變異 (Changed)】狀態！</span>
                </strong>
                <span class="text-xs bg-amber-400 text-purple-950 px-2 py-0.5 rounded font-black">
                  無法恢復幸運值
                </span>
              </div>
              <p class="text-xs leading-relaxed text-amber-200">
                依據《守密人伴侶》p.92–93：單日理智累積扣除達 1/5 POW 即進入變異。
                在團後休整時，<strong>必須永久腐化／改寫下方十要素中的其中一項</strong>，才能解除變異狀態！
              </p>
            </div>
          </Show>

          {/* Key Connection Quick Control */}
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-amber-50 rounded-lg border border-amber-300 gap-2 text-xs">
            <div class="flex items-center gap-2">
              <span class="text-lg">⚓</span>
              <div>
                <strong class="text-amber-950 font-title">
                  當前精神錨點 (Key Connection)：{backstoryElements()[keyIndex()]?.title}
                </strong>
                <p class="text-stone-700 text-[11px]">
                  {backstoryElements()[keyIndex()]?.content}
                </p>
              </div>
            </div>
            <div class="flex gap-1.5 shrink-0">
              <button
                onClick={handleAnchorSelfHelp}
                class="bg-eldritch-green hover:bg-opacity-90 text-amber-100 px-2.5 py-1 rounded font-bold shadow-xs cursor-pointer transition"
                title="與錨點互動進行心靈修復 (+1D6 SAN)"
              >
                ⚓ 心靈休整 (+1D6)
              </button>
              <button
                onClick={handleAnchorLoss}
                class="bg-red-900 hover:bg-red-800 text-white px-2.5 py-1 rounded font-bold shadow-xs cursor-pointer transition"
                title="錨點被毀損或失去 (-1D6 SAN)"
              >
                💔 錨點毀損 (-1D6)
              </button>
            </div>
          </div>

          {/* The 10 Elements Grid */}
          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <For each={backstoryElements()}>
              {(el, idx) => {
                const isKey = () => idx() === keyIndex();
                return (
                  <div
                    class={`p-3 rounded-lg border transition ${
                      isKey()
                        ? 'bg-amber-100/60 border-eldritch-gold shadow-md ring-1 ring-eldritch-gold'
                        : 'bg-parchment-50 border-parchment-300 hover:bg-parchment-100'
                    }`}
                  >
                    <div class="flex justify-between items-center border-b border-parchment-300 pb-1.5 mb-2">
                      <h4 class="font-bold text-xs text-sepia-900 flex items-center gap-1.5">
                        <span class="w-4 h-4 rounded-full bg-sepia-800 text-parchment-100 text-[10px] flex items-center justify-center font-mono">
                          {idx() + 1}
                        </span>
                        <span>{el.title}</span>
                      </h4>

                      <div class="flex items-center gap-1.5">
                        <Show when={isKey()}>
                          <span class="text-[10px] font-mono font-black bg-amber-400 text-stone-950 px-1.5 py-0.5 rounded shadow-xs">
                            ⚓ 精神錨點
                          </span>
                        </Show>
                        <Show when={!isKey()}>
                          <button
                            onClick={() => setKeyConnection(idx())}
                            class="text-[10px] text-amber-900 hover:text-amber-950 underline cursor-pointer"
                          >
                            設為錨點
                          </button>
                        </Show>
                        <Show when={activeChar.investigator.changed}>
                          <button
                            onClick={() => startRewriteElement(idx())}
                            class="text-[10px] bg-purple-900 text-amber-100 px-1.5 py-0.5 rounded font-bold cursor-pointer hover:bg-purple-800 ml-1"
                          >
                            質變改寫
                          </button>
                        </Show>
                      </div>
                    </div>

                    <textarea
                      rows="2"
                      value={el.content}
                      onInput={(e) => {
                        const val = e.currentTarget.value;
                        setActiveChar('backstory', idx(), 'content', val);
                      }}
                      class="w-full text-xs bg-white/70 border border-parchment-300 rounded p-1.5 text-sepia-900 focus:outline-none focus:bg-white"
                    />

                    <Show when={el.rewritten}>
                      <span class="block text-[10px] text-purple-950 font-serif italic mt-1 bg-purple-50 p-1 rounded border border-purple-200">
                        {el.rewritten}
                      </span>
                    </Show>
                  </div>
                );
              }}
            </For>
          </div>
        </div>
      </Show>

      {/* Sub-Section 2: Contacts List */}
      <Show when={subSection() === 'contacts'}>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <For each={activeChar.contacts}>
            {(contact) => (
              <div class="p-3 bg-parchment-50 rounded border border-parchment-300 shadow-xs flex flex-col justify-between">
                <div>
                  <div class="flex justify-between items-start">
                    <h4 class="font-bold text-xs text-sepia-900 flex items-center gap-1.5">
                      <span>{contact.name}</span>
                    </h4>
                    <span class="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                      {contact.relation}
                    </span>
                  </div>
                  <p class="text-xs text-sepia-800 mt-2 leading-relaxed">
                    {contact.notes || contact.role}
                  </p>
                </div>
              </div>
            )}
          </For>
        </div>
      </Show>

      {/* Sub-Section 3: Investigator Organization (Companion p.29) */}
      <Show when={subSection() === 'organization'}>
        <div class="p-4 bg-parchment-50 rounded-lg border border-parchment-300 space-y-3">
          <h4 class="text-xs font-bold font-title text-sepia-900 uppercase tracking-wider border-b border-parchment-300 pb-2">
            🏛️ 調查員組織架構與贊助者 (Investigator Organization · Companion p.29)
          </h4>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <label class="block text-[11px] font-bold text-sepia-700">組織名稱 (Organization Name)</label>
              <input
                type="text"
                value="阿卡姆機密調查小組 (Arkham Special Inquiries)"
                class="w-full bg-parchment-100 border border-parchment-400 rounded px-2.5 py-1 text-xs font-bold mt-1"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-sepia-700">贊助者／委託人 (Patron)</label>
              <input
                type="text"
                value="密斯卡托尼克大學董事會基金"
                class="w-full bg-parchment-100 border border-parchment-400 rounded px-2.5 py-1 text-xs mt-1"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-sepia-700">總部／集會據點 (Headquarters)</label>
              <input
                type="text"
                value="密斯卡托尼克大學奧恩圖書館特藏閱覽室隔間"
                class="w-full bg-parchment-100 border border-parchment-400 rounded px-2.5 py-1 text-xs mt-1"
              />
            </div>
            <div>
              <label class="block text-[11px] font-bold text-sepia-700">公費經費／物資預算 (Funding & Resources)</label>
              <input
                type="text"
                value="每月 $200 調查津貼、學術檔案調閱權限與化驗室使用證"
                class="w-full bg-parchment-100 border border-parchment-400 rounded px-2.5 py-1 text-xs mt-1"
              />
            </div>
          </div>
        </div>
      </Show>

      {/* Modal: Rewrite Element to Cure Changed */}
      <Show when={rewriteIndex() !== null}>
        <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-[#FAF5EB] max-w-md w-full rounded-xl vintage-border shadow-2xl p-5 space-y-4 text-sepia-900 animate-in fade-in zoom-in-95">
            <div class="flex justify-between items-center border-b border-purple-900 pb-2">
              <h3 class="font-title font-bold text-base text-purple-950 flex items-center gap-1.5">
                <span>🌀 心智質變烙印：改寫背景要素</span>
              </h3>
              <button
                onClick={() => setRewriteIndex(null)}
                class="w-6 h-6 rounded bg-stone-800 text-parchment-100 flex items-center justify-center font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p class="text-xs text-sepia-800 leading-relaxed font-serif">
              改寫項目：<strong>{backstoryElements()[rewriteIndex()!]?.title}</strong>
              <br />
              請描述神話不可名狀之恐怖如何永久扭曲或破壞了這項信念、記憶或人物關係。完成後將正式<strong>治癒變異狀態</strong>。
            </p>

            <textarea
              rows="4"
              value={rewrittenText()}
              onInput={(e) => setRewrittenText(e.currentTarget.value)}
              class="w-full bg-parchment-50 border border-purple-900/40 rounded p-2 text-xs font-serif leading-relaxed text-sepia-900 focus:outline-none focus:ring-1 focus:ring-purple-900"
            />

            <div class="flex justify-end gap-2 pt-2 border-t border-sepia-800">
              <button
                onClick={() => setRewriteIndex(null)}
                class="px-3 py-1.5 rounded text-xs font-bold bg-stone-300 text-stone-800 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={finalizeChangedRewrite}
                class="px-4 py-1.5 rounded text-xs font-bold bg-purple-950 text-amber-200 hover:bg-purple-900 cursor-pointer transition shadow-md font-title"
              >
                💾 永久改寫並治癒質變 (Cure Changed)
              </button>
            </div>
          </div>
        </div>
      </Show>
    </div>
  );
};
