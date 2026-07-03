const formulario = document.getElementById("formContacto");

const nombre = document.getElementById("nombre");
const municipio = document.getElementById("municipio");
const correo = document.getElementById("correo");
const telefono = document.getElementById("telefono");
const motivo = document.getElementById("motivo");
const mensaje = document.getElementById("mensaje");

const contador = document.getElementById("contadorMensaje");

const btnEnviar = document.getElementById("btnEnviar");

const mensajeExito = document.getElementById("mensajeExito");
const mensajeError = document.getElementById("mensajeError");

const regexNombre = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;

const regexCorreo =
/^[a-zA-Z0-9._%+-]+@(gmail\.com|hotmail\.com|outlook\.com)$/;

const regexTelefono = /^[0-9]{10}$/;

function mostrarError(id, texto){
    document.getElementById(id).textContent = texto;
}

function limpiarError(id){
    document.getElementById(id).textContent = "";
}

function validarNombre(){
    const valor = nombre.value.trim();

    if(valor === ""){
        mostrarError("errorNombre","Ingrese su nombre.");
        return false;
    }

    if(!regexNombre.test(valor)){
        mostrarError("errorNombre", "Solo se permiten letras y espacios.");
        return false;
    }

    limpiarError("errorNombre");
    return true;
}

function validarMunicipio(){
    if(municipio.value === ""){
        mostrarError("errorMunicipio", "Seleccione un municipio.");
        return false;
    }

    limpiarError("errorMunicipio");
    return true;
}

function validarCorreo(){
    const valor = correo.value.trim();

    if(valor === ""){
        mostrarError("errorCorreo", "Ingrese un correo.");
        return false;
    }

    if(!regexCorreo.test(valor)){
        mostrarError("errorCorreo", "Solo Gmail, Hotmail u Outlook.");
        return false;
    }

    limpiarError("errorCorreo");
    return true;
}

function validarTelefono(){
    const valor = telefono.value.trim();

    if(valor === ""){
        limpiarError("errorTelefono");
        return true;
    }

    if(!regexTelefono.test(valor)){
        mostrarError("errorTelefono", "Debe contener exactamente 10 dígitos.");
        return false;
    }

    limpiarError("errorTelefono");
    return true;
}

function validarMotivo(){
    if(motivo.value === ""){
        mostrarError("errorMotivo", "Seleccione una opción.");
        return false;
    }

    limpiarError("errorMotivo");
    return true;
}

function validarMensaje(){
    const valor = mensaje.value.trim();

    if(valor === ""){
        mostrarError("errorMensaje", "Escriba un mensaje.");
        return false;
    }

    if(valor.length > 500){
        mostrarError("errorMensaje", "Máximo 500 caracteres.");
        return false;
    }

    limpiarError("errorMensaje");
    return true;
}

function formularioValido(){
    return (
        validarNombre()
        && validarMunicipio()
        && validarCorreo()
        && validarTelefono()
        && validarMotivo()
        && validarMensaje()
    );
}

/* ---- Listeners de UI (contador, filtrado de texto en vivo) ---- */
mensaje.addEventListener("input", () => {
    contador.textContent = mensaje.value.length;
});

nombre.addEventListener("input", () => {
    nombre.value = nombre.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, "");
});

telefono.addEventListener("input", () => {
    telefono.value = telefono.value.replace(/\D/g, "").slice(0, 10);
});

/* ---- Validación en vivo por campo ---- */
nombre.addEventListener("blur", validarNombre);
municipio.addEventListener("change", validarMunicipio);
correo.addEventListener("blur", validarCorreo);
telefono.addEventListener("blur", validarTelefono);
motivo.addEventListener("change", validarMotivo);
mensaje.addEventListener("blur", validarMensaje);

/* ============================================================
   EmailJS — un único init y un único envío
   ============================================================ */
emailjs.init({
    publicKey: "D6jdObZbcJXORQa9W"
});

// IMPORTANTE: usa aquí el service ID y el template ID reales
// de tu panel de EmailJS (Email Templates -> el que quieras usar).
// "template_1w80rvp" es el que confirmaste que funciona (respondió 200 OK).
const EMAILJS_SERVICE_ID = "service_2ikxney";
const EMAILJS_TEMPLATE_ID = "template_1w80rvp";

formulario.addEventListener("submit", function (e) {
    e.preventDefault();

    mensajeExito.classList.add("d-none");
    mensajeError.classList.add("d-none");

    if (!formularioValido()) {
        return;
    }

    btnEnviar.disabled = true;
    btnEnviar.innerHTML = "Enviando...";

    const parametros = {
        nombre: nombre.value.trim(),
        municipio: municipio.value,
        correo: correo.value.trim(),
        telefono: telefono.value.trim(),
        motivo: motivo.value,
        mensaje: mensaje.value.trim()
    };

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, parametros)
        .then((response) => {
            console.log("EmailJS OK:", response.status, response.text);

            mensajeExito.classList.remove("d-none");

            formulario.reset();
            contador.textContent = "0";

            limpiarError("errorNombre");
            limpiarError("errorMunicipio");
            limpiarError("errorCorreo");
            limpiarError("errorTelefono");
            limpiarError("errorMotivo");
            limpiarError("errorMensaje");
        })
        .catch((error) => {
            console.error("EmailJS error:", error);
            mensajeError.classList.remove("d-none");
        })
        .finally(() => {
            btnEnviar.disabled = false;
            btnEnviar.innerHTML = "Enviar mensaje";
        });
});