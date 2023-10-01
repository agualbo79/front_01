
var elementosCanal = document.querySelectorAll(".canal");
console.log("Elementos de canal encontrados:", elementosCanal.length);

elementosCanal.forEach(function(elemento) {
    elemento.addEventListener("click", function(event) {
        // Obtén el ID del canal del atributo de datos
        var canalId = this.getAttribute("data-canal-id");
        console.log("Haciendo clic en un canal. canalId:", canalId);

        // Establece canalActualId al ID del canal
        canalActualId = canalId;
        console.log("canalActualId después de seleccionar un canal:", canalActualId);

        // Ahora puedes cargar los mensajes para este canal
        cargarMensajes(canalId);
    });
});


var enviarMensajeForm = document.getElementById("enviar-mensaje-form");
// Modificar el evento para enviar mensajes
enviarMensajeForm.addEventListener("submit", function(event) {
    event.preventDefault();
    var mensajeTexto = document.getElementById("mensaje").value;

    console.log("canalActualId antes de enviar un mensaje:", canalActualId);
    if (canalActualId) { // Verifica si se ha seleccionado un canal
        console.log("Enviando mensaje:", mensajeTexto, "al canal ID:", canalActualId);
        enviarMensaje(mensajeTexto, canalActualId);
    } else {
        console.error("Error: Debes seleccionar un canal antes de enviar un mensaje.");
    }
});

// Función para cargar mensajes en el canal actual
function cargarMensajes(canalId) {
    console.log("cargarMensajes llamado con canalId:", canalId);

    if (!canalId || canalId === "undefined") {
        console.error("ID del canal no válido. canalId:", canalId);
        return;
    }

    console.log("Cargando mensajes para el canal con ID:", canalId);

    fetch("http://127.0.0.1:5000/usuario/obtener_mensajes/" + canalId, {
        method: "GET",
        credentials: "include"
    })
    .then(response => response.json())
    .then(function(data) {
        console.log("Respuesta del servidor al obtener mensajes:", data);

        if (Array.isArray(data.mensajes) && data.mensajes.length > 0) {
            var mensajes = data.mensajes;
            var mensajesContainer = document.getElementById("lista-mensajes");
            mensajesContainer.innerHTML = "";

            mensajes.forEach(function(mensaje) {
                var nuevoMensaje = document.createElement("div");
                nuevoMensaje.textContent = mensaje.contenido;

                 // Agregar un icono "Editar" junto al mensaje
                var editarButton = document.createElement("button");
                editarButton.innerHTML = '<i class="fas fa-edit"></i>'; // Utiliza el icono de editar de Font Awesome
                editarButton.addEventListener("click", function() {
                    editarMensaje(mensaje.id, nuevoMensaje);
                });

                // Agregar un icono "Borrar" junto al mensaje
                var borrarButton = document.createElement("button");
                borrarButton.innerHTML = '<i class="fas fa-trash-alt"></i>'; // Utiliza el icono de borrar de Font Awesome
                borrarButton.addEventListener("click", function() {
                    borrarMensaje(mensaje.id, nuevoMensaje);
                });

                nuevoMensaje.appendChild(editarButton);
                nuevoMensaje.appendChild(borrarButton);
                editarButton.classList.add("transparent-button"); // Agregar clase CSS a botón Editar
                borrarButton.classList.add("transparent-button"); // Agregar clase CSS a botón Borrar
                mensajesContainer.appendChild(nuevoMensaje);
            });
        } else {
            console.warn("Respuesta inesperada del servidor:", data.mensaje);
        }
    })
    .catch(function(error) {
        console.error("Error de red:", error);
    });
}


// Función para enviar un mensaje
function enviarMensaje(mensajeTexto, canalId) {
    if (!canalId) {
        console.error("ID del canal no válido");
        return;
    }

    // Obtener el ID del usuario actual y asignarlo a datosMensaje.id_remitente
    var idRemitente = obtenerIdUsuarioActual();
    if (!idRemitente) {
        console.error("ID del remitente no válido");
        return;
    }

    var datosMensaje = {
        contenido: mensajeTexto,
        id_canal: canalId,
        id_remitente: idRemitente // Asignar el ID del remitente
    };

    fetch("http://127.0.0.1:5000/usuario/enviar_mensaje", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosMensaje),
        credentials: "include"
    })
    .then(response => response.json())
    .then(function(data) {
        console.log("Respuesta del servidor al enviar mensaje:", data);
        if (data.mensaje === "Mensaje enviado exitosamente") {
          
            cargarMensajes(canalId);
            document.getElementById("mensaje").value = ""; // Limpia el campo de texto
        } else {
            alert("Error al enviar el mensaje");
        }
    })
    .catch(error => {
        console.error("Error de red:", error);
    });
}

// Función para obtener el ID del usuario actual
function obtenerIdUsuarioActual() {
    
    return 12;
}

// Función para obtener el ID y el nombre de usuario actual
function obtenerInfoUsuarioActual() {
    // Devuelve un objeto con el ID y el nombre de usuario
    return {
        id: 12, 
        nombreUsuario: "Usuario123" 
    };
}

// Ejemplo de uso de obtenerIdUsuarioActual:
const idRemitente = obtenerIdUsuarioActual();
if (idRemitente) {
    
    console.log('ID del remitente:', idRemitente);
    
} else {
    
    console.error('No hay usuario autenticado');
}

// Ejemplo de uso de obtenerInfoUsuarioActual:
const infoUsuario = obtenerInfoUsuarioActual();
const userIdElement = document.getElementById("user-id"); 

if (infoUsuario) {
    // Crear elementos de párrafo para el nombre de usuario y el ID
    const nombreUsuarioElement = document.createElement("p");
    const idUsuarioElement = document.createElement("p");

    // Establecer el contenido de los elementos
    nombreUsuarioElement.textContent = `User: ${infoUsuario.nombreUsuario}`;
    idUsuarioElement.textContent = `ID: ${infoUsuario.id}`;

    // Agregar los elementos de párrafo al elemento contenedor
    userIdElement.appendChild(nombreUsuarioElement);
    userIdElement.appendChild(idUsuarioElement);

  
} else {
    // Maneja el caso en el que no haya un usuario autenticado
    console.error('No hay usuario autenticado');
}

const userAvatar = document.querySelector(".userAvatar");
const userPopup = document.querySelector(".user-popup");

userAvatar.addEventListener("click", () => {
    userPopup.style.display = userPopup.style.display === "block" ? "none" : "block";
});

// Para ocultar el pop-up si se hace clic fuera de él
document.addEventListener("click", (event) => {
    if (!userBox.contains(event.target) && userPopup.style.display === "block") {
        userPopup.style.display = "none";
    }
});


function borrarMensaje(mensajeId, mensajeElemento) {
    var confirmacion = confirm("¿Seguro que deseas borrar este mensaje?");
    
    if (confirmacion) {
        // Elimina el elemento del DOM
        mensajeElemento.remove();
        
       
    }
}
function editarMensaje(mensajeId, mensajeElemento) {
    var nuevoContenido = prompt("Edita tu mensaje:", mensajeElemento.textContent);
    
    if (nuevoContenido !== null) {
       
        mensajeElemento.textContent = nuevoContenido;
        
    }
}
