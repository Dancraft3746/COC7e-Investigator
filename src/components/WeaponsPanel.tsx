import { Component, createSignal, For, Show } from 'solid-js';
import {
  activeChar,
  setActiveChar,
  buildAndDB,
  formatDiceCommand,
  majorWoundThreshold,
} from '../stores/characterStore';
import type { WeaponItem } from '../types/investigator';
import { TacticalEngineModal } from './TacticalEngineModal';

const HISTORICAL_WEAPONS: Omit<WeaponItem, 'id'>[] = [
  {
    name: '湯普森 .45 衝鋒槍 (Tommy Gun)',
    skillName: '射擊（衝鋒槍 SMG）',
    damage: '1D10+2',
    range: '20 米',
    attacksPerRound: '1(3) 或全自動連射',
    currentAmmo: 50,
    maxAmmo: 50,
    malfunction: 96,
    notes: '「芝加哥打字機」，50 發彈鼓，可實施連射掃射壓制',
  },
  {
    name: '12號口徑雙管霰彈獵槍 (Shotgun)',
    skillName: '射擊（步槍/霰彈槍）',
    damage: '4D6/2D6/1D6',
    range: '10/20/50 米',
    attacksPerRound: '1 或 2',
    currentAmmo: 2,
    maxAmmo: 2,
    malfunction: 100,
    notes: '近距離 (10米內) 4D6 毀滅性面殺傷；20米內 2D6；50米內 1D6',
  },
  {
    name: '柯爾特 M1911 .45 半自動手槍',
    skillName: '射擊（手槍 Handgun）',
    damage: '1D10+2',
    range: '15 米',
    attacksPerRound: '1(3)',
    currentAmmo: 7,
    maxAmmo: 7,
    malfunction: 100,
    notes: '美軍制式手槍，強大制止力，穿刺武器',
  },
  {
    name: '炸藥棒 (Dynamite Stick · Core p.114)',
    skillName: '投擲 (Throw)',
    damage: '4D10 (3碼半徑)',
    range: 'STR/5 米 (投擲)',
    attacksPerRound: '1/2',
    currentAmmo: 1,
    maxAmmo: 1,
    malfunction: 99,
    notes: '3碼半徑內4D10；每遠離3碼傷害減半；地下室或密閉空間傷害翻倍！',
  },
  {
    name: '莫洛托夫燃燒瓶 (Molotov Cocktail)',
    skillName: '投擲 (Throw)',
    damage: '2D6 + 持續燃燒',
    range: 'STR/5 米 (投擲)',
    attacksPerRound: '1/2',
    currentAmmo: 1,
    maxAmmo: 1,
    malfunction: 95,
    notes: '爆發半徑 2 米，著火目標每輪承受 1D6 燃燒傷害直至撲滅',
  },
  {
    name: '紳士重型手杖 / 狼牙短棍 (Heavy Cane)',
    skillName: '格鬥（鬥毆 Brawl）',
    damage: '1D6+DB',
    range: '觸碰 (Touch)',
    attacksPerRound: '1',
    currentAmmo: 0,
    maxAmmo: 0,
    malfunction: 100,
    notes: '優雅隨身防身武器，鈍擊傷害',
  },
];

export const WeaponsPanel: Component = () => {
  const [targetBuild, setTargetBuild] = createSignal(1);
  const [showArmoryModal, setShowArmoryModal] = createSignal(false);
  const [showTacticalModal, setShowTacticalModal] = createSignal(false);

  // Tactical Armor & Cover Damage Absorber
  const [incomingDmg, setIncomingDmg] = createSignal(0);
  const [armorType, setArmorType] = createSignal<number>(1); // 1 = thick coat
  const [coverType, setCoverType] = createSignal<number>(0); // 0 = none

  const totalAbsorption = () => armorType() + coverType();
  const netDamage = () => Math.max(0, incomingDmg() - totalAbsorption());

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

  const handleApplyAbsorbedDamage = () => {
    const dmg = netDamage();
    if (dmg <= 0) {
      alert('🛡️ 護甲與掩體完全吸收了本次攻擊傷害！HP 未受到扣減！');
      return;
    }
    const currentHP = activeChar.investigator.hp;
    const nextHP = Math.max(0, currentHP - dmg);
    const threshold = majorWoundThreshold();

    setActiveChar('investigator', 'hp', nextHP);

    if (dmg >= threshold) {
      setActiveChar('investigator', 'majorWound', true);
      alert(`🩸 受到 ${dmg} 點淨傷害 (吸收 ${totalAbsorption()} 點)！\n傷害達到重傷線 (≥${threshold}點)，已自動標記【重傷 (Major Wound)】！當前 HP: ${nextHP}`);
    } else {
      alert(`💥 受到 ${dmg} 點淨傷害 (護甲掩體吸收 ${totalAbsorption()} 點)！當前 HP: ${nextHP}`);
    }
    setIncomingDmg(0);
  };

  const handleAddWeapon = (item: Omit<WeaponItem, 'id'>) => {
    const newWeapon: WeaponItem = {
      ...item,
      id: `wp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    };
    setActiveChar('weapons', (prev) => [...prev, newWeapon]);
    setShowArmoryModal(false);
  };

  const handleRemoveWeapon = (id: string) => {
    setActiveChar('weapons', (prev) => prev.filter((w) => w.id !== id));
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
          <div class="flex items-center gap-2">
            <button
              onClick={() => setShowTacticalModal(true)}
              class="bg-red-950 hover:bg-black text-amber-100 px-3 py-1.5 rounded text-xs font-bold shadow flex items-center gap-1 cursor-pointer transition font-title"
              title="開啟官方第七版追逐規則運算儀與體格戰技對抗器"
            >
              <span>🏃 追逐與戰技對抗器</span>
            </button>
            <button
              onClick={() => setShowArmoryModal(true)}
              class="bg-eldritch-gold hover:bg-yellow-500 text-stone-950 px-3 py-1.5 rounded text-xs font-bold shadow flex items-center gap-1 cursor-pointer transition font-title"
            >
              <span>➕ 添購歷史武器</span>
            </button>
          </div>
        </div>

        {/* Weapons Grid */}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          <For each={activeChar.weapons}>
            {(weapon) => {
              const skillVal = () => getSkillValue(weapon.skillName);

              return (
                <div class="p-3 bg-parchment-100 rounded border border-parchment-300 shadow-xs flex flex-col justify-between">
                  <div>
                    <div class="flex justify-between items-start">
                      <h4 class="font-bold text-xs text-sepia-900">{weapon.name}</h4>
                      <div class="flex items-center gap-1">
                        <span class="text-[10px] font-mono font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded border border-amber-300">
                          {skillVal()}% 技能
                        </span>
                        <button
                          onClick={() => handleRemoveWeapon(weapon.id)}
                          class="text-stone-400 hover:text-red-700 text-xs px-1 cursor-pointer"
                          title="移除此武器"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    <div class="grid grid-cols-3 gap-1 my-2 text-[10px] text-center font-mono">
                      <div class="bg-parchment-200 p-1 rounded">
                        <span class="block text-stone-500">基礎傷害</span>
                        <span class="font-bold text-red-900">{weapon.damage}</span>
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

                    {/* Ammo Tracker */}
                    <Show when={weapon.maxAmmo > 0}>
                      <div class="flex items-center justify-between text-xs font-mono font-bold bg-stone-100 p-1.5 rounded border border-stone-300 my-1.5">
                        <span class="text-stone-700">彈匣容量:</span>
                        <div class="flex items-center gap-1.5">
                          <span
                            class={`text-sm ${
                              weapon.currentAmmo === 0
                                ? 'text-red-600 animate-pulse font-black'
                                : 'text-stone-900'
                            }`}
                          >
                            {weapon.currentAmmo} / {weapon.maxAmmo} 發
                          </span>
                          <button
                            onClick={() => handleReloadWeapon(weapon)}
                            class="bg-stone-700 hover:bg-stone-800 text-white text-[10px] px-1.5 py-0.5 rounded cursor-pointer transition"
                          >
                            裝填
                          </button>
                        </div>
                      </div>
                    </Show>

                    <p class="text-[11px] text-sepia-700 italic mt-1">{weapon.notes}</p>
                  </div>

                  {/* Weapon Actions */}
                  <div class="flex items-center gap-2 mt-3 pt-2 border-t border-parchment-300">
                    <button
                      onClick={() => handleFireWeapon(weapon)}
                      class="flex-1 bg-red-900 hover:bg-red-800 text-white text-xs py-1 rounded font-bold cursor-pointer transition shadow-xs flex items-center justify-center gap-1"
                    >
                      <span>💥 判定攻擊</span>
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

      {/* 2. Tactical Armor & Damage Absorption Engine */}
      <div class="p-4 bg-parchment-50 rounded border border-parchment-400 shadow-sm space-y-3">
        <div class="flex justify-between items-center border-b border-parchment-300 pb-2">
          <h4 class="font-title font-bold text-sepia-900 text-xs flex items-center gap-1.5">
            <span>🛡️ 護甲防具與戰術掩體傷害吸收計算器 (Armor & Tactical Cover · Core p.108)</span>
          </h4>
          <span class="text-[11px] font-mono font-bold bg-amber-100 text-amber-950 px-2 py-0.5 rounded border border-amber-300">
            總減傷吸收: {totalAbsorption()} 點
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
          <div>
            <label class="block text-[11px] font-bold text-sepia-700">穿戴防具/護甲：</label>
            <select
              value={armorType()}
              onChange={(e) => setArmorType(Number(e.currentTarget.value))}
              class="w-full bg-parchment-100 border border-parchment-400 rounded p-1 text-xs font-bold mt-1"
            >
              <option value="0">無護甲 (0 點)</option>
              <option value="1">厚皮大衣 / 禦寒粗毛呢 (1 點)</option>
              <option value="2">一戰鋼盔 / 強化頭盔 (2 點)</option>
              <option value="3">厚皮大衣 + 鋼盔組合 (3 點)</option>
              <option value="8">現代凱夫拉防彈背心 (8 點防彈/3 點近戰)</option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-sepia-700">戰術地形掩體：</label>
            <select
              value={coverType()}
              onChange={(e) => setCoverType(Number(e.currentTarget.value))}
              class="w-full bg-parchment-100 border border-parchment-400 rounded p-1 text-xs font-bold mt-1"
            >
              <option value="0">無掩體 / 開闊地 (0 點)</option>
              <option value="2">半掩體：翻倒木桌 / 沙發 (+2 點)</option>
              <option value="4">堅固掩體：磚牆 / 戰壕沙包 (+4 點)</option>
              <option value="8">鋼鐵裝甲板 / 重型掩體 (+8 點)</option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-sepia-700">承受攻擊傷害：</label>
            <input
              type="number"
              min="0"
              placeholder="敵方命中傷害"
              value={incomingDmg() || ''}
              onInput={(e) => setIncomingDmg(Number(e.currentTarget.value))}
              class="w-full text-center bg-parchment-100 border border-parchment-400 rounded p-1 text-xs font-mono font-bold mt-1 text-red-900"
            />
          </div>

          <div class="flex items-end">
            <button
              onClick={handleApplyAbsorbedDamage}
              class="w-full bg-red-900 hover:bg-red-800 text-white py-1.5 rounded text-xs font-bold shadow-xs cursor-pointer transition font-title"
            >
              🩸 結算受傷 (扣 {netDamage()} HP)
            </button>
          </div>
        </div>
      </div>

      {/* 3. Maneuver & Tactics Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fighting Maneuver Comparator */}
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
                  onClick={() => setTargetBuild(Math.max(-2, targetBuild() - 1))}
                  class="w-5 h-5 bg-sepia-800 text-white rounded font-bold cursor-pointer text-xs"
                >
                  -
                </button>
                <span class="text-base font-bold text-sepia-900 w-6 text-center">
                  {targetBuild()}
                </span>
                <button
                  onClick={() => setTargetBuild(targetBuild() + 1)}
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

        {/* Firearm Maneuvers Cheat Sheet */}
        <div class="p-4 bg-parchment-100 rounded border border-parchment-400 shadow-sm text-xs">
          <h4 class="font-title font-bold text-sepia-900 text-xs flex items-center gap-1.5 border-b border-parchment-300 pb-2 mb-2">
            <span>🔫 槍械戰術動作速查 (Firearm Maneuvers · Companion p.68)</span>
          </h4>
          <ul class="space-y-1.5 text-[11px] text-sepia-900 leading-snug">
            <li>
              <strong class="text-amber-900">近身射擊 (Point-Blank)</strong>：目標距離 ≤ DEX/5 呎（約 {Math.floor((activeChar.characteristics.DEX || 50) / 5)} 呎）內，射擊獲得 <strong>+1 獎勵骰</strong>！
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

      {/* Modal: Add from Historical Armory */}
      <Show when={showArmoryModal()}>
        <div class="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div class="bg-[#FAF5EB] max-w-lg w-full rounded-xl vintage-border shadow-2xl p-5 space-y-4 text-sepia-900 animate-in fade-in zoom-in-95 max-h-[85vh] overflow-y-auto">
            <div class="flex justify-between items-center border-b-2 border-sepia-800 pb-2">
              <h3 class="font-title font-bold text-base text-sepia-900 flex items-center gap-1.5">
                <span>⚔️ 官方 1920s 歷史軍械庫選購 (Historical Armory)</span>
              </h3>
              <button
                onClick={() => setShowArmoryModal(false)}
                class="w-6 h-6 rounded bg-stone-800 text-parchment-100 flex items-center justify-center font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div class="space-y-2">
              <For each={HISTORICAL_WEAPONS}>
                {(item) => (
                  <div class="p-3 bg-parchment-100 rounded border border-parchment-300 flex justify-between items-center gap-2">
                    <div>
                      <strong class="text-xs font-title text-sepia-900 block">{item.name}</strong>
                      <span class="text-[11px] font-mono text-stone-700">
                        傷害: {item.damage} • 射程: {item.range} • 故障: {item.malfunction}
                      </span>
                      <p class="text-[10px] text-sepia-700 italic">{item.notes}</p>
                    </div>
                    <button
                      onClick={() => handleAddWeapon(item)}
                      class="bg-eldritch-green hover:bg-opacity-90 text-amber-100 px-3 py-1.5 rounded text-xs font-bold shadow cursor-pointer transition shrink-0"
                    >
                      裝備
                    </button>
                  </div>
                )}
              </For>
            </div>
          </div>
        </div>
      </Show>

      {/* Official Tactical Maneuver & Chase Simulator Modal */}
      <TacticalEngineModal
        isOpen={showTacticalModal()}
        onClose={() => setShowTacticalModal(false)}
      />
    </div>
  );
};
