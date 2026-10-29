import type { InvestigatorData, SkillItem } from '../types/investigator';

export const defaultSkillsList: SkillItem[] = [
  { id: 'sk_cr', name: '信用評級 (Credit Rating)', base: 0, occ: 25, interest: 0, growth: 0, total: 25, checked: false },
  { id: 'sk_spot', name: '偵查 / 識破 (Spot Hidden)', base: 25, occ: 45, interest: 0, growth: 0, total: 70, checked: false },
  { id: 'sk_psych', name: '心理學 (Psychology)', base: 10, occ: 50, interest: 10, growth: 0, total: 70, checked: false },
  { id: 'sk_gun', name: '射擊（手槍 Handgun）', base: 20, occ: 0, interest: 40, growth: 0, total: 60, checked: false },
  { id: 'sk_brawl', name: '格鬥（鬥毆 Brawl）', base: 25, occ: 0, interest: 35, growth: 0, total: 60, checked: false },
  { id: 'sk_dodge', name: '閃避 (Dodge)', base: 35, occ: 0, interest: 25, growth: 0, total: 60, checked: false },
  { id: 'sk_lib', name: '圖書館使用 (Library Use)', base: 20, occ: 30, interest: 0, growth: 0, total: 50, checked: false },
  { id: 'sk_law', name: '法律 (Law)', base: 5, occ: 35, interest: 0, growth: 0, total: 40, checked: false },
  { id: 'sk_fasttalk', name: '話術 / 欺騙 (Fast Talk)', base: 5, occ: 35, interest: 0, growth: 0, total: 40, checked: false },
  { id: 'sk_disguise', name: '喬裝 (Disguise)', base: 5, occ: 20, interest: 0, growth: 0, total: 25, checked: false },
  { id: 'sk_photo', name: '藝術與手藝（攝影 Photography）', base: 5, occ: 20, interest: 0, growth: 0, total: 25, checked: false },
  { id: 'sk_drive', name: '汽車駕駛 (Drive Auto)', base: 20, occ: 0, interest: 20, growth: 0, total: 40, checked: false },
  { id: 'sk_stealth', name: '隱密行動 / 潛行 (Stealth)', base: 20, occ: 0, interest: 20, growth: 0, total: 40, checked: false },
  { id: 'sk_listen', name: '聆聽 (Listen)', base: 20, occ: 0, interest: 0, growth: 0, total: 20, checked: false },
  { id: 'sk_firstaid', name: '急救 (First Aid)', base: 30, occ: 0, interest: 0, growth: 0, total: 30, checked: false },
  { id: 'sk_med', name: '醫學 (Medicine)', base: 1, occ: 0, interest: 0, growth: 0, total: 1, checked: false },
  { id: 'sk_mythos', name: '克蘇魯神話 (Cthulhu Mythos)', base: 0, occ: 0, interest: 0, growth: 0, total: 0, checked: false },
  { id: 'sk_track', name: '追蹤 (Track)', base: 10, occ: 0, interest: 0, growth: 0, total: 10, checked: false },
  { id: 'sk_climb', name: '攀爬 (Climb)', base: 20, occ: 0, interest: 0, growth: 0, total: 20, checked: false },
  { id: 'sk_reassure', name: '安撫 (Reassure)', base: 9, occ: 0, interest: 0, growth: 0, total: 9, checked: false },
  { id: 'sk_lock', name: '鎖匠 (Locksmith)', base: 1, occ: 0, interest: 0, growth: 0, total: 1, checked: false },
  { id: 'sk_mech', name: '機械維修 (Mechanical Repair)', base: 10, occ: 0, interest: 0, growth: 0, total: 10, checked: false },
  { id: 'sk_elec', name: '電器維修 (Electrical Repair)', base: 10, occ: 0, interest: 0, growth: 0, total: 10, checked: false },
  { id: 'sk_occult', name: '神秘學 (Occult)', base: 5, occ: 0, interest: 0, growth: 0, total: 5, checked: false },
  { id: 'sk_history', name: '歷史 (History)', base: 5, occ: 0, interest: 0, growth: 0, total: 5, checked: false },
  { id: 'sk_lang_own', name: '語言（母語 英語）', base: 60, occ: 0, interest: 0, growth: 0, total: 60, checked: false },
  { id: 'sk_lang_latin', name: '語言（外語一 拉丁語）', base: 1, occ: 0, interest: 0, growth: 0, total: 1, checked: false }
];

export const defaultEdwardPierce: InvestigatorData = {
  id: 'char_edward_pierce',
  createdAt: Date.now(),
  updatedAt: Date.now(),
  investigator: {
    name: '艾德華·皮爾斯 (Edward Pierce)',
    job: '私家偵探',
    player: '調查員',
    age: 34,
    gender: '男',
    era: '1920s',
    birthplace: '波士頓',
    residence: '阿卡姆市法蘭西街118號',
    description: '略顯憔悴但目光銳利，常穿深褐色粗花呢風衣，配戴圓框眼鏡與老懷錶。',
    creationMethod: '480點分配法 (Companion)',
    hp: 11,
    mp: 12,
    san: 60,
    luck: 55,
    majorWound: false,
    shock: false,
    changed: false,
    panic5F: 'None',
    keyConnectionIndex: 2
  },
  characteristics: {
    STR: 60,
    CON: 55,
    DEX: 70,
    APP: 45,
    POW: 60,
    INT: 75,
    SIZ: 55,
    EDU: 60,
    LUCK: 55
  },
  skills: defaultSkillsList,
  weapons: [
    {
      id: 'wp_brawl',
      name: '徒手格鬥 / 拳打腳踢',
      skillName: '格鬥（鬥毆 Brawl）',
      damage: '1D3+DB',
      range: '觸碰 (Touch)',
      attacksPerRound: '1',
      currentAmmo: 0,
      maxAmmo: 0,
      malfunction: 100,
      notes: '可實施戰技：繳械、摔絆、搶抱'
    },
    {
      id: 'wp_revolver',
      name: '.38 口徑左輪手槍',
      skillName: '射擊（手槍 Handgun）',
      damage: '1D10',
      range: '15 米',
      attacksPerRound: '1(3)',
      currentAmmo: 6,
      maxAmmo: 6,
      malfunction: 100,
      notes: '可靠便攜，極限成功造成穿刺傷害 (10+1D10)'
    },
    {
      id: 'wp_knife',
      name: '小型折疊匕首',
      skillName: '格鬥（鬥毆 Brawl）',
      damage: '1D4+DB',
      range: '觸碰 (Touch)',
      attacksPerRound: '1',
      currentAmmo: 0,
      maxAmmo: 0,
      malfunction: 100,
      notes: '隱蔽防身，穿刺武器'
    }
  ],
  tomes: [
    { id: 'tm_1', name: '《玄君七章秘經》殘篇手抄', language: '漢語/古文', status: '略讀完成', sanLoss: '1D4', mythosGain: 3, studyTime: '8 週', spells: '召引地底之影' }
  ],
  spells: [
    { id: 'sp_1', name: '肉體防護術 (Flesh Ward)', cost: '可變 MP, 1D4 SAN', castTime: '5 輪', source: '《玄君七章秘經》殘篇', desc: '提供等同於投入 MP 點數之物理傷害抵消護盾。' }
  ],
  entities: [
    { id: 'en_1', category: '神話生物/眷族', name: '食屍鬼 (Ghoul)', aliases: '墓穴啃噬者', notes: '阿卡姆公墓深處曾目擊過其佝僂的犬面輪廓。' }
  ],
  contacts: [
    { id: 'ct_1', name: '亨利·阿米蒂奇博士', relation: '贊助者/導師', role: '密大圖書館長', notes: '提供特藏文獻調閱特權與學術諮詢。', isKeyConnection: true }
  ],
  chronicles: [
    { id: 'ch_1', title: '黑水鎮疑雲', type: '短篇模組', kp: '平凡', date: '1925.03.14', sanReward: '+1D4', mythosGain: 1, luckGain: 5, notes: '初涉超自然調查，揭露非法走私與深海信徒。' }
  ],
  backstory: [
    { title: '個人外貌特徵', content: '身材清瘦，習慣穿著風衣，帶著失眠形成的黑眼圈。' },
    { title: '意識形態與信念', content: '理性與科學必能驅散世間迷霧，任何謎團背後皆有邏輯可循。' },
    { title: '重要之人 (精神錨點)', content: '恩師亨利·阿米蒂奇博士。在迷惘時引導其走向真實學問的燈塔。' },
    { title: '意義非凡之地', content: '波士頓古董二手書店，那是他人生第一次接觸古例文獻的地方。' },
    { title: '珍視之物', content: '祖父所遺留的老舊懷錶，指針走動聲能撫平緊繃的神經。' },
    { title: '個人特質', content: '執著敏銳、沈默寡言、對未知事物充滿難以遏制的探求欲。' },
    { title: '傷痕與疤痕', content: '左肩有一道一戰時期留下的陳舊彈片擦傷疤痕。' },
    { title: '恐懼症與躁狂症', content: '輕度幽閉恐懼症（在無窗之地下室內需保持警惕）。' },
    { title: '神秘典籍與神器', content: '手頭藏有一本抄錄零星段落的《玄君七章秘經》殘篇。' },
    { title: '遭遇超自然實體', content: '曾在阿卡姆近郊荒廢莊園遠眺過不可名狀的夜魘黑影。' }
  ]
};

const normanRaw = {
  "investigator": {
    "name": "諾曼·諾巴蒂 (Norman Nobody)",
    "job": "神話專家",
    "player": "平凡",
    "age": 37,
    "gender": "男",
    "era": "1925s",
    "hp": 11,
    "mp": 20,
    "san": 30,
    "luck": 52,
    "majorWound": false,
    "shock": false,
    "changed": true,
    "special": "諾登斯之眼 (Eye of Nodens)"
  },
  "characteristics": {
    "STR": 50,
    "CON": 55,
    "DEX": 65,
    "APP": 50,
    "POW": 102,
    "INT": 75,
    "SIZ": 60,
    "EDU": 90
  },
  "tomes": [
    {
      "name": "《女巫的魔典》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：2D6\n克蘇魯神話：+1/+2%\n神話等級：9\n學時：2D6 月"
    },
    {
      "name": "《伊波恩之書》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：2D4\n克蘇魯神話：+3/+8% \n神話等級：33\n學時：32 周"
    },
    {
      "name": "《雅斯特岑布斯基的日記》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D6\n克蘇魯神話：+1/+2% \n神話等級：9\n學時：8 周"
    },
    {
      "name": "《加斯帕·菲格羅亞的最後懺悔》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D3\n克蘇魯神話：+1/+2%\n神話等級：9\n閱讀時間：2周"
    },
    {
      "name": "《索諾拉印第安部落的咒語及儀式》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D6\n克蘇魯神話：+0/+1% \n神話等級：3\n學時：6 周"
    },
    {
      "name": "《蠕蟲之秘密》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：2D6\n克蘇魯神話：+4/+8% \n神話等級：36\n學時：48 周"
    },
    {
      "name": "《死靈之書》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：2D10\n克蘇魯神話：+5/+11%\n神話等級：48\n學時：68週"
    },
    {
      "name": "《鮑文博士的筆記本》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D4\n克蘇魯神話：+1/+2% \n神話等級：9\n學時：6 周"
    },
    {
      "name": "《星之智慧》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D4\n克蘇魯神話：+0/+2% \n神話等級：6\n學時：6 周"
    },
    {
      "name": "《伊波恩之書註釋》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：2D4\n克蘇魯神話：+1/+4% \n神話等級：15\n學時：6 周"
    },
    {
      "name": "《通向黑暗之路》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：2D4\n克蘇魯神話：+2/+4% \n神話等級：18\n學時：8 周"
    },
    {
      "name": "《不可名狀的教團》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：2D8\n克蘇魯神話：+3/+6% \n神話等級：27\n學時：30 周\n建議法術：無。"
    },
    {
      "name": "《不可名狀的教團》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：2D8\n克蘇魯神話：+5/+10% \n神話等級：45\n學時：52 周"
    },
    {
      "name": "《奈哈格抄本》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D4\n克蘇魯神話：+1/+2% \n神話等級：9\n學時： 6小時/三周"
    },
    {
      "name": "《多爾讚歌》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：2D6\n克蘇魯神話：+2/+5% \n神話等級：21\n學時：15小時/20 周"
    },
    {
      "name": "《蒙面信使故事集》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D4\n克蘇魯神話：+1/+2% \n神話等級：9\n學時： 6周"
    },
    {
      "name": "《食屍教典籍》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D10\n克蘇魯神話：+4/+8% \n神話等級：36\n學時：22 周"
    },
    {
      "name": "《黑扇女神》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D4\n克蘇魯神話：+1/+4%\n神話等級：15\n解讀時間：2周"
    },
    {
      "name": "《偉大者回歸的神聖奧秘》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：2D4\n克蘇魯神話：+2/+5%\n神話等級：21\n學時：13 周"
    },
    {
      "name": "《〈死靈之書〉中的克蘇魯》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D6\n克蘇魯神話：+2/+4%\n神話等級：18\n學時：14週"
    },
    {
      "name": "《格拉基啟示錄》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：2D8\n克蘇魯神話：+5/+10%\n神話等級：45\n學時：32週"
    },
    {
      "name": "《卡納瑪戈斯遺囑》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D6\n克蘇魯神話：+2/+4% \n神話等級：18\n學時：23 周"
    },
    {
      "name": "《賢士的智慧》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：2D6\n克蘇魯神話：+3/+7%\n神話等級：30\n學時：40 週"
    },
    {
      "name": "《阿爾巴林的信使》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：2D6\n克蘇魯神話：+3/+8%\n神話等級：33\n學時：36 週"
    },
    {
      "name": "《頭之卷軸》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1d4\n克蘇魯神話：+1/+2%\n神話等級：9\n學習時間：10 小時"
    },
    {
      "name": "《左臂之捲軸》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D4\n克蘇魯神話：+0/+2% \n神話等級：6\n學時：24 小時"
    },
    {
      "name": "《腹之捲軸》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：2D6\n克蘇魯神話：+2/+5% \n神話等級：21\n學時：40 小時"
    },
    {
      "name": "《腿之捲軸》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1d6+1\n克蘇魯神話：+2/+5% \n神話等級：21\n學時：40 小時"
    },
    {
      "name": "《右臂之捲軸》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1d6+1\n克蘇魯神話：+2/+5% \n神話等級：21\n學時：40 小時"
    },
    {
      "name": "《非洲的黑暗教派》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D10\n克蘇魯神話：+2/+4\n神話等級：30\n解讀時間：6周"
    },
    {
      "name": "《伊波恩之書》法文版",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：2D4\n克蘇魯神話：+4/+8\n神話等級：36\n解讀時間：36周"
    },
    {
      "name": "《巨石之間》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D3\n克蘇魯神話：+1/+2\n神話等級：9\n解讀時間：1周"
    },
    {
      "name": "《生之為神》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D6\n克蘇魯神話：+2/+4\n神話等級：18\n解讀時間：10周"
    },
    {
      "name": "《納克特抄本》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D8\n克蘇魯神話：+3/+7\n神話等級：30\n解讀時間：45周"
    },
    {
      "name": "《蓬萊七頌》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D6\n克蘇魯神話：+2/+4% \n神話等級：18\n學時：12 周"
    },
    {
      "name": "《燈神之歌（歐格尼特敏·阿爾·金）》",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D4\n克蘇魯神話：+1/+3\n神話等級：12\n解讀時間：12周"
    },
    {
      "name": "《剛果王國》拉丁文擴展版",
      "language": "多語言手抄/印本",
      "status": "已研讀記錄",
      "sanLoss": "詳見註記",
      "mythosGain": 2,
      "studyTime": "已精讀/略讀",
      "spells": "",
      "notes": "理智損失：1D8\n克蘇魯神話：+1/+1%\n神話等級：6\n學時：8 周"
    }
  ],
  "spells": [
    {
      "name": "奈亞拉托提普請/送神術",
      "source": "《請/送神術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "安昌初請/送神術[已施放]",
      "source": "《請/送神術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "阿圖請/送神術",
      "source": "《請/送神術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "召喚有角之人",
      "source": "《請/送神術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "無皮者請神術",
      "source": "《請/送神術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "阿撒托斯請/送神術",
      "source": "《請/送神術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "猶格·索托斯請/送神術",
      "source": "《請/送神術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "莎布-尼古拉絲請/送神術",
      "source": "《請/送神術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "圖爾茲查請/送神術",
      "source": "《請/送神術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "塞伊格亞請/送神術",
      "source": "《請/送神術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "尼約格薩請/送神術",
      "source": "《請/送神術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "加塔諾托亞請/送神術",
      "source": "《請/送神術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "獵夢者請神術",
      "source": "《請/送神術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "哈斯塔請/送神術",
      "source": "《請/送神術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "克圖格亞請/送神術",
      "source": "《請/送神術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "阿薩托斯的恐怖詛咒[已施放][深層]",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "枯萎術[已施放]",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "拉萊耶造霧術[已施放]",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "肢體凋萎術[已施放]",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "消失術[已施放]",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "僵屍毀滅術",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "奈哈戈送葬歌",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "反轉移術",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "火焰斗篷術[已施放]",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "蘇萊曼之塵",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "支配術[已施放]",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "恐懼植入術[已施放]",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "伊本-加齊之粉[已施放]",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "猶格-索托斯之拳[已施放]",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "劍悉地[已施放]",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "敏足術[已施放]",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "折磨術[已施放]",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "精神淹溺術[已施放]",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "精神震爆術",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "帕祖祖之息",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "帕祖祖之怒",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "魔力吸取術",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "化骨術",
      "source": "《戰鬥法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "舊印開光術[已施放]",
      "source": "《保護法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "壞屍粉創建術",
      "source": "《保護法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "光明與黑暗之眼",
      "source": "《保護法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "靈魂分配術",
      "source": "《保護法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "邪眼守衛術[已施放]",
      "source": "《保護法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "納克-提特障壁創建術[已施放]",
      "source": "《保護法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "涅弗倫-卡的封印[已施放]",
      "source": "《保護法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "塞迪菲卡爾之皮",
      "source": "《保護法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "血肉防護術(中國版)[已施放]",
      "source": "《保護法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "伊波恩霧輪術[已施放]",
      "source": "《保護法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "清心法",
      "source": "《保護法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "極樂術[已施放]",
      "source": "《保護法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "精神的溫暖[已施放]",
      "source": "《保護法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "伊希斯的封印[已施放]",
      "source": "《保護法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "刀具附魔術",
      "source": "《附魔法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "血清附魔術",
      "source": "《附魔法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "巴爾塞之印創建術",
      "source": "《附魔法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "炭火盆附魔術",
      "source": "《附魔法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "饕餮附魔術",
      "source": "《附魔法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "活焰附魔術[已施放]",
      "source": "《附魔法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "戒指附魔術",
      "source": "《附魔法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "哨子附魔術",
      "source": "《附魔法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "無等等銃",
      "source": "《附魔法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "過度生死送解脫",
      "source": "《附魔法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "附魔神聖樂器",
      "source": "《附魔法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "夢想家助力術(烏薩、潘斯山谷)[已施放]",
      "source": "《旅行和交通法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "時空門創建術",
      "source": "《旅行和交通法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "消失術[已施放]",
      "source": "《旅行和交通法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "厄運之門",
      "source": "《旅行和交通法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "浮空術[已施放]",
      "source": "《旅行和交通法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "彼端之旅",
      "source": "《旅行和交通法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    },
    {
      "name": "關閉空間連接[已施放]",
      "source": "《旅行和交通法術》",
      "cost": "依規則/典籍消耗",
      "castTime": "依儀式宣告",
      "desc": ""
    }
  ],
  "entities": [
    {
      "category": "舊日支配者/外神",
      "name": "諾登斯\nNodens",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "奈亞拉托提普\nNyarlathotep",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "阿薩托斯\nAzathoth",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "猶格-索托斯\nYog-Sothoth",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "莎布-尼古拉絲\nShub-Niggurath",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "克蘇魯\nCthulhu",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "薩托古亞\nTsathoggua",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "伊格\nYig",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "尼約格薩\nNyogtha",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "阿特拉克·納克亞\nAtlach-Nacha",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "羅比格斯\nRobigus",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "伽達摩\nGhadamon",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "圖爾茲查\nTulzscha",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "塞伊格亞\nCyäegha",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "加塔諾托亞\nGhatanothoa",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "獵夢者\nHuitloxopetl",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "哈斯塔\nHastur",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "克圖格亞\nCthugha",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "夸切•烏陶斯\nQuachil Uttaus",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "達貢\nDagon",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "索貝克\nSobek",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "伊德海拉\nYidhra",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "芭絲特\nBast",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "伊西斯\nIsis",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "舊日支配者/外神",
      "name": "莫爾迪基安\nMordiggian",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "食屍鬼\nGhoul",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "狼人\nWerewolf",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "古墓群的女巫\nSorceress in the Great Ancient Cemetery",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "喪屍\nZombie",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "黏菌史萊姆\nSlime Mold",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "妖精環\nFairy Ring",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "妖精\nFairy",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "藍色馬勃\nblue puffball",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "伽達摩的僕從\nServant of Ghadamon",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "暗影子嗣\nShadow Spawn",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "恐怖獵手\nHunting Horror",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "卡里希里\nKharisiri",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "卡里希里幼蟲\nLarval Parasite",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "炎之精\nFire Vampire",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "怪物",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "細長人影",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "險惡的存在",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "潰鬼\nFestering Shambler",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "無形之子\nFormless Spawn",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "蛇人\nSerpent People",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "古老者\nElder Thing",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "木乃伊\nMummy",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "維拉\nValar",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "拜亞基\nByakhee",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "黑山羊幼仔\nDark Young",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "星之精\nStar Vampire",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "變異人類",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "夜魘\nNightgaunt",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "空鬼\nDimensional Shambler",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "深潛者\nDeep One",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "米-戈\nMi-go",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "潛沙怪\nSand-dweller",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "外神僕役\nServitor of the Outer Gods",
      "aliases": "",
      "notes": ""
    },
    {
      "category": "神話生物/眷族",
      "name": "黑斯芬克斯",
      "aliases": "",
      "notes": ""
    }
  ],
  "contacts": [
    {
      "name": "傑克遜·埃利亞斯",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "莎莉·加特玲",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "莫莉·梅德福",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "賈斯汀·梅德福",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "羅奈爾得·加洛韋",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "喬納森·恩格斯",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "馬丁·普爾",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "莫迪凱·萊明博士",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "亞瑟·愛默生",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "米莉亞姆·阿特萊特",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "約拿·肯辛頓",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "神話NPC",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "角色",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "尼爾森·布萊克利",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "阿德里安·斯蒂姆森",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "宙斯博士",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "理查德·厄普頓·皮克曼",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "約翰·斯科特",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "凱薩·德瑞克",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "娜依拉",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "江·塔科達",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "安布羅斯·莫根斯",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "卡爾·斯坦福",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "米莫斯",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    },
    {
      "name": "費南多·伊波利特",
      "relation": "調查夥伴/NPC",
      "role": "",
      "notes": ""
    }
  ],
  "chronicles": [
    {
      "title": "奈亞拉托提普的面具 (Masks of Nyarlathotep)",
      "type": "長跑傳奇戰役",
      "kp": "平凡",
      "date": "1925",
      "sanReward": "-15",
      "mythosGain": 18,
      "luckGain": 10,
      "notes": "橫跨紐約、倫敦、開羅、肯亞、上海之全域神話浩劫調查。"
    },
    {
      "title": "野獸之日 (Day of the Beast)",
      "type": "邪教末日戰役",
      "kp": "平凡",
      "date": "1926",
      "sanReward": "-10",
      "mythosGain": 12,
      "luckGain": 15,
      "notes": "對抗萬物兄弟會與終焉預言，多次使用高階神話法術拯救世界。"
    }
  ]
};

export const defaultNormanNobody: InvestigatorData = {
  id: 'char_norman_nobody',
  createdAt: Date.now() - 86400000 * 365,
  updatedAt: Date.now(),
  investigator: {
    name: normanRaw.investigator.name,
    job: normanRaw.investigator.job,
    player: normanRaw.investigator.player,
    age: normanRaw.investigator.age,
    gender: normanRaw.investigator.gender,
    era: normanRaw.investigator.era,
    birthplace: '波士頓',
    residence: '全球戰役奔波',
    description: '面容冷峻、目光歷經深淵，身著歷經風霜的戰地風衣。',
    creationMethod: '資深傳奇老兵 (雙大戰役生還者)',
    specialAbility: normanRaw.investigator.special || '諾登斯之眼 (Eye of Nodens)',
    hp: normanRaw.investigator.hp,
    mp: normanRaw.investigator.mp,
    san: normanRaw.investigator.san,
    luck: normanRaw.investigator.luck,
    majorWound: normanRaw.investigator.majorWound,
    shock: normanRaw.investigator.shock,
    changed: normanRaw.investigator.changed,
    panic5F: 'None',
    keyConnectionIndex: 2
  },
  characteristics: {
    STR: normanRaw.characteristics.STR,
    CON: normanRaw.characteristics.CON,
    DEX: normanRaw.characteristics.DEX,
    APP: normanRaw.characteristics.APP,
    POW: normanRaw.characteristics.POW,
    INT: normanRaw.characteristics.INT,
    SIZ: normanRaw.characteristics.SIZ,
    EDU: normanRaw.characteristics.EDU,
    LUCK: normanRaw.investigator.luck
  },
  weapons: [
    {
      id: 'wp_norman_brawl',
      name: '戰地徒手格鬥',
      skillName: '格鬥（鬥毆 Brawl）',
      damage: '1D3+DB',
      range: '觸碰 (Touch)',
      attacksPerRound: '1',
      currentAmmo: 0,
      maxAmmo: 0,
      malfunction: 100,
      notes: '可實施進階戰技'
    },
    {
      id: 'wp_norman_revolver',
      name: '.38 特種警用左輪手槍',
      skillName: '射擊（手槍 Handgun）',
      damage: '1D10',
      range: '15 米',
      attacksPerRound: '1(3)',
      currentAmmo: 6,
      maxAmmo: 6,
      malfunction: 100,
      notes: '一戰退役配槍，極限穿刺'
    },
    {
      id: 'wp_norman_shotgun',
      name: '12號雙管霰彈槍',
      skillName: '射擊（手槍 Handgun）',
      damage: '4D6/2D6/1D6',
      range: '10/20/50 米',
      attacksPerRound: '1 或 2',
      currentAmmo: 2,
      maxAmmo: 2,
      malfunction: 100,
      notes: '大威力面殺傷，近距致命打擊'
    }
  ],
  skills: defaultSkillsList.map((s) => {
    if (s.name.includes('克蘇魯神話')) return { ...s, total: 35 };
    if (s.name.includes('心理學')) return { ...s, total: 80 };
    if (s.name.includes('偵查')) return { ...s, total: 75 };
    return s;
  }),
  tomes: normanRaw.tomes.map((t: any, i: number) => ({ ...t, id: `tome_${i}` })),
  spells: normanRaw.spells.map((s: any, i: number) => ({ ...s, id: `spell_${i}` })),
  entities: normanRaw.entities.map((e: any, i: number) => ({ ...e, id: `entity_${i}` })),
  contacts: normanRaw.contacts.map((c: any, i: number) => ({ ...c, id: `contact_${i}` })),
  chronicles: normanRaw.chronicles.map((ch: any, i: number) => ({ ...ch, id: `chronicle_${i}` }))
};
