import { Component, Show, createSignal } from 'solid-js';
import {
  activeChar,
  setActiveChar,
  maxSanity,
} from '../stores/characterStore';

export const [isSanityRecoveryOpen, setIsSanityRecoveryOpen] = createSignal(false);

export const SanityRecoveryModal: Component = () => {
  const [logText, setLogText] = createSignal('');
  const [lastGain, setLastGain] = createSignal<number | null>(null);

  const san = () => activeChar.investigator.san;
  const maxSAN = () => maxSanity();

  // 1. Reassurance (+2 SAN)
  const handleReassurance = () => {
    const roll = Math.floor(Math.random() * 100) + 1;
    // Assume average teammate Reassure skill around 30% or social
    const success = roll <= 50;
    const fumble = roll >= 96;

    if (fumble) {
      const loss = Math.floor(Math.random() * 6) + 1;
      const updated = Math.max(0, san() - loss);
      setActiveChar('investigator', 'san', updated);
      setLastGain(-loss);
      setLogText(`💀 安撫大失敗 (擲出 ${roll})！隊友言詞刺痛創傷，陷入更深恐慌！損失 -${loss} 點理智 (當前 SAN: ${updated})`);
    } else if (success) {
      const updated = Math.min(maxSAN(), san() + 2);
      setActiveChar('investigator', 'san', updated);
      setLastGain(2);
      setLogText(`💚 安撫成功 (擲出 ${roll})！隊友以堅定言語溫暖心靈，回復 +2 點理智！(當前 SAN: ${updated})`);
    } else {
      setLastGain(0);
      setLogText(`❌ 安撫常規失敗 (擲出 ${roll})。未能平復激動情緒，無額外理智變化。`);
    }
  };

  // 2. Psychotherapy (1D3 SAN vs 1D6 Fumble)
  const handlePsychotherapy = () => {
    const roll = Math.floor(Math.random() * 100) + 1;
    const success = roll <= 60;
    const fumble = roll >= 96;

    if (fumble) {
      const loss = Math.floor(Math.random() * 6) + 1;
      const updated = Math.max(0, san() - loss);
      setActiveChar('investigator', 'san', updated);
      setLastGain(-loss);
      setLogText(`💀 精神分析大失敗 (擲出 ${roll})！心理防線崩潰，引發嚴重逆火！損失 -${loss} 點理智 (當前 SAN: ${updated})`);
    } else if (success) {
      const gain = Math.floor(Math.random() * 3) + 1;
      const updated = Math.min(maxSAN(), san() + gain);
      setActiveChar('investigator', 'san', updated);
      setLastGain(gain);
      setLogText(`🩺 精神分析成功 (擲出 ${roll})！經過系統性疏導，回復 1D3 = +${gain} 點理智！(當前 SAN: ${updated})`);
    } else {
      setLastGain(0);
      setLogText(`❌ 精神分析未見成效 (擲出 ${roll})。本期心理諮商無突破進展。`);
    }
  };

  // 3. Key Connection Self-Help (1D6 SAN)
  const handleKeyConnectionSelfHelp = () => {
    const hardTarget = Math.floor((activeChar.characteristics.INT || 70) / 2);
    const roll = Math.floor(Math.random() * 100) + 1;
    const success = roll <= hardTarget;

    if (success) {
      const gain = Math.floor(Math.random() * 6) + 1;
      const updated = Math.min(maxSAN(), san() + gain);
      setActiveChar('investigator', 'san', updated);
      setLastGain(gain);
      setLogText(`⚓ 精神錨點困難檢定成功 (擲出 ${roll} ≤ ${hardTarget})！與最珍視之人事物心靈共鳴，回復 1D6 = +${gain} 點理智！(當前 SAN: ${updated})`);
    } else {
      setLastGain(0);
      setLogText(`❌ 精神錨點檢定失敗 (擲出 ${roll} > ${hardTarget})。心靈仍受陰霾困擾，未能獲得慰藉。`);
    }
  };

  // 4. Keeper Scenario Reward (1D6 / 1D10)
  const handleKeeperAward = (dice: 6 | 10) => {
    const gain = Math.floor(Math.random() * dice) + 1;
    const updated = Math.min(maxSAN(), san() + gain);
    setActiveChar('investigator', 'san', updated);
    setLastGain(gain);
    setLogText(`🏆 守密人劇本通關獎勵 (1D${dice} = ${gain} 點)！粉碎神話陰謀，心智大幅舒緩！回復 +${gain} 點理智！(當前 SAN: ${updated})`);
  };

  const copyTherapyToDiscord = () => {
    if (!logText()) return;
    const charName = activeChar.investigator.name || '調查員';
    const text = `🧠【${charName} · 理智修復與精神治療日誌】\n${logText()}\n當前理智值: ${san()} / ${maxSAN()}`;
    navigator.clipboard.writeText(text);
    alert('✅ 已複製治療日誌至剪貼簿！直接貼到 Discord 跑團頻道即可！');
  };

  return (
    <Show when={isSanityRecoveryOpen()}>
      <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        <div class="bg-[#FAF5EB] max-w-lg w-full rounded-xl vintage-border shadow-2xl p-5 my-8 space-y-4 text-sepia-900 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div class="flex justify-between items-center border-b-2 border-purple-900 pb-2.5">
            <div>
              <h3 class="font-title font-bold text-base text-purple-950 flex items-center gap-1.5">
                <span>🩺 官方五大理智修復與心理治療工作站 (Sanity Therapy)</span>
              </h3>
              <p class="text-xs text-sepia-700">
                依據《守密人伴侶》p.94–96 官方五大理智康復途徑與風險判定
              </p>
            </div>
            <button
              onClick={() => setIsSanityRecoveryOpen(false)}
              class="w-6 h-6 rounded bg-stone-800 text-parchment-100 flex items-center justify-center font-bold text-xs hover:bg-stone-900 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Current SAN Ticker */}
          <div class="flex justify-between items-center bg-purple-900/10 p-3 rounded-lg border border-purple-900/30">
            <div>
              <span class="text-xs text-purple-950 font-bold block">當前理智狀態:</span>
              <span class="text-xs text-stone-600 font-serif">上限極限值: {maxSAN()} (99 - 神話技能)</span>
            </div>
            <div class="text-2xl font-black font-mono text-purple-950">
              {san()} <span class="text-xs text-stone-600">/ {maxSAN()}</span>
            </div>
          </div>

          {/* Pathways Selection Grid */}
          <div class="space-y-2.5">
            {/* Pathway 1: Reassurance */}
            <div class="p-3 bg-parchment-100 rounded-lg border border-parchment-300 flex justify-between items-center">
              <div>
                <strong class="text-xs font-title text-sepia-900 block">
                  1. 同伴安撫 (Reassurance · Companion p.94)
                </strong>
                <span class="text-[11px] text-stone-600 font-serif">
                  隊友檢定安撫技能 (APP/5) 或社交技能。成功 +2 SAN (每劇本限一次)。
                </span>
              </div>
              <button
                onClick={handleReassurance}
                class="bg-eldritch-green hover:bg-opacity-90 text-amber-100 px-3 py-1.5 rounded text-xs font-bold shadow cursor-pointer transition shrink-0"
              >
                執行安撫 (+2)
              </button>
            </div>

            {/* Pathway 2: Psychotherapy */}
            <div class="p-3 bg-parchment-100 rounded-lg border border-parchment-300 flex justify-between items-center">
              <div>
                <strong class="text-xs font-title text-sepia-900 block">
                  2. 精神分析專業治療 (Psychotherapy · Core p.95)
                </strong>
                <span class="text-[11px] text-stone-600 font-serif">
                  專業心理醫師檢定。成功回復 +1D3 SAN；大失敗損失 1D6。
                </span>
              </div>
              <button
                onClick={handlePsychotherapy}
                class="bg-eldritch-purple hover:bg-opacity-90 text-amber-100 px-3 py-1.5 rounded text-xs font-bold shadow cursor-pointer transition shrink-0"
              >
                心理諮商 (+1D3)
              </button>
            </div>

            {/* Pathway 3: Key Connection Self-Help */}
            <div class="p-3 bg-parchment-100 rounded-lg border border-parchment-300 flex justify-between items-center">
              <div>
                <strong class="text-xs font-title text-sepia-900 block">
                  3. 精神錨點休整修復 (Key Connection Self-Help)
                </strong>
                <span class="text-[11px] text-stone-600 font-serif">
                  休整期間與精神錨點心靈共鳴。困難 INT 成功回復 +1D6 SAN！
                </span>
              </div>
              <button
                onClick={handleKeyConnectionSelfHelp}
                class="bg-amber-600 hover:bg-amber-700 text-stone-950 px-3 py-1.5 rounded text-xs font-bold shadow cursor-pointer transition shrink-0 font-title"
              >
                ⚓ 錨點冥想 (+1D6)
              </button>
            </div>

            {/* Pathway 4: Keeper Award */}
            <div class="p-3 bg-parchment-100 rounded-lg border border-parchment-300 flex justify-between items-center">
              <div>
                <strong class="text-xs font-title text-sepia-900 block">
                  4. 守密人劇本通關功勳獎勵 (Keeper Award)
                </strong>
                <span class="text-[11px] text-stone-600 font-serif">
                  擊敗狂信徒、封閉門扉或生還通關之大賞。
                </span>
              </div>
              <div class="flex gap-1 shrink-0">
                <button
                  onClick={() => handleKeeperAward(6)}
                  class="bg-blue-800 hover:bg-blue-700 text-white px-2 py-1.5 rounded text-xs font-bold shadow cursor-pointer transition"
                >
                  +1D6 SAN
                </button>
                <button
                  onClick={() => handleKeeperAward(10)}
                  class="bg-blue-900 hover:bg-blue-800 text-amber-200 px-2 py-1.5 rounded text-xs font-bold shadow cursor-pointer transition"
                >
                  +1D10 SAN
                </button>
              </div>
            </div>
          </div>

          {/* Result Log */}
          <Show when={logText()}>
            <div class="p-3 bg-white/80 rounded-lg border border-purple-900/40 text-xs space-y-1.5 font-serif">
              <strong class="text-purple-950 font-sans block">最新治療紀錄：</strong>
              <p class="leading-relaxed text-stone-800">{logText()}</p>
              <div class="pt-1">
                <button
                  onClick={copyTherapyToDiscord}
                  class="text-[11px] font-bold text-purple-900 hover:text-purple-950 underline cursor-pointer"
                >
                  📋 複製本次治療紀錄至 Discord
                </button>
              </div>
            </div>
          </Show>

          {/* Footer */}
          <div class="flex justify-end pt-2 border-t border-sepia-800">
            <button
              onClick={() => setIsSanityRecoveryOpen(false)}
              class="px-4 py-1.5 rounded text-xs font-bold bg-sepia-800 text-parchment-100 hover:bg-sepia-900 cursor-pointer"
            >
              完成治療
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};
