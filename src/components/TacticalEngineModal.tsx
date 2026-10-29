import { Component, createSignal, Show, createMemo, For } from 'solid-js';
import { activeChar, moveRate, buildAndDB, formatDiceCommand } from '../stores/characterStore';

interface TacticalEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OBSTACLES = [
  { name: '翻越鐵絲網與磚牆', skill: '攀爬 (Climb)', defaultSkillId: 'sk_climb', targetFallback: 20, desc: '兩米高鐵網，失敗將割傷手掌並損失 1 次移動行動。' },
  { name: '狹窄暗巷雜物穿梭', skill: '敏捷 (DEX)', defaultSkillId: 'DEX', targetFallback: 60, desc: '垃圾桶與晾衣繩阻隔，需敏捷側身穿過。' },
  { name: '橫越鬧區擁擠人潮', skill: '格鬥（鬥毆 Brawl）', defaultSkillId: 'sk_brawl', targetFallback: 25, desc: '擠過人群，或以話術/力量推開阻礙。' },
  { name: '急轉彎或濕滑泥沼', skill: '汽車駕駛 (Drive Auto)', defaultSkillId: 'sk_drive', targetFallback: 20, desc: '輪胎或鞋底打滑，失敗將失控衝撞路障。' },
  { name: '縱身躍過斷裂屋頂/深溝', skill: '閃避 (Dodge)', defaultSkillId: 'sk_dodge', targetFallback: 35, desc: '極度危險之躍進，失敗可能墜落承受墜落傷害。' },
];

export const TacticalEngineModal: Component<TacticalEngineModalProps> = (props) => {
  const [activeSubTab, setActiveSubTab] = createSignal<'chase' | 'maneuver'>('chase');

  // --- Chase Engine State ---
  const [adversaryMov, setAdversaryMov] = createSignal<number>(7);
  const [distanceZones, setDistanceZones] = createSignal<number>(2); // 0=caught, 1=near, 2=mid, 3=far, 4=escaped
  const [chaseLog, setChaseLog] = createSignal<string>('');
  const [obstacleRollResult, setObstacleRollResult] = createSignal<{ roll: number; target: number; text: string; success: boolean } | null>(null);

  const investigatorMov = createMemo(() => moveRate());

  const movDifference = createMemo(() => investigatorMov() - adversaryMov());

  const speedAdvantageText = createMemo(() => {
    const diff = movDifference();
    if (diff > 0) {
      return `🌟 調查員速度更快 (+${diff} MOV)！每輪擁有額外 ${diff} 次移動/障礙穿越行動！`;
    } else if (diff < 0) {
      return `⚠️ 對手速度更快 (${diff} MOV)！對手每輪擁有額外 ${Math.abs(diff)} 次追逐行動！`;
    }
    return `⚖️ 雙方速度勢均力敵 (皆為 MOV ${investigatorMov()})，每輪常規各 1 次行動！`;
  });

  // --- Combat Maneuver State ---
  const [targetBuild, setTargetBuild] = createSignal<number>(1);
  const [isPointBlank, setIsPointBlank] = createSignal<boolean>(false);
  const [isOutnumbered, setIsOutnumbered] = createSignal<boolean>(false);
  const [isSurprise, setIsSurprise] = createSignal<boolean>(false);

  const investigatorBuild = createMemo(() => buildAndDB().build);

  const buildDifference = createMemo(() => targetBuild() - investigatorBuild());

  const maneuverAssessment = createMemo(() => {
    const diff = buildDifference();
    if (diff >= 3) {
      return {
        status: 'impossible',
        title: '🚫 體格相差懸殊：戰技無效 (Impossible)',
        desc: `目標體格 (${targetBuild()}) 超出調查員 (${investigatorBuild()}) 達 3 點以上！依據第七版核心規則 p.105，任何壓制、摔絆、擒抱均無法實施！只能常規徒手傷害！`,
        class: 'bg-red-950 text-white border-red-700',
      };
    }
    if (diff === 2) {
      return {
        status: 'hard',
        title: '⚠️ 體格落後 2 級：-2 懲罰骰 (2 Penalty Dice)',
        desc: '實施摔絆、奪械或擒拿時需額外擲 2 顆十位數懲罰骰取最差結果！',
        class: 'bg-amber-100 text-amber-950 border-amber-300',
      };
    }
    if (diff === 1) {
      return {
        status: 'penalty',
        title: '⚠️ 體格落後 1 級：-1 懲罰骰 (1 Penalty Die)',
        desc: '實施摔絆、奪械或擒拿時需額外擲 1 顆十位數懲罰骰取最差結果！',
        class: 'bg-amber-50 text-amber-900 border-amber-200',
      };
    }
    return {
      status: 'normal',
      title: '✅ 體格對等或優勢：常規戰技檢定 (Standard)',
      desc: '無體格懲罰骰，常規擲格鬥檢定即可實施奪械、推倒或制伏！',
      class: 'bg-green-100 text-green-950 border-green-300',
    };
  });

  // Roll Obstacle Test
  const handleRollObstacle = (obs: typeof OBSTACLES[0]) => {
    let target = obs.targetFallback;
    if (obs.defaultSkillId === 'DEX') {
      target = activeChar.characteristics.DEX || 60;
    } else {
      const s = activeChar.skills.find((sk) => sk.id === obs.defaultSkillId || sk.name.includes(obs.skill.split(' ')[0]));
      if (s) target = s.total;
    }

    const roll = Math.floor(Math.random() * 100) + 1;
    const fumble = target < 50 ? 96 : 100;
    const isSuccess = roll <= target && roll < fumble;

    let text = '';
    if (roll === 1) text = `🌟 障礙穿越大成功 (01)！敏捷流暢地越過【${obs.name}】！`;
    else if (roll >= fumble) text = `💀 障礙大失敗 (${roll})！猛烈摔倒並拉近距離！`;
    else if (roll <= Math.floor(target / 5)) text = `🟣 極限成功 (${roll} <= ${Math.floor(target / 5)})！驚險躍過並大幅拉開距離！`;
    else if (roll <= target) text = `🟢 常規成功 (${roll} <= ${target})！順利跨越障礙！`;
    else text = `❌ 檢定失敗 (${roll} > ${target})！在【${obs.name}】前受阻停滯！`;

    setObstacleRollResult({ roll, target, text, success: isSuccess });

    if (isSuccess) {
      setDistanceZones((prev) => Math.min(4, prev + 1));
      setChaseLog(`🏃【${obs.name} 順利穿越】${text} 距離拉開至第 ${distanceZones()} 區間！`);
    } else {
      setDistanceZones((prev) => Math.max(0, prev - 1));
      setChaseLog(`⚠️【${obs.name} 遭遇阻礙】${text} 對手逼近！距離縮短至第 ${distanceZones()} 區間！`);
    }
  };

  const copyChaseStatus = () => {
    const text = `🏃【${activeChar.investigator.name} 追逐戰況】
速度指標: 調查員 MOV ${investigatorMov()} vs 對手 MOV ${adversaryMov()} (${speedAdvantageText()})
追逐距離: 第 ${distanceZones()} 區間 (${distanceZones() === 0 ? '💥 已被逮獲交鋒！' : distanceZones() >= 4 ? '🎉 成功脫逃甩開！' : '追擊進行中'})
戰況日誌: ${chaseLog() || '追逐正在劇烈上演中！'}`;
    navigator.clipboard.writeText(text);
    alert('✅ 已複製追逐戰況至剪貼簿！');
  };

  const copyManeuverStatus = () => {
    const text = `🥊【${activeChar.investigator.name} 戰鬥戰技裁決】
體格對比: 調查員 Build ${investigatorBuild()} vs 目標 Build ${targetBuild()} (差額: ${buildDifference()})
戰技裁定: ${maneuverAssessment().title}
戰術環境: ${isPointBlank() ? '🎯 零距離射擊 (+1 獎勵骰，目標無法閃避) | ' : ''}${isOutnumbered() ? '⚠️ 人數劣勢 (-1 懲罰骰) | ' : ''}${isSurprise() ? '⚡ 突襲伏擊 (目標首輪無法反擊)' : '常規戰鬥'}`;
    navigator.clipboard.writeText(text);
    alert('✅ 已複製戰技戰術裁定至剪貼簿！');
  };

  return (
    <Show when={props.isOpen}>
      <div class="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-xs">
        <div class="bg-[#FAF5EB] p-5 rounded-lg max-w-lg w-full vintage-border shadow-2xl space-y-4 text-sepia-900">
          {/* Header */}
          <div class="flex justify-between items-start border-b border-sepia-800 pb-2.5">
            <div>
              <span class="text-[10px] uppercase font-bold tracking-wider text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                ⚔️ 官方戰術與追逐運算儀 (Core Ch. 7 & Companion p.20)
              </span>
              <h3 class="text-base font-title font-bold text-sepia-900 mt-1">
                戰術指揮終端
              </h3>
            </div>
            <button
              onClick={props.onClose}
              class="text-sepia-600 hover:text-sepia-900 text-lg font-bold cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Sub Tab Navigation */}
          <div class="flex border-b border-parchment-400 gap-2">
            <button
              onClick={() => setActiveSubTab('chase')}
              class={`pb-2 px-3 text-xs font-bold cursor-pointer border-b-2 transition ${
                activeSubTab() === 'chase'
                  ? 'border-sepia-800 text-sepia-900'
                  : 'border-transparent text-sepia-600 hover:text-sepia-900'
              }`}
            >
              🏃 追逐規則運算 (Chases)
            </button>
            <button
              onClick={() => setActiveSubTab('maneuver')}
              class={`pb-2 px-3 text-xs font-bold cursor-pointer border-b-2 transition ${
                activeSubTab() === 'maneuver'
                  ? 'border-sepia-800 text-sepia-900'
                  : 'border-transparent text-sepia-600 hover:text-sepia-900'
              }`}
            >
              🥊 戰技體格與戰術加值 (Maneuvers)
            </button>
          </div>

          {/* TAB 1: CHASES */}
          <Show when={activeSubTab() === 'chase'}>
            <div class="space-y-3">
              {/* MOV Comparison Row */}
              <div class="grid grid-cols-2 gap-2 bg-parchment-100 p-2.5 rounded border border-parchment-300 text-xs">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-sepia-900">🏃 調查員 MOV:</span>
                  <span class="font-mono font-black text-sm text-green-900 bg-green-50 px-2 py-0.5 rounded border border-green-200">
                    {investigatorMov()}
                  </span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-bold text-sepia-900">🏃 對手 MOV:</span>
                  <input
                    type="number"
                    min="1"
                    max="15"
                    value={adversaryMov()}
                    onInput={(e) => setAdversaryMov(parseInt(e.currentTarget.value) || 7)}
                    class="w-14 text-center font-mono font-bold bg-white border border-parchment-400 rounded px-1 py-0.5 text-xs text-red-900"
                  />
                </div>
              </div>

              {/* Speed Advantage Notice */}
              <div class="p-2 bg-parchment-200 rounded border border-parchment-400 text-xs text-sepia-900 font-bold leading-relaxed text-center">
                {speedAdvantageText()}
              </div>

              {/* Distance Zone Track */}
              <div class="bg-parchment-100 p-2.5 rounded border border-parchment-300 text-xs space-y-1.5">
                <div class="flex justify-between items-center font-bold">
                  <span>追逐距離進度 (Zones):</span>
                  <span class="font-mono text-purple-900">
                    {distanceZones() === 0 && '💥 0 區間 (逮獲/近身交鋒！)'}
                    {distanceZones() === 1 && '⚠️ 1 區間 (近在咫尺！)'}
                    {distanceZones() === 2 && '🏃 2 區間 (視野追逐)'}
                    {distanceZones() === 3 && '🌲 3 區間 (拉開距離)'}
                    {distanceZones() >= 4 && '🎉 4 區間 (成功脫逃！)'}
                  </span>
                </div>
                {/* Visual Track */}
                <div class="grid grid-cols-5 gap-1 text-center font-mono text-[10px] font-bold">
                  <div class={`p-1 rounded border ${distanceZones() === 0 ? 'bg-red-800 text-white border-red-900' : 'bg-parchment-200 text-stone-600'}`}>0: 逮獲</div>
                  <div class={`p-1 rounded border ${distanceZones() === 1 ? 'bg-amber-600 text-white border-amber-700' : 'bg-parchment-200 text-stone-600'}`}>1: 迫近</div>
                  <div class={`p-1 rounded border ${distanceZones() === 2 ? 'bg-yellow-500 text-stone-900 border-yellow-600' : 'bg-parchment-200 text-stone-600'}`}>2: 中距</div>
                  <div class={`p-1 rounded border ${distanceZones() === 3 ? 'bg-blue-600 text-white border-blue-700' : 'bg-parchment-200 text-stone-600'}`}>3: 遠距</div>
                  <div class={`p-1 rounded border ${distanceZones() >= 4 ? 'bg-green-700 text-white border-green-800' : 'bg-parchment-200 text-stone-600'}`}>4: 脫逃</div>
                </div>
              </div>

              {/* Obstacle Generator */}
              <div class="bg-parchment-100 p-2.5 rounded border border-parchment-300 text-xs space-y-1.5">
                <span class="font-bold text-sepia-900 block">🚧 遭遇隨機路障與險阻 (點擊進行判定):</span>
                <div class="space-y-1">
                  <For each={OBSTACLES}>
                    {(obs) => (
                      <div class="flex items-center justify-between p-1.5 bg-parchment-200 rounded text-[11px]">
                        <div>
                          <span class="font-bold text-sepia-900">{obs.name}</span>
                          <span class="text-stone-500 text-[10px] block">檢定: {obs.skill}</span>
                        </div>
                        <button
                          onClick={() => handleRollObstacle(obs)}
                          class="bg-stone-800 hover:bg-stone-900 text-amber-100 px-2 py-1 rounded font-bold cursor-pointer transition shadow-xs text-[10px]"
                        >
                          🎲 突破檢定
                        </button>
                      </div>
                    )}
                  </For>
                </div>
              </div>

              {/* Chase Log */}
              <Show when={chaseLog()}>
                <div class="p-2 bg-amber-50 rounded border border-amber-300 text-xs font-bold text-amber-950">
                  {chaseLog()}
                </div>
              </Show>

              <div class="flex justify-between items-center pt-2 border-t border-parchment-300">
                <button
                  onClick={copyChaseStatus}
                  class="bg-eldritch-gold hover:bg-amber-600 text-stone-900 text-xs px-3 py-1.5 rounded font-bold cursor-pointer transition shadow-xs"
                >
                  📋 複製追逐戰報
                </button>
                <button
                  onClick={props.onClose}
                  class="bg-stone-800 hover:bg-stone-900 text-amber-100 text-xs px-4 py-1.5 rounded font-bold cursor-pointer transition shadow-xs"
                >
                  完成
                </button>
              </div>
            </div>
          </Show>

          {/* TAB 2: COMBAT MANEUVERS */}
          <Show when={activeSubTab() === 'maneuver'}>
            <div class="space-y-3">
              {/* Build Comparison Configuration */}
              <div class="bg-parchment-100 p-2.5 rounded border border-parchment-300 text-xs space-y-2">
                <div class="grid grid-cols-2 gap-2">
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-sepia-900">🥊 調查員體格:</span>
                    <span class="font-mono font-black text-sm text-sepia-900 bg-parchment-200 px-2 py-0.5 rounded">
                      {investigatorBuild()}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="font-bold text-sepia-900">🥊 目標對手體格:</span>
                    <input
                      type="number"
                      min="-2"
                      max="6"
                      value={targetBuild()}
                      onInput={(e) => setTargetBuild(parseInt(e.currentTarget.value) || 0)}
                      class="w-14 text-center font-mono font-bold bg-white border border-parchment-400 rounded px-1 py-0.5 text-xs text-red-900"
                    />
                  </div>
                </div>

                {/* Maneuver Penalty Result Alert */}
                <div class={`p-2.5 rounded border text-xs leading-relaxed ${maneuverAssessment().class}`}>
                  <p class="font-bold">{maneuverAssessment().title}</p>
                  <p class="text-[11px] mt-0.5">{maneuverAssessment().desc}</p>
                </div>
              </div>

              {/* Tactical Modifiers */}
              <div class="bg-parchment-100 p-2.5 rounded border border-parchment-300 text-xs space-y-2">
                <span class="font-bold text-sepia-900 block">🎯 官方戰術修正條件 (Core p.108-113):</span>
                <div class="space-y-1.5">
                  <label class="flex items-center gap-2 cursor-pointer bg-parchment-200 p-1.5 rounded">
                    <input
                      type="checkbox"
                      checked={isPointBlank()}
                      onChange={(e) => setIsPointBlank(e.currentTarget.checked)}
                      class="rounded text-eldritch-green focus:ring-0"
                    />
                    <span class="font-bold text-sepia-900">
                      🎯 零距離射擊 (Point Blank · 距離 ≤ DEX/5 呎): +1 獎勵骰，目標無法閃避！
                    </span>
                  </label>

                  <label class="flex items-center gap-2 cursor-pointer bg-parchment-200 p-1.5 rounded">
                    <input
                      type="checkbox"
                      checked={isOutnumbered()}
                      onChange={(e) => setIsOutnumbered(e.currentTarget.checked)}
                      class="rounded text-red-800 focus:ring-0"
                    />
                    <span class="font-bold text-sepia-900">
                      👥 人數劣勢防禦 (Outnumbered): 防守者連續格擋/反擊時承擔 -1 懲罰骰！
                    </span>
                  </label>

                  <label class="flex items-center gap-2 cursor-pointer bg-parchment-200 p-1.5 rounded">
                    <input
                      type="checkbox"
                      checked={isSurprise()}
                      onChange={(e) => setIsSurprise(e.currentTarget.checked)}
                      class="rounded text-purple-900 focus:ring-0"
                    />
                    <span class="font-bold text-sepia-900">
                      ⚡ 突襲/伏擊 (Surprise Attack): 目標首輪驚愕，無法閃避或進行反擊！
                    </span>
                  </label>
                </div>
              </div>

              {/* Maneuver Summary Card */}
              <div class="p-2 bg-stone-100 rounded border border-stone-300 text-xs font-mono">
                <span class="font-bold text-stone-800">戰技執行指令:</span>
                <p class="text-stone-700 text-[11px] mt-0.5">
                  實施「推倒 / 奪械 / 擒抱」：擲格鬥（鬥毆）對抗目標敏捷或格鬥。
                  {buildDifference() > 0 && buildDifference() < 3 && ` (包含 ${buildDifference()} 顆十位數懲罰骰)`}
                </p>
              </div>

              <div class="flex justify-between items-center pt-2 border-t border-parchment-300">
                <button
                  onClick={copyManeuverStatus}
                  class="bg-eldritch-gold hover:bg-amber-600 text-stone-900 text-xs px-3 py-1.5 rounded font-bold cursor-pointer transition shadow-xs"
                >
                  📋 複製戰術裁決
                </button>
                <button
                  onClick={props.onClose}
                  class="bg-stone-800 hover:bg-stone-900 text-amber-100 text-xs px-4 py-1.5 rounded font-bold cursor-pointer transition shadow-xs"
                >
                  完成
                </button>
              </div>
            </div>
          </Show>
        </div>
      </div>
    </Show>
  );
};
