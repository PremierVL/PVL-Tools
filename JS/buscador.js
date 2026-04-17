const TEAMS_URL = "https://premiervl.github.io/PVL-Tools/JS/teams.json";

let allPlayers = [];
let filteredPlayers = [];

const filters = {
  name: "",
  team: "all",
  nat: "all",
  position: "all",
  ageMin: 16, ageMax: 40,
  stMin: 0, stMax: 20,
  tkMin: 0, tkMax: 20
};

// ---------------- PARSER ----------------
function parseTeam(txt, teamName) {
  const lines = txt.split("\n").slice(2);
  return lines
    .filter(l => l.trim())
    .map(l => {
      const p = l.trim().split(/\s+/);
      return {
        name: p[0],
        age: +p[1],
        nat: p[2],
        st: +p[3],
        tk: +p[4],
        ps: +p[5],
        sh: +p[6],
        ag: +p[7],
        kab: +p[8],
        tab: +p[9],
        pab: +p[10],
        sab: +p[11],
        team: teamName
      };
    });
}

// ---------------- LOAD ----------------
async function loadData() {
  try {
    document.getElementById('loading').innerHTML = `
      <div class="spinner"></div>
      <div>Cargando equipos...</div>
    `;
    
    const teams = await fetch(TEAMS_URL).then(r => r.json());
    
    for (let i = 0; i < teams.length; i++) {
      const t = teams[i];
      const txt = await fetch(t.dropbox_dir).then(r => r.text());
      allPlayers.push(...parseTeam(txt, t.team));
      
      // Update progress cada 5 equipos
      if (i % 5 === 0) {
        document.getElementById('loading').innerHTML = `
          <div class="spinner"></div>
          <div>Procesando ${i+1}/${teams.length} equipos... (${allPlayers.length.toLocaleString()} jugadores)</div>
        `;
      }
    }

    // Mostrar interfaz
    document.getElementById('loading').style.display = 'none';
    document.getElementById('controls').style.display = 'block';
    
    buildFilters();
    updateAll();
    
  } catch (error) {
    document.getElementById('loading').innerHTML = '❌ Error al cargar datos. Revisa la consola.';
    console.error('Error:', error);
  }
}

// ---------------- FILTER CORE ----------------
function filterPlayers() {
  return allPlayers.filter(p => {
    // Nombre
    if (filters.name && !p.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
    
    // Equipo
    if (filters.team !== "all" && p.team !== filters.team) return false;
    
    // Nacionalidad
    if (filters.nat !== "all" && p.nat !== filters.nat) return false;
    
    // Edad
    if (p.age < filters.ageMin || p.age > filters.ageMax) return false;
    
    // ST
    if (p.st < filters.stMin || p.st > filters.stMax) return false;
    
    // TK
    if (p.tk < filters.tkMin || p.tk > filters.tkMax) return false;
    
    // Posición
    if (filters.position !== "all" && !matchPosition(p, filters.position)) return false;
    
    return true;
  });
}

// ---------------- POSITIONS ----------------
function matchPosition(p, pos) {
  if (pos === "GK") return p.st <= 2;
  if (pos === "DF") return p.tk >= 10;
  if (pos === "MF") return p.ps >= 10;
  if (pos === "FW") return p.sh >= 10;
  return true;
}

// ---------------- BUILD FILTERS ----------------
function buildFilters() {
  const teamSel = document.getElementById("teamFilter");
  const natSel = document.getElementById("natFilter");

  const teams = [...new Set(allPlayers.map(p => p.team))].sort();
  const nats = [...new Set(allPlayers.map(p => p.nat))].sort();

  teamSel.innerHTML = `<option value="all">Todos los equipos (${teams.length})</option>` +
    teams.map(t => `<option value="${t}">${t}</option>`).join("");

  natSel.innerHTML = `<option value="all">Todas las nacionalidades (${nats.length})</option>` +
    nats.map(n => `<option value="${n}">${n}</option>`).join("");

  // Event listeners
  teamSel.onchange = e => { filters.team = e.target.value; updateAll(); };
  natSel.onchange = e => { filters.nat = e.target.value; updateAll(); };

  document.getElementById("nameSearch").oninput = e => {
    filters.name = e.target.value;
    updateAll();
  };

  // Sliders
  setupSlider('ageMin', 'ageMax', 16, 40, updateAll);
  setupSlider('stMin', 'stMax', 0, 20, updateAll);
  setupSlider('tkMin', 'tkMax', 0, 20, updateAll);

  // Position buttons
  document.querySelectorAll('.pos-btn').forEach(btn => {
    btn.onclick = () => setPosition(btn.dataset.pos);
  });
}

function setupSlider(minId, maxId, minVal, maxVal, callback) {
  const minSlider = document.getElementById(minId);
  const maxSlider = document.getElementById(maxId);
  const minValSpan = document.getElementById(minId + 'Val');
  const maxValSpan = document.getElementById(maxId + 'Val');

  minSlider.min = minVal; maxSlider.min = minVal;
  minSlider.max = maxVal; maxSlider.max = maxVal;
  minSlider.value = minVal; maxSlider.value = maxVal;

  const updateSlider = () => {
    filters[minId] = +minSlider.value;
    filters[maxId] = +maxSlider.value;
    minValSpan.textContent = minSlider.value;
    maxValSpan.textContent = maxSlider.value;
    callback();
  };

  minSlider.oninput = maxSlider.oninput = updateSlider;
}

// ---------------- UI ACTIONS ----------------
function setPosition(pos) {
  filters.position = pos;
  updatePositionButtons();
  updateAll();
}

function updatePositionButtons() {
  document.querySelectorAll('.pos-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.pos === filters.position);
  });
}

function resetFilters() {
  filters.name = "";
  filters.team = "all";
  filters.nat = "all";
  filters.position = "all";
  filters.ageMin = 16; filters.ageMax = 40;
  filters.stMin = 0; filters.stMax = 20;
  filters.tkMin = 0; filters.tkMax = 20;

  // Reset UI
  document.getElementById("nameSearch").value = "";
  document.getElementById("teamFilter").value = "all";
  document.getElementById("natFilter").value = "all";
  
  setupSlider('ageMin', 'ageMax', 16, 40, () => {});
  setupSlider('stMin', 'stMax', 0, 20, () => {});
  setupSlider('tkMin', 'tkMax', 0, 20, () => {});

  updatePositionButtons();
  updateAll();
}

function updateAll() {
  filteredPlayers = filterPlayers();
  render(filteredPlayers);
  updateStats(filteredPlayers);
}

// ---------------- STATS ----------------
function updateStats(players) {
  document.getElementById('statsRow').style.display = 'flex';
  document.getElementById('totalPlayers').textContent = players.length.toLocaleString();
  
  if (players.length > 0) {
    const avgAge = Math.round(players.reduce((sum, p) => sum + p.age, 0) / players.length);
    const topStat = Math.max(...players.map(p => Math.max(p.st, p.tk, p.ps, p.sh)));
    
    document.getElementById('avgAge').textContent = avgAge;
    document.getElementById('topStat').textContent = topStat;
  }
}

// ---------------- RENDER ----------------
function render(players) {
  const tbody = document.getElementById("results");
  
  if (players.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="13" class="no-results">
          <div style="font-size: 4rem;">🔍</div>
          <div style="font-size: 1.3rem; margin: 20px 0;">No se encontraron jugadores</div>
          <div style="color: #64748b;">Prueba ajustando los filtros</div>
        </td>
      </tr>
    `;
    document.getElementById('tableContainer').style.display = 'block';
    return;
  }

  document.getElementById('tableContainer').style.display = 'block';
  
  tbody.innerHTML = players.slice(0, 500).map(p => `
    <tr>
      <td class="name-cell">${p.name}</td>
      <td>${p.team}</td>
      <td>${p.age}</td>
      <td>${p.nat}</td>
      <td style="color: ${p.st >= 15 ? '#10b981' : ''}">${p.st}</td>
      <td style="color: ${p.tk >= 15 ? '#10b981' : ''}">${p.tk}</td>
      <td>${p.ps}</td>
      <td style="color: ${p.sh >= 15 ? '#10b981' : ''}">${p.sh}</td>
      <td>${p.ag}</td>
      <td>${p.kab}</td>
      <td>${p.tab}</td>
      <td>${p.pab}</td>
      <td>${p.sab}</td>
    </tr>
  `).join("");
}

// ---------------- EXPORT ----------------
function exportResults() {
  if (filteredPlayers.length === 0) {
    alert('No hay jugadores para exportar');
    return;
  }

  const csv = [
    ['Nombre', 'Equipo', 'Edad', 'NAT', 'ST', 'TK', 'PS', 'SH', 'AG', 'KAb', 'TAb', 'PAb', 'SAb'],
    ...filteredPlayers.map(p => [
      p.name, p.team, p.age, p.nat, p.st, p.tk, p.ps, p.sh, p.ag, p.kab, p.tab, p.pab, p.sab
    ])
  ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `jugadores_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
}

// ---------------- INIT ----------------
loadData();
