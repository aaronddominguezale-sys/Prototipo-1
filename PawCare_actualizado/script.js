// 1. Definir los precios de los servicios.

const precios = {
    bano: 150,
    corte: 120,
    antiparasitario: 100,
    unas: 50,
    oidos: 40,
    dientes: 50,
    vacuna: 200
};

// 2. Obtener los elementos del HTML.

const formulario = document.getElementById("formulario-perro");

const campoNombre = document.getElementById("nombre");
const campoRaza = document.getElementById("raza");
const campoPeso = document.getElementById("peso");
const campoEdad = document.getElementById("edad");
const campoDescripcion = document.getElementById("descripcion");

const listaServicios = document.getElementById("lista-servicios");

const datosResumen = document.getElementById("datos-resumen");
const detallePrecios = document.getElementById("detalle-precios");

const precioTotal = document.getElementById("precio-total");
const botonResumen = document.getElementById("boton-resumen");

// 3. Formatear cantidades como pesos mexicanos.

function formatearPrecio(cantidad) {
    return cantidad.toLocaleString("es-MX", {
        style: "currency",
        currency: "MXN"
    });
}

// 4. Obtener los servicios seleccionados.

function obtenerServiciosSeleccionados() {
    const seleccionados = document.querySelectorAll(
        'input[name="servicio"]:checked'
    );

    return Array.from(seleccionados).map((checkbox) => {
        return {
            id: checkbox.value,
            nombre: checkbox.parentElement.querySelector("span").textContent,
            precio: precios[checkbox.value]
        };
    });
}

// 5. Calcular y actualizar los precios.

function actualizarPrecios() {
    const servicios = obtenerServiciosSeleccionados();

    let total = 0;

    detallePrecios.replaceChildren();

    if (servicios.length === 0) {
        const mensaje = document.createElement("p");
        mensaje.textContent = "Selecciona los servicios que deseas.";
        detallePrecios.appendChild(mensaje);
    }

    servicios.forEach((servicio) => {
        total += servicio.precio;

        const fila = document.createElement("p");
        fila.textContent =
            `${servicio.nombre}: ${formatearPrecio(servicio.precio)}`;

        detallePrecios.appendChild(fila);
    });

    precioTotal.textContent = formatearPrecio(total);
}

// 6. Mostrar los datos básicos del perro.

function actualizarDatosPerro() {
    const nombre = campoNombre.value.trim();
    const raza = campoRaza.value;
    const peso = campoPeso.value;
    const edad = campoEdad.value;
    const descripcion = campoDescripcion.value.trim();

    datosResumen.replaceChildren();

    if (!nombre || !raza || !peso || !edad) {
        const mensaje = document.createElement("p");
        mensaje.textContent =
            "Completa el nombre, la raza, el peso y la edad de tu perro.";
        datosResumen.appendChild(mensaje);
        return;
    }

    const datos = [
        `Nombre: ${nombre}`,
        `Raza: ${raza}`,
        `Peso: ${peso} kg`,
        `Edad: ${edad} años`,
        `Descripción: ${descripcion || "Sin descripción adicional"}`
    ];

    datos.forEach((dato) => {
        const parrafo = document.createElement("p");
        parrafo.textContent = dato;
        datosResumen.appendChild(parrafo);
    });
}

// 7. Actualizar los precios cuando cambie una selección.

listaServicios.addEventListener("change", () => {
    actualizarPrecios();
    respuestaGenerada.hidden = true;
});

// 8. Actualizar los datos cuando se modifique el formulario.

formulario.addEventListener("input", () => {
    actualizarDatosPerro();
    respuestaGenerada.hidden = true;
});
formulario.addEventListener("change", () => {
    actualizarDatosPerro();
    respuestaGenerada.hidden = true;
});

// 9. Generar un resumen visible en la página.
const respuestaGenerada = document.getElementById("respuesta-generada");
const contenidoRespuesta = document.getElementById("contenido-respuesta");
const botonImprimir = document.getElementById("boton-imprimir");

botonResumen.addEventListener("click", () => {
    if (!formulario.reportValidity()) return;

    const peso = Number(campoPeso.value);
    const edad = Number(campoEdad.value);

    if (!Number.isFinite(peso) || peso <= 0 || peso > 150 ||
        !Number.isFinite(edad) || edad < 0 || edad > 40) {
        alert("Revisa el peso y la edad introducidos.");
        return;
    }

    const servicios = obtenerServiciosSeleccionados();
    if (servicios.length === 0) {
        alert("Selecciona al menos un servicio.");
        return;
    }

    const total = servicios.reduce((suma, servicio) => suma + servicio.precio, 0);
    contenidoRespuesta.replaceChildren();

    const agregarParrafo = (texto, clase = "") => {
        const p = document.createElement("p");
        p.textContent = texto;
        if (clase) p.className = clase;
        contenidoRespuesta.appendChild(p);
    };

    agregarParrafo(`Nombre: ${campoNombre.value.trim()}`);
    agregarParrafo(`Raza: ${campoRaza.value}`);
    agregarParrafo(`Peso: ${peso} kg`);
    agregarParrafo(`Edad: ${edad} ${edad === 1 ? "año" : "años"}`);
    agregarParrafo(`Descripción: ${campoDescripcion.value.trim() || "Sin descripción adicional"}`);

    const tituloServicios = document.createElement("h4");
    tituloServicios.textContent = "Servicios seleccionados";
    contenidoRespuesta.appendChild(tituloServicios);

    servicios.forEach(servicio => {
        agregarParrafo(`${servicio.nombre}: ${formatearPrecio(servicio.precio)}`);
    });

    agregarParrafo(`Total estimado: ${formatearPrecio(total)}`, "respuesta-total");
    agregarParrafo("Nota: precios de demostración. Las vacunas requieren valoración veterinaria.");

    respuestaGenerada.hidden = false;
    respuestaGenerada.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

botonImprimir.addEventListener("click", () => window.print());

// 10. Estado inicial.

actualizarPrecios();
actualizarDatosPerro();