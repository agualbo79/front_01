// main.js
import { cargarCanales, crearServidor, mostrarFormularioCrearCanal } from './app.js';

document.addEventListener("DOMContentLoaded", function() {
    var crearServidorBtn = document.getElementById("crear-servidor-btn");
    var crearServidorForm = document.getElementById("crear-servidor-form");
    var listaServidores = document.getElementById("lista-servidores");
    var listaCanales = document.getElementById("lista-canales");
    var crearCanalBtn = document.getElementById("crear-canal-btn");
    crearServidorForm.style.display = "none";
    var servidores = JSON.parse(localStorage.getItem("servidores")) || [];

    crearServidorBtn.addEventListener("click", function() {
        crearServidorForm.style.display = "block";
    });

    crearServidorForm.addEventListener("submit", function(event) {
        event.preventDefault();
        var nombre = document.getElementById("nombre-servidor").value;
        var descripcion = document.getElementById("descripcion-servidor").value;
        crearServidor(nombre, descripcion);
    });

    servidores.forEach(servidor => {
        var nuevoServidor = document.createElement("div");
        nuevoServidor.textContent = servidor.nombre;
        nuevoServidor.setAttribute("data-servidor-id", servidor.id);
        listaServidores.appendChild(nuevoServidor);

        nuevoServidor.addEventListener("click", function() {
            console.log("Haciendo clic en un servidor");
            var servidorId = nuevoServidor.getAttribute("data-servidor-id");
            cargarCanales(servidorId);

            // Mover la visibilidad del botón "Crear Canal" aquí
            crearCanalBtn.style.display = "block";

            var formularioCrearCanal = document.getElementById("crear-canal-form");
            if (formularioCrearCanal) {
                if (formularioCrearCanal.style.display === "none") {
                    formularioCrearCanal.style.display = "block";
                }
            }

            console.log("Estado del botón después de cargar canales:", crearCanalBtn.style.display);
        });
    });
});
