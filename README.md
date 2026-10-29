# 密斯卡托尼克大學 • 阿卡姆機密調查員終端
### CALL OF CTHULHU 7th EDITION · SOLIDSTART & TYPESCRIPT RUNNING TERMINAL

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![SolidStart](https://img.shields.io/badge/SolidStart-v2.0-2c4f7c.svg)](https://start.solidjs.com)
[![Solid.js](https://img.shields.io/badge/Solid.js-1.9%20%7C%202.0-446b9e.svg)](https://www.solidjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-38bdf8.svg)](https://tailwindcss.com)
[![Discord Ready](https://img.shields.io/badge/Discord-TRPG%20Optimized-5865F2.svg)](https://discord.com)

本專案是一套專為 **《克蘇魯的呼喚》第七版（Call of Cthulhu 7e）** 與 **《守密人伴侶修訂版（Keeper's Companion Revised）》** 打造的現代化調查員管理終端。

採用 **SolidStart (v2) + Solid.js + TypeScript + Tailwind CSS (v4)** 現代全端架構重構，解決傳統試算表「資料維度爆炸」與單純 LocalStorage「多角色無法管理、換瀏覽器即遺失」的痛點，邁向全球級 TRPG 平台的工程化基礎。

---

## 🌟 核心特色與架構升級

### 1. ⚡ 極致細粒度響應性 (Solid.js Fine-Grained Reactivity)
- **零 Virtual DOM 開銷**：利用 Solid 的 Signals 與 Store，數值更動時僅精準更新單一文字節點，手機跑團滑動血條 0 延遲。
- **100% 雙向可逆的生理與心智狀態機**：
  - **生命值 (HP)**：即時推演健康、輕傷、重傷、昏迷、瀕死（Dying Box）與瞬間致死。
  - **心智值 (SAN)**：包含單次損耗臨界線、單日質變線、5F 急性恐慌（Fight/Flight/Freeze/Fawn/Flop）、心智質變（Changed 幸運凍結）與精神錨點回理智機制。

### 2. 📁 多調查員名冊庫 (Character Roster System)
- **多角色抽屜式切換**：支援隨時切換多位調查員（如資深神話老兵諾曼·諾巴蒂、初始私家偵探艾德華·皮爾斯）。
- **IndexedDB 本機資料庫持久化**：突破 LocalStorage 5MB 限制，本機支援數百 MB 空間，存放數十張長跑老兵卡。
- **一鍵新增 / 複製 / 刪除**：支援跑團高死亡率時的備份分身與殉職存檔。

### 3. 🤖 Discord 跑團極致整合
- 🎲 **一鍵複製骰點指令**：支援主流骰娘語法切換（`.ra 技能 數值`、`cc 數值 技能`、`.r 1d100<=數值`）。
- 📋 **一鍵發布戰況看板**：快速複製公開透明的 Rich Embed 文字狀態卡至 Discord 頻道。
- 📈 **團後技能成長清單**：自動抓取勾選「成長（☑）」的技能，輸出 KP 專用審核清單。
- 🔮 **一鍵施法宣告**：自動格式化法術消耗（MP/SAN/施法時間）宣告。

### 4. 🌐 零伺服器分享與備份
- **URL Hash 狀態分享**：點擊一鍵分享，全角色資料壓縮編碼於網址中，傳給 KP 或隊友開啟即可檢視。
- **JSON 匯入與導出**：支援單卡或整組名冊匯出為標準 JSON，換裝置隨時還原。

---

## 📂 專案工程目錄結構

```text
├── src/
│   ├── components/                            # 🧩 模組化 UI 組件
│   │   ├── Header.tsx                         # 頂部橫幅、狀態卡按鈕、分頁導航
│   │   ├── CharacterDrawer.tsx                # 調查員多角色名冊庫抽屜
│   │   ├── VitalsPanel.tsx                    # 生命/魔法/理智/幸運儀表盤與狀態機
│   │   ├── CharacteristicsGrid.tsx            # 九大特徵值、年齡調整、480點驗證
│   │   ├── SkillsTab.tsx                      # 80+ 技能樹、即時搜尋、自訂新增
│   │   ├── GrimoireTab.tsx                    # 禁忌典籍庫與習得法術、施法宣告
│   │   ├── MythosCodexTab.tsx                 # 舊日支配者/眷族/邪教/神器圖鑑
│   │   ├── SocialWebTab.tsx                   # 人際網絡、精神錨點、贊助人
│   │   └── ChronicleTab.tsx                   # 戰役編年史日誌與 KP 成長審核
│   ├── stores/
│   │   └── characterStore.ts                  # 🧠 全域 Solid 響應式狀態、計算與動作
│   ├── lib/
│   │   └── storage.ts                         # 💾 IndexedDB 儲存驅動引擎
│   ├── types/
│   │   └── investigator.ts                    # 📑 TypeScript 全規則資料模型與型別
│   ├── data/
│   │   └── defaultData.ts                     # 📜 預設私家偵探與老兵諾曼全量深淵檔案
│   ├── routes/
│   │   └── index.tsx                          # 🏠 首頁主應用掛載點
│   ├── app.css                                # 🎨 Tailwind v4 主題、羊皮紙調色盤
│   ├── app.tsx                                # 🌐 SolidStart 根應用路由
│   ├── entry-client.tsx                       # 🖥️ 客戶端掛載進入點
│   └── entry-server.tsx                       # ☁️ 伺服器端渲染進入點
├── public/                                    # 🖼️ 靜態資源（Favicon、圖示）
├── .github/workflows/deploy.yml               # 🚀 GitHub Pages 自動建置與部署工作流
├── vite.config.ts                             # ⚙️ Vite + SolidStart + Nitro 設定
├── tsconfig.json                              # 🛠️ TypeScript 5 嚴格型別設定
├── package.json                               # 📦 專案依賴管理
├── norman_nobody_full.json                    # 📜 諾曼·諾巴蒂原始深淵資料 (70法術/37典籍)
└── README.md                                  # 📖 專案主說明文件
```

---

## 🚀 開發與部署指南

### 本地開發 (Local Development)

本專案使用 `pnpm` 作為套件管理器：

```bash
# 1. 安裝依賴
pnpm install

# 2. 啟動開發伺服器
pnpm dev
```
瀏覽器打開 `http://localhost:3000` 即可享受毫秒級 HMR 熱重載。

### 生產建置 (Production Build)

```bash
# 編譯 SSG / Nitro 全靜態產物
pnpm build

# 本地預覽生產建置
pnpm preview
```

### GitHub Pages 自動部署

本專案已配置完整 GitHub Actions：
1. 將代碼推送至 GitHub 的 `main` 分支。
2. 前往 GitHub 倉庫 ➜ **Settings** ➜ **Pages**。
3. 將 **Build and deployment > Source** 切換為 **GitHub Actions**。
4. 每當您執行 `git push`，GitHub Actions 將自動編譯 SolidStart 靜態檔案並發布至您的專屬網址！
