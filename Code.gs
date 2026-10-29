/**
 * ============================================================================
 * 密斯卡托尼克大學 • 阿卡姆調查局
 * COC 7版 調查員角色卡 旗艦自動化工具箱 (Google Apps Script)
 * Discord 跑團紀錄導向純淨版：無私下暗骰，全公開透明彙整
 * ============================================================================
 */

function onOpen() {
  var ui = SpreadsheetApp.getUi();
  
  // 自動檢查並啟用勾選方塊
  try {
    setupCheckboxes();
  } catch (e) {}

  ui.createMenu('📜 密斯卡托尼克調查員工具')
    .addItem('📋 彙整待成長檢定清單 (可一鍵複製至 Discord 供 KP 審核)', 'showGrowthSummaryForDiscord')
    .addItem('🧹 一鍵清除有勾選的技能成長標記', 'clearAllGrowthCheckboxes')
    .addSeparator()
    .addItem('✂️ 一鍵裁切/移除本表多餘空白行列 (收縮至卡片邊界)', 'trimUnusedRowsAndColumns')
    .addItem('☑ 啟用/修復技能成長勾選方塊', 'setupCheckboxes')
    .addItem('🔄 重置調查員技能分配點數 (新角色專用)', 'resetSkillPoints')
    .addToUi();
}

/**
 * 1. 彙整待成長檢定清單，彈出視窗供一鍵複製貼至 Discord
 */
function showGrowthSummaryForDiscord() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('📜 調查員核心檔案');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  }
  var ui = SpreadsheetApp.getUi();
  
  var pcName = sheet.getRange('C4').getValue() || '無名調查員';
  var checkedSkills = [];
  
  // 掃描左列技能 (列 22~61，Col A 為勾選框，Col B 為名稱，Col G 為總值)
  for (var r = 22; r <= 61; r++) {
    var isChecked = sheet.getRange('A' + r).getValue();
    if (isChecked === true) {
      checkedSkills.push({
        name: sheet.getRange('B' + r).getValue(),
        total: sheet.getRange('G' + r).getValue()
      });
    }
  }
  // 掃描右列技能 (列 22~61，Col I 為勾選框，Col J 為名稱，Col O 為總值)
  for (var r = 22; r <= 61; r++) {
    var isChecked = sheet.getRange('I' + r).getValue();
    if (isChecked === true) {
      checkedSkills.push({
        name: sheet.getRange('J' + r).getValue(),
        total: sheet.getRange('O' + r).getValue()
      });
    }
  }
  
  if (checkedSkills.length === 0) {
    ui.alert('提示', '目前沒有在角卡上勾選任何技能的成長標記（☑）！\n請先在技能表格最左側勾選本次跑團中有成功發揮之技能。', ui.ButtonSet.OK);
    return;
  }
  
  var lines = [];
  lines.push('📋【' + pcName + ' 團後技能成長檢定申請】');
  lines.push('守密人 (KP) 您好，以下為本次模組有成功發揮之技能清單：');
  lines.push('----------------------------------------');
  for (var i = 0; i < checkedSkills.length; i++) {
    var s = checkedSkills[i];
    lines.push((i + 1) + '. ' + s.name + ' (目前 ' + s.total + '%) ➜ 請在 Discord 擲 1D100 > ' + s.total + ' 或 ≥96');
  }
  lines.push('----------------------------------------');
  lines.push('（檢定通過者請在 Discord 擲 1D10 增長點數，並填回角卡「成長」欄！）');
  
  var text = lines.join('\n');
  
  var htmlOutput = HtmlService.createHtmlOutput(
    '<style>' +
    'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Microsoft JhengHei", sans-serif; padding: 16px; background: #FAF6EE; color: #2C1810; margin: 0; }' +
    'h3 { margin-top: 0; color: #3E2723; }' +
    'p { font-size: 13px; color: #5D4037; }' +
    'textarea { width: 100%; height: 180px; font-family: monospace; font-size: 12px; padding: 10px; border: 1px solid #8D6E63; background: #FFFDE7; border-radius: 4px; box-sizing: border-box; resize: vertical; }' +
    'button { margin-top: 12px; background: #5D4037; color: #FFF8E7; padding: 10px 20px; border: none; border-radius: 4px; font-weight: bold; cursor: pointer; font-size: 13px; }' +
    'button:hover { background: #3E2723; }' +
    '</style>' +
    '<h3>📋 Discord 成長檢定清單彙整</h3>' +
    '<p>點選下方按鈕一鍵複製文字，直接貼到 Discord 頻道供 KP 查閱，並公開擲 1D100 檢定：</p>' +
    '<textarea id="textBox">' + text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</textarea><br>' +
    '<button onclick="copyText()">一鍵複製文字</button>' +
    '<script>' +
    'function copyText() {' +
    '  var box = document.getElementById("textBox");' +
    '  box.select();' +
    '  document.execCommand("copy");' +
    '  alert("✅ 複製成功！請前往 Discord 貼上發布給 KP！");' +
    '}' +
    '</script>'
  ).setWidth(520).setHeight(360);

  ui.showModalDialog(htmlOutput, '📋 Discord 成長檢定清單');
}

/**
 * 2. 一鍵清除有勾選的技能成長標記
 */
function clearAllGrowthCheckboxes() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('📜 調查員核心檔案');
  if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var ui = SpreadsheetApp.getUi();
  
  var confirm = ui.alert('🧹 清除成長標記', '是否確定要清空主卡上所有的「☑ 成長標記」？\n\n（建議在 Discord 檢定完畢並將 1D10 增長點數填入「成長」欄後再執行此操作）', ui.ButtonSet.YES_NO);
  if (confirm !== ui.Button.YES) return;

  var count = 0;
  for (var r = 22; r <= 61; r++) {
    if (sheet.getRange('A' + r).getValue() === true) count++;
    if (sheet.getRange('I' + r).getValue() === true) count++;
  }

  sheet.getRange('A22:A61').clearContent();
  sheet.getRange('I22:I61').clearContent();
  sheet.getRange('A22:A61').insertCheckboxes();
  sheet.getRange('I22:I61').insertCheckboxes();
  
  ui.alert('提示', '已成功清除 ' + count + ' 項技能的成長勾選標記！', ui.ButtonSet.OK);
}

/**
 * 3. 輔助函數：將技能成長標記轉換為 Google 試算表原生勾選方塊
 */
function setupCheckboxes() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('📜 調查員核心檔案');
  if (sheet) {
    sheet.getRange('A22:A61').insertCheckboxes();
    sheet.getRange('I22:I61').insertCheckboxes();
    sheet.getRange('M10').insertCheckboxes(); // 重傷勾選
    sheet.getRange('M12').insertCheckboxes(); // 永久瘋狂勾選
    sheet.getRange('M13').insertCheckboxes(); // 震懾勾選
    sheet.getRange('M14').insertCheckboxes(); // 質變勾選
  }
}

/**
 * 4. 一鍵裁切多餘空白行列 (收縮至卡片邊界)
 */
function trimUnusedRowsAndColumns() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();

  var confirm = ui.alert('✂️ 裁切空白區域', '確定要將所有分頁多餘的空白列與欄永久刪除，使試算表完美貼合卡片邊界嗎？', ui.ButtonSet.YES_NO);
  if (confirm !== ui.Button.YES) return;

  // 定義各分頁的保留最大欄位與列數
  var bounds = {
    '📜 調查員核心檔案': { maxCol: 16, maxRow: 75 },
    '🕯️ 調查員背景與心智印記': { maxCol: 8, maxRow: 36 },
    '📈 團後成長與經歷日誌': { maxCol: 16, maxRow: 57 },
    '📚 官方核心資料庫': { maxCol: 17, maxRow: 131 }
  };

  for (var name in bounds) {
    var sh = ss.getSheetByName(name);
    if (!sh) continue;
    var b = bounds[name];

    // 刪除多餘欄位
    var totalCols = sh.getMaxColumns();
    if (totalCols > b.maxCol) {
      sh.deleteColumns(b.maxCol + 1, totalCols - b.maxCol);
    }

    // 刪除多餘列數
    var totalRows = sh.getMaxRows();
    if (totalRows > b.maxRow) {
      sh.deleteRows(b.maxRow + 1, totalRows - b.maxRow);
    }
  }

  ui.alert('✅ 完成', '所有分頁之多餘空白欄列已全數刪除，卡片邊界已極致貼合！', ui.ButtonSet.OK);
}

/**
 * 5. 重置技能配置點數 (新角色專用)
 */
function resetSkillPoints() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('📜 調查員核心檔案');
  if (!sheet) sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var ui = SpreadsheetApp.getUi();
  var confirm = ui.alert('⚠️ 警告', '確定要將所有技能的「本職點數」與「興趣點數」清空重置嗎？', ui.ButtonSet.YES_NO);
  if (confirm !== ui.Button.YES) return;

  sheet.getRange('D22:E61').clearContent();
  sheet.getRange('L22:M61').clearContent();

  ui.alert('提示', '技能配置點數已全數重置為 0！', ui.ButtonSet.OK);
}
