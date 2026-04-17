const TEAMS_URL = "https://premiervl.github.io/PVL-Tools/JS/teams.json";

let allPlayers = [];

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

        kab: +p[8],
        tab: +p[9],
        pab: +p[10],
        sab: +p[11],

        team: teamName,
        rating: +p[3] + +p[4] + +p[5] + +p[6]
      };
    });
}

// ---------------- LOAD DATA ----------------
async function loadData() {
  // CACHE
  if (localStorage.getItem("players")) {
    allPlayers = JSON.parse(localStorage.getItem("players"));
    render(allPlayers);
    return;
  }

  const teams = await fetch(TEAMS_URL).then(r => r.json());

  for (const team of teams) {
    try {
      const txt = await fetch(team.dropbox_dir).then(r => r.text());
      const players = parseTeam(txt, team.team);
      allPlayers.push(...players);
    } catch (err) {
      console.error("Error con", team.team);
    }
  }

  localStorage.setItem("players", JSON.stringify(allPlayers));

  render(allPlayers);
}

// ---------------- FILTER ENGINE ----------------
function applyFilter(p, f) {
  // >
  if (f.includes(">")) {
    const [key, val] = f.split(">");
    return +p[key] > +val;
  }

  // <
  if (f.includes("<")) {
    const [key, val] = f.split("<");
    return +p[key] < +val;
  }

  // =
  if (f.includes("=")) {
    const [key, val] = f.split("=");

    if (key === "nat") {
      return p.nat.toLowerCase() === val;
    }

    return p[key] == val;
  }

  // búsqueda texto
  return (
    p.name.toLowerCase().includes(f) ||
    p.team.toLowerCase().includes(f) ||
    p.nat.toLowerCase().includes(f)
  );
}

// ---------------- SEARCH ----------------
document.getElementById("search").addEventListener("input", e => {
  const q = e.target.value.trim().toLowerCase();

  if (!q) {
    render(allPlayers);
    return;
  }

  const filters = q.split(" ");

  const results = allPlayers.filter(p =>
    filters.every(f => applyFilter(p, f))
  );

  render(results);
});

// ---------------- COLOR STATS ----------------
function colorStat(val) {
  if (val >= 12) return "good";
  if (val >= 8) return "mid";
  return "bad";
}

// ---------------- RENDER ----------------
function render(players) {
  const tbody = document.getElementById("results");

  tbody.innerHTML = players
    .slice(0, 100)
    .map(p => `
      <tr>
        <td>${p.name}</td>
        <td>${p.team}</td>
        <td>${p.age}</td>
        <td>${p.nat}</td>

        <td class="${colorStat(p.st)}">${p.st}</td>
        <td class="${colorStat(p.tk)}">${p.tk}</td>
        <td class="${colorStat(p.ps)}">${p.ps}</td>
        <td class="${colorStat(p.sh)}">${p.sh}</td>

        <td>${p.kab}</td>
        <td>${p.tab}</td>
        <td>${p.pab}</td>
        <td>${p.sab}</td>
      </tr>
    `)
    .join("");
}

// ---------------- INIT ----------------
loadData();
