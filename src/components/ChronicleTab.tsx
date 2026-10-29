import { Component, For } from 'solid-js';
import { activeChar, generateGrowthChecklist } from '../stores/characterStore';
import { setIsDevPhaseOpen } from './DevelopmentPhaseModal';

export const ChronicleTab: Component = () => {
  const handleCopyGrowth = () => {
    const text = generateGrowthChecklist();
    if (!text) {
      alert('提示: 您尚未在技能清單勾選任何成長標記（☑）！\n請先勾選本場跑團成功發揮之技能。');
      return;
    }
    navigator.clipboard.writeText(text);
    alert('✅ 已複製團後成長檢定清單！直接發給 KP 審核公開骰點！');
  };

  return (
    <div class="space-y-4">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-parchment-200 rounded border border-parchment-400 gap-2">
        <div>
          <h3 class="text-sm font-bold font-title text-sepia-900 mb-0.5">
            📈 戰役編年史與團後記錄 (Chronicle & Growth Log)
          </h3>
          <p class="text-xs text-sepia-700">
            記錄每場模組通關時間、KP 名字、理智與幸運收支
          </p>
        </div>
        <div class="flex gap-2">
          <button
            onClick={() => setIsDevPhaseOpen(true)}
            class="bg-eldritch-green hover:bg-opacity-90 text-amber-100 px-3 py-1.5 rounded text-xs font-bold shadow cursor-pointer transition flex items-center gap-1 font-title"
          >
            <span>🎲 進入團後成長結算輪盤</span>
          </button>
          <button
            onClick={handleCopyGrowth}
            class="bg-sepia-800 hover:bg-sepia-900 text-parchment-100 px-3 py-1.5 rounded text-xs font-bold shadow cursor-pointer transition"
          >
            📋 複製成長清單
          </button>
        </div>
      </div>

      <div class="space-y-3">
        <For each={activeChar.chronicles}>
          {(item) => (
            <div class="p-4 bg-parchment-50 rounded border border-parchment-300 shadow-xs">
              <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-2 border-b border-parchment-200 gap-1">
                <div>
                  <h4 class="font-bold text-sm text-sepia-900">{item.title}</h4>
                  <span class="text-[11px] text-sepia-700">
                    類型: {item.type} • KP: {item.kp} • 日期: {item.date}
                  </span>
                </div>
                <div class="flex items-center gap-2 text-xs font-mono font-bold">
                  <span class="bg-purple-100 text-purple-900 px-2 py-0.5 rounded">
                    SAN: {item.sanReward}
                  </span>
                  <span class="bg-red-100 text-red-900 px-2 py-0.5 rounded">
                    神話: +{item.mythosGain}%
                  </span>
                  <span class="bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                    幸運: +{item.luckGain}
                  </span>
                </div>
              </div>
              <p class="text-xs text-sepia-800 mt-2 leading-relaxed">
                {item.notes}
              </p>
            </div>
          )}
        </For>
      </div>
    </div>
  );
};
