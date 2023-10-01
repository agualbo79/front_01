
//agrega un "event listener" (escuchador de eventos) al documento HTML,
//asegura que el código JavaScript se ejecute después de que la página web esté lista para interactuar

document.addEventListener('DOMContentLoaded', function () {

    //Aquí se obtiene una referencia al elemento HTML con el atributo id "registro-form" 
    //y se almacena en una variable llamada formularioRegistro. Esto se hace para que podamos acceder 
    //fácilmente al formulario 
    const formularioRegistro = document.getElementById('registro-form');



    formularioRegistro.addEventListener('submit', function (event) {
          //agrega un evento "submit" al formulario identificado anteriormente. Significa que cuando el usuario envíe el formulario 

        event.preventDefault(); // Evita que el formulario se envíe automáticamente, lo que permite realizar una solicitud AJAX al servidor sin recargar la página.


//Aquí se inicia una solicitud fetch para enviar datos al servidor. 
        fetch('http://127.0.0.1:5000/usuario/registro', {
        method: 'POST', //Se especifica que se utilizará el método HTTP POST
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'  //el encabezado HTTP para indicar que los datos se están enviando en formato "application/x-www-form-urlencoded", que es el formato típico para los formularios HTML.
        },
        body: new URLSearchParams(new FormData(formularioRegistro))
        //e construye el cuerpo de la solicitud. Se crea un objeto FormData a partir del formulario formularioRegistro, que contiene todos los datos del formulario. Luego, se convierte en una cadena codificada usando URLSearchParams.
        })
        .then(response => response.json()) //Después de enviar la solicitud al servidor, esperamos una respuesta. Cuando la respuesta llega, la convertimos a un objeto JSON para que podamos trabajar con los datos recibidos.
        .then(data => console.log(data))//Finalmente, se muestra la respuesta JSON en la consola del navegador usando console.log. Esto podría ser útil para depurar y verificar la respuesta del servidor.
        .catch((error) => {
            console.error('Error:', error); //caso de que ocurra algún error en la solicitud, se maneja aquí. Se muestra un mensaje de error en la consola del navegador para ayudar en la depuración.
        });

    });
});
