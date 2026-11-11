// ============================================================
// Cinema Seat Manager 🎬  —  Lógica de negocio (consola)
// ============================================================

const FILAS = 8;
const COLUMNAS = 10;

// Crea la sala: matriz de FILAS x COLUMNAS con todos los asientos libres (0).
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

// Reserva un asiento (0 -> 1) si existe y está libre; devuelve el mensaje del resultado.
function reservarAsiento(sala: number[][], fila: number, columna: number): string {
  if (fila < 0 || fila >= FILAS) {
    return `❌ Error: la fila ${fila} no existe.`;
  }
  if (columna < 0 || columna >= COLUMNAS) {
    return `❌ Error: la columna ${columna} no existe.`;
  }
  if (sala[fila][columna] === 1) {
    return `❌ El asiento [${fila},${columna}] ya está ocupado.`;
  }
  sala[fila][columna] = 1;
  return `✅ Asiento [${fila},${columna}] reservado.`;
}

// Libera un asiento (1 -> 0) si existe y estaba ocupado; devuelve true si se pudo.
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

// Cuenta los asientos libres (0) de toda la sala.
function contarLibres(sala: number[][]): number {
  let libres = 0;
  for (let f = 0; f < FILAS; f++)
    for (let c = 0; c < COLUMNAS; c++)
      if (sala[f][c] === 0) libres++;
  return libres;
}

// Cuenta los asientos ocupados (1) de toda la sala.
function contarOcupados(sala: number[][]): number {
  let ocupados = 0;
  for (let f = 0; f < FILAS; f++)
    for (let c = 0; c < COLUMNAS; c++)
      if (sala[f][c] === 1) ocupados++;
  return ocupados;
}

// Devuelve [ocupados, libres] con el recuento total de la sala.
function contarAsientos(sala: number[][]): number[] {
  return [contarOcupados(sala), contarLibres(sala)];
}

// Busca el primer par de asientos libres juntos en una fila; devuelve [fila, columna] o null.
function buscarAsientosContiguos(sala: number[][]): number[] | null {
  for (let f = 0; f < FILAS; f++) {
    // COLUMNAS - 1 para no salirnos de la fila al mirar el asiento c + 1
    for (let c = 0; c < COLUMNAS - 1; c++) {
      if (sala[f][c] === 0 && sala[f][c + 1] === 0) {
        console.log(`🔍 Asientos libres juntos: fila ${f}, columnas ${c} y ${c + 1}.`);
        return [f, c];
      }
    }
  }
  console.log("❌ No hay dos asientos libres contiguos en ninguna fila.");
  return null;
}

// Imprime la sala en consola con L (libre) y X (ocupado), con números de fila y columna.
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

// Muestra la sala, el recuento de asientos y la búsqueda de una pareja de asientos juntos.
function mostrarInforme(sala: number[][]): void {
  mostrarSala(sala);
  const [ocupados, libres] = contarAsientos(sala);
  console.log(`📊 Ocupados: ${ocupados} | Libres: ${libres}`);
  buscarAsientosContiguos(sala);
}

// Ocupa todos los asientos de la sala.
function llenarSala(sala: number[][]): void {
  for (let f = 0; f < FILAS; f++)
    for (let c = 0; c < COLUMNAS; c++)
      reservarAsiento(sala, f, c);
}

// Pruebas por consola: sala vacía, parcial, casi llena y llena.
function ejecutarPruebas(): void {
  console.log("\n=== Escenario 1: sala vacía ===");
  const vacia = inicializarSala();
  mostrarInforme(vacia);

  console.log("\n=== Escenario 2: sala parcialmente ocupada ===");
  const parcial = inicializarSala();
  console.log(reservarAsiento(parcial, 0, 0));
  console.log(reservarAsiento(parcial, 0, 1));
  console.log(reservarAsiento(parcial, 0, 1)); // ya ocupado
  console.log(reservarAsiento(parcial, 8, 0)); // fila inexistente
  console.log(reservarAsiento(parcial, 3, 12)); // columna inexistente
  console.log(reservarAsiento(parcial, 1, 4));
  mostrarInforme(parcial);

  console.log("\n=== Escenario 3: sala casi llena (solo asientos sueltos) ===");
  const casiLlena = inicializarSala();
  llenarSala(casiLlena);
  cancelarReserva(casiLlena, 0, 0);
  cancelarReserva(casiLlena, 2, 5);
  cancelarReserva(casiLlena, 4, 9);
  cancelarReserva(casiLlena, 7, 3);
  mostrarInforme(casiLlena);
  console.log("--- Se libera el asiento [7,4], junto al [7,3] ---");
  cancelarReserva(casiLlena, 7, 4);
  mostrarInforme(casiLlena);

  console.log("\n=== Escenario 4: sala completamente llena ===");
  const llena = inicializarSala();
  llenarSala(llena);
  console.log(reservarAsiento(llena, 3, 3)); // ya ocupado
  mostrarInforme(llena);
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

    // ============================================================
    // Sistema de 3 estados: asientos seleccionados (pendientes)
    // ============================================================
    const seleccionados = new Set<string>(); // guarda "fila-columna"
    const PRECIO_POR_ASIENTO = 8.5;
    const juntosMsg = document.getElementById("juntos-msg")!;

    // Solo visual: huecos de pasillo tras estas columnas / fila
    const PASILLOS_COLUMNA = [2, 7];
    const PASILLO_FILA = 4;

    /** Icono SVG de butaca; el color lo da text-* (currentColor) */
    const iconoButaca = (ocupado: boolean): string => `
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="#0a0a0d" stroke-width="0.7" class="h-full w-full" aria-hidden="true">
        <rect x="6" y="2" width="12" height="10" rx="3.5"/>
        <rect x="2" y="9" width="5" height="10" rx="2.2"/>
        <rect x="17" y="9" width="5" height="10" rx="2.2"/>
        <rect x="5" y="12" width="14" height="7" rx="2.5"/>
        <rect x="5" y="20" width="2.5" height="2.5" rx="1"/>
        <rect x="16.5" y="20" width="2.5" height="2.5" rx="1"/>
        ${ocupado ? '<path d="M9.8 5.3l4.4 4.4M14.2 5.3l-4.4 4.4" stroke-width="1.4" stroke-linecap="round"/>' : ""}
      </svg>`;

    /** Margen extra a la izquierda de la columna c si va justo tras un pasillo */
    const huecoColumna = (c: number): string => (PASILLOS_COLUMNA.includes(c - 1) ? "ml-4" : "");

    /** Actualiza el contador de asientos disponibles */
    function actualizarPanel(): void {
      const disponibles = contarLibres(sala) - seleccionados.size;
      panel.textContent = `${disponibles} disponibles`;
    }

    /** Actualiza el panel de checkout lateral */
    function actualizarCheckout(): void {
      const entradasEl = document.getElementById("checkout-entradas")!;
      const asientosEl = document.getElementById("checkout-asientos")!;
      const totalEl = document.getElementById("checkout-total")!;
      const btn = document.getElementById("btn-checkout") as HTMLButtonElement;

      const cantidad = seleccionados.size;
      entradasEl.textContent = `${cantidad}`;

      // Desplegable de asientos: se abre solo si hay asientos seleccionados
      const detalle = document.getElementById("checkout-detalle") as HTMLDetailsElement;
      detalle.open = cantidad > 0;
      detalle.classList.toggle("opacity-50", cantidad === 0);
      document.getElementById("checkout-asientos-hint")!.textContent =
        cantidad === 0 ? "Selecciona en el plano" : "";

      if (cantidad === 0) {
        asientosEl.innerHTML = "";
        totalEl.textContent = "0,00 €";
        btn.disabled = true;
      } else {
        // Listar asientos seleccionados ordenados
        asientosEl.innerHTML = Array.from(seleccionados)
          .sort()
          .map((key) => {
            const [f, c] = key.split("-");
            return `<span class="rounded-md bg-emerald-500/15 px-2 py-1 font-medium text-emerald-300">Fila ${f} · Asiento ${c}</span>`;
          })
          .join("");

        const total = (cantidad * PRECIO_POR_ASIENTO).toFixed(2).replace(".", ",");
        totalEl.textContent = `${total} €`;
        btn.disabled = true; // sigue deshabilitado (checkout ficticio)
      }
    }

    /** Pinta la cuadrícula completa desde la matriz + seleccionados */
    function renderizarSala(): void {
      container.innerHTML = "";
      juntosMsg.textContent = "";

      // Encabezado de columnas
      const encRow = document.createElement("div");
      encRow.className = "flex items-center gap-1.5";
      const empty = document.createElement("div");
      empty.className = "w-6 shrink-0";
      encRow.appendChild(empty);
      for (let c = 0; c < COLUMNAS; c++) {
        const num = document.createElement("div");
        num.className = `w-9 shrink-0 text-center text-[10px] font-mono text-amber-200/50 ${huecoColumna(c)}`;
        num.textContent = `${c}`;
        encRow.appendChild(num);
      }
      container.appendChild(encRow);

      // Filas de asientos
      for (let f = 0; f < FILAS; f++) {
        const rowDiv = document.createElement("div");
        rowDiv.className = `flex items-center gap-1.5 ${f === PASILLO_FILA + 1 ? "mt-4" : ""}`;

        // Número de fila
        const label = document.createElement("div");
        label.className = "w-6 shrink-0 text-center text-[10px] font-mono text-amber-200/50";
        label.textContent = `${f}`;
        rowDiv.appendChild(label);

        for (let c = 0; c < COLUMNAS; c++) {
          const seat = document.createElement("div");
          const key = `${f}-${c}`;
          const ocupado = sala[f][c] === 1;
          const seleccionado = seleccionados.has(key);

          // Clases según estado: libre (claro), seleccionado (verde), ocupado (oscuro)
          let clase = `h-9 w-9 shrink-0 transition-all duration-150 ${huecoColumna(c)} `;

          if (ocupado) {
            clase += "text-zinc-700 cursor-not-allowed";
          } else if (seleccionado) {
            clase += "text-emerald-400 cursor-pointer scale-105 drop-shadow-[0_0_6px_rgba(52,211,153,0.7)]";
          } else {
            clase += "text-zinc-300 cursor-pointer hover:text-amber-300 hover:scale-110";
          }

          seat.className = clase;
          seat.title = `Fila ${f} · Asiento ${c}`;
          seat.innerHTML = iconoButaca(ocupado);

          // Evento clic con 3 estados
          seat.addEventListener("click", () => {
            if (sala[f][c] === 1) return; // ocupado → no se toca

            if (seleccionados.has(key)) {
              // Estaba seleccionado → lo deseleccionamos
              seleccionados.delete(key);
            } else {
              // Estaba libre → lo seleccionamos
              seleccionados.add(key);
            }

            renderizarSala();
            actualizarPanel();
            actualizarCheckout();
          });

          rowDiv.appendChild(seat);
        }
        container.appendChild(rowDiv);
      }
    }

    // Sin asientos seleccionados el desplegable no se puede abrir a mano
    document.getElementById("checkout-detalle")!.addEventListener("click", (e) => {
      if (seleccionados.size === 0 && (e.target as HTMLElement).closest("summary")) {
        e.preventDefault();
      }
    });

    // "Encontrar 2 juntos": usa buscarAsientosContiguos() sobre una copia de la sala
    // en la que los asientos ya seleccionados cuentan como ocupados (sala no se modifica)
    document.getElementById("btn-juntos")!.addEventListener("click", () => {
      const copia = sala.map((fila) => [...fila]);
      seleccionados.forEach((key) => {
        const [f, c] = key.split("-").map(Number);
        copia[f][c] = 1;
      });

      const pareja = buscarAsientosContiguos(copia);
      if (!pareja) {
        juntosMsg.textContent = "No hay 2 asientos libres juntos.";
        return;
      }

      seleccionados.add(`${pareja[0]}-${pareja[1]}`);
      seleccionados.add(`${pareja[0]}-${pareja[1] + 1}`);
      renderizarSala();
      actualizarPanel();
      actualizarCheckout();
    });

    // Ocupamos algunos asientos de ejemplo para que se vean los 3 estados
    reservarAsiento(sala, 1, 3);
    reservarAsiento(sala, 2, 5);
    reservarAsiento(sala, 2, 6);
    reservarAsiento(sala, 4, 1);
    reservarAsiento(sala, 6, 8);

    renderizarSala();
    actualizarPanel();
    actualizarCheckout();
    console.log("🎬 Cines Felix — Interfaz cargada con 3 estados.");
  });
} else {
  // Ejecución en consola (npm run console): lanzamos las pruebas
  ejecutarPruebas();
}

export {};
