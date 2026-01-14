/**
 * data.js - Data Store & Demo Data Generator
 * DATA EDITORIAL v4.0
 */

// ==================== GLOBAL DATA STORE ====================
const DATA = {
  raw: [],
  daily: [],
  hourly: [],
  heatmap: [],
  categories: [],
  categoryDetails: [],
  genderDist: [],
  ageDist: [],
  lifeDist: [],
  rfm: [],
  personas: [],
  n1: null,
  kpi: { revenue: 0, transactions: 0, basket: 0, frequency: 0 }
};

// ==================== DEMO DATA GENERATOR ====================
function generateDemoData() {
  // KPI
  DATA.kpi = { revenue: 847520000, transactions: 312450, basket: 2712, frequency: 4.2 };

  // Daily (October 2025, 31 days)
  DATA.daily = [];
  const baseDaily = [24.8, 26.2, 28.5, 32.1, 29.3, 38.2, 35.6, 25.1, 27.4, 29.8, 31.2, 28.7, 36.8, 34.2, 26.3, 28.9, 30.5, 32.8, 29.1, 37.5, 33.9, 25.8, 27.1, 29.5, 31.8, 28.4, 35.2, 32.6, 24.5, 26.8, 28.2];
  for (let d = 1; d <= 31; d++) {
    DATA.daily.push({ day: d, revenue: baseDaily[d-1] * 1000000 * (0.9 + Math.random() * 0.2) });
  }

  // Hourly (realistic pattern, no zeros)
  DATA.hourly = [
    { hour: 9, value: 1850 }, { hour: 10, value: 4520 }, { hour: 11, value: 6230 },
    { hour: 12, value: 5180 }, { hour: 13, value: 4890 }, { hour: 14, value: 5340 },
    { hour: 15, value: 6720 }, { hour: 16, value: 7890 }, { hour: 17, value: 8450 },
    { hour: 18, value: 7210 }, { hour: 19, value: 5680 }, { hour: 20, value: 3420 },
    { hour: 21, value: 1820 }
  ];

  // Heatmap (Monday-start: 月火水木金土日)
  const days = ['月', '火', '水', '木', '金', '土', '日'];
  const heatBase = [
    [0,0,0,0,0,0,0,0,0,18,42,58,48,45,52,65,78,82,68,54,32,18,0,0],
    [0,0,0,0,0,0,0,0,0,16,38,52,44,42,48,62,74,78,64,50,28,15,0,0],
    [0,0,0,0,0,0,0,0,0,20,45,62,52,48,55,68,82,88,72,58,35,20,0,0],
    [0,0,0,0,0,0,0,0,0,17,40,55,46,44,50,64,76,80,66,52,30,16,0,0],
    [0,0,0,0,0,0,0,0,0,22,48,68,58,54,62,75,92,98,82,65,42,24,0,0],
    [0,0,0,0,0,0,0,0,0,28,58,82,72,68,78,95,100,95,88,72,48,28,0,0],
    [0,0,0,0,0,0,0,0,0,25,52,75,65,62,70,85,92,88,78,62,40,22,0,0]
  ];
  DATA.heatmap = days.map((day, di) => ({
    day,
    hours: heatBase[di].map((v, h) => ({ hour: h, value: v > 0 ? v : 0 }))
  }));

  // Categories with full breakdown
  DATA.categories = [
    { name: '青果', value: 18.5, color: '#10B981' },
    { name: '精肉', value: 15.2, color: '#F43F5E' },
    { name: '鮮魚', value: 11.8, color: '#06B6D4' },
    { name: '惣菜', value: 14.3, color: '#F59E0B' },
    { name: '日配', value: 12.6, color: '#8B5CF6' },
    { name: '飲料', value: 8.4, color: '#14B8A6' },
    { name: '製菓', value: 6.2, color: '#EC4899' },
    { name: '酒類', value: 5.8, color: '#EF4444' },
    { name: '冷凍', value: 4.5, color: '#3B82F6' },
    { name: 'その他', value: 2.7, color: '#6B7280' }
  ];

  DATA.categoryDetails = [
    { name: '青果', revenue: 156820000, share: 18.5, growth: 3.2, basket: 1.8 },
    { name: '精肉', revenue: 128920000, share: 15.2, growth: 2.1, basket: 1.5 },
    { name: '惣菜', revenue: 121280000, share: 14.3, growth: 5.8, basket: 1.9 },
    { name: '日配', revenue: 106840000, share: 12.6, growth: 1.2, basket: 2.1 },
    { name: '鮮魚', revenue: 100040000, share: 11.8, growth: -0.5, basket: 1.3 },
    { name: '飲料', revenue: 71220000, share: 8.4, growth: 4.2, basket: 1.6 },
    { name: '製菓', revenue: 52540000, share: 6.2, growth: 2.8, basket: 1.4 },
    { name: '酒類', revenue: 49160000, share: 5.8, growth: 1.5, basket: 1.2 },
    { name: '冷凍', revenue: 38140000, share: 4.5, growth: 6.5, basket: 1.7 },
    { name: 'その他', revenue: 22560000, share: 2.7, growth: 0.8, basket: 0.9 }
  ];

  // Demographics (strict order)
  DATA.genderDist = sortByOrder([
    { label: '男', value: 41 },
    { label: '女', value: 59 }
  ], 'gender');

  DATA.ageDist = sortByOrder([
    { label: '10代', value: 3 },
    { label: '20代', value: 8 },
    { label: '30代', value: 15 },
    { label: '40代', value: 25 },
    { label: '50代', value: 21 },
    { label: '60代', value: 16 },
    { label: '70代', value: 9 },
    { label: '80代以上', value: 3 }
  ], 'age');

  DATA.lifeDist = sortByOrder([
    { label: '単身', value: 20 },
    { label: 'DINKS', value: 16 },
    { label: 'DEWKS', value: 32 },
    { label: '老年夫婦', value: 22 },
    { label: 'その他', value: 10 }
  ], 'lifestage');

  // RFM Matrix
  DATA.rfm = [
    { r: 'High', f: 'High', m: 'High', count: 2840, label: 'Champion', color: '#10B981' },
    { r: 'High', f: 'High', m: 'Mid', count: 4520, label: 'Loyal', color: '#06B6D4' },
    { r: 'High', f: 'Mid', m: 'High', count: 3180, label: 'Potential', color: '#8B5CF6' },
    { r: 'Mid', f: 'High', m: 'Mid', count: 5640, label: 'Promising', color: '#F59E0B' },
    { r: 'Mid', f: 'Mid', m: 'Mid', count: 8920, label: 'Average', color: '#6B7280' },
    { r: 'Low', f: 'Low', m: 'Low', count: 3450, label: 'At Risk', color: '#F43F5E' }
  ];

  // Personas
  DATA.personas = [
    {
      name: '健康志向ファミリー',
      tag: 'DEWKS',
      color: '#10B981',
      scores: { 健康志向: 92, 利便性: 48, 価格感度: 55, 品揃え: 78, ロイヤリティ: 85 }
    },
    {
      name: '時短重視シングル',
      tag: '単身',
      color: '#06B6D4',
      scores: { 健康志向: 42, 利便性: 95, 価格感度: 68, 品揃え: 52, ロイヤリティ: 38 }
    },
    {
      name: '品質重視シニア',
      tag: '老年夫婦',
      color: '#F59E0B',
      scores: { 健康志向: 75, 利便性: 58, 価格感度: 35, 品揃え: 62, ロイヤリティ: 92 }
    }
  ];

  // N1 Profile
  DATA.n1 = {
    id: 'CX-284719',
    name: '山田 花子 様',
    age: '50代',
    gender: '女',
    lifestage: 'DEWKS',
    rfmRank: 'Champion',
    narrative: '週に<strong>3.2回</strong>来店される、当店の最も大切なお客様のお一人です。<strong>青果と惣菜</strong>を中心に購入され、特に<strong>有機野菜</strong>への関心が高い傾向があります。お子様がいらっしゃる共働き世帯と推測され、<strong>時短</strong>と<strong>健康</strong>の両立を重視されています。日曜日の午前中に来店されることが多く、まとめ買い傾向が顕著です。直近3ヶ月で<strong>¥128,450</strong>をお買い上げいただいており、ロイヤリティスコアは上位<strong>2.1%</strong>に位置します。',
    stats: { visits: 42, spend: 128450, basket: 3058, loyalty: '上位2.1%' }
  };
}

// ==================== CSV PROCESSING ====================
function processCSVData(rows, headers) {
  const cols = {
    date: detectColumn(headers, COLUMN_ALIASES.date),
    amount: detectColumn(headers, COLUMN_ALIASES.amount),
    customerId: detectColumn(headers, COLUMN_ALIASES.customerId),
    gender: detectColumn(headers, COLUMN_ALIASES.gender),
    age: detectColumn(headers, COLUMN_ALIASES.age),
    category: detectColumn(headers, COLUMN_ALIASES.category),
    lifestage: detectColumn(headers, COLUMN_ALIASES.lifestage),
    hour: detectColumn(headers, COLUMN_ALIASES.hour)
  };

  // Filter out zero-amount rows
  const validRows = rows.filter(r => {
    const amt = parseFloat(r[cols.amount]) || 0;
    return amt > 0;
  });

  // Calculate KPIs
  let totalRevenue = 0;
  const customerSet = new Set();
  validRows.forEach(r => {
    totalRevenue += parseFloat(r[cols.amount]) || 0;
    if (cols.customerId && r[cols.customerId]) customerSet.add(r[cols.customerId]);
  });

  DATA.kpi.revenue = totalRevenue;
  DATA.kpi.transactions = validRows.length;
  DATA.kpi.basket = validRows.length > 0 ? Math.round(totalRevenue / validRows.length) : 0;
  DATA.kpi.frequency = customerSet.size > 0 ? (validRows.length / customerSet.size).toFixed(1) : 0;

  // Process demographics if available
  if (cols.gender) {
    const genderCounts = {};
    validRows.forEach(r => {
      const g = r[cols.gender];
      if (g) genderCounts[g] = (genderCounts[g] || 0) + 1;
    });
    const total = Object.values(genderCounts).reduce((a, b) => a + b, 0);
    DATA.genderDist = sortByOrder(
      Object.entries(genderCounts).map(([label, count]) => ({ label, value: Math.round(count / total * 100) })),
      'gender'
    );
  }

  if (cols.age) {
    const ageCounts = {};
    validRows.forEach(r => {
      const a = r[cols.age];
      if (a) ageCounts[a] = (ageCounts[a] || 0) + 1;
    });
    const total = Object.values(ageCounts).reduce((a, b) => a + b, 0);
    DATA.ageDist = sortByOrder(
      Object.entries(ageCounts).map(([label, count]) => ({ label, value: Math.round(count / total * 100) })),
      'age'
    );
  }

  if (cols.lifestage) {
    const lifeCounts = {};
    validRows.forEach(r => {
      const l = r[cols.lifestage];
      if (l) lifeCounts[l] = (lifeCounts[l] || 0) + 1;
    });
    const total = Object.values(lifeCounts).reduce((a, b) => a + b, 0);
    DATA.lifeDist = sortByOrder(
      Object.entries(lifeCounts).map(([label, count]) => ({ label, value: Math.round(count / total * 100) })),
      'lifestage'
    );
  }

  // Update node heat based on category data
  if (cols.category) {
    const catCounts = {};
    validRows.forEach(r => {
      const c = r[cols.category];
      if (c) catCounts[c] = (catCounts[c] || 0) + 1;
    });
    const maxCount = Math.max(...Object.values(catCounts));
    GRAPH_NODES.forEach(node => {
      const matchingCats = NODE_CATEGORIES[node.id] || [];
      let nodeCount = 0;
      matchingCats.forEach(cat => {
        Object.keys(catCounts).forEach(k => {
          if (k.includes(cat)) nodeCount += catCounts[k];
        });
      });
      if (nodeCount > 0 && maxCount > 0) {
        node.heat = Math.round((nodeCount / maxCount) * 100);
      }
    });
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { DATA, generateDemoData, processCSVData };
}
