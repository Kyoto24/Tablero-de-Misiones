
const SUPABASE_URL = "https://jcoemrqwsytiackpmjyr.supabase.co";
const SUPABASE_KEY = "sb_publishable_BNQj4x3_s-76gIG80P2qTw_gvm307gi";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let misionesData = [];

const listaPapeles = document.querySelector("#lista-papeles");
const modal = document.querySelector("#mision-modal");
const modalCodigo = document.querySelector("#modal-codigo");
const modalRango = document.querySelector("#modal-rango");
const modalTitle = document.querySelector("#modal-title");
const modalDesc = document.querySelector("#modal-description");
const modalCliente = document.querySelector("#modal-cliente");
const modalRecompensa = document.querySelector("#modal-recompensa");

// 2. Cargar misiones desde la base de datos
async function cargarMisiones() {
    const { data, error } = await supabaseClient
        .from("misiones")
        .select("*")
        .order("id", { ascending: true });

    if (error) {
        console.error("Error cargando misiones:", error);
        return;
    }

    misionesData = data;
    renderizarTablero();
}

// 3. Dibujar los pergaminos en el tablero automáticamente
function renderizarTablero() {
    listaPapeles.innerHTML = ""; // Limpia el tablero

    misionesData.forEach((mision, index) => {
        const boton = document.createElement("button");
        boton.classList.add("Papeles-list-item");

        // Detectar clase de color según el rango (ej. "Rango S" -> "rango-s")
        const claseRango = mision.rango.toLowerCase().replace(/\s+/g, "-");

        boton.innerHTML = `
            <span class="rango ${claseRango}">${mision.rango}</span>
            <span class="mision-nombre">${mision.titulo}</span>
            <span class="mision-recompensa">${mision.recompensa}</span>
        `;

        boton.addEventListener("click", () => abrirMision(index));
        listaPapeles.appendChild(boton);
    });
}

// 4. Abrir el modal con tu animación
function abrirMision(index) {
    const mision = misionesData[index];
    if (!mision) return;

    modalCodigo.textContent = `ENCARGO Nº 000${mision.codigo}`;
    modalRango.textContent = mision.rango;
    modalTitle.textContent = mision.titulo;
    modalDesc.textContent = mision.descripcion;
    modalCliente.textContent = `Cliente: ${mision.cliente}`;
    modalRecompensa.textContent = `Recompensa: ${mision.recompensa}`;

    modal.classList.add("active");
}

function cerrarMision() {
    modal.classList.remove("active");
}

document.querySelector("#btn-cerrar").addEventListener("click", cerrarMision);
modal.addEventListener("click", (e) => {
    if (e.target === modal) cerrarMision();
});

// Arrancar al cargar la página
cargarMisiones();