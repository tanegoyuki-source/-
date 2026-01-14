/**
 * config.js - Configuration & Constants
 * DATA EDITORIAL v4.0
 */

// ==================== COLUMN AUTO-DETECTION ====================
const COLUMN_ALIASES = {
  date: ['date', '日付', '購買日', 'transaction_date', 'sale_date', '取引日'],
  amount: ['amount', '金額', '売上', 'revenue', 'price', 'total', '売上金額', '購買金額'],
  customerId: ['customer_id', '顧客ID', '会員番号', 'member_id', 'id', 'カード番号'],
  gender: ['gender', '性別', 'sex'],
  age: ['age', '年代', '年齢', 'age_group', '年齢層'],
  category: ['category', 'カテゴリ', '商品分類', 'product_category', '部門', '商品カテゴリ'],
  lifestage: ['lifestage', 'ライフステージ', 'life_stage', 'household', '世帯構成'],
  hour: ['hour', '時間', '時刻', 'time']
};

// ==================== STRICT SORTING ORDERS ====================
const SORT_ORDER = {
  gender: ['男', '女'],
  age: ['10代', '20代', '30代', '40代', '50代', '60代', '70代', '80代以上'],
  lifestage: ['単身', 'DINKS', 'DEWKS', '老年夫婦', 'その他']
};

// ==================== SIMULATION GRAPH NODES ====================
const GRAPH_NODES = [
  { id: 'entrance', label: 'ENTRANCE', x: 0.08, y: 0.5, color: '#10B981', size: 48, heat: 100 },
  { id: 'produce', label: 'PRODUCE', x: 0.25, y: 0.2, color: '#10B981', size: 42, heat: 85 },
  { id: 'meat', label: 'MEAT', x: 0.42, y: 0.15, color: '#F43F5E', size: 40, heat: 72 },
  { id: 'fish', label: 'FISH', x: 0.58, y: 0.2, color: '#06B6D4', size: 38, heat: 58 },
  { id: 'deli', label: 'DELI', x: 0.75, y: 0.28, color: '#F59E0B', size: 44, heat: 78 },
  { id: 'center', label: 'CENTER', x: 0.45, y: 0.52, color: '#8B5CF6', size: 50, heat: 65 },
  { id: 'beverage', label: 'BEVERAGE', x: 0.65, y: 0.6, color: '#14B8A6', size: 36, heat: 55 },
  { id: 'bakery', label: 'BAKERY', x: 0.28, y: 0.7, color: '#F59E0B', size: 34, heat: 48 },
  { id: 'frozen', label: 'FROZEN', x: 0.52, y: 0.82, color: '#3B82F6', size: 32, heat: 42 },
  { id: 'checkout', label: 'CHECKOUT', x: 0.92, y: 0.5, color: '#FFFFFF', size: 52, heat: 100 }
];

// ==================== SIMULATION GRAPH EDGES ====================
const GRAPH_EDGES = [
  { from: 'entrance', to: 'produce', weight: 0.85 },
  { from: 'entrance', to: 'center', weight: 0.15 },
  { from: 'produce', to: 'meat', weight: 0.65 },
  { from: 'produce', to: 'center', weight: 0.35 },
  { from: 'meat', to: 'fish', weight: 0.55 },
  { from: 'meat', to: 'deli', weight: 0.35 },
  { from: 'meat', to: 'center', weight: 0.10 },
  { from: 'fish', to: 'deli', weight: 0.70 },
  { from: 'fish', to: 'center', weight: 0.30 },
  { from: 'deli', to: 'checkout', weight: 0.60 },
  { from: 'deli', to: 'beverage', weight: 0.40 },
  { from: 'center', to: 'beverage', weight: 0.45 },
  { from: 'center', to: 'bakery', weight: 0.35 },
  { from: 'center', to: 'frozen', weight: 0.20 },
  { from: 'beverage', to: 'checkout', weight: 0.75 },
  { from: 'beverage', to: 'frozen', weight: 0.25 },
  { from: 'bakery', to: 'frozen', weight: 0.40 },
  { from: 'bakery', to: 'center', weight: 0.30 },
  { from: 'bakery', to: 'checkout', weight: 0.30 },
  { from: 'frozen', to: 'checkout', weight: 1.00 }
];

// ==================== NODE CATEGORY MAPPING ====================
const NODE_CATEGORIES = {
  produce: ['青果', '野菜', 'PRODUCE'],
  meat: ['精肉', '肉', 'MEAT'],
  fish: ['鮮魚', '魚', 'FISH'],
  deli: ['惣菜', 'DELI'],
  center: ['日配', '加工食品', 'CENTER'],
  beverage: ['飲料', 'BEVERAGE'],
  bakery: ['パン', 'ベーカリー', 'BAKERY'],
  frozen: ['冷凍', 'FROZEN']
};

// ==================== UTILITY FUNCTIONS ====================
function detectColumn(headers, aliases) {
  const lowerHeaders = headers.map(h => h.toLowerCase().trim());
  for (const alias of aliases) {
    const idx = lowerHeaders.indexOf(alias.toLowerCase());
    if (idx !== -1) return headers[idx];
  }
  return null;
}

function sortByOrder(arr, orderKey, labelKey = 'label') {
  const order = SORT_ORDER[orderKey];
  if (!order) return arr;
  return arr.sort((a, b) => {
    const idxA = order.indexOf(a[labelKey]);
    const idxB = order.indexOf(b[labelKey]);
    return (idxA === -1 ? 999 : idxA) - (idxB === -1 ? 999 : idxB);
  });
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { COLUMN_ALIASES, SORT_ORDER, GRAPH_NODES, GRAPH_EDGES, NODE_CATEGORIES, detectColumn, sortByOrder };
}
