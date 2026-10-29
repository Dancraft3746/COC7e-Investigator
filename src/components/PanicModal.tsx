import { Component, Show, createSignal } from 'solid-js';
import {
  isPanicModalOpen,
  setIsPanicModalOpen,
  activePanic,
  setActivePanic,
  activeChar,
  setActiveChar,
} from '../stores/characterStore';

const FIVE_F_TABLE = [
  {
    name: '⚡ 戰鬥 (Fight / Frenzy)',
    tag: 'Fight',
    desc: '歇斯底里地向眼前最具威脅性或最近的生物/物體發動猛烈攻擊，不顧自身安危！',
  },
  {
    name: '🏃 逃跑 (Flight / Panic Escape)',
    tag: 'Flight',
    desc: '尖叫並本能地朝著反方向全力奔逃，拋棄手中重物，只求遠離恐懼源頭！',
  },
  {
    name: '🧊 僵直 (Freeze / Catatonia)',
    tag: 'Freeze',
    desc: '神經系統超載，肌肉僵硬，雙眼無神瞪視虛空，無法行動、移動或回應呼喚！',
  },
  {
    name: '🙇 屈從 (Fawn / Submissive Compliance)',
    tag: 'Fawn',
    desc: '崩潰跪倒在地哀求、跪拜或主動服從不可名狀的命令，企圖以卑微順從換取生機！',
  },
  {
    name: '💫 癱軟昏厥 (Flop / Syncope)',
    tag: 'Flop',
    desc: '血壓急劇驟降，大腦自我保護切斷感知，全身脫力昏迷倒地，短時間內不省人事！',
  },
];

const BOUT_OF_MADNESS_TABLE = [
  {
    title: '失憶症 (Amnesia)',
    desc: '醒來後忘記自己是誰，不知身在何處，遺忘近期所有關鍵記憶。',
  },
  {
    title: '假性心身失能 (Psychosomatic Disability)',
    desc: '暫時性失去視覺、聽覺或四肢麻痺，無任何生理病變卻無法感知。',
  },
  {
    title: '暴怒狂行 (Violence & Rage)',
    desc: '情緒徹底失控，轉為極度暴力，以非理性的狂怒摧毀眼前的任何事物。',
  },
  {
    title: '偏執妄想 (Paranoia)',
    desc: '深信身邊同伴皆為不可信的背叛者、怪物偽裝或監視者，伺機暗害自己。',
  },
  {
    title: '恐慌狂奔 (Flee in Panic)',
    desc: '喪失方向感，盲目朝任何看似出口的方向拔足狂奔，毫不在意陷阱與深淵。',
  },
  {
    title: '情緒暴走 (Physical Hysteria)',
    desc: '不可遏止地狂笑、痛哭或瘋狂尖叫，完全無法控制聲帶與表情肌肉。',
  },
  {
    title: '不可名狀幻覺 (Hallucination)',
    desc: '看見牆壁滲出黑血、地面蠕動或聽見非人的低語在腦海深處迴盪。',
  },
  {
    title: '仿說仿行 (Echolalia & Echopraxia)',
    desc: '喪失自我主觀意識，如提線木偶般机械式模仿周圍之人的一言一行。',
  },
  {
    title: '異食與怪異癖好 (Strange Desire / Pica)',
    desc: '強烈渴望吞食生肉、泥土、舊羊皮紙，或撕扯自己頭髮、刮擦指甲。',
  },
  {
    title: '木僵假死 (Catatonic Stupor)',
    desc: '陷入如屍體般的假死狀態，呼吸微弱至難以察覺，體溫驟降。',
  },
];

const PHOBIAS_MANIAS = [
  '闇黑恐懼症 (Achluophobia)',
  '深海恐懼症 (Thalassophobia)',
  '屍體恐懼症 (Necrophobia)',
  '真菌與孢子恐懼症 (Mycophobia)',
  '巨物恐懼症 (Megalophobia)',
  '幽閉恐懼症 (Claustrophobia)',
  '蜘蛛恐懼症 (Arachnophobia)',
  '不可視之物恐懼症 (Aphanisis)',
  '鏡中自我恐懼症 (Spectrophobia)',
  '縱火癖 (Pyromania)',
  '求知狂與禁忌閱讀狂 (Bibliomania)',
  '清潔與淨化強迫 (Ablutomania)',
  '殘害強迫 (Trichotillomania)',
  '恐慌囤積癖 (Hoarding Mania)',
  '無差別說謊狂 (Mythomania)',
];

export const PanicModal: Component = () => {
  const [copied, setCopied] = createSignal(false);
  const [savedToBio, setSavedToBio] = createSignal(false);

  const rollPanicBout = () => {
    // 1. Pick 5F
    const fIdx = Math.floor(Math.random() * FIVE_F_TABLE.length);
    const chosenF = FIVE_F_TABLE[fIdx];

    // 2. Pick Bout (1D10)
    const boutIdx = Math.floor(Math.random() * BOUT_OF_MADNESS_TABLE.length);
    const chosenBout = BOUT_OF_MADNESS_TABLE[boutIdx];

    // 3. Roll Duration (1D10 rounds)
    const rounds = Math.floor(Math.random() * 10) + 1;

    // 4. Random Phobia / Mania
    const pmIdx = Math.floor(Math.random() * PHOBIAS_MANIAS.length);
    const chosenPM = PHOBIAS_MANIAS[pmIdx];

    setActivePanic({
      fiveF: chosenF.name,
      fiveFDesc: chosenF.desc,
      symptom: chosenBout.title,
      symptomDesc: chosenBout.desc,
      durationRounds: rounds,
      phobiaMania: chosenPM,
    });

    // Automatically check Shock state on character
    setActiveChar('investigator', 'shock', true);
    setCopied(false);
    setSavedToBio(false);
  };

  const saveToCharacterBio = () => {
    if (!activePanic.symptom) return;
    const currentPM = activeChar.vitals.sanity.phobiasManias;
    const entry = `【發狂診斷】${activePanic.fiveF} / ${activePanic.symptom} (${activePanic.phobiaMania})`;
    const updatedPM = currentPM ? `${currentPM}\n${entry}` : entry;

    setActiveChar('vitals', 'sanity', 'phobiasManias', updatedPM);
    setSavedToBio(true);
  };

  const copyDiscordBout = () => {
    if (!activePanic.symptom) return;
    const charName = activeChar.investigator.name || '調查員';
    const text = `🩸【${charName} · 理智崩潰發狂宣告 (Bout of Madness)】
⚡ 本能恐慌反應 (5F)：${activePanic.fiveF}
🧠 即時症狀：${activePanic.symptom}
⏳ 持續時間：1D10 = ${activePanic.durationRounds} 輪 (Rounds)
⚠️ 潛在精神創傷：${activePanic.phobiaMania}
📜 症狀描述：${activePanic.fiveFDesc}；${activePanic.symptomDesc}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Show when={isPanicModalOpen()}>
      <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
        <div class="bg-[#FAF5EB] max-w-lg w-full rounded-xl vintage-border shadow-2xl p-5 space-y-4 text-sepia-900 animate-in fade-in zoom-in-95">
          {/* Header */}
          <div class="flex justify-between items-center border-b border-red-900 pb-2">
            <h3 class="font-title font-bold text-base text-red-950 flex items-center gap-2">
              <span>🩸 急性發狂與 5F 本能恐慌解析器 (Panic Resolver)</span>
            </h3>
            <button
              onClick={() => setIsPanicModalOpen(false)}
              class="w-6 h-6 rounded bg-stone-800 text-parchment-100 flex items-center justify-center font-bold text-xs hover:bg-stone-900 cursor-pointer"
            >
              ✕
            </button>
          </div>

          <p class="text-xs text-sepia-700 leading-relaxed">
            當調查員單次理智檢定損失 ≥ 5 點，或總理智損失達當日上限時觸發。
            點擊下方「抽籤發狂輪盤」，自動推算 5F 本能反應、1D10 即時症狀與持續輪數。
          </p>

          {/* Result Display Box */}
          <Show
            when={activePanic.symptom}
            fallback={
              <div class="py-8 text-center bg-parchment-100 rounded-lg border-2 border-dashed border-red-900/30">
                <span class="text-4xl block mb-2">👁️‍🗨️</span>
                <span class="text-xs font-bold text-sepia-700 font-serif italic">
                  深淵正凝視著你... 點擊按鈕抽取本次發狂結果
                </span>
              </div>
            }
          >
            <div class="space-y-3 bg-red-950/5 p-4 rounded-lg border border-red-900/40">
              {/* 5F Tag & Duration */}
              <div class="flex justify-between items-center">
                <span class="px-2.5 py-1 rounded text-xs font-black bg-red-900 text-amber-100 tracking-wider">
                  {activePanic.fiveF}
                </span>
                <span class="text-xs font-mono font-bold bg-amber-100 text-red-950 px-2 py-0.5 rounded border border-amber-300">
                  持續: {activePanic.durationRounds} 輪 (Rounds)
                </span>
              </div>

              <div class="text-xs font-serif text-stone-800 leading-relaxed bg-white/70 p-2.5 rounded border border-red-200">
                <strong class="text-red-950 block mb-0.5 font-sans">
                  🧠 核心症狀：{activePanic.symptom}
                </strong>
                {activePanic.fiveFDesc} {activePanic.symptomDesc}
              </div>

              {/* Acquired Phobia/Mania */}
              <div class="text-[11px] bg-purple-900/10 p-2 rounded border border-purple-900/20 text-purple-950">
                <strong>潛伏恐懼/狂熱：</strong> {activePanic.phobiaMania}
              </div>
            </div>
          </Show>

          {/* Action Button Row */}
          <div class="flex flex-wrap gap-2 pt-1">
            <button
              onClick={rollPanicBout}
              class="flex-1 bg-red-900 hover:bg-red-800 text-amber-100 py-2.5 px-3 rounded text-xs font-bold shadow-md cursor-pointer transition flex items-center justify-center gap-1.5"
            >
              <span>🎲 抽籤發狂輪盤 (Roll 5F & Bout)</span>
            </button>

            <Show when={activePanic.symptom}>
              <button
                onClick={copyDiscordBout}
                class="bg-eldritch-purple hover:bg-opacity-90 text-amber-100 px-3 py-2.5 rounded text-xs font-bold shadow cursor-pointer transition"
              >
                {copied() ? '✅ 已複製！' : '📋 複製至 Discord'}
              </button>

              <button
                onClick={saveToCharacterBio}
                disabled={savedToBio()}
                class={`px-3 py-2.5 rounded text-xs font-bold shadow cursor-pointer transition border ${
                  savedToBio()
                    ? 'bg-stone-300 text-stone-600 border-stone-400 cursor-not-allowed'
                    : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-400'
                }`}
              >
                {savedToBio() ? '☑ 已記入卡片' : '💾 記入精神狀態'}
              </button>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
};
