/**
 * simulation.js - Canvas-based Retail Graph Simulation
 * DATA EDITORIAL v4.0
 */

// ==================== SIMULATION STATE ====================
let simCanvas, simCtx;
let simRunning = false;
let simAnimId = null;
let particles = [];
let simComplete = 0;
let simTotalTime = 0;

// ==================== INITIALIZATION ====================
function initSimulation() {
  simCanvas = document.getElementById('simCanvas');
  simCtx = simCanvas.getContext('2d');
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  drawStaticGraph();
}

function resizeCanvas() {
  const rect = simCanvas.parentElement.getBoundingClientRect();
  simCanvas.width = rect.width;
  simCanvas.height = 500;
  if (!simRunning) drawStaticGraph();
}

// ==================== COORDINATE HELPERS ====================
function getNodePos(node) {
  return {
    x: node.x * simCanvas.width,
    y: node.y * simCanvas.height
  };
}

// ==================== STATIC GRAPH DRAWING ====================
function drawStaticGraph() {
  const ctx = simCtx;
  const W = simCanvas.width;
  const H = simCanvas.height;

  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, W, H);

  // Draw edges
  ctx.strokeStyle = 'rgba(0, 43, 97, 0.6)';
  ctx.lineWidth = 2;
  GRAPH_EDGES.forEach(edge => {
    const fromNode = GRAPH_NODES.find(n => n.id === edge.from);
    const toNode = GRAPH_NODES.find(n => n.id === edge.to);
    if (fromNode && toNode) {
      const from = getNodePos(fromNode);
      const to = getNodePos(toNode);
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.stroke();
    }
  });

  // Draw nodes
  GRAPH_NODES.forEach(node => {
    const pos = getNodePos(node);
    const size = node.size * (node.heat / 100 * 0.3 + 0.7);

    // Glow effect
    const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, size * 1.5);
    gradient.addColorStop(0, node.color + '40');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, size * 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Hexagon shape
    ctx.fillStyle = node.color;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i - Math.PI / 6;
      const px = pos.x + size * Math.cos(angle);
      const py = pos.y + size * Math.sin(angle);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fill();

    // Label
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 10px Montserrat';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.label, pos.x, pos.y);
  });
}

// ==================== PARTICLE SPAWNING ====================
function spawnParticle() {
  const entrance = GRAPH_NODES.find(n => n.id === 'entrance');
  const pos = getNodePos(entrance);
  const hue = Math.random() * 60 + 160; // Cyan to green

  particles.push({
    x: pos.x,
    y: pos.y + (Math.random() - 0.5) * 40,
    currentNode: 'entrance',
    targetNode: null,
    progress: 0,
    speed: 0.008 + Math.random() * 0.006,
    startTime: performance.now(),
    color: `hsl(${hue}, 85%, 55%)`,
    trail: [],
    waiting: false,
    waitEnd: 0
  });
}

// ==================== NEXT NODE SELECTION (PROBABILITY) ====================
function getNextNode(currentId) {
  const possibleEdges = GRAPH_EDGES.filter(e => e.from === currentId);
  if (possibleEdges.length === 0) return null;

  const rand = Math.random();
  let cumulative = 0;
  for (const edge of possibleEdges) {
    cumulative += edge.weight;
    if (rand <= cumulative) return edge.to;
  }
  return possibleEdges[possibleEdges.length - 1].to;
}

// ==================== SIMULATION UPDATE ====================
function updateSimulation() {
  const now = performance.now();

  particles.forEach(p => {
    // Store trail point
    p.trail.push({ x: p.x, y: p.y, age: 0 });
    if (p.trail.length > 25) p.trail.shift();
    p.trail.forEach(t => t.age++);

    // Waiting at node
    if (p.waiting) {
      if (now >= p.waitEnd) {
        p.waiting = false;
        p.targetNode = getNextNode(p.currentNode);
        if (!p.targetNode) {
          // Reached checkout - mark for removal
          p.remove = true;
          simComplete++;
          simTotalTime += (now - p.startTime) / 1000;
        }
        p.progress = 0;
      }
      return;
    }

    // Moving to target
    if (p.targetNode) {
      p.progress += p.speed;
      if (p.progress >= 1) {
        p.currentNode = p.targetNode;
        p.targetNode = null;
        p.progress = 0;
        p.waiting = true;
        p.waitEnd = now + 300 + Math.random() * 500;
      } else {
        const fromNode = GRAPH_NODES.find(n => n.id === p.currentNode);
        const toNode = GRAPH_NODES.find(n => n.id === p.targetNode);
        const from = getNodePos(fromNode);
        const to = getNodePos(toNode);

        // Eased interpolation
        const t = p.progress;
        const ease = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
        p.x = from.x + (to.x - from.x) * ease;
        p.y = from.y + (to.y - from.y) * ease;
      }
    } else {
      // Get next target
      p.targetNode = getNextNode(p.currentNode);
      if (!p.targetNode && p.currentNode !== 'checkout') {
        p.targetNode = 'checkout';
      }
    }
  });

  // Remove completed particles
  particles = particles.filter(p => !p.remove);

  // Update stats display
  document.getElementById('simActive').textContent = particles.length;
  document.getElementById('simComplete').textContent = simComplete;
  document.getElementById('simAvgTime').textContent = simComplete > 0 ? (simTotalTime / simComplete).toFixed(1) : '0.0';
}

// ==================== SIMULATION RENDERING ====================
function renderSimulation() {
  const ctx = simCtx;
  const W = simCanvas.width;
  const H = simCanvas.height;

  // Fade effect
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
  ctx.fillRect(0, 0, W, H);

  // Redraw static graph
  drawStaticGraph();

  // Draw particles with neon trails
  particles.forEach(p => {
    // Trail
    if (p.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(p.trail[0].x, p.trail[0].y);
      for (let i = 1; i < p.trail.length; i++) {
        ctx.lineTo(p.trail[i].x, p.trail[i].y);
      }
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.globalAlpha = 0.6;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    // Particle head with glow
    const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, 12);
    gradient.addColorStop(0, p.color);
    gradient.addColorStop(0.5, p.color + '80');
    gradient.addColorStop(1, 'transparent');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
    ctx.fill();

    // White core
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

// ==================== SIMULATION LOOP ====================
function simLoop() {
  if (!simRunning) return;
  updateSimulation();
  renderSimulation();
  simAnimId = requestAnimationFrame(simLoop);
}

// ==================== TOGGLE SIMULATION ====================
function toggleSimulation() {
  const btn = document.getElementById('simToggle');

  if (simRunning) {
    // Stop simulation
    simRunning = false;
    cancelAnimationFrame(simAnimId);
    btn.textContent = 'START';
    btn.classList.remove('running');
    drawStaticGraph();
  } else {
    // Start simulation
    simRunning = true;
    particles = [];
    simComplete = 0;
    simTotalTime = 0;
    btn.textContent = 'STOP';
    btn.classList.add('running');

    // Spawn particles periodically
    const spawner = setInterval(() => {
      if (!simRunning) {
        clearInterval(spawner);
        return;
      }
      if (particles.length < 40) spawnParticle();
    }, 350);

    simLoop();
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { initSimulation, toggleSimulation, drawStaticGraph };
}
