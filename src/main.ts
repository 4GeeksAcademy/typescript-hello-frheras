// ============================================================
// Cinema Seat Manager 🎬  —  Lógica de negocio (consola)
// ============================================================

const FILAS = 8;
const COLUMNAS = 10;

function inicializarSala(): number[][] {
  const sala: number[][] = [];
  for (let f = 0; f < FILAS; f++) {
    const fila: number[] = [];
    for (let c = 0; c < COLUMNAS; c++) {
      fila.push(0);
    }
    sala.push(fila);
  }
  return sala;
}

function reservarAsiento(sala: number[][], fila: number, columna: number): boolean {
  if (fila < 0 || fila >= FILAS) {
    console.log(`❌ Error: la fila ${fila} no existe.`);
    return false;
  }
  if (columna < 0 || columna >= COLUMNAS) {
    console.log(`❌ Error: la columna ${columna} no existe.`);
    return false;
  }
  if (sala[fila][columna] === 1) {
    console.log(`❌ El asiento [${fila},${columna}] ya está ocupado.`);
    return false;
  }
  sala[fila][columna] = 1;
  console.log(`✅ Asiento [${fila},${columna}] reservado.`);
  return true;
}

function cancelarReserva(sala: number[][], fila: number, columna: number): boolean {
  if (fila < 0 || fila >= FILAS) { console.log("❌ Fila inválida."); return false; }
  if (columna < 0 || columna >= COLUMNAS) { console.log("❌ Columna inválida."); return false; }
  if (sala[fila][columna] === 0) {
    console.log(`ℹ️ El asiento [${fila},${columna}] ya estaba libre.`);
    return false;
  }
  sala[fila][columna] = 0;
  console.log(`✅ Reserva cancelada [${fila},${columna}] ahora libre.`);
  return true;
}

function contarLibres(sala: number[][]): number {
  let libres = 0;
  for (let f = 0; f < FILAS; f++)
    for (let c = 0; c < COLUMNAS; c++)
      if (sala[f][c] === 0) libres++;
  return libres;
}

function contarOcupados(sala: number[][]): number {
  let ocupados = 0;
  for (let f = 0; f < FILAS; f++)
    for (let c = 0; c < COLUMNAS; c++)
      if (sala[f][c] === 1) ocupados++;
  return ocupados;
}

function buscarAsientosContiguos(sala: number[][]): { fila: number; columna: number } | null {
  for (let f = 0; f < FILAS; f++)
    for (let c = 0; c < COLUMNAS - 1; c++)
      if (sala[f][c] === 0 && sala[f][c + 1] === 0)
        return { fila: f, columna: c };
  return null;
}

function mostrarSala(sala: number[][]): void {
  let encabezado = "   ";
  for (let c = 0; c < COLUMNAS; c++) encabezado += ` ${c}`;
  console.log(encabezado);
  console.log("   " + "-".repeat(COLUMNAS * 2 + 1));
  for (let f = 0; f < FILAS; f++) {
    let linea = `${f} |`;
    for (let c = 0; c < COLUMNAS; c++)
      linea += sala[f][c] === 0 ? " L" : " X";
    console.log(linea);
  }
}

// ============================================================
// 🖥️  Interfaz visual en el navegador (DOM + Tailwind v4)
// ============================================================

// Solo ejecutamos la parte visual si estamos en el navegador
if (typeof document !== "undefined") {
  import("./style.css").then(() => {
    const sala = inicializarSala();
    const container = document.getElementById("sala-container")!;
    const panel = document.getElementById("panel")!;

    /** Actualiza el panel de estadísticas */
    function actualizarPanel(): void {
      const libres = contarLibres(sala);
      const ocupados = contarOcupados(sala);
      panel.innerHTML = `
        <span class="text-green-400">🟢 Libres: ${libres}</span>
        &nbsp;·&nbsp;
        <span class="text-red-400">🔴 Ocupados: ${ocupados}</span>
        &nbsp;·&nbsp;
        <span class="text-slate-400">Total: ${libres + ocupados}</span>
      `;
    }

    /** Pinta la cuadrícula completa desde la matriz */
    function renderizarSala(): void {
      container.innerHTML = ""; // limpiamos y repintamos

      // Encabezado de columnas
      const encRow = document.createElement("div");
      encRow.className = "flex gap-1";
      // Esquina vacía
      const empty = document.createElement("div");
      empty.className = "w-8 h-8 flex items-center justify-center text-xs text-slate-500";
      empty.textContent = "";
      encRow.appendChild(empty);
      // Números de columna
      for (let c = 0; c < COLUMNAS; c++) {
        const num = document.createElement("div");
        num.className = "w-10 h-8 flex items-center justify-center text-xs text-slate-400 font-mono";
        num.textContent = `${c}`;
        encRow.appendChild(num);
      }
      container.appendChild(encRow);

      // Filas de asientos
      for (let f = 0; f < FILAS; f++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = "flex gap-1";

        // Número de fila
        const label = document.createElement("div");
        label.className = "w-8 h-10 flex items-center justify-center text-xs text-slate-400 font-mono";
        label.textContent = `${f}`;
        rowDiv.appendChild(label);

        for (let c = 0; c < COLUMNAS; c++) {
          const seat = document.createElement("div");
          const ocupado = sala[f][c] === 1;

          // Clases Tailwind: verde si libre, rojo si ocupado
          seat.className = `w-10 h-10 rounded-lg border-2 flex items-center justify-center font-mono text-sm font-bold cursor-pointer transition-colors duration-150 ${
            ocupado
              ? "bg-red-600 border-red-700 text-white"
              : "bg-green-500 border-green-600 text-white hover:bg-green-400"
          }`;

          seat.textContent = ocupado ? "X" : "L";

          // Evento clic: reservar / cancelar
          seat.addEventListener("click", () => {
            if (sala[f][c] === 0) {
              reservarAsiento(sala, f, c);
            } else {
              // Si ya está ocupado, al hacer clic se cancela
              cancelarReserva(sala, f, c);
            }
            renderizarSala(); // repintar
            actualizarPanel();
          });

          rowDiv.appendChild(seat);
        }
        container.appendChild(rowDiv);
      }
    }

    renderizarSala();
    actualizarPanel();
    console.log("🎬 Cinema Seat Manager cargado en el navegador.");
  });
}

export {};
