import { Component, Show } from 'solid-js';
import {
  activeChar,
  activeTab,
  setActiveTab,
  isDrawerOpen,
  setIsDrawerOpen,
  rosterSummaries,
  generateDiscordStatusCard,
  generateGrowthChecklist,
  copyShareURL,
  exportJSONFile,
  importJSONFile,
  loadNormanNobodyProfile,
  resetToDefaultPierce,
} from '../stores/characterStore';
import { setIsDevPhaseOpen } from './DevelopmentPhaseModal';

export const Header: Component = () => {
  let fileInputRef: HTMLInputElement | undefined;

  const handleCopyStatus = () => {
    const text = generateDiscordStatusCard();
    navigator.clipboard.writeText(text);
    alert('✅ 已複製 Discord 調查員現況看板！直接在 Discord 貼上即可發布！');
  };

  const handleCopyGrowth = () => {
    const text = generateGrowthChecklist();
    if (!text) {
      alert('提示: 您尚未在技能清單勾選任何成長標記（☑）！\n請先勾選本場跑團成功發揮之技能。');
      return;
    }
    navigator.clipboard.writeText(text);
    alert('✅ 已複製團後成長檢定清單！直接發給 KP 審核公開骰點！');
  };

  const handleShare = () => {
    copyShareURL();
    alert('✅ 已產生專屬調查員即時網址並複製至剪貼簿！\n發送給任何人，對方打開即可直接檢視您的全部角色卡！');
  };

  const tabs = [
    { id: 'core' as const, name: '📜 核心檔案' },
    { id: 'skills' as const, name: '🎯 技能清單' },
    { id: 'grimoire' as const, name: '🔮 典籍與法術' },
    { id: 'mythos' as const, name: '👁️ 神話遭遇' },
    { id: 'contacts' as const, name: '👥 人際網絡' },
    { id: 'chronicles' as const, name: '📈 戰役編年史' },
  ];

  return (
    <header class="parchment-sheet rounded-t-lg p-4 sm:p-5 border-b-4 border-eldritch-gold vintage-border relative overflow-hidden mb-1">
      <div class="flex flex-col lg:flex-row justify-between items-center gap-4 relative z-10">
        <div class="text-center lg:text-left">
          <div class="flex items-center justify-center lg:justify-start gap-2 text-xs tracking-widest text-amber-700 uppercase font-title font-bold">
            <span>🏛️ MISKATONIC UNIVERSITY • SPECIAL INVESTIGATIONS ARCHIVES</span>
          </div>
          <div class="flex items-center gap-3 mt-1 justify-center lg:justify-start">
            <h1 class="text-2xl sm:text-3xl font-extrabold font-title text-sepia-900 tracking-wider">
              阿卡姆機密調查員終端
            </h1>
            <button
              onClick={() => setIsDrawerOpen(true)}
              class="bg-eldritch-purple hover:bg-opacity-90 text-amber-100 text-xs px-2.5 py-1 rounded shadow flex items-center gap-1 font-bold transition cursor-pointer"
              title="管理與切換多個角色卡"
            >
              <span>📂 名冊庫 ({rosterSummaries().length})</span>
            </button>
          </div>
          <p class="text-xs text-sepia-700 mt-1 italic font-serif">
            CALL OF CTHULHU 7th EDITION • SOLID.JS 2.0 REACTIVE CODEX • DISCORD SUITE
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div class="flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={handleCopyStatus}
            class="bg-eldritch-purple hover:bg-opacity-90 text-amber-100 px-3 py-1.5 rounded text-xs font-bold tracking-wider shadow transition cursor-pointer"
          >
            📋 Discord 狀態卡
          </button>
          <button
            onClick={() => setIsDevPhaseOpen(true)}
            class="bg-eldritch-green hover:bg-opacity-90 text-amber-100 px-3 py-1.5 rounded text-xs font-bold tracking-wider shadow transition cursor-pointer flex items-center gap-1 font-title"
            title="啟動團後全體技能成長輪盤、幸運恢復與 90% 大師里程碑結算"
          >
            <span>📈 團後成長結算</span>
          </button>
          <button
            onClick={handleCopyGrowth}
            class="border border-eldritch-green hover:bg-green-100 text-green-950 px-2.5 py-1.5 rounded text-xs font-bold shadow transition cursor-pointer"
            title="複製已標記成長技能清單給 KP"
          >
            📋 成長清單
          </button>
          <button
            onClick={handleShare}
            class="bg-eldritch-gold hover:bg-amber-600 text-stone-900 px-3 py-1.5 rounded text-xs font-bold tracking-wider shadow transition cursor-pointer"
          >
            🔗 一鍵分享網址
          </button>
          <button
            onClick={() => fileInputRef?.click()}
            class="bg-sepia-800 hover:bg-sepia-900 text-parchment-100 px-3 py-1.5 rounded text-xs font-bold shadow transition cursor-pointer"
          >
            📥 匯入 JSON
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importJSONFile(file);
            }}
            class="hidden"
            accept=".json"
          />
          <button
            onClick={exportJSONFile}
            class="bg-sepia-800 hover:bg-sepia-900 text-parchment-100 px-3 py-1.5 rounded text-xs font-bold shadow transition cursor-pointer"
          >
            💾 備份 JSON
          </button>
          <button
            onClick={loadNormanNobodyProfile}
            class="bg-red-900 hover:bg-red-800 text-amber-100 px-3 py-1.5 rounded text-xs font-bold shadow transition cursor-pointer"
            title="載入《面具/野獸之日》諾曼·諾巴蒂傳奇檔案"
          >
            📜 老兵諾曼卡
          </button>
          <button
            onClick={resetToDefaultPierce}
            class="border border-sepia-700 hover:bg-parchment-200 text-sepia-800 px-2 py-1.5 rounded text-xs font-bold shadow transition cursor-pointer"
            title="重置回初始私家偵探"
          >
            🔄 預設偵探
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav class="flex overflow-x-auto bg-sepia-900 text-parchment-300 p-1 mt-4 rounded shadow border border-sepia-700 text-xs sm:text-sm font-bold font-title">
        {tabs.map((t) => (
          <button
            onClick={() => setActiveTab(t.id)}
            class={`flex items-center gap-2 px-4 py-2 whitespace-nowrap transition rounded ${
              activeTab() === t.id
                ? 'bg-parchment-100 text-sepia-900 border-b-2 border-eldritch-gold shadow'
                : 'hover:text-parchment-100 hover:bg-sepia-800'
            }`}
          >
            <span>{t.name}</span>
          </button>
        ))}
      </nav>
    </header>
  );
};
