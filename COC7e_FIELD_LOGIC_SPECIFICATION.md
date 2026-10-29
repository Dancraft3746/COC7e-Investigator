# 密斯卡托尼克大學 · 阿卡姆機密調查員終端
# 調查員終端 APP 全架構與狀態判定核心規範書
# (Investigator Codex App: Comprehensive Architecture & Field Logic Specification)

> **文檔版本**：v3.0 現代化 Web App 獨立終端架構版  
> **制定依據**：
> 1. 《Call of Cthulhu Investigator Handbook & Keeper Rulebook (7th Edition)》官方核心規則書
> 2. 《Call of Cthulhu Keeper's Companion (Revised Edition)》官方守密人夥伴修訂規則（含 480 點分配法、理智大修、震懾 5F 反應、心智質變 Changed、精神錨點、同伴安撫技能）
> 3. Vue 3 響應式雙向可逆狀態機引擎（零依賴、純前端、離線可用、自動記憶、Discord 跑團工作流原生串接）

---

## 目錄 (Table of Contents)
1. [架構設計核心原則 (App Core Architecture Principles)](#1-架構設計核心原則)
2. [資料模型規格 (Data Models & Schemas)](#2-資料模型規格)
3. [衍生屬性與數值計算引擎 (Derived Attributes Engine)](#3-衍生屬性與數值計算引擎)
4. [生理心智即時雙向可逆狀態機 (Vitals & Sanity State Machine)](#4-生理心智即時雙向可逆狀態機)
5. [Discord 跑團工作流整合規範 (Discord Integration Suite)](#5-discord-跑團工作流整合規範)
6. [資料持久化與即時分享生命週期 (Storage & Sharing Lifecycle)](#6-資料持久化與即時分享生命週期)

---

## 1. 架構設計核心原則

### 原則一：狀態判定 100% 雙向即時可逆 (Pure Reactive Bidirectional Engine)
- **過去試算表的痛點**：靜態覆蓋或單向觸發，導致玩家受創改變狀態後，急救或恢復理智時**無法自動恢復為健康狀態**。
- **終端 App 規範**：所有狀態計算（生命、重傷、瀕死、昏迷、理智、震懾、質變）**一律採用 Vue 3 `computed` 計算屬性**。
  - 當 HP 減少或標記重傷時，UI 即時警報瀕死或昏迷；
  - 當 HP 透過急救/醫療上升，或取消重傷標記時，計算屬性**毫秒級自動回退為健康狀態**，永遠不需要手動清理。

### 原則二：多戰役老兵百科級資料承載 (Unlimited Multi-Campaign Scaling)
- 告別二維表格擠壓排版的物理硬傷，採用**動態陣列卡片庫（Dynamic Card Arrays）**。
- 不管調查員歷經多少模組，獲得了 70 門法術、37 部典籍或見過 8 個奈亞拉托提普化身，全部透過分類標籤與關鍵字搜尋引擎流暢收納。

### 原則三：Discord 跑團零阻力整合 (Zero-Friction Discord TRPG Workflow)
- 所有技能與法術內建格式化引擎，支援 `.ra`（Dice! 骰娘）、`cc`（CCFOLIA 骰娘）、`.r 1d100<=`（通用擲骰）。
- 點擊即複製，切換回 Discord 貼上即骰；團後自動生成 KP 專用審核清單。

---

## 2. 資料模型規格 (Data Models & Schemas)

### 2.1 調查員基礎資料 (`investigator`)
```typescript
interface InvestigatorProfile {
  name: string;        // 調查員姓名 (PC Name)
  job: string;         // 職業 (Occupation)
  player: string;      // 操縱玩家 (Player)
  age: number;         // 年齡 (直接影響 MOV 衰老減值)
  gender: string;      // 性別 (男 / 女 / 其他)
  era: string;         // 時代背景 (例如 1920s)
  hp: number;          // 當前生命值 (Current HP)
  mp: number;          // 當前魔法值 (Current MP)
  san: number;         // 當前理智值 (Current Sanity)
  luck: number;        // 當前幸運值 (Current Luck)
  majorWound: boolean; // 是否處於重傷狀態 (Major Wound Flag)
  shock: boolean;      // 震懾餘波 (Shock / 5F 恐慌標記)
  changed: boolean;    // 心智質變 (Changed / 幸運凍結標記)
  special?: string;    // 特殊能力 (如：諾登斯之眼)
}
```

### 2.2 九大基礎特徵值 (`characteristics`)
```typescript
interface Characteristics {
  STR: number; // 力量 (15–99)
  CON: number; // 體質 (15–99)
  DEX: number; // 敏捷 (15–99)
  APP: number; // 外貌 (15–99)
  POW: number; // 意志 (15–99)
  INT: number; // 智力 / 靈感 (15–99)
  SIZ: number; // 體型 (15–99)
  EDU: number; // 教育 (15–99)
}
```

### 2.3 技能樹結構 (`skills`)
```typescript
interface SkillItem {
  name: string;      // 技能名稱 (中英雙語)
  base: number;      // 基礎值
  occ: number;       // 本職配點
  interest: number;  // 興趣配點
  growth: number;    // 團後成長累積點數
  total: number;     // 總值 = base + occ + interest + growth
  checked: boolean;  // 團中是否成功發揮 (成長標記 ☑)
}
```

### 2.4 神話魔典與圖鑑資料 (`tomes`, `spells`, `entities`)
- **典籍 (`tomes`)**：名稱、語言、略讀/精讀進度、理智損失、神話增長、研讀時間、記載法術。
- **法術 (`spells`)**：法術名稱、MP/SAN 消耗、施法時間、出處典籍、法術詳細效果。
- **神話遭遇 (`entities`)**：分類（舊日支配者/眷族/邪教/神器）、實體名稱、化身/別名、戰役筆記。

---

## 3. 衍生屬性與數值計算引擎

### 3.1 基礎衍生公式
1. **最大生命值**：
   $$\text{Max HP} = \lfloor (\text{CON} + \text{SIZ}) / 10 \rfloor$$
2. **重傷線 (Major Wound Threshold)**：
   $$\text{Threshold} = \lfloor \text{Max HP} / 2 \rfloor$$
3. **最大魔法值**：
   $$\text{Max MP} = \lfloor \text{POW} / 5 \rfloor$$
4. **理智上限 (Max Sanity)**：
   $$\text{Max SAN} = 99 - \text{克蘇魯神話技能值}$$
5. **變異質變線 (Changed Threshold)**：
   $$\text{Threshold} = \lfloor \text{POW} / 5 \rfloor$$

### 3.2 移動力（MOV）衰老扣減演算法
```javascript
const moveRate = computed(() => {
  const { STR, DEX, SIZ } = characteristics.value;
  let base = 8;
  if (STR < SIZ && DEX < SIZ) base = 7;
  else if (STR > SIZ && DEX > SIZ) base = 9;

  const age = investigator.value.age;
  let penalty = 0;
  if (age >= 80) penalty = 5;
  else if (age >= 70) penalty = 4;
  else if (age >= 60) penalty = 3;
  else if (age >= 50) penalty = 2;
  else if (age >= 40) penalty = 1;

  return Math.max(1, base - penalty);
});
```

### 3.3 體格（Build）與傷害加值（DB）對照
$$\text{Sum} = \text{STR} + \text{SIZ}$$
- $\text{Sum} < 65 \rightarrow \text{Build} = -2, \text{DB} = -2$
- $\text{Sum} < 85 \rightarrow \text{Build} = -1, \text{DB} = -1$
- $\text{Sum} < 125 \rightarrow \text{Build} = 0, \text{DB} = 0$
- $\text{Sum} < 165 \rightarrow \text{Build} = 1, \text{DB} = +1\text{D}4$
- $\text{Sum} < 205 \rightarrow \text{Build} = 2, \text{DB} = +1\text{D}6$
- $\text{Sum} < 285 \rightarrow \text{Build} = 3, \text{DB} = +2\text{D}6$

---

## 4. 生理心智即時雙向可逆狀態機

### 4.1 生命生理狀態推演邏輯
```javascript
const hpStateText = computed(() => {
  const hp = investigator.value.hp;
  const max = maxHP.value;
  const mw = investigator.value.majorWound;

  if (hp <= -max) return '💀 瞬間致死 (Instant Death)';
  if (hp <= 0 && mw) return '⚠️ 瀕死 (Dying · 每輪CON檢定)';
  if (hp <= 0) return '💤 昏迷 (Unconscious · 1小時甦醒)';
  if (mw) return '🩹 重傷受創 (Major Wound · 休養每週恢復)';
  if (hp < max) return '🤕 輕傷微恙 (Minor Injury · 每日恢復1點)';
  return '💚 健康健全 (Healthy)';
});
```

### 4.2 心智狀態推演邏輯
```javascript
const sanStateText = computed(() => {
  const san = investigator.value.san;
  if (san <= 0) return '💀 永久瘋狂 (SAN歸零 · 退場)';
  if (investigator.value.changed) return '🌀 心智質變 (Changed · 幸運凍結)';
  if (investigator.value.shock) return '⚡ 震懾餘波 (Aftershock · 易生幻覺)';
  if (san < characteristics.value.POW) return `⚠️ 理智受損 (損耗 ${characteristics.value.POW - san} 點)`;
  return '🧠 心智健全 (Sane)';
});
```

---

## 5. Discord 跑團工作流整合規範

### 5.1 骰點指令生成
支援透過單選切換三種跑團常見格式：
1. **Dice! 前綴**：`.ra {技能名稱} {總值}`
2. **CCFOLIA 前綴**：`cc {總值} {技能名稱}`
3. **通用語法**：`.r 1d100<={總值} {技能名稱}`

### 5.2 狀態看板 Rich Embed 文本格式
一鍵複製至剪貼簿，在 Discord 頻道貼上發布：
```text
╭───【 諾曼·諾巴蒂 · 調查員現況面板 】───╮
│ ❤️ HP: 11/11  ✨ MP: 20/20  🧠 SAN: 30/99
│ 🩹 生理: 💚 健康健全 (Healthy)
│ 🌀 心智: 🌀 心智質變 (Changed · 幸運凍結)
│ 🍀 幸運: 52  |  🏃 MOV: 8  |  🥊 DB: 0 (體格 0)
│ 🔫 主要武器: .38 左輪手槍 (60%) 1D10  |  徒手鬥毆 (60%) 1D3
╰──────────────────────────────────────────╯
```

### 5.3 團後成長檢定清單
自動過濾 `checked === true` 之技能，輸出 KP 審核格式：
```text
📋【調查員姓名 團後技能成長檢定清單】
守密人 (KP) 您好，以下為本次模組成功發揮之技能：
----------------------------------------
1. 偵查 / 識破 (目前 70%) ➜ 擲 1D100 > 70 或 ≥96
2. 心理學 (目前 80%) ➜ 擲 1D100 > 80 或 ≥96
----------------------------------------
（通過者請擲 1D10 增長點數！）
```

---

## 6. 資料持久化與即時分享生命週期

### 6.1 自動記憶 (LocalStorage Auto-Save)
- 任何欄位改動，透過深度監聽器（`deep watch`）自動序列化為 JSON，即時寫入 `localStorage.setItem('coc7e_dossier_autosave', ...)`。
- 關閉瀏覽器或重新整理，所有狀態完美保留。

### 6.2 零伺服器 URL Hash 分享
- 點擊「一鍵分享網址」，將完整調查員狀態壓縮編碼至 URL Hash：
  `https://dancraft3746.github.io/COC7e-Investigator/#investigator={dataStr}`
- 接收者在任何瀏覽器打開，App 於 `onMounted` 生命週期自動解析還原，無需後端、永久有效。

### 6.3 備份與全量還原 (JSON Import/Export)
- 支援一鍵導出 `.json` 檔案備份。
- 支援透過「匯入 JSON」按鈕一鍵還原任何調查員（包含內建諾曼全量深淵檔案）。
