/* ================================================================
   JAVASCRIPT: BEHAVIOR / LOGIC LAYER - Universal Data Engine
   DATA EDITORIAL - Retail Analysis Platform
   ================================================================ */

// ================================================================
// DEMO DATA GENERATOR
// ================================================================
const DEMO_DATA = generateDemoData();

function generateDemoData() {
  return {
    dailySales: generateDailySales(),
    hourlySales: generateHourlySales(),
    congestionMap: generateCongestionMap(),
    categories: generateCategories(),
    topItems: generateTopItems(),
    ageDistribution: [
      { label: '10代', value: 5 },
      { label: '20代', value: 12 },
      { label: '30代', value: 18 },
      { label: '40代', value: 24 },
      { label: '50代', value: 20 },
      { label: '60代', value: 13 },
      { label: '70代', value: 6 },
      { label: '80代以上', value: 2 }
    ],
    genderDistribution: [
      { label: '女性', value: 58 },
      { label: '男性', value: 42 }
    ],
    lifestageDistribution: [
      { label: '単身', value: 22 },
      { label: 'DINKS', value: 18 },
      { label: 'DEWKS', value: 28 },
      { label: '老年夫婦', value: 20 },
      { label: 'その他', value: 12 }
    ],
    customers: generateCustomers(60),
    rfmMatrix: generateRFMMatrix(),
    crossSellLinks: generateCrossSellLinks()
  };
}

function generateDailySales() {
  const sales = [];
  const holidays = [13, 14]; // Sports Day weekend
  const weekends = [4, 5, 11, 12, 18, 19, 25, 26];

  for (let day = 1; day <= 31; day++) {
    let base = 680000 + Math.random() * 180000;

    if (weekends.includes(day)) base *= 1.35 + Math.random() * 0.15;
    if (holidays.includes(day)) base *= 1.55 + Math.random() * 0.2;
    if (day <= 5 || (day >= 25 && day <= 28)) base *= 1.12;

    const dow = new Date(2025, 9, day).getDay();

    sales.push({
      day,
      date: `10/${day}`,
      revenue: Math.round(base),
      isHoliday: holidays.includes(day),
      isWeekend: dow === 0 || dow === 6,
      dayOfWeek: dow
    });
  }
  return sales;
}

function generateHourlySales() {
  return [
    { hour: '09', label: '9時', value: 42 },
    { hour: '10', label: '10時', value: 65 },
    { hour: '11', label: '11時', value: 88 },
    { hour: '12', label: '12時', value: 82 },
    { hour: '13', label: '13時', value: 68 },
    { hour: '14', label: '14時', value: 72 },
    { hour: '15', label: '15時', value: 85 },
    { hour: '16', label: '16時', value: 92 },
    { hour: '17', label: '17時', value: 100 },
    { hour: '18', label: '18時', value: 96 },
    { hour: '19', label: '19時', value: 78 },
    { hour: '20', label: '20時', value: 52 },
    { hour: '21', label: '21時', value: 25 }
  ];
}

function generateCongestionMap() {
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const hours = Array.from({ length: 13 }, (_, i) => i + 9);
  const map = [];

  days.forEach((day, di) => {
    hours.forEach(hour => {
      let base = 30 + Math.random() * 40;

      // Weekend boost
      if (di === 0 || di === 6) base += 25;
      // Evening peak
      if (hour >= 17 && hour <= 19) base += 30;
      // Lunch time
      if (hour >= 11 && hour <= 13) base += 15;
      // Late night drop
      if (hour >= 20) base -= 20;

      map.push({
        day: di,
        dayLabel: day,
        hour,
        value: Math.min(100, Math.max(10, Math.round(base)))
      });
    });
  });
  return map;
}

function generateCategories() {
  return [
    { name: '日配食品', nameEn: 'Daily Foods', revenue: 5120000, share: 23.8 },
    { name: '加工食品', nameEn: 'Processed', revenue: 4280000, share: 19.9 },
    { name: '菓子', nameEn: 'Snacks', revenue: 2850000, share: 13.2 },
    { name: '飲料', nameEn: 'Beverages', revenue: 2480000, share: 11.5 },
    { name: '酒類', nameEn: 'Alcohol', revenue: 2120000, share: 9.8 },
    { name: '生鮮食品', nameEn: 'Fresh', revenue: 1860000, share: 8.6 },
    { name: '冷凍食品', nameEn: 'Frozen', revenue: 1420000, share: 6.6 },
    { name: '日用品', nameEn: 'Daily Goods', revenue: 980000, share: 4.5 },
    { name: '化粧品', nameEn: 'Cosmetics', revenue: 450000, share: 2.1 }
  ];
}

function generateTopItems() {
  return [
    { name: 'プレミアム牛乳 1L', category: '日配食品', sales: 4580, revenue: 916000 },
    { name: '食パン 6枚切り', category: '日配食品', sales: 4120, revenue: 576800 },
    { name: 'ミネラルウォーター 2L', category: '飲料', sales: 3860, revenue: 347400 },
    { name: 'カップヌードル 各種', category: '加工食品', sales: 3580, revenue: 644400 },
    { name: 'バナナ 1房', category: '生鮮食品', sales: 3320, revenue: 431600 },
    { name: 'ヨーグルト 4個パック', category: '日配食品', sales: 3080, revenue: 523600 },
    { name: '卵 10個入り', category: '日配食品', sales: 2920, revenue: 642400 },
    { name: 'ポテトチップス 各種', category: '菓子', sales: 2780, revenue: 389200 },
    { name: '缶ビール 350ml 6本', category: '酒類', sales: 2540, revenue: 838200 },
    { name: 'インスタントコーヒー', category: '飲料', sales: 2280, revenue: 592800 }
  ];
}

function generateCustomers(count) {
  const ages = ['10代', '20代', '30代', '40代', '50代', '60代', '70代', '80代以上'];
  const genders = ['女性', '男性'];
  const lifestages = ['単身', 'DINKS', 'DEWKS', '老年夫婦', 'その他'];
  const categories = ['日配食品', '加工食品', '菓子', '飲料', '酒類'];
  const customers = [];

  for (let i = 0; i < count; i++) {
    const totalSpend = Math.round(30000 + Math.random() * 470000);
    const visits = Math.round(3 + Math.random() * 47);

    customers.push({
      id: `CU${String(i + 1).padStart(6, '0')}`,
      totalSpend,
      visits,
      avgBasket: Math.round(totalSpend / visits),
      lastVisit: Math.round(1 + Math.random() * 28),
      age: ages[Math.floor(Math.random() * ages.length)],
      gender: genders[Math.floor(Math.random() * genders.length)],
      lifestage: lifestages[Math.floor(Math.random() * lifestages.length)],
      topCategory: categories[Math.floor(Math.random() * categories.length)],
      rfmScore: {
        r: Math.floor(Math.random() * 5) + 1,
        f: Math.floor(Math.random() * 5) + 1,
        m: Math.floor(Math.random() * 5) + 1
      },
      dna: {
        frequency: Math.round(20 + Math.random() * 80),
        basket: Math.round(20 + Math.random() * 80),
        variety: Math.round(20 + Math.random() * 80),
        loyalty: Math.round(20 + Math.random() * 80),
        timing: Math.round(20 + Math.random() * 80)
      },
      timeline: generateTimeline()
    });
  }

  return customers.sort((a, b) => b.totalSpend - a.totalSpend);
}

function generateTimeline() {
  const timeline = [];
  for (let i = 0; i < 8; i++) {
    const day = Math.round(1 + Math.random() * 28);
    timeline.push({
      date: `10/${day}`,
      amount: Math.round(800 + Math.random() * 8000),
      items: Math.round(2 + Math.random() * 12)
    });
  }
  return timeline.sort((a, b) => {
    const dayA = parseInt(a.date.split('/')[1]);
    const dayB = parseInt(b.date.split('/')[1]);
    return dayB - dayA;
  });
}

function generateRFMMatrix() {
  const matrix = [];
  for (let r = 5; r >= 1; r--) {
    for (let m = 1; m <= 5; m++) {
      let count;
      const isChampion = r >= 4 && m >= 4;
      const isLoyal = r >= 3 && m >= 3 && !isChampion;
      const isAtRisk = r <= 2 && m >= 4;

      if (isChampion) count = Math.round(180 + Math.random() * 320);
      else if (isAtRisk) count = Math.round(40 + Math.random() * 80);
      else if (r <= 2 && m <= 2) count = Math.round(250 + Math.random() * 350);
      else count = Math.round(80 + Math.random() * 180);

      matrix.push({ r, m, count, isChampion, isLoyal, isAtRisk });
    }
  }
  return matrix;
}

function generateCrossSellLinks() {
  const items = [
    { id: 'milk', name: '牛乳', group: 'daily' },
    { id: 'bread', name: 'パン', group: 'daily' },
    { id: 'egg', name: '卵', group: 'daily' },
    { id: 'yogurt', name: 'ヨーグルト', group: 'daily' },
    { id: 'noodle', name: 'カップ麺', group: 'processed' },
    { id: 'snack', name: 'スナック菓子', group: 'processed' },
    { id: 'rice', name: 'お米', group: 'processed' },
    { id: 'water', name: 'ミネラルウォーター', group: 'beverage' },
    { id: 'beer', name: 'ビール', group: 'beverage' },
    { id: 'coffee', name: 'コーヒー', group: 'beverage' },
    { id: 'tissue', name: 'ティッシュ', group: 'other' },
    { id: 'detergent', name: '洗剤', group: 'other' }
  ];

  const links = [
    { source: 'milk', target: 'bread', value: 85 },
    { source: 'milk', target: 'egg', value: 72 },
    { source: 'bread', target: 'egg', value: 68 },
    { source: 'milk', target: 'yogurt', value: 65 },
    { source: 'noodle', target: 'snack', value: 58 },
    { source: 'beer', target: 'snack', value: 75 },
    { source: 'water', target: 'snack', value: 45 },
    { source: 'coffee', target: 'bread', value: 52 },
    { source: 'rice', target: 'egg', value: 48 },
    { source: 'tissue', target: 'detergent', value: 62 },
    { source: 'beer', target: 'noodle', value: 42 }
  ];

  return { items, links };
}

// ================================================================
// GLOBAL STATE
// ================================================================
let currentData = DEMO_DATA;
let charts = {};
let slicerState = {
  gender: 'all',
  age: 'all',
  lifestage: 'all'
};

// ================================================================
// INITIALIZATION
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initSlicers();
  initFileUpload();
  renderAllVisualization();
});

// ================================================================
// NAVIGATION
// ================================================================
function initNavigation() {
  const tabs = document.querySelectorAll('.nav-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.getElementById(`panel-${tab.dataset.tab}`).classList.add('active');
    });
  });
}

// ================================================================
// SLICERS
// ================================================================
function initSlicers() {
  document.querySelectorAll('.slicer-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const slicer = btn.dataset.slicer;
      const value = btn.dataset.value;

      // Update active state
      document.querySelectorAll(`.slicer-btn[data-slicer="${slicer}"]`).forEach(b => {
        b.classList.remove('active');
      });
      btn.classList.add('active');

      // Update state
      slicerState[slicer] = value;

      // Re-render with filtered data
      renderAllVisualization();
    });
  });
}

// ================================================================
// FILE UPLOAD
// ================================================================
function initFileUpload() {
  const overlay = document.getElementById('uploadOverlay');
  const zone = document.getElementById('uploadZone');
  const input = document.getElementById('fileInput');
  const closeBtn = document.getElementById('uploadClose');
  const openBtn = document.getElementById('uploadBtn');

  openBtn.addEventListener('click', () => overlay.classList.add('active'));
  closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  zone.addEventListener('click', () => input.click());

  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('drag-over');
  });

  zone.addEventListener('dragleave', () => zone.classList.remove('drag-over'));

  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('drag-over');
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  });

  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (file) processFile(file);
  });
}

function processFile(file) {
  Papa.parse(file, {
    header: true,
    skipEmptyLines: true,
    encoding: 'Shift_JIS',
    complete: results => {
      if (results.data.length === 0) {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: handleParsedData
        });
      } else {
        handleParsedData(results);
      }
    }
  });
}

function handleParsedData(results) {
  console.log('Loaded:', results.data.length, 'rows');
  document.getElementById('uploadOverlay').classList.remove('active');
  alert(`${results.data.length}件のデータを読み込みました。\n解析を開始します。`);
  // In production, transform CSV to visualization format here
}

// ================================================================
// RENDER ALL VISUALIZATIONS
// ================================================================
function renderAllVisualization() {
  renderHeroStats();
  renderMetrics();
  renderDailyChart();
  renderHourlyChart();
  renderCongestionHeatmap();
  renderCategoryChart();
  renderTopItemsChart();
  renderCrossSellNetwork();
  renderAttributeDistributions();
  renderRFMMatrix();
  renderCustomerList();
}

// ================================================================
// HERO STATS
// ================================================================
function renderHeroStats() {
  const total = currentData.dailySales.reduce((sum, d) => sum + d.revenue, 0);
  animateValue('heroRevenue', total, '¥', true);
}

// ================================================================
// KEY METRICS
// ================================================================
function renderMetrics() {
  const total = currentData.dailySales.reduce((sum, d) => sum + d.revenue, 0);
  const transactions = Math.round(total / 2920);
  const avgBasket = Math.round(total / transactions);
  const customers = Math.round(transactions * 0.68);
  const items = Math.round(transactions * 4.5);

  animateValue('metricTransactions', transactions);
  animateValue('metricBasket', avgBasket, '¥');
  animateValue('metricCustomers', customers);
  animateValue('metricItems', items);

  document.getElementById('metricTransactionsChange').textContent = '+7.8% 前月比';
  document.getElementById('metricBasketChange').textContent = '+2.9% 前月比';
  document.getElementById('metricCustomersChange').textContent = '+4.6% 前月比';
  document.getElementById('metricItemsChange').textContent = '+11.2% 前月比';
}

function animateValue(elementId, targetValue, prefix = '', useMillion = false) {
  const el = document.getElementById(elementId);
  const duration = 1200;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(targetValue * eased);

    if (useMillion && current >= 1000000) {
      el.textContent = prefix + (current / 1000000).toFixed(1) + 'M';
    } else {
      el.textContent = prefix + current.toLocaleString();
    }

    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// ================================================================
// DAILY CHART
// ================================================================
function renderDailyChart() {
  const ctx = document.getElementById('dailyChart').getContext('2d');
  if (charts.daily) charts.daily.destroy();

  charts.daily = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: currentData.dailySales.map(d => d.date),
      datasets: [{
        data: currentData.dailySales.map(d => d.revenue),
        backgroundColor: currentData.dailySales.map(d =>
          d.isHoliday ? '#FFFFFF' :
          d.isWeekend ? '#152238' :
          '#FF0000'
        ),
        borderRadius: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: '#000',
          titleFont: { family: 'Noto Sans JP' },
          bodyFont: { family: 'Noto Sans JP' },
          callbacks: {
            label: ctx => `売上: ¥${ctx.raw.toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#757575', font: { size: 9 }, maxRotation: 0 },
          grid: { display: false }
        },
        y: {
          ticks: {
            color: '#757575',
            font: { size: 10 },
            callback: v => `¥${(v / 10000).toFixed(0)}万`
          },
          grid: { color: '#212121' }
        }
      }
    }
  });
}

// ================================================================
// HOURLY CHART
// ================================================================
function renderHourlyChart() {
  const ctx = document.getElementById('hourlyChart').getContext('2d');
  if (charts.hourly) charts.hourly.destroy();

  charts.hourly = new Chart(ctx, {
    type: 'line',
    data: {
      labels: currentData.hourlySales.map(d => d.label),
      datasets: [{
        data: currentData.hourlySales.map(d => d.value),
        borderColor: '#FF0000',
        backgroundColor: 'rgba(255, 0, 0, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 5,
        pointBackgroundColor: '#FF0000',
        pointBorderColor: '#000',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `来客指数: ${ctx.raw}%`
          }
        }
      },
      scales: {
        x: {
          ticks: { color: '#757575', font: { size: 10 } },
          grid: { display: false }
        },
        y: {
          ticks: {
            color: '#757575',
            callback: v => `${v}%`
          },
          grid: { color: '#212121' },
          min: 0,
          max: 120
        }
      }
    }
  });
}

// ================================================================
// CONGESTION HEATMAP
// ================================================================
function renderCongestionHeatmap() {
  const container = document.getElementById('congestionHeatmap');
  const days = ['日', '月', '火', '水', '木', '金', '土'];
  const hours = Array.from({ length: 13 }, (_, i) => i + 9);

  let html = '<div class="heatmap-header"></div>';
  hours.forEach(h => {
    html += `<div class="heatmap-header">${h}時</div>`;
  });

  days.forEach((day, di) => {
    html += `<div class="heatmap-label">${day}</div>`;
    hours.forEach(hour => {
      const cell = currentData.congestionMap.find(c => c.day === di && c.hour === hour);
      const level = Math.ceil(cell.value / 20);
      html += `<div class="heatmap-cell l${level}" title="${day}曜 ${hour}時: ${cell.value}%"></div>`;
    });
  });

  container.innerHTML = html;
}

// ================================================================
// CATEGORY CHART
// ================================================================
function renderCategoryChart() {
  const ctx = document.getElementById('categoryChart').getContext('2d');
  if (charts.category) charts.category.destroy();

  charts.category = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: currentData.categories.map(c => c.name),
      datasets: [{
        data: currentData.categories.map(c => c.revenue),
        backgroundColor: [
          '#FF0000', '#FFFFFF', '#152238', '#FF0000', '#FFFFFF',
          '#152238', '#FF0000', '#FFFFFF', '#152238'
        ],
        borderRadius: 2
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `売上: ¥${ctx.raw.toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#757575',
            callback: v => `¥${(v / 10000).toFixed(0)}万`
          },
          grid: { color: '#212121' }
        },
        y: {
          ticks: { color: '#BDBDBD', font: { size: 11 } },
          grid: { display: false }
        }
      }
    }
  });
}

// ================================================================
// TOP ITEMS CHART
// ================================================================
function renderTopItemsChart() {
  const ctx = document.getElementById('topItemsChart').getContext('2d');
  if (charts.topItems) charts.topItems.destroy();

  const top8 = currentData.topItems.slice(0, 8);

  charts.topItems = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: top8.map(i => i.name.substring(0, 12)),
      datasets: [{
        data: top8.map(i => i.revenue),
        backgroundColor: '#FF0000',
        borderRadius: 2
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: ctx => `売上: ¥${ctx.raw.toLocaleString()}`
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#757575',
            callback: v => `¥${(v / 10000).toFixed(0)}万`
          },
          grid: { color: '#212121' }
        },
        y: {
          ticks: { color: '#BDBDBD', font: { size: 10 } },
          grid: { display: false }
        }
      }
    }
  });
}

// ================================================================
// CROSS-SELL NETWORK (D3.js)
// ================================================================
function renderCrossSellNetwork() {
  const svg = d3.select('#crossSellNetwork');
  svg.selectAll('*').remove();

  const container = document.querySelector('.network-container');
  const width = container.clientWidth;
  const height = container.clientHeight;

  svg.attr('width', width).attr('height', height);

  const { items, links } = currentData.crossSellLinks;

  const colorMap = {
    daily: '#FF0000',
    processed: '#FFFFFF',
    beverage: '#152238',
    other: '#757575'
  };

  const simulation = d3.forceSimulation(items)
    .force('link', d3.forceLink(links).id(d => d.id).distance(120))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(50));

  const link = svg.append('g')
    .selectAll('line')
    .data(links)
    .join('line')
    .attr('stroke', '#424242')
    .attr('stroke-opacity', 0.6)
    .attr('stroke-width', d => d.value / 20);

  const node = svg.append('g')
    .selectAll('circle')
    .data(items)
    .join('circle')
    .attr('r', 24)
    .attr('fill', d => colorMap[d.group])
    .attr('stroke', '#000')
    .attr('stroke-width', 2)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  const label = svg.append('g')
    .selectAll('text')
    .data(items)
    .join('text')
    .text(d => d.name)
    .attr('font-family', 'Noto Sans JP')
    .attr('font-size', 10)
    .attr('fill', '#9E9E9E')
    .attr('text-anchor', 'middle')
    .attr('dy', 40);

  simulation.on('tick', () => {
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);

    label
      .attr('x', d => d.x)
      .attr('y', d => d.y);
  });

  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }

  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }

  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
}

// ================================================================
// ATTRIBUTE DISTRIBUTIONS
// ================================================================
function renderAttributeDistributions() {
  renderAttributeBars('ageDistribution', currentData.ageDistribution, 'red');
  renderAttributeBars('genderDistribution', currentData.genderDistribution, 'navy');
  renderAttributeBars('lifestageDistribution', currentData.lifestageDistribution, 'white');
}

function renderAttributeBars(containerId, data, colorClass) {
  const container = document.getElementById(containerId);
  const maxValue = Math.max(...data.map(d => d.value));

  container.innerHTML = data.map(d => `
    <div class="attribute-row">
      <div class="attribute-row-header">
        <span class="attribute-row-label">${d.label}</span>
        <span class="attribute-row-value">${d.value}%</span>
      </div>
      <div class="attribute-row-bar">
        <div class="attribute-row-fill ${colorClass}" style="width: ${(d.value / maxValue) * 100}%;"></div>
      </div>
    </div>
  `).join('');
}

// ================================================================
// RFM MATRIX
// ================================================================
function renderRFMMatrix() {
  const container = document.getElementById('rfmGrid');

  container.innerHTML = currentData.rfmMatrix.map(cell => {
    let className = 'rfm-cell';
    let label = '';

    if (cell.isChampion) {
      className += ' champion';
      label = '優良';
    } else if (cell.isLoyal) {
      className += ' loyal';
      label = 'ロイヤル';
    } else if (cell.isAtRisk) {
      className += ' at-risk';
      label = '要注意';
    }

    return `
      <div class="${className}" title="R${cell.r} x M${cell.m}: ${cell.count}人">
        <span class="rfm-cell-count">${cell.count}</span>
        <span class="rfm-cell-label">${label}</span>
      </div>
    `;
  }).join('');
}

// ================================================================
// CUSTOMER LIST (N1)
// ================================================================
function renderCustomerList() {
  const container = document.getElementById('customerList');

  container.innerHTML = currentData.customers.slice(0, 30).map((c, i) => `
    <div class="entity-item" data-index="${i}">
      <p class="entity-rank">RANK #${i + 1}</p>
      <p class="entity-name">${c.id}</p>
      <p class="entity-meta">¥${c.totalSpend.toLocaleString()} / ${c.visits}回 / ${c.age} ${c.gender}</p>
    </div>
  `).join('');

  container.querySelectorAll('.entity-item').forEach(item => {
    item.addEventListener('click', () => {
      container.querySelectorAll('.entity-item').forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      const index = parseInt(item.dataset.index);
      renderCustomerDetail(currentData.customers[index]);
    });
  });
}

function renderCustomerDetail(customer) {
  const container = document.getElementById('customerDetail');

  container.innerHTML = `
    <div style="margin-bottom: var(--space-xl);">
      <p class="typo-title" style="color: var(--red); margin-bottom: var(--space-xs);">${customer.id}</p>
      <p class="typo-caption">${customer.age} / ${customer.gender} / ${customer.lifestage}</p>
    </div>

    <div class="entity-profile">
      <div class="profile-stat">
        <p class="profile-stat-value red">¥${(customer.totalSpend / 1000).toFixed(0)}K</p>
        <p class="profile-stat-label">総購買額</p>
      </div>
      <div class="profile-stat">
        <p class="profile-stat-value">${customer.visits}</p>
        <p class="profile-stat-label">来店回数</p>
      </div>
      <div class="profile-stat">
        <p class="profile-stat-value">¥${customer.avgBasket.toLocaleString()}</p>
        <p class="profile-stat-label">平均客単価</p>
      </div>
      <div class="profile-stat">
        <p class="profile-stat-value">${customer.lastVisit}日前</p>
        <p class="profile-stat-label">最終来店</p>
      </div>
    </div>

    <div style="margin-bottom: var(--space-xl);">
      <p class="typo-label" style="color: var(--gray-500); margin-bottom: var(--space-md);">顧客DNAレーダー</p>
      <div class="radar-container">
        <canvas id="customerRadar"></canvas>
      </div>
    </div>

    <div>
      <p class="typo-label" style="color: var(--gray-500); margin-bottom: var(--space-md);">購買タイムライン</p>
      <div class="timeline-container">
        ${customer.timeline.map(t => `
          <div class="timeline-item">
            <span class="timeline-date">${t.date}</span>
            <div class="timeline-content">
              <p class="timeline-amount">¥${t.amount.toLocaleString()}</p>
              <p class="timeline-items">${t.items}点購入</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;

  renderCustomerRadar(customer);
}

function renderCustomerRadar(customer) {
  const ctx = document.getElementById('customerRadar');
  if (!ctx) return;

  new Chart(ctx.getContext('2d'), {
    type: 'radar',
    data: {
      labels: ['購買頻度', '客単価', '購買多様性', 'ロイヤルティ', '来店時間帯'],
      datasets: [{
        data: [
          customer.dna.frequency,
          customer.dna.basket,
          customer.dna.variety,
          customer.dna.loyalty,
          customer.dna.timing
        ],
        backgroundColor: 'rgba(255, 0, 0, 0.2)',
        borderColor: '#FF0000',
        borderWidth: 2,
        pointBackgroundColor: '#FF0000',
        pointBorderColor: '#000',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        r: {
          beginAtZero: true,
          max: 100,
          ticks: {
            stepSize: 20,
            color: '#757575',
            backdropColor: 'transparent'
          },
          grid: { color: '#424242' },
          angleLines: { color: '#424242' },
          pointLabels: {
            color: '#9E9E9E',
            font: { family: 'Noto Sans JP', size: 10 }
          }
        }
      }
    }
  });
}

// ================================================================
// WINDOW RESIZE HANDLER
// ================================================================
window.addEventListener('resize', () => {
  renderCrossSellNetwork();
});
