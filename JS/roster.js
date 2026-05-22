// CÓDIGOS DE PAÍS A BANDERAS
const countryFlags = {
    'esp': '🇪🇸', 'ita': '🇮🇹', 'eng': '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'fra': '🇫🇷', 'ger': '🇩🇪',
    'por': '🇵🇹', 'bra': '🇧🇷', 'arg': '🇦🇷', 'uru': '🇺🇾', 'col': '🇨🇴',
    'bel': '🇧🇪', 'ned': '🇳🇱', 'sui': '🇨🇭', 'aut': '🇦🇹', 'swe': '🇸🇪',
    'nor': '🇳🇴', 'den': '🇩🇰', 'fin': '🇫🇮', 'pol': '🇵🇱', 'rus': '🇷🇺',
    'ukr': '🇺🇦', 'cro': '🇭🇷', 'ser': '🇷🇸', 'gre': '🇬🇷', 'tur': '🇹🇷',
    'usa': '🇺🇸', 'can': '🇨🇦', 'mex': '🇲🇽', 'jap': '🇯🇵', 'kor': '🇰🇷',
    'chi': '🇨🇱', 'aus': '🇦🇺', 'egy': '🇪🇬', 'nig': '🇳🇬', 'gha': '🇬🇭',
    'cam': '🇨🇲', 'cma': '🇨🇲', 'cod': '🇨🇩', 'sen': '🇸🇳', 'mar': '🇲🇦',
    'tun': '🇹🇳', 'alg': '🇩🇿', 'irl': '🇮🇪', 'sco': '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'wal': '🏴󠁧󠁢󠁷󠁬󠁳󠁿',
    'nir': '🇳🇷', 'hun': '🇭🇺', 'cze': '🇨🇿', 'svk': '🇸🇰', 'svn': '🇸🇮',
    'rou': '🇷🇴', 'bul': '🇧🇬', 'isl': '🇮🇸', 'lit': '🇱🇹', 'lat': '🇱🇻',
    'est': '🇪🇪', 'geo': '🇬🇪', 'arm': '🇦🇲', 'aze': '🇦🇿', 'kaz': '🇰🇿',
    'uae': '🇦🇪', 'ksa': '🇸🇦', 'qat': '🇶🇦', 'irq': '🇮🇶', 'irn': '🇮🇷',
    'nz': '🇳🇿', 'din': '🇩🇰', 'hol': '🇳🇱', 'mac': '🇲🇰', 'gre': '🇬🇷',
    'slo': '🇸🇮', 'isl': '🇮🇸'
};

function getFlag(code) {
    return countryFlags[code.toLowerCase()] || '🌍';
}

function parseSquadData(text) {
    const lines = text.trim().split('\n');
    const players = [];
    
    // Saltar cabecera y línea de guiones
    for (let i = 2; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        
        const parts = line.split(/\s+/);
        
        if (parts.length >= 10) {
            players.push({
                name: parts[0],
                age: parseInt(parts[1]),
                nat: parts[2],
                ps: parseInt(parts[4]),
                tab: parseInt(parts[7]),
                gam: parseInt(parts[11]),
                gls: parseInt(parts[20]),
                ass: parseInt(parts[21])
            });
        }
    }
    
    return players;
}

function createPlayerCard(p) {
    return `
        <div class="player-card">
            <div class="player-number">${p.ps}</div>
            <div class="player-flag">${getFlag(p.nat)}</div>
            <div class="player-name">${p.name.replace(/_/g, ' ')}</div>
            <div class="player-stats">
                <div class="player-ability">${p.tab}</div>
                <div class="player-info">${p.age} años • ${p.gam} part.</div>
            </div>
        </div>
    `;
}

function renderSquad(players) {
    const container = document.getElementById('squad');
    
    const por = players.filter(p => p.ps === 1);
    const def = players.filter(p => p.ps >= 2 && p.ps <= 5);
    const med = players.filter(p => p.ps >= 6 && p.ps <= 15);
    const del = players.filter(p => p.ps >= 16 && p.ps <= 20);
    
    let html = '';
    
    if (por.length > 0) {
        html += '<div class="position-row"><div class="position-title por">🧤 Porteros</div>';
        por.forEach(p => html += createPlayerCard(p));
        html += '</div>';
    }
    
    if (def.length > 0) {
        html += '<div class="position-row"><div class="position-title def">🛡️ Defensas</div>';
        def.forEach(p => html += createPlayerCard(p));
        html += '</div>';
    }
    
    if (med.length > 0) {
        html += '<div class="position-row"><div class="position-title med">⚽ Mediocampistas</div>';
        med.forEach(p => html += createPlayerCard(p));
        html += '</div>';
    }
    
    if (del.length > 0) {
        html += '<div class="position-row"><div class="position-title del">🎯 Delteros</div>';
        del.forEach(p => html += createPlayerCard(p));
        html += '</div>';
    }
    
    container.innerHTML = html;
}

async function loadSquad() {
    const container = document.getElementById('squad');
    
    try {
        // CAMBIA ESTA URL por tu API real
        const response = await fetch('https://esmsubed.duckdns.org/api/lfplv/plantilla?id=dep');
        
        if (!response.ok) {
            throw new Error('Error al cargar datos');
        }
        
        const text = await response.text();
        const players = parseSquadData(text);
        
        if (players.length === 0) {
            container.innerHTML = '<div class="error">No se encontraron jugadores</div>';
            return;
        }
        
        renderSquad(players);
        
    } catch (error) {
        container.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
    }
}

// DATOS DE PRUEBA (para testar sin API)
const testData = `Name         Age Nat St Tk Ps Sh Ag KAb TAb PAb SAb Gam Sub  Min Mom Sav Con Ktk Kps Sht Gls Ass  DP Inj Sus Fit
Agirrezabala  25 esp 20  1  1  1 20 229 100 100 100  40   0 3625   1 208  40   0   0   0   0   0   6   0   0 100
Gaga_Slonina  22 usa 15  1  1  1 20 791 300 300 300   5   3  394   0  11   6   0   0   0   0   0   0   0   0 100
A_Buongiorno  26 ita  1 17  8  4 20 300 118 161 496  33   4 2626   1   0   0  35  28  17   0   3   4   0   0 100
O_Diomande    22 cma  1 17  7  3 20 300 445 338 208  38   6 2777   0   0   0  49  27  11   0   2   6   0   0 100
Jorrel_Hato   20 hol  1 16  9  4 20 300 929 556 414  37  13 2640   1   0   0  33  24  12   0   0   4   0   0 100
Hector_Fort   19 esp  1 16  8  6 20 300 297 628 226  28   9 2111   0   0   0  16   9  10   1   0   6   0   0 100
Angelino      29 esp  1 16 10  5 20 300 166 968 835  29   7 2283   1   0   0  28  36  18   1   1   8   0   0 100
Anton_Gaaei   23 din  1 15  9  3 20 300 644 801 994  28   5 2216   2   0   0  26  18   7   0   0   0   0   0 100
Luca_Reggiani 18 ita  1 14 10  3 20 300 685 412 384   3   1  178   0   0   0   3   0   0   0   0   0   0   0 100
Lucien_Agoume 24 fra  1 12 15  5 20 300  65 478 151  23   0 2212   0   0   0  21  24  15   1   1   4   0   0 100
Ngolo_Kante   35 fra  1 12 15  3 20 300 130 788 343  20   1 1834   1   0   0  15  41   9   1   3   0   0   0 100
M_Caqueret    26 fra  1  6 16  6 20 300 469 427 345   8   0  787   1   0   0   5  15   4   0   1   4   0   0 100
Yunus_Musah   23 usa  1  6 16  8 20 300 257 217 606  23   1 2036   0   0   0   2  27  10   1   2  14   0   0 100
R_Bellanova   25 ita  1  6 14  5 20 300 356 884 328   0   0    0   0   0   0   0   0   0   0   0   0 100
Eljif_Elmas   26 mac  1  6 16 10 20 300 499 713 845  42  19 2613   0   0   0   9  31  39   0   5  10   0   1 100
De_Arrascaeta 31 uru  1  5 16 10 20 100 708 130 789  41  22 2394   0   0   0   4  25  41   5   0  12   0   0 100
Kang-in_Lee   25 kor  1  1 16 10 20 300 959 989 727  42   0 2917   2   0   0   2  40  44   4   3   2   0   0 100`
