// =====================================================
// PLANTILLA.JS - LFP Virtual (Estilo Besoccer)
// =====================================================

function getInitials(name) {
    const parts = name.replace(/_/g, ' ').split(' ');
    if (parts.length >= 2) {
        return parts[0][0] + parts[1][0];
    }
    return parts[0].substring(0, 2);
}

function getPositionByStats(st, tk, ps, sh) {
    const max = Math.max(st, tk, ps, sh);
    
    if (st > 0 && st === max) return 'por';
    if (tk > 0 && tk === max) return 'def';
    if (ps > 0 && ps === max) return 'med';
    if (sh > 0 && sh === max) return 'del';
    
    return 'del';
}

function getPositionName(pos) {
    const names = {
        'por': 'Porteros',
        'def': 'Defensas',
        'med': 'Centrocampistas',
        'del': 'Delanteros'
    };
    return names[pos] || pos;
}

function parseSquadData(text) {
    const lines = text.trim().split('\n');
    const players = [];
    
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const parts = line.split(/\s+/);
        
        if (parts.length >= 20) {
            const st = parseInt(parts[3]);
            const tk = parseInt(parts[4]);
            const ps = parseInt(parts[5]);
            const sh = parseInt(parts[6]);
            const gam = parseInt(parts[12]);
            
            const position = getPositionByStats(st, tk, ps, sh);
            
            players.push({
                name: parts[0],
                age: parseInt(parts[1]),
                nat: parts[2],
                st: st,
                tk: tk,
                ps: ps,
                sh: sh,
                position: position,
		kab: parseInt(parts[8]),    
                tab: parseInt(parts[9]),
		pab: parseInt(parts[10]),
                sab: parseInt(parts[11]),
                gam: gam,
                gls: parseInt(parts[20]),
                ass: parseInt(parts[21]),
		ktk: parseInt(parts[17])
            });
        }
    }
    
    return players;
}

function createPlayerRow(p) {
    const initials = getInitials(p.name);
    
    return `
        <tr class="row-body">
            <td class="player-img">
                <div>${initials}</div>
            </td>
            <td class="name">
                ${p.name}
            </td>
            <td class="flag-cell">
                <img src="./images/countries/${p.nat}.png" alt="${p.nat}" onerror="this.style.display='none'">
            </td>
	    <td data-stat="edad" class="age-cell">${p.age}</td>
            <td data-stat="pj">${p.st}</td>
            <td data-stat="pj">${p.tk}</td>
            <td data-stat="pj">${p.ps}</td>
            <td data-stat="pj">${p.sh}</td>
            <td data-stat="pj">${p.gam}</td>
            <td data-stat="goles">${p.gls}</td>
            <td data-stat="asistencias">${p.ass}</td>
	    <td data-stat="cortes">${p.ktk}</td>
            <td data-stat="abilidad" class="ability-cell">${p.kab}</td>
	    <td data-stat="abilidad" class="ability-cell">${p.tab}</td>
	    <td data-stat="abilidad" class="ability-cell">${p.pab}</td>
	    <td data-stat="abilidad" class="ability-cell">${p.sab}</td>
            <td data-stat="temp">1</td>
            <td data-stat="pjtotal" class="green">${p.gam}</td>
            <td data-stat="golestotal">${p.gls}</td>
            <td data-stat="asistotal">${p.ass}</td>
        </tr>
    `;
}

function createSectionHeader(position) {
    return `
        <tr class="row-head">
            <th colspan="2" class="main">${getPositionName(position)}</th>
            <th>Nat</th>
	    <th>Edad</th>
	    <th>St</th>
	    <th>Tk</th>
	    <th>Ps</th>
	    <th>Sh</th>
            <th>PJ</th>
            <th>Gls</th>
	    <th>Ass</th>
	    <th>Ktk</th>
            <th>Kab</th>
	    <th>Tab</th>
	    <th>Pab</th>
	    <th>Sab</th>
            <th>€</th>
            <th>rating</th>
            <th>Temp.</th>
            <th>PJ</th>
            <th>
                <div class="img-ico event-45"></div>
            </th>
            <th>
                <div class="img-ico event-4"></div>
            </th>
        </tr>
    `;
}

// Función para copiar la plantilla al portapapeles
function copyToClipboard() {
    const btn = document.querySelector('.btn-copy');
    const originalHTML = btn.innerHTML;
    
    navigator.clipboard.writeText(lastSquadData || '').then(() => {
        // Mostrar mensaje de éxito
        const msg = document.createElement('div');
        msg.className = 'copy-success';
        msg.textContent = '✅ Plantilla copiada!';
        document.body.appendChild(msg);
        
        setTimeout(() => {
            msg.remove();
        }, 2000);
    }).catch(err => {
        console.error('Error al copiar:', err);
        alert('Error al copiar la plantilla');
    });
}

function createSectionHeader(position) {
    return `
        <tr class="row-head">
            <th colspan="2" class="main">${getPositionName(position)}</th>
            <th>Nat</th>
            <th>Edad</th>
            <th>St</th>
            <th>Tk</th>
            <th>Ps</th>
            <th>Sh</th>
            <th>PJ</th>
            <th>Gls</th>
            <th>Ass</th>
            <th>Ktk</th>
            <th>Kab</th>
            <th>Tab</th>
            <th>Pab</th>
            <th>Sab</th>
            <th>€</th>
            <th>rating</th>
            <th>Temp.</th>
            <th>PJ</th>
            <th>
                <div class="img-ico event-45"></div>
            </th>
            <th>
                <div class="img-ico event-4"></div>
            </th>
        </tr>
    `;
}

// Variable para guardar los datos originales
let lastSquadData = '';

function renderSquad(players) {
    const container = document.getElementById('squad');

    if (!container) {
        console.error('Contenedor #squad no encontrado');
        return;
    }

    // GUARDAR DATOS ORIGINALES PARA COPIAR
    lastSquadData = JSON.stringify(players.map(p => ({
        name: p.name,
        age: p.age,
        nat: p.nat,
        st: p.st,
        tk: p.tk,
        ps: p.ps,
        sh: p.sh,
        gam: p.gam,
        gls: p.gls,
        ass: p.ass
    })), null, 2);

    const por = players.filter(p => p.position === 'por');
    const def = players.filter(p => p.position === 'def');
    const med = players.filter(p => p.position === 'med');
    const del = players.filter(p => p.position === 'del');

    // CABECERA FIJA CON ESCUDO Y BOTÓN COPIAR
    let html = `
        <div class="head-info">
            <div class="left-content">
                <div class="team-crest">
                    <img src="./images/crest.png" alt="Escudo" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCI+PHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjZmZmIi8+PC9zdmc+'">
                </div>
                <div class="team-title">Plantilla</div>
            </div>
            <div class="right-content">
                <div class="head-select">
                    <label>Competición</label>
                    <select id="competition">
                        <option value="1">Primera División</option>
                        <option value="129">Copa del Rey</option>
                        <option value="107">Champions League</option>
                    </select>
                </div>
                <div class="head-select">
                    <label>Temporada</label>
                    <select id="season">
                        <option value="2026">2025-26</option>
                        <option value="2025">2024-25</option>
                    </select>
                </div>
                <button class="btn-copy" onclick="copyToClipboard()" title="Copiar plantilla">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    Copiar
                </button>
            </div>
        </div>
    `;

    html += '<div class="table-wrapper"><table class="table"><tbody>';

    if (por.length > 0) {
        html += createSectionHeader('por');
        por.forEach(p => html += createPlayerRow(p));
    }

    if (def.length > 0) {
        html += createSectionHeader('def');
        def.forEach(p => html += createPlayerRow(p));
    }

    if (med.length > 0) {
        html += createSectionHeader('med');
        med.forEach(p => html += createPlayerRow(p));
    }

    if (del.length > 0) {
        html += createSectionHeader('del');
        del.forEach(p => html += createPlayerRow(p));
    }

    html += '</tbody></table></div>';

    container.innerHTML = html;
}

async function loadSquad() {
    const container = document.getElementById('squad');
    
    if (container) {
        container.innerHTML = '<div class="loading">Cargando...</div>';
    }
    
    try {
        const response = await fetch('https://esmsubed.duckdns.org/api/lfplv/plantilla?id=dep');
        
        if (!response.ok) {
            throw new Error('Error al cargar datos');
        }
        
        const text = await response.text();
        const players = parseSquadData(text);
        
        if (players.length === 0) {
            if (container) {
                container.innerHTML = '<div class="error">No se encontraron jugadores</div>';
            }
            return;
        }
        
        renderSquad(players);
        
    } catch (error) {
        console.error('Error:', error);
        if (container) {
            container.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
        }
    }
}


// INICIAR - USAR API REAL O DATOS DE PRUEBA
loadSquad();
