import { Component, createSignal, Show, createMemo } from 'solid-js';
import { activeChar, setActiveChar, maxSanity } from '../stores/characterStore';
import { triggerSanityCheck } from '../stores/sanityStore';
import type { TomeItem, SpellItem } from '../types/investigator';

interface TomeStudyModalProps {
  tome: TomeItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TomeStudyModal: Component<TomeStudyModalProps> = (props) => {
  const [studyMode, setStudyMode] = createSignal<'skim' | 'full'>('skim');
  const [langRollResult, setLangRollResult] = createSignal<{ roll: number; text: string; success: boolean } | null>(null);
  const [sanLossRoll, setSanLossRoll] = createSignal<number | null>(null);
  const [studySuccess, setStudySuccess] = createSignal<boolean | null>(null);
  const [actionLog, setActionLog] = createSignal<string>('');

  // Find relevant language skill for this tome
  const matchingLanguageSkill = createMemo(() => {
    if (!props.tome) return null;
    const lang = props.tome.language.trim();
    return activeChar.skills.find(
      (s) => s.name.includes(lang) || (lang.includes('英語') && s.name.includes('母語'))
    ) || null;
  });

  const languageSkillTarget = createMemo(() => {
    const sk = matchingLanguageSkill();
    if (sk) return sk.total;
    if (props.tome?.language.includes('母語') || props.tome?.language.includes('英語')) {
      return activeChar.characteristics.EDU || 60;
    }
    return 1; // Base foreign language
  });

  // Roll Language Test for Full Study
  const rollLanguageCheck = () => {
    const target = languageSkillTarget();
    const roll = Math.floor(Math.random() * 100) + 1;
    const fumble = target < 50 ? 96 : 100;

    let text = '';
    let success = false;
    if (roll === 1) {
      text = `🌟 語言大成功 (Critical 01)！字裡行間的異端真實躍然紙上！`;
      success = true;
    } else if (roll >= fumble) {
      text = `💀 語言大失敗 (${roll})！心智遭受誤讀與古老詛咒的反噬！`;
      success = false;
    } else if (roll <= Math.floor(target / 5)) {
      text = `🟣 極限成功 (${roll} <= ${Math.floor(target / 5)})！透徹領會晦澀字句！`;
      success = true;
    } else if (roll <= Math.floor(target / 2)) {
      text = `🔵 困難成功 (${roll} <= ${Math.floor(target / 2)})！順利解讀典籍深意！`;
      success = true;
    } else if (roll <= target) {
      text = `🟢 常規成功 (${roll} <= ${target})！大致讀懂文字內容！`;
      success = true;
    } else {
      text = `❌ 研讀失敗 (${roll} > ${target})！文字深奧晦澀，無法理解核心內涵！`;
      success = false;
    }

    setLangRollResult({ roll, text, success });
  };

  // Execute Skim (初讀)
  const executeSkim = () => {
    if (!props.tome) return;
    const sanLoss = Math.floor(Math.random() * 3) + 1; // 1D3 SAN loss for skim
    const mythosGain = 1; // +1% Cthulhu Mythos

    // Update Mythos Skill
    const mythosSkillIndex = activeChar.skills.findIndex((s) => s.name.includes('克蘇魯神話'));
    if (mythosSkillIndex >= 0) {
      const currentMythos = activeChar.skills[mythosSkillIndex].total;
      setActiveChar('skills', mythosSkillIndex, 'total', currentMythos + mythosGain);
      setActiveChar('skills', mythosSkillIndex, 'growth', (g) => g + mythosGain);
    }

    // Deduct Sanity
    const newSAN = Math.max(0, activeChar.investigator.san - sanLoss);
    setActiveChar('investigator', 'san', newSAN);

    // Update Tome Status
    setActiveChar('tomes', (t) => t.id === props.tome!.id, 'status', '初讀完成 (Skimmed)');

    if (sanLoss >= 5) {
      triggerSanityCheck(sanLoss);
    }

    const log = `📖【初讀完成】花費數小時粗略翻閱《${props.tome.name}》，瞥見了宇宙不可言說之黑暗。獲得 +${mythosGain}% 克蘇魯神話，失去 ${sanLoss} 點理智 (SAN)。`;
    setActionLog(log);
    setStudySuccess(true);
  };

  // Execute Full Study (精讀)
  const executeFullStudy = () => {
    if (!props.tome) return;

    // Parse Sanity loss
    let sanLoss = 4;
    const sanExpr = props.tome.sanLoss.toUpperCase();
    if (sanExpr.includes('D')) {
      const [cStr, sStr] = sanExpr.split('D');
      const count = parseInt(cStr, 10) || 1;
      const sides = parseInt(sStr, 10) || 6;
      let sum = 0;
      for (let i = 0; i < count; i++) {
        sum += Math.floor(Math.random() * sides) + 1;
      }
      sanLoss = sum;
    } else {
      sanLoss = parseInt(sanExpr, 10) || 4;
    }
    setSanLossRoll(sanLoss);

    const mythosGain = props.tome.mythosGain || 4;

    // Update Mythos Skill
    const mythosSkillIndex = activeChar.skills.findIndex((s) => s.name.includes('克蘇魯神話'));
    if (mythosSkillIndex >= 0) {
      const currentMythos = activeChar.skills[mythosSkillIndex].total;
      setActiveChar('skills', mythosSkillIndex, 'total', currentMythos + mythosGain);
      setActiveChar('skills', mythosSkillIndex, 'growth', (g) => g + mythosGain);
    }

    // Deduct Sanity
    const newSAN = Math.max(0, activeChar.investigator.san - sanLoss);
    setActiveChar('investigator', 'san', newSAN);

    // Unlock spells into Grimoire if listed
    if (props.tome.spells) {
      const spellNames = props.tome.spells.split(/[,，、]/).map((s) => s.trim()).filter(Boolean);
      spellNames.forEach((sName) => {
        const exists = activeChar.spells.some((sp) => sp.name.includes(sName));
        if (!exists) {
          const newSpell: SpellItem = {
            id: `spell_tome_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
            name: sName,
            cost: '8 MP, 1D6 SAN',
            castTime: '1 輪',
            source: props.tome!.name,
            desc: `習自禁忌典籍《${props.tome!.name}》之秘術儀軌。`,
          };
          setActiveChar('spells', (prev) => [...prev, newSpell]);
        }
      });
    }

    // Update Tome Status
    setActiveChar('tomes', (t) => t.id === props.tome!.id, 'status', '精讀完成 (Studied)');

    if (sanLoss >= 5) {
      triggerSanityCheck(sanLoss);
    }

    const log = `📚【精讀完成】歷經數週冥思苦讀《${props.tome.name}》，理智重塑！獲得 +${mythosGain}% 克蘇魯神話知識 (理智上限降至 ${maxSanity()})，失去 ${sanLoss} 點理智！解鎖典籍所載法術！`;
    setActionLog(log);
    setStudySuccess(true);
  };

  const copyLogToClipboard = () => {
    navigator.clipboard.writeText(actionLog());
    alert('✅ 已複製研讀成果至剪貼簿！');
  };

  return (
    <Show when={props.isOpen && props.tome}>
      <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
        <div class="bg-[#FAF5EB] p-5 rounded-lg max-w-md w-full vintage-border shadow-2xl space-y-4 text-sepia-900">
          {/* Header */}
          <div class="flex justify-between items-start border-b border-sepia-800 pb-2.5">
            <div>
              <span class="text-[10px] uppercase font-bold tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                📖 禁忌典籍研讀系統 (Core p.173)
              </span>
              <h3 class="text-base font-title font-bold text-sepia-900 mt-1">
                {props.tome?.name}
              </h3>
            </div>
            <button
              onClick={props.onClose}
              class="text-sepia-600 hover:text-sepia-900 text-lg font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Tome Properties */}
          <div class="grid grid-cols-4 gap-1.5 text-center text-xs font-mono">
            <div class="bg-parchment-200 p-1.5 rounded">
              <span class="block text-[10px] text-stone-500">語言</span>
              <span class="font-bold">{props.tome?.language}</span>
            </div>
            <div class="bg-parchment-200 p-1.5 rounded">
              <span class="block text-[10px] text-stone-500">研讀週期</span>
              <span class="font-bold">{props.tome?.studyTime}</span>
            </div>
            <div class="bg-parchment-200 p-1.5 rounded">
              <span class="block text-[10px] text-stone-500">神話增長</span>
              <span class="font-bold text-red-900">+{props.tome?.mythosGain}%</span>
            </div>
            <div class="bg-parchment-200 p-1.5 rounded">
              <span class="block text-[10px] text-stone-500">SAN 損耗</span>
              <span class="font-bold text-purple-900">{props.tome?.sanLoss}</span>
            </div>
          </div>

          <Show when={props.tome?.spells}>
            <div class="bg-purple-50 p-2 rounded border border-purple-200 text-xs">
              <span class="font-bold text-purple-950">📜 載錄法術：</span>
              <span class="text-purple-900 italic font-mono">{props.tome?.spells}</span>
            </div>
          </Show>

          {/* Mode Selector Tabs */}
          <div class="flex border-b border-parchment-400 gap-2">
            <button
              onClick={() => { setStudyMode('skim'); setStudySuccess(null); setActionLog(''); }}
              class={`pb-2 px-3 text-xs font-bold cursor-pointer border-b-2 transition ${
                studyMode() === 'skim'
                  ? 'border-sepia-800 text-sepia-900'
                  : 'border-transparent text-sepia-600 hover:text-sepia-900'
              }`}
            >
              📖 階段一：初讀 (Initial Skim)
            </button>
            <button
              onClick={() => { setStudyMode('full'); setStudySuccess(null); setActionLog(''); }}
              class={`pb-2 px-3 text-xs font-bold cursor-pointer border-b-2 transition ${
                studyMode() === 'full'
                  ? 'border-sepia-800 text-sepia-900'
                  : 'border-transparent text-sepia-600 hover:text-sepia-900'
              }`}
            >
              📚 階段二：精讀 (Full Study)
            </button>
          </div>

          {/* Mode Content */}
          <Show when={studyMode() === 'skim'}>
            <div class="space-y-3 bg-parchment-100 p-3 rounded border border-parchment-300 text-xs">
              <p class="leading-relaxed text-sepia-800">
                初讀耗費數小時至數天，調查員快速瀏覽典籍結構與大意，不要求高深語言檢定即可洞悉典籍所涉及的主題與危險。
              </p>
              <div class="flex justify-between items-center bg-parchment-200 p-2 rounded font-mono text-[11px]">
                <span>初讀收益: +1% 克蘇魯神話</span>
                <span class="text-purple-900">理智代價: 1D3 點 SAN</span>
              </div>
              <button
                onClick={executeSkim}
                class="w-full py-2 bg-eldritch-green hover:bg-emerald-700 text-amber-100 font-bold rounded cursor-pointer transition shadow text-xs"
              >
                📖 進行初讀 (Initial Skim)
              </button>
            </div>
          </Show>

          <Show when={studyMode() === 'full'}>
            <div class="space-y-3 bg-parchment-100 p-3 rounded border border-parchment-300 text-xs">
              <p class="leading-relaxed text-sepia-800">
                精讀耗時 {props.tome?.studyTime}。依據核心規則，需進行對應語言檢定。通過後將永久獲取神話知識、重置理智上限並完全習得記載之法術！
              </p>
              
              {/* Language Check Box */}
              <div class="bg-parchment-200 p-2.5 rounded border border-parchment-400 space-y-2">
                <div class="flex justify-between items-center">
                  <div>
                    <span class="font-bold text-sepia-900">
                      🔤 語言檢定: {matchingLanguageSkill()?.name || props.tome?.language}
                    </span>
                    <span class="text-[10px] text-stone-500 block">
                      當前目標值: {languageSkillTarget()}%
                    </span>
                  </div>
                  <button
                    onClick={rollLanguageCheck}
                    class="bg-stone-800 hover:bg-stone-900 text-amber-100 px-2.5 py-1 rounded text-xs font-bold cursor-pointer transition shadow-xs"
                  >
                    🎲 檢定 1D100
                  </button>
                </div>

                <Show when={langRollResult()}>
                  <div class={`p-1.5 rounded font-mono font-bold text-[11px] text-center ${
                    langRollResult()?.success
                      ? 'bg-green-100 text-green-900 border border-green-300'
                      : 'bg-red-100 text-red-900 border border-red-300'
                  }`}>
                    {langRollResult()?.text}
                  </div>
                </Show>
              </div>

              <button
                onClick={executeFullStudy}
                disabled={langRollResult() && !langRollResult()?.success}
                class={`w-full py-2 font-bold rounded cursor-pointer transition shadow text-xs ${
                  langRollResult() && !langRollResult()?.success
                    ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                    : 'bg-eldritch-purple hover:bg-purple-900 text-amber-100'
                }`}
              >
                📚 執行精讀並頓悟神話知識
              </button>
            </div>
          </Show>

          {/* Action Result Log */}
          <Show when={studySuccess()}>
            <div class="p-3 bg-amber-50 border border-amber-300 rounded space-y-2">
              <p class="text-xs text-amber-950 font-bold leading-relaxed">{actionLog()}</p>
              <div class="flex justify-end gap-2">
                <button
                  onClick={copyLogToClipboard}
                  class="bg-parchment-200 hover:bg-parchment-300 text-sepia-900 text-xs px-2.5 py-1 rounded font-bold cursor-pointer transition"
                >
                  📋 複製成果日誌
                </button>
                <button
                  onClick={props.onClose}
                  class="bg-stone-800 hover:bg-stone-900 text-amber-100 text-xs px-3 py-1 rounded font-bold cursor-pointer transition"
                >
                  完成
                </button>
              </div>
            </div>
          </Show>

          <Show when={!studySuccess()}>
            <div class="flex justify-end pt-2 border-t border-parchment-300">
              <button
                onClick={props.onClose}
                class="px-3 py-1.5 rounded text-xs font-bold bg-parchment-300 hover:bg-parchment-400 text-sepia-900 cursor-pointer"
              >
                關閉
              </button>
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
};
