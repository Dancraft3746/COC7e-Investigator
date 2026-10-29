# 密斯卡托尼克大學 • 阿卡姆機密調查員終端
### CALL OF CTHULHU 7th EDITION · INVESTIGATOR CODEX & RUNNING TERMINAL

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![COC Edition](https://img.shields.io/badge/COC-7th%20Edition-red.svg)](https://www.chaosium.com)
[![Discord Ready](https://img.shields.io/badge/Discord-TRPG%20Optimized-5865F2.svg)](https://discord.com)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen.svg)](https://pages.github.com)

**線上即時使用網址**：[https://dancraft3746.github.io/COC7e-Investigator/](https://dancraft3746.github.io/COC7e-Investigator/)

本專案是一套專為 **《克蘇魯的呼喚》第七版（Call of Cthulhu 7e）** 與 **《守密人伴侶修訂版（Keeper's Companion Revised）》** 打造的現代化調查員管理終端（Web App / PWA）。

專為長期跑團、多戰役歷練之資深調查員設計，承載數十門法術、典籍、神話實體與戰役日誌，並深度整合 Discord 跑團工作流，具備一鍵擲骰、狀態看板發布、團後成長審核與跨裝置自動記憶功能。

---

## 🌟 核心特色 (Web App / PWA)

- **檔案進入點**：[`index.html`](index.html)（亦可直接開啟 [`coc7e_investigator_app.html`](coc7e_investigator_app.html)）
- **零依賴與純單檔架構**：以 Vue 3 + Tailwind CSS 打造，免安裝伺服器與後端，下載即用、跨平台無阻。
- **1920s 羊皮紙沉浸美學**：專為 PC、iPad、手機設計的自動響應式版面，閱讀手感典雅。
- **自動記憶與離線保護 (LocalStorage)**：任何數值更動（扣血、扣理智、勾選成長、新增法術）自動即時保存於瀏覽器，刷新不遺失。
- **100% 雙向可逆的生理與心智狀態機**：
  - **生命值 (HP)**：即時推演健康、輕傷、重傷、昏迷、瀕死（Dying Box）與瞬間致死。
  - **心智值 (SAN)**：包含單次損耗臨界線、單日質變線、5F 急性恐慌（Fight/Flight/Freeze/Fawn/Flop）、心智質變（Changed 幸運凍結）與精神錨點回理智機制。
- **神話百科全書動態收納**：
  - 完整承載老兵級別龐大資料：**70+ 門法術、37+ 部禁忌典籍、59+ 神話生物/支配者、25+ 人際網絡、戰役編年史**。
  - 支援關鍵字即時篩選、分類過濾與動態新增自訂卡片。
- **Discord 跑團極致整合**：
  - 🎲 **一鍵複製骰點指令**：支援主流骰娘開關（`.ra 技能 數值`、`cc 數值 技能`、`.r 1d100<=數值`）。
  - 📋 **一鍵發布戰況看板**：快速複製公開透明的 Rich Embed 文字狀態卡至 Discord 頻道。
  - 📈 **團後技能成長清單**：自動抓取勾選「成長（☑）」的技能，輸出 KP 專用審核清單。
  - 🔮 **一鍵施法宣告**：自動格式化法術消耗（MP/SAN/施法時間）宣告。
- **免登入、極簡分享機制**：
  - 支援 URL Hash 狀態導出（`#investigator=...`），複製專屬網址即可給隊友與 KP 檢視，永久有效。
  - 支援完整 JSON 匯入與備份導出（內建傳奇老兵諾曼檔案 [`norman_nobody_full.json`](norman_nobody_full.json)）。

---

## 📂 專案檔案結構

```text
├── index.html                                 # 🌐 Web App 進入點（GitHub Pages 首頁）
├── coc7e_investigator_app.html                # 🚀 調查員終端單頁應用程式
├── norman_nobody_full.json                    # 📜 《面具/野獸之日》傳奇老兵諾曼全量資料
├── occupations_clean.json                     # 📚 COC 7e 全職業資料庫
├── weapons_clean.json                         # ⚔️ COC 7e 全武器與戰鬥動態資料庫
├── COC7e_FIELD_LOGIC_SPECIFICATION.md         # 📑 調查員終端架構與欄位邏輯規範書
├── COC7e_CHARACTER_SHEET_RULES_SPECIFICATION.md # 📑 核心與伴侶修訂規則手冊
├── .gitignore                                 # 🔒 排除大檔案與個人資料
└── README.md                                  # 📖 專案主說明文件
```

> **注意**：本機參考文獻、大體積版權 PDF（Core Rulebook、Keeper's Companion）與個人長篇老兵試算表備份統一存放在 `references/` 目錄中，並已被 `.gitignore` 排除，絕不上傳至公開儲存庫。

---

## 🚀 快速上手

### 方式 1：線上網址直接開啟（最推薦）
直接造訪：[**https://dancraft3746.github.io/COC7e-Investigator/**](https://dancraft3746.github.io/COC7e-Investigator/)
- 在手機、平板或電腦直接使用。
- 點擊頂部 **`載入老兵諾曼神話卡`** 即可體驗全 70 門法術、37 部典籍；或點擊 **`預設偵探`** 開始自己的新角色。
- 跑團時點擊技能旁的 **🎲** 按鈕，即可自動複製骰點指令至剪貼簿，在 Discord 貼上即骰！

### 方式 2：本機離線開啟
1. 將本專案下載至電腦。
2. 直接雙擊 [`index.html`](index.html) 或 [`coc7e_investigator_app.html`](coc7e_investigator_app.html)。
3. 零依賴、純本機離線可用！

---

## 📜 規則遵循與致謝
- 本工具依據 Chaosium 官方《Call of Cthulhu 7th Edition Keeper Rulebook》及《Keeper's Companion Revised Edition》精神進行架構與邏輯設計。
- 專為繁體中文 TRPG 跑團社群、Discord 文字/語音團設計。
