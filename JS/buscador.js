const TEAMS_URL = "https://premiervl.github.io/PVL-Tools/JS/teams.json";

let allPlayers = [];

const filters = {
  name: "",
  team: "all",
  nat: "all",
  position: "all",
  ageMin: 16,
  ageMax: 40
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
    const teams = await fetch(TEAMS_URL).then(r => r.json());

    for (const t of teams) {
      const txt = await fetch(t.dropbox_dir).then(r => r.text());
      allPlayers.push(...parseTeam(txt, t.team));
    }

    // Mostrar controles y tabla después de cargar
    document.getElementById('loading').style.display = 'none';
    document.getElementById('controls').style.display = 'block';
    document.getElementById('tableContainer').style.display = 'table';

    buildFilters();
    update();
  } catch (error) {
    document.getElementById('loading').innerHTML = '❌ Error al cargar datos';
    console.error('Error loading data:', error);
  }
}

// ---------------- FILTER CORE ----------------
function filterPlayers() {
  return allPlayers.filter(p => {
    // Filtro por nombre
    if (filters.name && !p.name.toLowerCase().includes(filters.name.toLowerCase())) {
      return false;
    }

    if (filters.team !== "all" && p.team !== filters.team) return false;
    if (filters.nat !== "all" && p.nat !== filters.nat) return false;

    if (p.age < filters.ageMin || p.age > filters.ageMax) return false;

    if (filters.position !== "all") {
      if (!matchPosition(p, filters.position)) return false;
    }

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

// ---------------- UI ACTIONS ----------------
function setPos(pos) {
  filters.position = pos;
  updatePositionButtons();
  update();
}

function resetFilters() {
  filters.name = "";
  filters.team = "all";
  filters.nat = "all";
  filters.position = "all";
  filters.ageMin = 16;
  filters.ageMax = 40;

  document.getElementById("nameSearch").value = "";
  document.getElementById("ageMin").value = 16;
  document.getElementById("ageMax").value = 40;

  updatePositionButtons();
  update();
}

// ---------------- BUILD FILTERS ----------------
function buildFilters() {
  const teamSel = document.getElementById("teamFilter");
  const natSel = document.getElementById("natFilter");

  const teams = [...new Set(allPlayers.map(p => p.team))].sort();
  const nats = [...new Set(allPlayers.map(p => p.nat))].sort();

  teamSel.innerHTML = `<option value="all">Todos equipos</option>` +
    teams.map(t => `<option value="${t}">${t}</option>`).join("");

  natSel.innerHTML = `<option value="all">Todos países</option>` +
    nats.map(n => `<option value="${n}">${n}</option>`).join("");

  teamSel.onchange = e => {
    filters.team = e.target.value;
    update();
  };

  natSel.onchange = e => {
    filters.nat = e.target.value;
    update();
  };

  // Name search
  document.getElementById("nameSearch").oninput = e => {
    filters.name = e.target.value;
    update();
  };

  // Age sliders
  const ageMin = document.getElementById("ageMin");
  const ageMax = document.getElementById("ageMax");

  ageMin.oninput = ageMax.oninput = () => {
    filters.ageMin = +ageMin.value;
    filters.ageMax = +ageMax.value;
    document.getElementById("ageLabel").innerText = `${filters.ageMin} - ${filters.ageMax}`;
    update();
  };

  ageMin.value = 16;
  ageMax.value = 40;
  document.getElementById("ageLabel").innerText = "16 - 40";

  // Position buttons
  document.querySelectorAll('.btn-pos').forEach(btn => {
    btn.onclick = () => setPos(btn.dataset.pos);
  });

  updatePositionButtons();
}

function updatePositionButtons() {
  document.querySelectorAll('.btn-pos').forEach(btn => {
    btn.classList.remove('btn-active');
    if (btn.dataset.pos === filters.position) {
      btn.classList.add('btn-active');
      btn.classList.remove('btn-secondary');
      btn.classList.add('btn-primary');
    } else {
      btn.classList.remove('btn-primary');
      btn.classList.add('btn-secondary');
    }
  });
}

// ---------------- RENDER ----------------
function render(players) {
  const tbody = document.getElementById("results");

  if (players.length === 0) {
    tbody.innerHTML = '<tr><td colspan="12" class="no-results">No se encontraron jugadores</td></tr>';
    return;
  }

  tbody.innerHTML = players.slice(0, 200).map(p => `
    <tr>
      <td>${p.name}</td>
      <td>${p.team}</td>
      <td>${p.age}</td>
      <td>${p.nat}</td>
      <td>${p.st}</td>
      <td>${p.tk}</td>
      <td>${p.ps}</td>
      <td>${p.sh}</td>
      <td>${p.kab}</td>
      <td>${p.tab}</td>
      <td>${p.pab}</td>
      <td>${p.sab}</td>
    </tr>
  `).join("");
}

// ---------------- UPDATE ----------------
function update() {
  const players = filterPlayers();
  render(players);
}

// ---------------- INIT ----------------
loadData();
