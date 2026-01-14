/**
 * main.js - Application Entry Point & Event Handlers
 * DATA EDITORIAL v4.0
 */

// ==================== TAB NAVIGATION ====================
function initTabs() {
  const navBtns = document.querySelectorAll('.nav-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  navBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.dataset.tab;

      // Update active states
      navBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(t => t.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById('tab-' + tabId).classList.add('active');

      // Render tab-specific content with delay for DOM update
      if (tabId === 'trend') {
        setTimeout(() => {
          renderDailyChart();
          renderHourlyChart();
          renderHeatmap();
        }, 50);
      } else if (tabId === 'structure') {
        setTimeout(() => {
          renderCategoryChart();
          renderCategoryBarChart();
          renderNetworkGraph();
        }, 50);
      } else if (tabId === 'customer') {
        setTimeout(() => {
          renderDemoBars();
          renderRFMMatrix();
          renderPersonaRadars();
          renderN1Profile();
        }, 50);
      }
    });
  });
}

// ==================== CSV UPLOAD HANDLING ====================
function initUpload() {
  const zone = document.getElementById('uploadZone');
  const input = document.getElementById('csvInput');

  // Click to upload
  zone.addEventListener('click', () => input.click());

  // Drag and drop
  zone.addEventListener('dragover', e => {
    e.preventDefault();
    zone.classList.add('dragover');
  });

  zone.addEventListener('dragleave', () => {
    zone.classList.remove('dragover');
  });

  zone.addEventListener('drop', e => {
    e.preventDefault();
    zone.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file) parseCSV(file);
  });

  // File input change
  input.addEventListener('change', e => {
    if (e.target.files[0]) parseCSV(e.target.files[0]);
  });
}

// ==================== CSV PARSING ====================
function parseCSV(file) {
  Papa.parse(file, {
    header: true,
    encoding: 'Shift_JIS',
    skipEmptyLines: true,
    complete: results => {
      if (results.data && results.data.length > 0) {
        processCSVData(results.data, results.meta.fields);
        renderAll();
      }
    },
    error: err => console.error('CSV Parse Error:', err)
  });
}

// ==================== RENDER ALL ====================
function renderAll() {
  renderKPI();
  drawStaticGraph();
}

// ==================== INITIALIZATION ====================
function init() {
  // Generate demo data
  generateDemoData();

  // Render initial KPI
  renderKPI();

  // Initialize simulation
  initSimulation();

  // Initialize tabs
  initTabs();

  // Initialize upload handlers
  initUpload();

  // Simulation toggle button
  document.getElementById('simToggle').addEventListener('click', toggleSimulation);
}

// ==================== DOM READY ====================
document.addEventListener('DOMContentLoaded', init);
