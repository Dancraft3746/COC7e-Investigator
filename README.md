# 密斯卡托尼克大學 • 阿卡姆機密調查員終端與檔案冊
### CALL OF CTHULHU 7th EDITION · INVESTIGATOR CODEX & FLAGSHIP DOSSIER

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![COC Edition](https://img.shields.io/badge/COC-7th%20Edition-red.svg)](https://www.chaosium.com)
[![Discord Ready](https://img.shields.io/badge/Discord-TRPG%20Optimized-5865F2.svg)](https://discord.com)
[![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen.svg)](https://pages.github.com)

本專案是一套專為 **《克蘇魯的呼喚》第七版（Call of Cthulhu 7e）** 與 **《守密人伴侶修訂版（Keeper's Companion Revised）》** 打造的現代化調查員管理系統。

本專案解決了傳統 Google 試算表在資深老兵角色卡上**「數據維度爆炸（數十門法術、典籍、神話實體）」**、**「14 個分頁切換繁瑣」**、**「手機操作困難」** 與 **「與 Discord 跑團脫節」** 的物理限制，提供 **Web 互動終端** 與 **旗艦版試算表** 雙軌解決方案。

---

## 🌟 核心特色

### 1. 🚀 超越試算表：阿卡姆機密調查員終端 (Web App / PWA)
- **檔案**：[`index.html`](index.html)（亦可直接開啟 [`coc7e_investigator_app.html`](coc7e_investigator_app.html)）
- **零依賴與純單檔架構**：以 Vue 3 + Tailwind CSS 打造，免安裝伺服器，下載即用。
- **1920s 羊皮紙沉浸美學**：專為 PC、iPad、手機設計的響應式版面。
- **100% 雙向可逆的生理與心智狀態機**：
  - **生命值 (HP)**：即時推演健康、輕傷、重傷、昏迷、瀕死（Dying Box）與瞬間致死。
  - **心智值 (SAN)**：包含單次損耗臨界線、單日質變線、5F 急性恐慌（Fight/Flight/Freeze/Fawn/Flop）、心智質變（Changed 幸運凍結）與精神錨點回理智機制。
- **神話百科全書動態收納**：
  - 承載老兵級別龐大資料：**70+ 門法術、37+ 部禁忌典籍、神話實體與邪教、人際贊助網絡、編年史**。
  - 支援關鍵字即時篩選、分類過濾與動態新增自訂卡片。
- **Discord 跑團極致整合**：
  - 🎲 **一鍵複製骰點指令**：支援主流骰娘開關（`.ra 技能 數值`、`cc 數值 技能`、`.r 1d100<=數值`）。
  - 📋 **一鍵發布戰況看板**：快速複製公開透明的 Rich Embed 文字狀態卡至 Discord 頻道。
  - 📈 **團後技能成長清單**：自動抓取勾選「成長（☑）」的技能，輸出 KP 專用審核清單。
  - 🔮 **一鍵施法宣告**：自動格式化法術消耗（MP/SAN/施法時間）宣告。
- **免登入、極簡分享機制**：
  - 支援 URL Hash 狀態導出（`#investigator=...`），複製專屬網址即可給隊友與 KP 檢視，永久有效。
  - 支援完整 JSON 備份與一鍵載入。

---

### 2. 📊 旗艦版 Google 試算表 / Excel 檔案冊 (Spreadsheet Dossier)
- **範本檔案**：[`COC7e_Flagship_Investigator_Dossier.xlsx`](COC7e_Flagship_Investigator_Dossier.xlsx)
- **生成腳本**：[`generate_coc7e_dossier.py`](generate_coc7e_dossier.py)
- **Apps Script 擴充工具**：[`Code.gs`](Code.gs)
- **四大模組化工作表**：
  1. `【調查員檔案】`：基本檔案、九大特徵值、生理心智監控、80+ 技能樹、武器庫、戰技比對器。
  2. `【背景與創傷】`：官方十要素、精神錨點、5F 震懾與心智質變歷程記錄簿。
  3. `【調查歷程】`：跑團模組、KP 審核、理智增減、成長檢定記錄。
  4. `【核心數據庫】`：全官方職業清單、本職公式、信用上下限、全武器彈藥資料。
- **純公式雙向連動**：全面修正年齡扣減 MOV、下拉選單（DataValidation）原生嵌入、自動隱藏未使用空白網格。

---

## 📂 專案檔案結構

```text
├── index.html                                 # 🌐 Web App 進入點（支援 GitHub Pages）
├── coc7e_investigator_app.html                # 🚀 完整單頁應用程式
├── generate_coc7e_dossier.py                  # ⚙️ 旗艦版試算表自動化生成主腳本
├── COC7e_Flagship_Investigator_Dossier.xlsx   # 📊 旗艦版 Excel 角色卡範本
├── Code.gs                                    # 📜 Google Apps Script 工具包
├── occupations_clean.json                     # 📚 COC 7e 全職業資料庫
├── weapons_clean.json                         # ⚔️ COC 7e 全武器與戰鬥動態資料庫
├── COC7e_FIELD_LOGIC_SPECIFICATION.md         # 📑 全欄位邏輯與公式規格書
├── COC7e_CHARACTER_SHEET_RULES_SPECIFICATION.md # 📑 核心與伴侶修訂規則手冊
├── COC7e_FLAGSHIP_DOSSIER_USER_GUIDE.md       # 📖 試算表使用者手冊
├── .gitignore                                 # 🔒 排除大檔案與個人資料
└── README.md                                  # 📖 專案主說明文件
```

> **注意**：本機參考文獻、大體積版權 PDF（Core Rulebook、Keeper's Companion）與個人長篇老兵角色卡備份統一存放在 `references/` 目錄中，並已被 `.gitignore` 排除，絕不上傳至公開儲存庫。

---

## 🚀 快速上手

### 方式 A：直接在瀏覽器開啟 Web 終端
1. 下載本專案後，直接雙擊 [`index.html`](index.html)。
2. 點擊右上角 **`載入資深老兵諾曼卡`** 可載入傳奇老兵數據，或直接於各欄位自訂輸入。
3. 點擊各技能旁的 **🎲** 按鈕即可自動複製擲骰指令至剪貼簿，在 Discord 貼上即可擲骰。

### 方式 B：一鍵免費託管到 GitHub Pages（隨時隨地開啟）
1. 將本專案推送至您的 GitHub 儲存庫。
2. 進入儲存庫的 **Settings > Pages**。
3. 在 **Branch** 選取 `main`，資料夾選取 `/ (root)`，點擊 **Save**。
4. 數秒後即可獲得專屬公開線上網址（例如 `https://<你的帳號>.github.io/<倉庫名>/`），在手機、平板與 Discord 內嵌瀏覽器隨開即用！

### 方式 C：使用旗艦版 Google 試算表
1. 打開 Google 雲端硬碟，將 [`COC7e_Flagship_Investigator_Dossier.xlsx`](COC7e_Flagship_Investigator_Dossier.xlsx) 上傳。
2. 以 Google 試算表格式開啟。
3. 前往 **擴充功能 > Apps Script**，貼上 [`Code.gs`](Code.gs) 內容，即可享受自動邊界裁切與 Discord 狀態輸出。

---

## 📜 規則遵循與致謝
- 本工具依據 Chaosium 官方《Call of Cthulhu 7th Edition Keeper Rulebook》及《Keeper's Companion Revised Edition》精神進行架構與邏輯設計。
- 專為繁體中文 TRPG 跑團社群、Discord 文字/語音團設計。
