/**
 * charts.js - Chart.js Rendering Functions
 * DATA EDITORIAL v4.0
 */

// ==================== CHART.JS SETUP ====================
Chart.defaults.color = '#A3A3A3';
Chart.defaults.borderColor = '#404040';
Chart.defaults.font.family = "'Montserrat', 'Noto Sans JP', sans-serif";

const chartInstances = {};

function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

// ==================== KPI RENDERING ====================
function renderKPI() {
  document.getElementById('kpiRevenue').textContent = '¥' + (DATA.kpi.revenue / 100000000).toFixed(1) + '億';
  document.getElementById('kpiTx').textContent = DATA.kpi.transactions.toLocaleString();
  document.getElementById('kpiBasket').textContent = '¥' + DATA.kpi.basket.toLocaleString();
  document.getElementById('kpiFreq').textContent = DATA.kpi.frequency.toFixed(1) + '回';
}

// ==================== DAILY TREND CHART ====================
function renderDailyChart() {
  destroyChart('chartDaily');
  const ctx = document.getElementById('chartDaily').getContext('2d');
  chartInstances['chartDaily'] = new Chart(ctx, {
    type: 'line',
    data: {
      labels: DATA.daily.map(d => d.day + '日'),
      datasets: [{
        label: '売上',
        data: DATA.daily.map(d => d.revenue / 1000000),
        borderColor: '#06B6D4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 0,
        pointHoverRadius: 6,
        pointHoverBackgroundColor: '#06B6D4',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { callbacks: { label: ctx => '¥' + ctx.raw.toFixed(1) + 'M' } }
      },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#262626' }, ticks: { callback: v => '¥' + v + 'M' } }
      }
    }
  });
}

// ==================== HOURLY PATTERN CHART ====================
function renderHourlyChart() {
  destroyChart('chartHourly');
  const ctx = document.getElementById('chartHourly').getContext('2d');
  chartInstances['chartHourly'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: DATA.hourly.map(h => h.hour + '時'),
      datasets: [{
        label: '来店数',
        data: DATA.hourly.map(h => h.value),
        backgroundColor: DATA.hourly.map(h => h.value > 7000 ? '#10B981' : h.value > 5000 ? '#06B6D4' : '#002B61'),
        borderRadius: 4,
        borderSkipped: false
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid: { display: false } },
        y: { grid: { color: '#262626' } }
      }
    }
  });
}

// ==================== HEATMAP ====================
function renderHeatmap() {
  const container = document.getElementById('heatmapContainer');
  let html = '<div class="heatmap-grid">';

  // Header row
  html += '<div class="heatmap-label"></div>';
  for (let h = 0; h < 24; h++) {
    html += `<div class="heatmap-hour">${h}</div>`;
  }

  // Data rows (Monday start)
  DATA.heatmap.forEach(row => {
    html += `<div class="heatmap-label">${row.day}</div>`;
    row.hours.forEach(cell => {
      const intensity = cell.value / 100;
      const color = cell.value > 0
        ? `rgba(6, 182, 212, ${0.2 + intensity * 0.8})`
        : 'rgba(38, 38, 38, 1)';
      html += `<div class="heatmap-cell" style="background:${color}" data-value="${cell.value > 0 ? cell.value : ''}"></div>`;
    });
  });

  html += '</div>';
  container.innerHTML = html;
}

// ==================== CATEGORY DOUGHNUT CHART ====================
function renderCategoryChart() {
  destroyChart('chartCategory');
  const ctx = document.getElementById('chartCategory').getContext('2d');
  chartInstances['chartCategory'] = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: DATA.categories.map(c => c.name),
      datasets: [{
        data: DATA.categories.map(c => c.value),
        backgroundColor: DATA.categories.map(c => c.color),
        borderWidth: 0,
        hoverOffset: 10
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '65%',
      plugins: {
        legend: { position: 'right', labels: { padding: 12, usePointStyle: true, pointStyle: 'circle' } },
        tooltip: { callbacks: { label: ctx => ctx.label + ': ' + ctx.raw + '%' } }
      }
    }
  });
}

// ==================== CATEGORY BAR CHART ====================
function renderCategoryBarChart() {
  destroyChart('chartCategoryBar');
  const ctx = document.getElementById('chartCategoryBar').getContext('2d');
  chartInstances['chartCategoryBar'] = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: DATA.categoryDetails.map(c => c.name),
      datasets: [{
        label: '売上（百万円）',
        data: DATA.categoryDetails.map(c => c.revenue / 1000000),
        backgroundColor: DATA.categories.map(c => c.color),
        borderRadius: 4
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
            label: ctx => '¥' + ctx.raw.toFixed(0) + 'M (構成比: ' + DATA.categoryDetails[ctx.dataIndex].share + '%)'
          }
        }
      },
      scales: {
        x: { grid: { color: '#262626' }, ticks: { callback: v => '¥' + v + 'M' } },
        y: { grid: { display: false } }
      }
    }
  });
}

// ==================== D3 NETWORK GRAPH ====================
function renderNetworkGraph() {
  const svg = d3.select('#networkSvg');
  svg.selectAll('*').remove();

  const width = svg.node().getBoundingClientRect().width;
  const height = 400;

  const nodes = DATA.categories.slice(0, 8).map((c, i) => ({
    id: c.name, group: i, value: c.value, color: c.color
  }));

  const links = [
    { source: '青果', target: '精肉', value: 0.68 },
    { source: '青果', target: '鮮魚', value: 0.52 },
    { source: '精肉', target: '惣菜', value: 0.71 },
    { source: '惣菜', target: '日配', value: 0.64 },
    { source: '日配', target: '飲料', value: 0.58 },
    { source: '飲料', target: '製菓', value: 0.45 },
    { source: '鮮魚', target: '酒類', value: 0.42 },
    { source: '青果', target: '日配', value: 0.55 },
    { source: '精肉', target: '飲料', value: 0.38 }
  ];

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).id(d => d.id).distance(100))
    .force('charge', d3.forceManyBody().strength(-400))
    .force('center', d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(50));

  const link = svg.append('g')
    .selectAll('line')
    .data(links)
    .enter().append('line')
    .attr('class', 'network-link')
    .attr('stroke', '#06B6D4')
    .attr('stroke-width', d => d.value * 5);

  const node = svg.append('g')
    .selectAll('circle')
    .data(nodes)
    .enter().append('circle')
    .attr('class', 'network-node')
    .attr('r', d => 15 + d.value)
    .attr('fill', d => d.color)
    .call(d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended));

  const label = svg.append('g')
    .selectAll('text')
    .data(nodes)
    .enter().append('text')
    .attr('class', 'network-label')
    .text(d => d.id);

  simulation.on('tick', () => {
    link.attr('x1', d => d.source.x).attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x).attr('y2', d => d.target.y);
    node.attr('cx', d => d.x).attr('cy', d => d.y);
    label.attr('x', d => d.x).attr('y', d => d.y + 4);
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

// ==================== DEMOGRAPHIC BARS ====================
function renderDemoBars() {
  const colors = { gender: ['#06B6D4', '#EC4899'], age: '#10B981', lifestage: '#F59E0B' };

  // Gender
  let html = '';
  DATA.genderDist.forEach((d, i) => {
    html += `<div class="demo-bar-container">
      <div class="demo-bar-label"><span>${d.label}</span><span>${d.value}%</span></div>
      <div class="demo-bar-track"><div class="demo-bar-fill" style="width:${d.value}%;background:${colors.gender[i]}"></div></div>
    </div>`;
  });
  document.getElementById('genderBars').innerHTML = html;

  // Age
  html = '';
  DATA.ageDist.forEach(d => {
    html += `<div class="demo-bar-container">
      <div class="demo-bar-label"><span>${d.label}</span><span>${d.value}%</span></div>
      <div class="demo-bar-track"><div class="demo-bar-fill" style="width:${d.value * 4}%;background:${colors.age}"></div></div>
    </div>`;
  });
  document.getElementById('ageBars').innerHTML = html;

  // Lifestage
  html = '';
  DATA.lifeDist.forEach(d => {
    html += `<div class="demo-bar-container">
      <div class="demo-bar-label"><span>${d.label}</span><span>${d.value}%</span></div>
      <div class="demo-bar-track"><div class="demo-bar-fill" style="width:${d.value * 3}%;background:${colors.lifestage}"></div></div>
    </div>`;
  });
  document.getElementById('lifeBars').innerHTML = html;
}

// ==================== RFM MATRIX ====================
function renderRFMMatrix() {
  const container = document.getElementById('rfmMatrix');
  const fLabels = ['High', 'Mid', 'Low'];
  const rLabels = ['High', 'Mid', 'Low'];

  let html = '<div class="rfm-matrix">';
  html += '<div class="rfm-header"></div>';
  fLabels.forEach(f => html += `<div class="rfm-header">F:${f}</div>`);

  rLabels.forEach(r => {
    html += `<div class="rfm-row-label">R:${r}</div>`;
    fLabels.forEach(f => {
      const cell = DATA.rfm.find(c => c.r === r && c.f === f) || { count: 0, label: '-', color: '#262626' };
      html += `<div class="rfm-cell" style="background:${cell.color}">${cell.count > 0 ? cell.count.toLocaleString() : '-'}</div>`;
    });
  });

  html += '</div>';
  container.innerHTML = html;
}

// ==================== PERSONA RADAR CHARTS ====================
function renderPersonaRadars() {
  const container = document.getElementById('personaGrid');
  container.innerHTML = DATA.personas.map((p, i) => `
    <div class="persona-card">
      <div class="persona-name">${p.name}</div>
      <div class="persona-tag">${p.tag}</div>
      <div class="persona-chart"><canvas id="radarChart${i}"></canvas></div>
    </div>
  `).join('');

  DATA.personas.forEach((p, i) => {
    const ctx = document.getElementById(`radarChart${i}`).getContext('2d');
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: Object.keys(p.scores),
        datasets: [{
          data: Object.values(p.scores),
          backgroundColor: p.color + '33',
          borderColor: p.color,
          borderWidth: 2,
          pointBackgroundColor: p.color,
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            beginAtZero: true,
            max: 100,
            ticks: { display: false },
            grid: { color: '#404040' },
            pointLabels: { color: '#A3A3A3', font: { size: 10 } }
          }
        }
      }
    });
  });
}

// ==================== N1 PROFILE ====================
function renderN1Profile() {
  const n = DATA.n1;
  document.getElementById('n1Name').textContent = n.name;
  document.getElementById('n1Tags').innerHTML = `
    <span class="n1-tag">${n.age}</span>
    <span class="n1-tag">${n.gender}</span>
    <span class="n1-tag">${n.lifestage}</span>
    <span class="n1-tag highlight">${n.rfmRank}</span>
  `;
  document.getElementById('n1Narrative').innerHTML = n.narrative;
  document.getElementById('n1Stats').innerHTML = `
    <div class="n1-stat"><div class="n1-stat-value">${n.stats.visits}</div><div class="n1-stat-label">来店回数/3M</div></div>
    <div class="n1-stat"><div class="n1-stat-value">¥${(n.stats.spend/1000).toFixed(0)}K</div><div class="n1-stat-label">累計購買額</div></div>
    <div class="n1-stat"><div class="n1-stat-value">¥${n.stats.basket.toLocaleString()}</div><div class="n1-stat-label">平均客単価</div></div>
    <div class="n1-stat"><div class="n1-stat-value">${n.stats.loyalty}</div><div class="n1-stat-label">ロイヤリティ</div></div>
  `;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderKPI, renderDailyChart, renderHourlyChart, renderHeatmap,
    renderCategoryChart, renderCategoryBarChart, renderNetworkGraph,
    renderDemoBars, renderRFMMatrix, renderPersonaRadars, renderN1Profile
  };
}
