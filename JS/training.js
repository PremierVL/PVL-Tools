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

crearEntrenamientos()

})

/* =========================
   CREAR 5 ENTRENAMIENTOS
========================= */

function crearEntrenamientos(){

container.innerHTML = ""

for(let i=1;i<=5;i++){

const div = document.createElement("div")
div.className = "training-block"
div.style.marginBottom = "15px"

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
   CUANDO CAMBIA EQUIPO
========================= */

dropdown.onchange = () => {

const equipo = equiposData.find(e => e.id === dropdown.value)

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
resultado.innerHTML = "✔ Entrenamiento guardado correctamente"
}else{
resultado.innerHTML = "❌ " + (data.error || "Error")
}

}catch(e){

resultado.innerHTML = "❌ Error de conexión"

}

}
