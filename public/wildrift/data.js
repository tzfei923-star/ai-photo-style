// 激鬥峽谷選角分析 — 資料檔
// 來源：https://www.wildriftfire.com/tier-list（iTzSTU4RT 維護）
// 更新方式：改 patch / 日期，再依照 wildriftfire 的分級調整下方名單即可。
//
// tier 說明（沿用 wildriftfire）：
//   S+ 目前最強、很難被 counter、能單獨 carry
//   S  非常強勢、穩定
//   A  強，在多數情況表現良好
//   B  可用，在對的情況能打出效果
//   C  影響力偏低，不建議排位首選

window.WR_DATA = {
  patch: "7.2d",
  patchReleased: "2026-08-26",   // Riot 官方 7.2d 上線日
  compiled: "2026-09-05",        // 本頁名單整理日期
  source: "https://www.wildriftfire.com/tier-list",

  // 各路的一句話 meta 解讀
  lanes: [
    {
      id: "baron",
      name: "上路",
      sub: "BARON LANE",
      icon: "sword",
      color: "#FF8A5B",
      meta: "7.2d 上路是戰士 / 鬥士的天下：靠硬實力換血、能 1v1 抗壓又能開團的角色最吃香。"
    },
    {
      id: "jungle",
      name: "打野",
      sub: "JUNGLE",
      icon: "leaf",
      color: "#6EE7B7",
      meta: "清野快、4 級前就能開打的打野在帶節奏。菲艾與奈德麗的 gank 壓力目前是版本答案。"
    },
    {
      id: "mid",
      name: "中路",
      sub: "MID LANE",
      icon: "star",
      color: "#C7B6F5",
      meta: "中路仍是法師主場：阿璃、星朵拉兼具清線、遊走與爆發；控制型法師被削後靠機動性補位。"
    },
    {
      id: "adc",
      name: "下路",
      sub: "DRAGON LANE",
      icon: "dragon",
      color: "#7FC8F8",
      meta: "下路獎勵攻速與後期成長：斯莫德與尤娜拉的滾雪球能力，是目前團戰的決勝點。"
    },
    {
      id: "support",
      name: "輔助",
      sub: "SUPPORT",
      icon: "heart",
      color: "#FF7EB6",
      meta: "本版本輔助沒有 S+，坦克開團與傷害型輔助並列 S 級：派克、雷歐娜、瑟雷西都很穩。"
    }
  ],

  // 每路各級名單（順序即 wildriftfire 顯示順序）
  // 欄位：[英文名, 中文名, 定位]
  //  定位代碼：T 坦克 / F 戰士 / M 法師 / A 刺客 / R 射手 / S 輔助
  tiers: {
    baron: {
      "S+": [["Gwen", "葛溫", "F"], ["Jax", "賈克斯", "F"]],
      "S":  [["Ornn", "鄂爾", "T"], ["Camille", "卡蜜兒", "F"], ["Malphite", "墨菲特", "T"], ["Gnar", "吶兒", "F"], ["K'Sante", "卡桑帝", "T"], ["Aatrox", "厄薩斯", "F"], ["Darius", "達瑞斯", "F"]],
      "A":  [["Renekton", "雷尼克頓", "F"], ["Ambessa", "安蓓薩", "F"], ["Singed", "辛吉德", "T"], ["Cho'Gath", "科加斯", "T"], ["Garen", "蓋倫", "F"], ["Teemo", "提摩", "R"], ["Sett", "賽特", "F"], ["Fiora", "菲歐拉", "F"], ["Mordekaiser", "魔鬥凱薩", "F"], ["Irelia", "伊瑞莉亞", "F"]],
      "B":  [["Riven", "雷玟", "F"], ["Urgot", "烏爾加特", "F"], ["Nasus", "納瑟斯", "F"]],
      "C":  [["Dr. Mundo", "蒙多醫生", "T"]]
    },
    jungle: {
      "S+": [["Vi", "菲艾", "F"], ["Nidalee", "奈德麗", "A"]],
      "S":  [["Nocturne", "夜曲", "A"], ["Kindred", "鏡爪", "R"], ["Lee Sin", "李星", "F"], ["Warwick", "沃維克", "F"], ["Pantheon", "潘森", "F"], ["Nunu & Willump", "努努和威朗普", "T"], ["Rammus", "拉姆斯", "T"], ["Amumu", "阿姆姆", "T"], ["Jarvan IV", "嘉文四世", "F"]],
      "A":  [["Volibear", "弗力貝爾", "F"], ["Viego", "維爾戈", "A"], ["Lillia", "莉莉亞", "M"], ["Rengar", "雷葛爾", "A"], ["Tryndamere", "泰達米爾", "F"], ["Shyvana", "希瓦娜", "F"], ["Kha'Zix", "卡力斯", "A"], ["Xin Zhao", "趙信", "F"], ["Fiddlesticks", "費德提克", "M"], ["Gragas", "古拉格斯", "T"]],
      "B":  [["Master Yi", "易大師", "A"], ["Skarner", "史加納", "T"]],
      "C":  [["Graves", "葛雷夫", "R"], ["Nilah", "妮拉", "F"]]
    },
    mid: {
      "S+": [["Ahri", "阿璃", "M"], ["Syndra", "星朵拉", "M"]],
      "S":  [["Taliyah", "塔莉雅", "M"], ["Yone", "永恩", "A"], ["Twisted Fate", "逆命", "M"], ["Ryze", "雷茲", "M"], ["Orianna", "奧莉安娜", "M"], ["Kassadin", "卡薩丁", "A"], ["Galio", "加里歐", "T"]],
      "A":  [["Aurora", "歐蘿拉", "M"], ["Brand", "布蘭德", "M"], ["Lissandra", "麗珊卓", "M"], ["Norra", "諾拉", "M"], ["Veigar", "維迦", "M"], ["Viktor", "維克特", "M"], ["Zed", "劫", "A"], ["Akali", "阿卡莉", "A"], ["Ziggs", "希格斯", "M"]],
      "B":  [["Heimerdinger", "漢默丁格", "M"], ["Mel", "梅爾", "M"], ["Yasuo", "犽宿", "F"], ["Fizz", "飛斯", "A"], ["Vladimir", "弗拉迪米爾", "M"], ["Akshan", "阿克尚", "R"], ["Jayce", "杰西", "F"]],
      "C":  [["Katarina", "卡特蓮娜", "A"]]
    },
    adc: {
      "S+": [["Yunara", "尤娜拉", "R"], ["Smolder", "斯莫德", "R"], ["Ezreal", "伊澤瑞爾", "R"]],
      "S":  [["Miss Fortune", "好運姐", "R"], ["Zeri", "婕莉", "R"], ["Vayne", "汎", "R"], ["Jhin", "燼", "R"], ["Varus", "法洛士", "R"]],
      "A":  [["Draven", "達瑞文", "R"], ["Lucian", "路西恩", "R"], ["Jinx", "吉茵珂絲", "R"], ["Kai'Sa", "凱莎", "R"], ["Ashe", "艾希", "R"], ["Samira", "煞蜜拉", "R"], ["Kog'Maw", "寇格魔", "R"], ["Corki", "庫奇", "R"]],
      "B":  [["Tristana", "崔絲塔娜", "R"], ["Twitch", "圖奇", "R"], ["Sivir", "希維爾", "R"], ["Caitlyn", "凱特琳", "R"]],
      "C":  []
    },
    support: {
      "S+": [],
      "S":  [["Pyke", "派克", "S"], ["Senna", "姍娜", "S"], ["Leona", "雷歐娜", "T"], ["Nami", "娜米", "S"], ["Thresh", "瑟雷西", "S"], ["Rell", "銳兒", "T"], ["Rakan", "銳空", "S"], ["Sona", "索娜", "S"], ["Braum", "布郎姆", "T"], ["Zilean", "極靈", "S"]],
      "A":  [["Milio", "米利歐", "S"], ["Seraphine", "瑟菈紛", "S"], ["Nautilus", "納帝魯斯", "T"], ["Alistar", "亞歷斯塔", "T"], ["Maokai", "茂凱", "T"], ["Blitzcrank", "布里茨", "T"], ["Lulu", "露璐", "S"], ["Zyra", "枷蘿", "M"], ["Soraka", "索拉卡", "S"], ["Morgana", "魔甘娜", "M"], ["Karma", "卡瑪", "S"]],
      "B":  [["Lux", "拉克絲", "M"], ["Yuumi", "悠咪", "S"], ["Janna", "珍娜", "S"]],
      "C":  []
    }
  }
};
