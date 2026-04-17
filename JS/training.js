const dropdown = document.getElementById("teamsDropdown")
const container = document.getElementById("trainingContainer")
const resultado = document.getElementById("resultado")
const btnEnviar = document.getElementById("btnEnviar")

let equiposData = []

const tiposEntreno = [
  "Físico",
  "Táctico",
  "Tiro",
  "Defensa",
  "Recuperación"
]

/* =========================
   LOADING MSG
========================= */

const loadingMsg = document.createElement("div")
loadingMsg.style.margin = "10px 0"
loadingMsg.style.color = "#666"
loadingMsg.style.display = "none"
loadingMsg.innerText = "🔄 Cargando jugadores..."
container.parentNode.insertBefore(loadingMsg, container)

/* =========================
   CARGAR EQUIPOS
========================= */

fetch('./JS/teams.json')
.then(r => r.json())
.then(equipos => {

equiposData = equipos

equipos.forEach(e => {
  const opt = document.createElement("option")
  opt.value = e.id
  opt.textContent = e.team
  dropdown.appendChild(opt)
})

})

/* =========================
   CREAR ENTRENAMIENTOS
========================= */

function crearEntrenamientos(){

container.innerHTML = ""

for(let i=1;i<=5;i++){

const div = document.createElement("div")
div.className = "training-block"

div.innerHTML = `
<h3>Entrenamiento ${i}</h3>

<div class="training-row">
  <select id="jugador_${i}">
    <option value="">-- Jugador --</option>
  </select>

  <select id="tipo_${i}">
    <option value="">-- Tipo --</option>
    ${tiposEntreno.map(t => `<option value="${t}">${t}</option>`).join("")}
  </select>
</div>
`

container.appendChild(div)
}

}

/* =========================
   CAMBIO DE EQUIPO
========================= */

dropdown.onchange = async () => {

const equipo = equiposData.find(e => e.id === dropdown.value)

// ❌ sin equipo → limpiar todo
if(!equipo){
container.innerHTML = ""
return
}

// ✔ crear estructura
crearEntrenamientos()

// 🔄 loading
loadingMsg.style.display = "block"

// limpiar selects
for(let i=1;i<=5;i++){
const sel = document.getElementById(`jugador_${i}`)
if(sel) sel.innerHTML = `<option value="">-- Jugador --</option>`
}

// pequeña UX delay
await new Promise(r => setTimeout(r, 300))

// ✔ cargar jugadores
for(let i=1;i<=5;i++){

const jugadorSelect = document.getElementById(`jugador_${i}`)
jugadorSelect.innerHTML = `<option value="">-- Jugador --</option>`

if(equipo && equipo.players){

equipo.players.forEach(p => {
  const opt = document.createElement("option")
  opt.value = p
  opt.textContent = p
  jugadorSelect.appendChild(opt)
})

}

}

loadingMsg.style.display = "none"

}

/* =========================
   ENVIAR DATOS A API
========================= */

btnEnviar.onclick = async () => {

const equipo = dropdown.value

if(!equipo){
alert("Selecciona un equipo")
return
}

const entrenamientos = []

for(let i=1;i<=5;i++){

entrenamientos.push({
  jugador: document.getElementById(`jugador_${i}`).value,
  tipo: document.getElementById(`tipo_${i}`).value
})

}

resultado.innerHTML = "🔄 Enviando..."

try{

const res = await fetch("https://esmsubed.duckdns.org/api/training", {
method: "POST",
headers: {"Content-Type":"application/json"},
body: JSON.stringify({
  equipo,
  entrenamientos
})
})

const data = await res.json()

if(res.ok){
resultado.innerHTML = `<div class="success">✔ Entrenamiento guardado correctamente</div>`
}else{
resultado.innerHTML = `<div class="error">❌ ${data.error || "Error"}</div>`
}

}catch(e){
resultado.innerHTML = `<div class="error">❌ Error de conexión</div>`
}

}
