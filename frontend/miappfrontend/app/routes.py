from flask import render_template, request, redirect, url_for, flash, jsonify, session
from . import app
from flask_login import LoginManager, login_user
import requests
import logging
from flask_login import login_user

logging.basicConfig(level=logging.DEBUG)  # Configura el nivel de registro DEBUG

# Ruta para crear un servidor desde el frontend
@app.route('/crear_servidor', methods=['POST'])
def crear_servidor():
    datos_servidor = request.json
    nombre = datos_servidor.get('nombre')
    descripcion = datos_servidor.get('descripcion')
    id_creador = datos_servidor.get('id_creador')  # El ID del usuario que crea el servidor

    # Lógica para crear el servidor aquí

    return jsonify({"mensaje": "Servidor creado exitosamente", "id_servidor": 1}), 200


# Ruta para mostrar el formulario de registro
@app.route('/usuario/registro', methods=['GET'])
def registro():
    return render_template('registro.html')

# Ruta para la página de dashboard
@app.route('/dashboard', methods=['GET'])
def dashboard():
    
    return render_template('dashboard.html')

@app.route('/usuario/login', methods=['POST'])
def login():
    if request.method == 'POST':
        # Obtén los datos del formulario
        username = request.form.get('username')
        password = request.form.get('password')

        # Haz una solicitud POST a la API de inicio de sesión en tu backend
        logging.debug(f'Solicitud de inicio de sesión enviada al backend: Usuario: {username}')
        response = requests.post('http://127.0.0.1:5000/usuario/login', data={
            'username': username,
            'password': password
        })
        logging.debug(f'Respuesta del backend: {response.text}')

        # Comprueba la respuesta
        if response.status_code == 200:
            data = response.json()
            if data.get('mensaje') == "Inicio de sesión exitoso":
                # Obtén el id del usuario de la respuesta
                user_id = data.get('user_id')

                # Almacena el id del usuario en la sesión
                session['user_id'] = user_id

                logging.debug('Inicio de sesión exitoso.')
                return redirect(url_for('dashboard'))  # Redirige al usuario a /dashboard
            else:
                logging.debug('Nombre de usuario o contraseña incorrectos')
                return jsonify({"error_message": "Nombre de usuario o contraseña incorrectos"})
        else:
            logging.debug('Error en el inicio de sesión')
            return jsonify({"error_message": "Error en el inicio de sesión"})
    else:
        return render_template('login.html')



@app.route('/usuario/registro', methods=['POST'])
def registro_submit():
    # Obtén los datos del formulario
    email = request.form.get('email')
    username = request.form.get('username')
    password = request.form.get('password')

    

    if username != 'admin':  # Esto es solo un ejemplo
        flash('Registro exitoso!', 'success')
        return redirect(url_for('dashboard'))
    else:
        flash('Error: ese nombre de usuario ya está en uso', 'danger')
        return redirect(url_for('login'))
       




if __name__ == '__main__':
    app.run(debug=True)
