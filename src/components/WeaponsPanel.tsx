import { Component, createSignal, For, Show } from 'solid-js';
import {
  activeChar,
  setActiveChar,
  buildAndDB,
  formatDiceCommand,
} from '../stores/characterStore';
import type { WeaponItem } from '../types/investigator';

export const WeaponsPanel: Component = () => {
  const [targetBuild, setTargetBuild] = createSignal(1);

  const myBuild = () => buildAndDB().build;
  const buildDiff = () => targetBuild() - myBuild();

  const maneuverResult = () => {
    const diff = buildDiff();
    if (diff <= 0) return { text: '常規判定 (無需懲罰骰，0P)', color: 'text-green-900 bg-green-100 border-green-300' };
    if (diff === 1) return { text: '承受 1 顆懲罰骰 (-1P)', color: 'text-amber-900 bg-amber-100 border-amber-300' };
    if (diff === 2) return { text: '承受 2 顆懲罰骰 (-2P)', color: 'text-orange-900 bg-orange-100 border-orange-300' };
    return { text: '⚠️ 目標體格大於我方 3 點以上，無法對其實施抓抱/壓制等物理戰技！', color: 'text-red-950 bg-red-100 border-red-300' };
  };

  const getSkillValue = (skillName: string): number => {
    const found = activeChar.skills.find((s) => s.name.includes(skillName) || skillName.includes(s.name.split('（')[0]));
    return found ? found.total : 50;
  };

  const handleFireWeapon = (weapon: WeaponItem) => {
    if (weapon.maxAmmo > 0 && weapon.currentAmmo <= 0) {
      alert(`⚠️ 【${weapon.name}】彈匣已空！請先點擊「填彈 (Reload)」！`);
      return;
    }
    if (weapon.maxAmmo > 0) {
      setActiveChar('weapons', (w) => w.id === weapon.id, 'currentAmmo', (c) => Math.max(0, c - 1));
    }
    const skillVal = getSkillValue(weapon.skillName);
    const cmd = formatDiceCommand(weapon.skillName, skillVal);
    navigator.clipboard.writeText(cmd);
    alert(`💥 【${weapon.name}】開火！\n${weapon.maxAmmo > 0 ? `剩餘彈藥: ${weapon.currentAmmo - 1}/${weapon.maxAmmo}\n` : ''}已複製攻擊檢定指令: ${cmd}`);
  };

  const handleReloadWeapon = (weapon: WeaponItem) => {
    setActiveChar('weapons', (w) => w.id === weapon.id, 'currentAmmo', weapon.maxAmmo);
  };

  const handleCopyDamage = (weapon: WeaponItem) => {
    let dmg = weapon.damage;
    if (dmg.includes('+DB')) {
      const dbStr = buildAndDB().db;
      dmg = dbStr === '0' ? dmg.replace('+DB', '') : dmg.replace('+DB', `+${dbStr}`);
    }
    const cmd = `.r ${dmg} ${weapon.name} 命中傷害`;
    navigator.clipboard.writeText(cmd);
    alert(`✅ 已複製傷害擲骰指令: ${cmd}`);
  };

  return (
    <div class="space-y-4">
      {/* 1. Weapons Armory Section */}
      <div class="bg-parchment-50 rounded border border-parchment-400 p-4 shadow-sm">
        <div class="flex justify-between items-center pb-3 border-b border-parchment-300 mb-3">
          <div>
            <h3 class="font-title font-bold text-sepia-900 text-sm flex items-center gap-1.5">
              <span>⚔️ 戰鬥軍械庫與隨身武裝 ({activeChar.weapons?.length || 0})</span>
            </h3>
            <p class="text-[11px] text-sepia-700">
              包含傷害、射程、射速、彈藥消耗與故障值
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <For each={activeChar.weapons}>
            {(weapon) => {
              const skillVal = () => getSkillValue(weapon.skillName);
              const computedDmg = () => {
                let d = weapon.damage;
                if (d.includes('+DB')) {
                  const dbStr = buildAndDB().db;
                  return dbStr === '0' ? d.replace('+DB', '') : d.replace('+DB', `${dbStr.startsWith('+') ? '' : '+'}${dbStr}`);
                }
                return d;
              };

              return (
                <div class="p-3 bg-parchment-100 rounded border border-parchment-300 shadow-xs flex flex-col justify-between">
                  <div>
                    <div class="flex justify-between items-start">
                      <h4 class="font-bold text-xs text-sepia-900">{weapon.name}</h4>
                      <span class="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                        {skillVal()}% 技能
                      </span>
                    </div>

                    <div class="grid grid-cols-3 gap-1 my-2 text-[10px] text-center font-mono">
                      <div class="bg-parchment-200 p-1 rounded">
                        <span class="block text-stone-500">基礎傷害</span>
                        <span class="font-bold text-red-900">{computedDmg()}</span>
                      </div>
                      <div class="bg-parchment-200 p-1 rounded">
                        <span class="block text-stone-500">有效射程</span>
                        <span class="font-bold">{weapon.range}</span>
                      </div>
                      <div class="bg-parchment-200 p-1 rounded">
                        <span class="block text-stone-500">每輪次數</span>
                        <span class="font-bold">{weapon.attacksPerRound}</span>
                      </div>
                    </div>

                    <Show when={weapon.maxAmmo > 0}>
                      <div class="flex items-center justify-between text-xs font-mono font-bold bg-stone-100 p-1.5 rounded border border-stone-300 my-1.5">
                        <span class="text-stone-700">彈匣容量:</span>
                        <div class="flex items-center gap-1.5">
                          <span class={`text-sm ${weapon.currentAmmo === 0 ? 'text-red-600 animate-pulse' : 'text-stone-900'}`}>
                            {weapon.currentAmmo} / {weapon.maxAmmo} 發
                          </span>
                          <button
                            onClick={() => handleReloadWeapon(weapon)}
                            class="bg-stone-700 hover:bg-stone-800 text-white text-[10px] px-1.5 py-0.5 rounded cursor-pointer"
                          >
                            裝填
                          </button>
                        </div>
                      </div>
                    </Show>

                    <p class="text-[11px] text-sepia-700 italic mt-1">
                      {weapon.notes}
                    </p>
                  </div>

                  {/* Weapon Actions */}
                  <div class="flex items-center gap-2 mt-3 pt-2 border-t border-parchment-300">
                    <button
                      onClick={() => handleFireWeapon(weapon)}
                      class="flex-1 bg-red-900 hover:bg-red-800 text-white text-xs py-1 rounded font-bold cursor-pointer transition shadow-xs"
                    >
                      💥 判定攻擊
                    </button>
                    <button
                      onClick={() => handleCopyDamage(weapon)}
                      class="bg-eldritch-gold hover:bg-amber-600 text-stone-900 text-xs px-2.5 py-1 rounded font-bold cursor-pointer transition shadow-xs"
                      title="複製傷害擲骰指令"
                    >
                      🎲 擲傷害
                    </button>
                  </div>
                </div>
              );
            }}
          </For>
        </div>
      </div>

      {/* 2. Fighting Maneuvers & Build Comparator */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Build Comparator */}
        <div class="p-4 bg-parchment-100 rounded border border-parchment-400 shadow-sm">
          <h4 class="font-title font-bold text-sepia-900 text-xs flex items-center gap-1.5 border-b border-parchment-300 pb-2 mb-3">
            <span>🥋 戰術戰技體格比對器 (Fighting Maneuver Build Comparator)</span>
          </h4>
          <div class="grid grid-cols-3 gap-2 text-center text-xs mb-3 font-mono">
            <div class="bg-parchment-200 p-2 rounded">
              <span class="block text-stone-600 text-[10px]">我方體格</span>
              <span class="text-base font-bold text-sepia-900">{myBuild()}</span>
            </div>
            <div class="bg-parchment-200 p-2 rounded">
              <span class="block text-stone-600 text-[10px]">目標體格</span>
              <div class="flex items-center justify-center gap-1 mt-0.5">
                <button
                  onClick={() => setTargetBuild((b) => Math.max(-2, b - 1))}
                  class="w-5 h-5 bg-sepia-800 text-white rounded font-bold cursor-pointer text-xs"
                >
                  -
                </button>
                <span class="text-base font-bold text-sepia-900 w-6 text-center">{targetBuild()}</span>
                <button
                  onClick={() => setTargetBuild((b) => Math.min(6, b + 1))}
                  class="w-5 h-5 bg-sepia-800 text-white rounded font-bold cursor-pointer text-xs"
                >
                  +
                </button>
              </div>
            </div>
            <div class="bg-parchment-200 p-2 rounded">
              <span class="block text-stone-600 text-[10px]">體格差距</span>
              <span class="text-base font-bold text-sepia-900">{buildDiff()}</span>
            </div>
          </div>
          <div class={`p-2 rounded text-xs font-bold border text-center ${maneuverResult().color}`}>
            {maneuverResult().text}
          </div>
          <p class="text-[10px] text-sepia-700 mt-2 leading-tight">
            規則說明：戰技包含繳械、摔絆、搶抱、擒拿。我方可消耗本輪近戰動作宣告實施。
          </p>
        </div>

        {/* Firearms Tactical Maneuvers Cheat Sheet */}
        <div class="p-4 bg-parchment-100 rounded border border-parchment-400 shadow-sm text-xs">
          <h4 class="font-title font-bold text-sepia-900 text-xs flex items-center gap-1.5 border-b border-parchment-300 pb-2 mb-2">
            <span>🔫 槍械戰術動作速查 (Firearm Maneuvers · Companion p.68)</span>
          </h4>
          <ul class="space-y-1.5 text-[11px] text-sepia-900 leading-snug">
            <li>
              <strong class="text-amber-900">近身射擊 (Point-Blank)</strong>：目標距離 ≤ DEX/5 呎（約 {Math.floor((activeChar.characteristics.DEX || 60) / 5)} 呎）內，射擊獲得 <strong>+1 獎勵骰</strong>！
            </li>
            <li>
              <strong class="text-amber-900">槍口命令 (Hold at Gunpoint)</strong>：持已準備槍械指著目標保留先攻，目標若試圖動作立即搶先射擊！
            </li>
            <li>
              <strong class="text-amber-900">製造恐慌 (Cause Panic)</strong>：於公共場合鳴槍，迫使人群潰散或目標進行意志/理智判定。
            </li>
            <li>
              <strong class="text-amber-900">圍攻加成 (Outnumbered)</strong>：目標同輪內反擊或閃避過一次後，後續所有近戰攻擊者獲得 <strong>+1 獎勵骰</strong>！
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
