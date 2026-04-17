const TEAMS_URL = "https://premiervl.github.io/PVL-Tools/JS/teams.json";

let allPlayers = [];
let fuse;

// ---------------- PARSER ----------------
function parseTeam(txt, teamName) {
  const lines = txt.split("\n").slice(2);

  return lines
    .filter(line => line.trim() !== "")
    .map(line => {
      const p = line.trim().split(/\s+/);

      return {
        name: p[0],
        age: +p[1],
        nat: p[2],
        st: +p[3],
        tk: +p[4],
        ps: +p[5],
        sh: +p[6],
        ag: +p[7],
        team: teamName,
        rating: +p[3] + +p[4] + +p[5] + +p[6]
      };
    });
}

// ---------------- CARGA GLOBAL ----------------
async function loadData() {
  const teams = await fetch(TEAMS_URL).then(r => r.json());

  for (const team of teams) {
    try {
      const txt = await fetch(team.dropbox_dir).then(r => r.text());
      const players = parseTeam(txt, team.team);
      allPlayers.push(...players);
    } catch (err) {
      console.error("Error cargando", team.team);
    }
  }

  initSearch();
}

// ---------------- BUSCADOR ----------------
function initSearch() {
  fuse = new Fuse(allPlayers, {
    keys: ["name", "team", "nat"],
    threshold: 0.3
  });

  render(allPlayers);
}

// ---------------- RENDER ----------------
function render(players) {
  const tbody = document.getElementById("results");

  tbody.innerHTML = players
    .slice(0, 100) // limitar resultados
    .map(p => `
      <tr>
        <td>${p.name}</td>
        <td>${p.team}</td>
        <td>${p.age}</td>
        <td>${p.nat}</td>
        <td>${p.st}</td>
        <td>${p.tk}</td>
        <td>${p.ps}</td>
        <td>${p.sh}</td>
      </tr>
    `)
    .join("");
}

// ---------------- EVENTO BUSQUEDA ----------------
document.getElementById("search").addEventListener("input", e => {
  const q = e.target.value.trim();

  if (!q) {
    render(allPlayers);
    return;
  }

  const results = fuse.search(q).map(r => r.item);
  render(results);
});

// ---------------- INIT ----------------
loadData();
