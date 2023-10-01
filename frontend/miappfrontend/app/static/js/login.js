document.addEventListener('DOMContentLoaded', function () { //Cuando se carga, se obtiene el elemento del formulario de inicio de sesión con el ID "login-form" y se agrega un evento de envío de formulario (submit) a ese formulario.
    const formularioLogin = document.getElementById('login-form');

    formularioLogin.addEventListener('submit', async function (event) {
        event.preventDefault(); //evitar que el formulario se envíe automáticamente y la página se recargue

        // Obtén los datos del formulario e obtienen los datos del formulario: el nombre de usuario (username) y la contraseña (password) utilizando el método querySelector para buscar los campos de entrada por su atributo "name".
        const username = formularioLogin.querySelector('[name="username"]').value;
        const password = formularioLogin.querySelector('[name="password"]').value;

        console.log('Evento submit del formulario ejecutado.');
        
        try {
            // Realiza la solicitud POST al backend para el inicio de sesión
            const response = await fetch('http://127.0.0.1:5000/usuario/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded' //Se especifica que el tipo de contenido es 'application/x-www-form-urlencoded'.
                },
                body: new URLSearchParams({ username, password }),
                credentials: 'include'
            });

            const data = await response.json();
            console.log('Data received from fetch:', data);

            // Después de recibir la respuesta exitosa del backend
            if (response.ok) {
                if (data.mensaje === 'Inicio de sesión exitoso' && data.redirect_url) {
                    console.log('Redirigiendo al usuario al dashboard...');
                    const nextUrl = data.redirect_url || '/dashboard';
                    
                    // Almacena el ID de usuario en la sesión del navegador
                    sessionStorage.setItem("user_id", data.user_id);

                    window.location.replace(nextUrl);

                } else {
                    console.error('URL de redirección no especificada en la respuesta del backend.');
                    // Maneja este caso si la URL de redirección no está presente.
                }
            }
            
             else {
                console.error('Error en el inicio de sesión:', data.error_message || response.statusText);
                alert('Error en el inicio de sesión. Verifica tus credenciales.');
            }
        } catch (error) {
            console.error('Error from fetch:', error);
            alert('Ocurrió un error al procesar la solicitud. Inténtalo de nuevo más tarde.');
        }
    });
});
