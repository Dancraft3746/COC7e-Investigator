import { Component, Show, createSignal, createMemo, For } from 'solid-js';
import { activeChar, creditRating } from '../stores/characterStore';

export const [isFinanceModalOpen, setIsFinanceModalOpen] = createSignal(false);

interface FinancialRecord {
  id: string;
  desc: string;
  amount: number;
  date: string;
}

export const FinanceModal: Component = () => {
  const [era, setEra] = createSignal<'1920s' | 'Modern'>(
    activeChar.investigator.era?.includes('202') ? 'Modern' : '1920s'
  );
  const [customCash, setCustomCash] = createSignal<number | null>(null);
  const [transDesc, setTransDesc] = createSignal('');
  const [transAmount, setTransAmount] = createSignal(0);
  const [records, setRecords] = createSignal<FinancialRecord[]>([
    {
      id: 'rec_init',
      desc: '月度生活費與委託準備金',
      amount: 50,
      date: '今日',
    },
  ]);

  const cr = () => creditRating();

  // Official Core Rulebook p.46-47 Financial Table
  const financeData = createMemo(() => {
    const val = cr();
    const isMod = era() === 'Modern';
    const mult = isMod ? 10 : 1;

    if (val <= 0) {
      return {
        tier: '身無分文 (Penniless)',
        color: 'bg-stone-200 text-stone-800 border-stone-300',
        cash: 0.5 * mult,
        spending: 0.5 * mult,
        assets: 0,
        desc: '居住在貧民窟或露宿街頭，僅能依靠乞討、收容所或撿拾度日。',
      };
    }
    if (val <= 9) {
      return {
        tier: '貧窮底層 (Poor)',
        color: 'bg-amber-100 text-amber-900 border-amber-300',
        cash: val * 1 * mult,
        spending: 2 * mult,
        assets: val * 10 * mult,
        desc: '租住廉價公寓或寄宿家庭，搭乘最廉價公共交通，生活捉襟見肘。',
      };
    }
    if (val <= 49) {
      return {
        tier: '普通中產 (Average)',
        color: 'bg-blue-100 text-blue-900 border-blue-300',
        cash: val * 2 * mult,
        spending: 10 * mult,
        assets: val * 50 * mult,
        desc: '有穩定的住所、擁有一輛二手普通轎車，可正常維持溫飽與家庭生活。',
      };
    }
    if (val <= 89) {
      return {
        tier: '富裕優渥 (Wealthy)',
        color: 'bg-emerald-100 text-emerald-950 border-emerald-300',
        cash: val * 5 * mult,
        spending: 50 * mult,
        assets: val * 500 * mult,
        desc: '住高級住宅區，雇用傭人僕從，擁有高檔私家車與度假鄉間別墅。',
      };
    }
    if (val <= 98) {
      return {
        tier: '頂層富豪 (Rich)',
        color: 'bg-purple-100 text-purple-950 border-purple-300',
        cash: val * 20 * mult,
        spending: 250 * mult,
        assets: val * 2000 * mult,
        desc: '擁有私人莊園大宅、家族信託、私人司機與管家，常出入高端社交俱樂部。',
      };
    }
    return {
      tier: '超級巨富 (Super Rich)',
      color: 'bg-amber-300 text-amber-950 border-amber-500 font-black',
      cash: 50000 * mult,
      spending: 5000 * mult,
      assets: 5000000 * mult,
      desc: '跨國財閥、舊日貴族或巨頭家族，財力可輕易調動整座城市的政商資源！',
    };
  });

  const displayCash = () => {
    if (customCash() !== null) return customCash()!;
    return financeData().cash;
  };

  const handleAddTransaction = () => {
    if (!transDesc() || transAmount() === 0) return;
    const current = displayCash();
    const updated = Math.max(0, current + transAmount());
    setCustomCash(updated);

    const rec: FinancialRecord = {
      id: `trans_${Date.now()}`,
      desc: transDesc(),
      amount: transAmount(),
      date: new Date().toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' }),
    };

    setRecords((prev) => [rec, ...prev]);
    setTransDesc('');
    setTransAmount(0);
  };

  return (
    <Show when={isFinanceModalOpen()}>
      <div class="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
        <div class="bg-[#FAF5EB] max-w-lg w-full rounded-xl vintage-border shadow-2xl p-5 space-y-4 text-sepia-900 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div class="flex justify-between items-center border-b-2 border-sepia-800 pb-2.5">
            <div>
              <h3 class="font-title font-bold text-base text-sepia-900 flex items-center gap-1.5">
                <span>💰 信用評級經濟學與隨身錢包 (Investigator Finance)</span>
              </h3>
              <p class="text-xs text-sepia-700">
                依據第七版核心規則書 p.46–47 信用評級 (CR: {cr()}%) 官方折算
              </p>
            </div>
            <button
              onClick={() => setIsFinanceModalOpen(false)}
              class="w-6 h-6 rounded bg-sepia-800 text-parchment-100 flex items-center justify-center font-bold text-xs hover:bg-sepia-900 cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Era & Tier Banner */}
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-parchment-100 rounded-lg border border-parchment-300">
            <div class="flex items-center gap-2">
              <span class={`px-2.5 py-1 rounded text-xs font-bold border ${financeData().color}`}>
                {financeData().tier}
              </span>
              <span class="text-xs font-bold text-sepia-800 font-mono">
                CR: {cr()}%
              </span>
            </div>
            <div class="flex items-center gap-1.5 text-xs font-bold">
              <span class="text-sepia-700">經濟標準:</span>
              <button
                onClick={() => setEra('1920s')}
                class={`px-2 py-0.5 rounded cursor-pointer transition ${
                  era() === '1920s'
                    ? 'bg-sepia-800 text-parchment-100'
                    : 'bg-parchment-200 text-sepia-800 hover:bg-parchment-300'
                }`}
              >
                1920 年代 ($)
              </button>
              <button
                onClick={() => setEra('Modern')}
                class={`px-2 py-0.5 rounded cursor-pointer transition ${
                  era() === 'Modern'
                    ? 'bg-sepia-800 text-parchment-100'
                    : 'bg-parchment-200 text-sepia-800 hover:bg-parchment-300'
                }`}
              >
                現代 (2020s)
              </button>
            </div>
          </div>

          <p class="text-xs text-sepia-800 font-serif leading-relaxed italic bg-white/70 p-2.5 rounded border border-parchment-300">
            {financeData().desc}
          </p>

          {/* Three-Column Financial Indicators */}
          <div class="grid grid-cols-3 gap-2.5 text-center font-mono">
            <div class="bg-amber-50 p-2.5 rounded-lg border border-amber-300 shadow-xs">
              <span class="block text-[10px] text-amber-900 font-bold uppercase">
                隨身現金 (Cash)
              </span>
              <span class="text-xl font-black text-amber-950 mt-1 block">
                ${displayCash().toLocaleString()}
              </span>
              <span class="block text-[9px] text-stone-500 mt-0.5">實體紙幣與零錢</span>
            </div>

            <div class="bg-blue-50 p-2.5 rounded-lg border border-blue-300 shadow-xs">
              <span class="block text-[10px] text-blue-900 font-bold uppercase">
                消費水準 (Spending)
              </span>
              <span class="text-xl font-black text-blue-950 mt-1 block">
                ${financeData().spending.toLocaleString()}
              </span>
              <span class="block text-[9px] text-stone-500 mt-0.5">單筆免記帳日常開銷</span>
            </div>

            <div class="bg-emerald-50 p-2.5 rounded-lg border border-emerald-300 shadow-xs">
              <span class="block text-[10px] text-emerald-900 font-bold uppercase">
                資產總額 (Assets)
              </span>
              <span class="text-base font-black text-emerald-950 mt-1.5 block">
                ${financeData().assets.toLocaleString()}
              </span>
              <span class="block text-[9px] text-stone-500 mt-0.5">房產/證券/車輛</span>
            </div>
          </div>

          {/* Rules Explanation Alert */}
          <div class="p-2.5 bg-stone-100 rounded text-[11px] text-stone-700 leading-snug border border-stone-200">
            💡 <strong>官方規則說明：</strong>
            單次消費額度 ≤ 消費水準 (${financeData().spending}) 時，如普通餐飲、計程車費、平價旅館等，<strong>無需記帳或扣減隨身現金</strong>。只有購買特殊昂貴物資、賄賂、購買火車船票或軍火時才扣減現金。
          </div>

          {/* Cash Transaction Form */}
          <div class="bg-parchment-100 p-3 rounded-lg border border-parchment-300 space-y-2">
            <span class="text-xs font-bold text-sepia-900 block">
              現金收支記帳 (Cash Ledger):
            </span>
            <div class="flex gap-2">
              <input
                type="text"
                placeholder="收支用途 (如: 購買阿卡姆至波士頓火車票)"
                value={transDesc()}
                onInput={(e) => setTransDesc(e.currentTarget.value)}
                class="flex-1 bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs"
              />
              <input
                type="number"
                placeholder="金額 (正數增加/負數扣除)"
                value={transAmount() || ''}
                onInput={(e) => setTransAmount(Number(e.currentTarget.value))}
                class="w-28 text-center bg-parchment-50 border border-parchment-400 rounded px-2 py-1 text-xs font-mono font-bold"
              />
              <button
                onClick={handleAddTransaction}
                class="bg-eldritch-purple hover:bg-opacity-90 text-amber-100 px-3 py-1 rounded text-xs font-bold shadow cursor-pointer transition"
              >
                記帳
              </button>
            </div>
          </div>

          {/* Recent Records List */}
          <div class="max-h-32 overflow-y-auto space-y-1 p-2 bg-parchment-50 rounded border border-parchment-300 font-mono text-xs">
            <For each={records()}>
              {(r) => (
                <div class="flex justify-between items-center py-1 border-b border-parchment-200 last:border-0">
                  <span class="text-sepia-900 truncate pr-2 font-sans">{r.desc}</span>
                  <div class="flex items-center gap-2 shrink-0">
                    <span
                      class={`font-bold ${
                        r.amount >= 0 ? 'text-green-800' : 'text-red-800'
                      }`}
                    >
                      {r.amount >= 0 ? `+$${r.amount}` : `-$${Math.abs(r.amount)}`}
                    </span>
                    <span class="text-[10px] text-stone-400">{r.date}</span>
                  </div>
                </div>
              )}
            </For>
          </div>

          {/* Footer */}
          <div class="flex justify-end pt-2 border-t border-sepia-800">
            <button
              onClick={() => setIsFinanceModalOpen(false)}
              class="px-4 py-1.5 rounded text-xs font-bold bg-sepia-800 text-parchment-100 hover:bg-sepia-900 cursor-pointer"
            >
              關閉錢包
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
};
