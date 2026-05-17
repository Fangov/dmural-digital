// ==========================
// API CLIMA
// ==========================
const API_KEY = "a2dc513fba2b42bcbcd110011241012";

// ==========================
// RELOJ
// ==========================
function reloj() {
  const ahora = new Date();

  document.getElementById("hora").innerText =
    ahora.toLocaleTimeString('es-CL', { hour12: false });

  document.getElementById("fecha").innerText =
    ahora.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
}
setInterval(reloj, 1000);
reloj();


// ==========================
// CLIMA
// ==========================
async function clima() {
  try {

    // Los Andes, Chile
    const lat = -32.8337;
    const lon = -70.5983;

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&timezone=auto`
    );

    const data = await res.json();

    document.getElementById("temp").innerText =
      Math.round(data.current.temperature_2m) + "°C";

    document.getElementById("descripcion").innerText =
      "Clima actual";

    document.getElementById("minmax").innerHTML =
      "Los Andes, Chile";

  } catch (error) {
    console.error("Error clima:", error);
  }
}


// ==========================
// NOTICIAS
// ==========================
let noticias = [];
let iNoticias = 0;

async function cargarNoticias() {
  try {
    const res = await fetch("json/noticias.json");
    const data = await res.json();

    noticias = data.noticias || [];
  } catch (error) {
    console.error("Error noticias:", error);
  }
}

function rotarNoticias() {
  if (noticias.length === 0) return;

  const cont = document.getElementById("noticias");

  cont.innerHTML =
    `<h3>📰 Noticias</h3>
     <p>• ${noticias[iNoticias]}</p>`;

  iNoticias = (iNoticias + 1) % noticias.length;
}


// ==========================
// AVISOS
// ==========================
let avisos = [];
let iAvisos = 0;

async function cargarAvisos() {
  try {
    const res = await fetch("json/avisos.json");
    const data = await res.json();

    avisos = data.avisos || [];
  } catch (error) {
    console.error("Error avisos:", error);
  }
}

function rotarAvisos() {
  if (avisos.length === 0) return;

  const cont = document.getElementById("avisos");

  let html = "<h3>📌 Avisos</h3><div class='lista-avisos'>";

  for (let i = 0; i < Math.min(3, avisos.length); i++) {
    const index = (iAvisos + i) % avisos.length;

    html += `<p>• ${avisos[index]}</p>`;
  }

  html += "</div>";

  cont.innerHTML = html;

  // 🔥 animación desde abajo
  const lista = cont.querySelector(".lista-avisos");
  lista.classList.add("subir");

  iAvisos = (iAvisos + 3) % avisos.length;
}

// ==========================
// 🎂 CUMPLEAÑOS (TU JSON REAL)
// ==========================
let cumpleHoy = [];
let iCumple = 0;

async function cargarCumple() {
  try {
    const res = await fetch("json/cumple.json");
    const data = await res.json();

    const hoy = new Date();
    const diaHoy = hoy.getDate();
    const mesHoy = hoy.getMonth() + 1;

    // 👇 AQUÍ LEEMOS TU FORMATO dd-mm-aaaa
    cumpleHoy = data.filter(persona => {
      if (!persona["Fecha Nacimiento"]) return false;

      const [dia, mes] = persona["Fecha Nacimiento"]
        .split("-")
        .map(Number);

      return dia === diaHoy && mes === mesHoy;
    });

  } catch (error) {
    console.error("Error cumple:", error);
  }
}

function rotarCumple() {
    const cont = document.querySelector(".contenido-cumple");

  if (cumpleHoy.length === 0) {
    cont.innerHTML =
      "<h3>🎂 Cumpleaños</h3><p>No hay cumpleaños hoy</p>";
    return;
  }

  let html = "<h3>¡¡Deseamos Feliz Cumpleaños!! a:</h3><div class='lista-cumple'>";

  for (let i = 0; i < Math.min(3, cumpleHoy.length); i++) {
    const index = (iCumple + i) % cumpleHoy.length;
    const p = cumpleHoy[index];

    html += `<p>${p.Nombre} - ${p.Curso}</p>`;
  }

 html += `
</div>

`;

  cont.innerHTML = html;

  // 🔥 animación
  const lista = cont.querySelector(".lista-cumple");
  lista.classList.add("subir");

  iCumple = (iCumple + 3) % cumpleHoy.length;
}


// ==========================
// GALERÍA
// ==========================
let imagenes = [];
let iImg = 0;

async function cargarImagenes() {
  try {
    const res = await fetch("json/imagenes.json");
    const data = await res.json();

    imagenes = data.imagenes || [];
  } catch (error) {
    console.error("Error imagenes:", error);
  }
}

function rotarImagenes() {
  if (imagenes.length === 0) return;

  const galeria = document.getElementById("galeria");

  let html = "";

  for (let i = 0; i < 3; i++) {
    const index = (iImg + i) % imagenes.length;

    html += `
      <div class="polaroid">
        <div class="pin pin-rojo"></div>
        <img src="${imagenes[index].src}">
        <p>${imagenes[index].texto || ""}</p>
      </div>
    `;
  }

  galeria.innerHTML = html;

  iImg = (iImg + 1) % imagenes.length;
}




// ==========================
// 🚀 INIT
// ==========================
async function iniciar() {
  await cargarNoticias();
  await cargarAvisos();
  await cargarCumple();
  await cargarImagenes();
  await cargarAsistencia();

  rotarNoticias();
  rotarAvisos();
  rotarCumple();
  rotarImagenes(); 
  rotarAsistencia();

  setInterval(rotarNoticias, 4000);
  setInterval(rotarAvisos, 5000);
  setInterval(rotarCumple, 6000);
  setInterval(rotarImagenes, 5000); 
  setInterval(rotarAsistencia, 7000);

  clima();
} 

iniciar();
// ==========================
// 📊 ASISTENCIA
// ==========================
let asistencia = [];
let iAsistencia = 0;

async function cargarAsistencia() {
  try {
    const res = await fetch("json/asistencia.json");
    const data = await res.json();

    asistencia = data.asistencia || [];

  } catch (error) {
    console.error("Error asistencia:", error);
  }
}

function rotarAsistencia() {

  if (asistencia.length === 0) return;

  const cont = document.getElementById("asistencia");

  let html = "<h3>📊 Asistencia Mensual</h3><div class='lista-asistencia'>";

  for (let i = 0; i < Math.min(3, asistencia.length); i++) {

    const index = (iAsistencia + i) % asistencia.length;
    const a = asistencia[index];

    const clase = a.porcentaje >= 90 ? "alto" : "bajo";

    const mensaje =
      a.porcentaje >= 90
        ? "👏 Felicitaciones!!!"
        : "⚠️ Debemos mejorar";

    html += `
  <p class="${clase}">
    ${a.curso}: ${a.porcentaje}% - ${mensaje}
  </p>
`;
  }

  html += "</div>";

  cont.innerHTML = html;

  const lista = cont.querySelector(".lista-asistencia");
  lista.classList.add("subir");

  iAsistencia = (iAsistencia + 3) % asistencia.length;
}
