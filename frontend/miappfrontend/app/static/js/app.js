// app.js
export function cargarCanales(servidorId) {
    console.log("Cargando canales para el servidor con ID:", servidorId);
    var formularioCrearCanal = document.getElementById("crear-canal-form");
    if (formularioCrearCanal) {
        formularioCrearCanal.style.display = "none";
    }

    fetch("http://127.0.0.1:5000/usuario/obtener_canales/" + servidorId, {
        method: "GET",
        credentials: "include"
    })
    .then(response => response.json())
    .then(function(data) {
        if (data.mensaje === "Canales obtenidos con éxito" && Array.isArray(data.canales)) {
            var canales = data.canales; // Obtenemos la lista de canales
            // Limpia la lista de canales existente
            listaCanales.innerHTML = "";

            // Agrega los nuevos canales
            canales.forEach(function(canal) {
                var nuevoCanal = document.createElement("div");
                nuevoCanal.textContent = canal.nombre;
                listaCanales.appendChild(nuevoCanal);
            });
        } else {
            console.warn("Respuesta inesperada del servidor:", data.mensaje);
        }

        // Mostrar el botón "Crear Canal" independientemente de la respuesta
        crearCanalBtn.style.display = "block";
    })
    .catch(function(error) {
        console.error("Error de red:", error);

        // Mostrar el botón "Crear Canal" incluso si hay un error
        crearCanalBtn.style.display = "block";
    });
}

export function crearServidor(nombre, descripcion) {
    var idCreador = sessionStorage.getItem("user_id");
    var datosServidor = {
        nombre: nombre,
        descripcion: descripcion,
        id_creador: idCreador
    };

    fetch("http://127.0.0.1:5000/usuario/crear_servidor", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datosServidor),
        credentials: "include"
    })
    .then(response => response.json())
    .then(data => {
        if (data.mensaje === "Servidor creado exitosamente") {
            alert("Servidor creado exitosamente");
            datosServidor.id = data.id_servidor;
            servidores.push(datosServidor);
            localStorage.setItem("servidores", JSON.stringify(servidores));
            var nuevoServidor = document.createElement("div");
            nuevoServidor.textContent = nombre;
            nuevoServidor.setAttribute("data-servidor-id", data.id_servidor);
            listaServidores.appendChild(nuevoServidor);
            document.getElementById("nombre-servidor").value = "";
            document.getElementById("descripcion-servidor").value = "";
            crearServidorForm.style.display = "none";
        } else {
            alert("Error al crear el servidor");
        }
    })
    .catch(error => {
        console.error("Error de red:", error);
    });
}




// Función para obtener el ID del usuario actual
function obtenerIdUsuarioActual() {
   
    // Verificar si el usuario está autenticado
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    if (usuarioActual && usuarioActual.id) {
        // Si el usuario está autenticado y tiene un ID válido, lo retornamos
        return usuarioActual.id;
    } else {
        
       
        console.error('Usuario no autenticado o ID no válido');
        return null; 
    }
}

// Ejemplo de uso:
const idRemitente = obtenerIdUsuarioActual();
if (idRemitente) {
   
    console.log('ID del remitente:', idRemitente);
    
} else {
    
}
