//dashboard.js
console.log("canalActualId al cargar la página:", canalActualId); //para verificar el estado de la variable durante la ejecución del script.


// Variable global para almacenar el servidor seleccionado
var servidorSeleccionadoId = null; // se declara una variable global llamada servidorSeleccionadoId y se le asigna el valor null. Esta variable se utilizará para almacenar el ID del servidor seleccionado.

// Variable global para almacenar el ID del canal actual
var canalActualId = null;

document.addEventListener("DOMContentLoaded", function() { //agrega un escuchador de eventos que espera a que se cargue completamente el contenido de la página
    console.log("DOMContentLoaded se ha disparado");
    var crearServidorBtn = document.getElementById("crear-servidor-btn"); //referencia al elemento HTML con el ID "crear-servidor-btn" y se almacena en la variable crearServidorBtn. Esto se hace para poder acceder fácilmente al botón en el futuro.
    var crearServidorForm = document.getElementById("crear-servidor-form");
    var listaServidores = document.getElementById("lista-servidores");
    var listaCanales = document.getElementById("lista-canales");
    var crearCanalBtn = document.getElementById("crear-canal-btn");
    crearServidorForm.style.display = "none"; //el formulario no se mostrará inicialmente cuando se carga la página.
    var servidores = JSON.parse(localStorage.getItem("servidores")) || [];

    
    // Inicializa canalActualId en null al cargar la página
    canalActualId = null;

  
// Evento para mostrar u ocultar el formulario de creación de canal
crearCanalBtn.addEventListener("click", function() { // agrega un "event listener" (escuchador de eventos) al elemento con el ID "crear-canal-btn
    var crearCanalForm = document.getElementById("crear-canal-form");
    if (crearCanalForm.style.display === "none" || crearCanalForm.style.display === "") { //comprueba si el formulario está oculto o no tiene un estilo definido.
      
        crearCanalForm.style.display = "block";
    } else {
        
        crearCanalForm.style.display = "none";
    }
});



    // Evento para crear un canal
    var crearCanalForm = document.getElementById("crear-canal-form"); // se dispara cuando el formulario se envía (cuando el usuario hace clic en el botón de envío). 
    crearCanalForm.addEventListener("submit", function(event) {
        event.preventDefault();  //la función event.preventDefault() evita el comportamiento predeterminado del formulario, que es enviar una solicitud al servidor y recargar la página.
        var nombreCanal = document.getElementById("nombre-canal").value; //Esta línea obtiene el valor del campo de entrada de texto con el ID "nombre-canal" y lo almacena en la variable nombreCanal  captura el nombre del canal que el usuario ha ingresado en el formulario.

        if (servidorSeleccionadoId) { // Verifica si se ha seleccionado un servidor ara asegurarse de que se haya seleccionado un servidor antes de crear un canal.
            console.log("Creando canal:", nombreCanal, "en el servidor ID:", servidorSeleccionadoId);
            crearCanal(nombreCanal, servidorSeleccionadoId); //Si se ha seleccionado un servidor, esta sección muestra un mensaje en la consola que indica que se está creando un canal con el nombre nombreCanal en el servidor con el ID servidorSeleccionadoId
        } else {
            console.error("Error: Debes seleccionar un servidor antes de crear un canal.");
        }
    });

     // Función para crear un canal
     function crearCanal(nombreCanal, servidorId) { //Esta función toma dos argumentos: nombreCanal, que es el nombre del canal que se va a crear, y servidorId, que es el ID del servidor al que se asociará el canal.
        // Verifica si se ha seleccionado un servidor
        if (servidorSeleccionadoId === null) { //la función verifica nuevamente si servidorSeleccionadoId es null. Si es así, muestra una alerta al usuario indicando que debe seleccionar un servidor antes de crear un canal y luego sale de la función.
        alert("Debes seleccionar un servidor antes de crear un canal.");
        return; 
    }
         // Crear un objeto con los datos del canal
         var datosCanal = { //se crea un objeto datosCanal que contiene la información necesaria para crear el canal. Incluye el nombre del canal (nombreCanal), el ID del servidor al que pertenecerá (servidorId), y el ID del usuario que está creando el canal, que se obtiene llamando a la función obtenerIdUsuarioActual().
             nombre: nombreCanal,
             id_servidor: servidorId,
             id_creador: obtenerIdUsuarioActual() 
         };
         console.log("Enviando solicitud para crear canal:", datosCanal);
 
         // Realizar una solicitud POST al servidor para crear el canal
         fetch("http://127.0.0.1:5000/usuario/crear_canal", { //se utiliza la función fetch para realizar una solicitud POST al servidor. La URL a la que se envía la solicitud es "http://127.0.0.1:5000/usuario/crear_canal". Se especifica el método HTTP como POST 
             method: "POST",
             headers: {
                 "Content-Type": "application/json"
             },
             body: JSON.stringify(datosCanal),
             credentials: "include"
         })
         .then(response => response.json()) //Después de enviar la solicitud al servidor, se espera una respuesta. Cuando la respuesta llega, se la convierte a un objeto JSON para poder trabajar con los datos recibidos.
         .then(function(data) {
             console.log("Respuesta del servidor al crear canal:", data);
             if (data.mensaje === "Canal creado exitosamente") {
                 alert("Canal creado exitosamente");
               
             } else {
                 alert("Error al crear el canal");
             }
         })
         .catch(error => {
             console.error("Error de red:", error);
         });
     }
 

    // Función para obtener el ID del usuario actual
    function obtenerIdUsuarioActual() { //define una función llamada obtenerIdUsuarioActual, que será utilizada para obtener el ID del usuario actual.
       
        var idUsuario = sessionStorage.getItem("user_id");
// se intenta obtener el valor asociado a la clave "user_id" desde el objeto sessionStorage. sessionStorage es un tipo de almacenamiento en el navegador web que permite a las aplicaciones web almacenar datos de manera temporal durante la sesión actual del usuario.
        
        if (idUsuario) {
            return idUsuario; //se verifica si idUsuario tiene un valor. Si existe un valor en idUsuario, lo que significa que se pudo obtener un ID de usuario de sessionStorage
        } else {
            
            console.error("No se pudo obtener el ID del usuario actual");
            return null; 
        }
    }
    // Función para cargar canales
    function cargarCanales(servidorId) { //Toma servidorId como argumento, que es el ID del servidor para el cual se cargarán los canales.
        console.log("Cargando canales para el servidor con ID:", servidorId);
        // Mostrar el botón "Crear Canal" al final
crearCanalBtn.style.display = "block";
        var formularioCrearCanal = document.getElementById("crear-canal-form");
        if (formularioCrearCanal) {
            formularioCrearCanal.style.display = "block";
        }

        fetch("http://127.0.0.1:5000/usuario/obtener_canales/" + servidorId, { //fetch para realizar una solicitud GET al servidor
            method: "GET",
            credentials: "include" //se utiliza para permitir el envío de cookies 
        })
        .then(response => response.json()) //se la convierte a un objeto JSON para poder trabajar con los datos recibidos.
        .then(function(data) {
            console.log("Respuesta del servidor al obtener canales:", data);
            if (data.mensaje === "Canales obtenidos con éxito" && Array.isArray(data.canales)) { //verifica si la respuesta del servidor contiene un mensaje con el texto "Canales obtenidos con éxito" y si la propiedad data.canales es un arreglo (Array.isArray(data.canales)). Esto se hace para asegurarse de que la respuesta del servidor sea válida y contenga una lista de canales.
                var canales = data.canales; // Obtenemos la lista de canales
                // Limpia la lista de canales existente ,para prepararla para la nueva lista de canales que se va a cargar.
                listaCanales.innerHTML = "";
          
            // Agregar los nuevos canales con eventos de clic
            canales.forEach(function(canal) { //Aquí se itera a través de la lista de canales
                var nuevoCanal = document.createElement("div"); //Dentro del bucle, se crea un nuevo elemento div para representar cada canal.
                
                // Crear un elemento span para el símbolo "#"
                var simboloNumeral = document.createElement("span");
                simboloNumeral.textContent = "#"; //crea un elemento span para el símbolo "#" que se utiliza comúnmente antes del nombre del canal.
                simboloNumeral.classList.add("hashtag"); // Agrega una clase para aplicar estilos específicos
                
                // Agregar el símbolo "#" al nuevo canal
                nuevoCanal.appendChild(simboloNumeral);
                
                // Agregar el nombre del canal después del símbolo "#"
                var nombreCanal = document.createElement("span");
                nombreCanal.textContent = canal.nombre; //Se crea otro elemento span para el nombre del canal
                
                // Agregar el nombre del canal al nuevo canal
                nuevoCanal.appendChild(nombreCanal); //El nombre del canal se agrega como un hijo del elemento div que representa el canal, después del símbolo "#"

                // Se verifica si canal.id es un valor válido (es decir, no es null ni undefined). Si es válido, se agrega un atributo de datos (data-canal-id) al elemento div que representa el canal
                if (canal.id) {
                    nuevoCanal.setAttribute("data-canal-id", canal.id);
                } else {
                    console.error("ID de canal no válido para canal:", canal);
                }
            
                nuevoCanal.classList.add("canal"); // Agrega la clase "canal" al elemento
                listaCanales.appendChild(nuevoCanal);
                
                // Depuración: Verificar si los elementos de canal tienen data-canal-id
                console.log("Elemento de canal creado con data-canal-id:", nuevoCanal.getAttribute("data-canal-id"));
            });
           
            var elementosCanal = document.querySelectorAll(".canal"); // Estos elementos representan los canales en la interfaz de usuario. 
            console.log("Elementos de canal encontrados:", elementosCanal.length);
            elementosCanal.forEach(function(elemento) { //e itera a través de todos los elementos de canal utilizando forEach. Para cada elemento de canal, se agrega un "event listener" para el evento "click". Cuando un usuario hace clic en un canal, se ejecutará la función
                elemento.addEventListener("click", function(event) {
                    var canalId = this.getAttribute("data-canal-id");
                    console.log("Haciendo clic en un canal. canalId:", canalId);
                    canalActualId = canalId; // Actualiza el canal actual
                    cargarMensajes(canalId); // Carga los mensajes para el canal seleccionado
                });
            });
            
           
                // Mostrar el botón "Crear Canal" al inicio
                crearCanalBtn.style.display = "block";
            } else {
                console.warn("Respuesta inesperada del servidor:", data.mensaje);
            }
        })
        .catch(function(error) {
            console.error("Error de red:", error);
        });
    }

    // Evento para mostrar el formulario de creación de servidor
    crearServidorBtn.addEventListener("click", function() { //se agrega un evento de clic al elemento con el ID "crearServidorBtn". Cuando se hace clic en este botón, se muestra el formulario de creación 
        crearServidorForm.style.display = "block";
    });

    // Evento para crear un servidor
    crearServidorForm.addEventListener("submit", function(event) { //se agrega un evento de envío de formulario al elemento con el ID "crearServidorForm". Este evento se dispara cuando el usuario envía el formulario 
        event.preventDefault();
        var nombre = document.getElementById("nombre-servidor").value;
        var descripcion = document.getElementById("descripcion-servidor").value;
        crearServidor(nombre, descripcion);
    });

    // Función para crear un servidor // toma dos argumentos: el nombre y la descripción del servidor. Luego, obtiene el ID del creador del servidor desde sessionStorage
    function crearServidor(nombre, descripcion) {
        var idCreador = sessionStorage.getItem("user_id");
        var datosServidor = { //e crea un objeto datosServidor que contiene el nombre, la descripción y el ID del creador del servidor, lo que representa los datos del servidor que se va a crear.
            nombre: nombre,
            descripcion: descripcion,
            id_creador: idCreador
        };

        fetch("http://127.0.0.1:5000/usuario/crear_servidor", { //fetch para realizar una solicitud POST al servidor. 
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
                datosServidor.id = data.id_servidor; //Se asigna el ID del servidor creado (data.id_servidor) al objeto datosServidor.
                servidores.push(datosServidor); //datosServidor al arreglo servidores, que representa la lista de servidores.
                localStorage.setItem("servidores", JSON.stringify(servidores)); //Se actualiza el almacenamiento local (localStorage) con la lista de servidores.
                var nuevoServidor = document.createElement("div"); //Se crea un nuevo elemento div que contiene el nombre del servidor y se establece su atributo "data-servidor-id" con el ID del servidor.
                nuevoServidor.textContent = nombre;
                nuevoServidor.setAttribute("data-servidor-id", data.id_servidor);
                listaServidores.appendChild(nuevoServidor);
                document.getElementById("nombre-servidor").value = ""; //El contenido de los campos del formulario se borra.
                document.getElementById("descripcion-servidor").value = "";
                crearServidorForm.style.display = "none"; //Se oculta el formulario de creación de servidor al establecer su estilo como "none".
            } else {
                alert("Error al crear el servidor");
            }
        })
        .catch(error => {
            console.error("Error de red:", error);
        });
    }



    // Evento para cargar canales al hacer clic en un servidor
    servidores.forEach(servidor => { //se itera a través de la lista de servidores utilizando forEach.
        var nuevoServidor = document.createElement("div");
        nuevoServidor.textContent = servidor.nombre.charAt(0); // Obtenemos la primera inicial del nombre
        nuevoServidor.setAttribute("data-servidor-id", servidor.id);
        nuevoServidor.classList.add("server-icon"); // Agregamos una clase para dar estilo a los iconos
        listaServidores.appendChild(nuevoServidor);

        // Agregamos un botón de eliminación a cada servidor
        var botonEliminar = document.createElement("span");
        botonEliminar.textContent = "X";
        botonEliminar.classList.add("eliminar-servidor"); //  clase para darle estilo

        nuevoServidor.appendChild(botonEliminar);

        botonEliminar.addEventListener("click", function(event) {
            event.stopPropagation(); // Evitar que el evento llegue al servidor al hacer clic en el botón de eliminación
            var servidorId = nuevoServidor.getAttribute("data-servidor-id");
            eliminarServidor(servidorId); // llama a la función eliminarServidor(servidorId) para eliminar el servidor 
        });
        

    
       // Agregamos el evento mouseover para mostrar el tooltip
        nuevoServidor.addEventListener("mouseover", function(event) {
            var nombreCompleto = servidor.nombre; // Obtenemos el nombre completo del servidor
            mostrarTooltip(event.clientX, event.clientY - 20, nombreCompleto); // Ajusta la posición vertical (20px arriba)
        });

        // Función para mostrar el tooltip con coordenadas personalizadas
        function mostrarTooltip(x, y, nombre) {
            var tooltip = document.createElement("div");
            tooltip.textContent = nombre;
            tooltip.classList.add("tooltip");
            tooltip.style.position = "fixed"; // Para que las coordenadas sean relativas a la ventana
            tooltip.style.left = x + "px";
            tooltip.style.top = y + "px";
            document.body.appendChild(tooltip);
        }
    
        // Agregamos el evento mouseout para ocultar el tooltip cuando el mouse sale del icono
        nuevoServidor.addEventListener("mouseout", function() {
            ocultarTooltip();
        });
    
        nuevoServidor.addEventListener("click", function() {
            console.log("Haciendo clic en un servidor");
            var servidorId = nuevoServidor.getAttribute("data-servidor-id");
            // Actualiza el servidor seleccionado globalmente
            servidorSeleccionadoId = servidorId;
            cargarCanales(servidorId);
    
            var formularioCrearCanal = document.getElementById("crear-canal-form");
            if (formularioCrearCanal) {
                if (formularioCrearCanal.style.display === "block") {
                    formularioCrearCanal.style.display = "block";
                }
            }
        });
    });

    // Función para mostrar el tooltip
function mostrarTooltip(nombre) {
    var tooltip = document.createElement("div");
    tooltip.textContent = nombre;
    tooltip.classList.add("tooltip");
    document.body.appendChild(tooltip);
}

// Función para ocultar el tooltip
function ocultarTooltip() {
    var tooltips = document.querySelectorAll(".tooltip");
    tooltips.forEach(tooltip => {
        tooltip.remove();
    });
}
function eliminarServidor(servidorId) {
    var servidor = document.querySelector(`[data-servidor-id="${servidorId}"]`);
    if (servidor) {
        servidor.remove(); 
        }
}

// Evento para hacer clic en un canal
document.addEventListener("click", function(event) {
    if (event.target.classList.contains("canal")) {
        var canalId = event.target.getAttribute("data-canal-id");
        console.log("Haciendo clic en un canal. canalId:", canalId);

        // Establece canalActualId al ID del canal
        canalActualId = canalId;
        console.log("canalActualId después de seleccionar un canal:", canalActualId);

       
        cargarMensajes(canalId);
    }
});

// Evento para hacer clic en un canal (delegación de eventos)
listaCanales.addEventListener("click", function(event) {
    var canalId = event.target.getAttribute("data-canal-id");
    if (canalId) {
        console.log("Haciendo clic en un canal. canalId:", canalId);

        // Establece canalActualId al ID del canal
        canalActualId = canalId;
        console.log("canalActualId después de seleccionar un canal:", canalActualId);

       
        cargarMensajes(canalId);
    }
});
    
});
function obtenerServidorSeleccionadoId() {
    var servidorSeleccionado = document.querySelector(".server.selected");
    if (servidorSeleccionado) {
        var servidorId = servidorSeleccionado.getAttribute("data-servidor-id");
        console.log("Servidor seleccionado:", servidorId);
        return servidorId;
    } else {
        console.log("Ningún servidor seleccionado.");
        return null;
    }
}

const userIcon = document.getElementById("user-icon");
const overlay = document.getElementById("overlay");
const closeButton = document.getElementById("close-button");

userIcon.addEventListener("click", () => {
    overlay.style.display = "block";
});

closeButton.addEventListener("click", () => {
    overlay.style.display = "none";
});


