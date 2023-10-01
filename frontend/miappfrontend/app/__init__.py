from flask import Flask, render_template, request, redirect, url_for, flash, session
import requests
from functools import wraps

app = Flask(__name__, static_folder='static', template_folder='templates')
app.secret_key = '352528b35a4cca7bf961c3f7c0dac9642c527428388d4de5f443df34f0e6e320'
backend_url = 'http://127.0.0.1:5000'  

# Función para cargar el usuario desde la sesión
def load_user(user_id):
    response = requests.get(f'{backend_url}/get_user/{user_id}')
    if response.status_code == 200:
        usuario_data = response.json()
        return usuario_data
    else:
        return None

# Ruta para mostrar el formulario de inicio de sesión
@app.route('/usuario/login', methods=['GET'])
def login():
    return render_template('login.html')

# Ruta para mostrar el formulario de registro
@app.route('/usuario/registro', methods=['GET'])
def registro():
    return render_template('registro.html')

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'username' not in session:
            flash('Debes iniciar sesión primero', 'warning')
            return redirect(url_for('login', next=request.url))
        return f(*args, **kwargs)
    return decorated_function

@app.route('/dashboard', methods=['GET'])

def dashboard():
    print("Acceso a la página del tablero")
    user_data = session.get('username', '')
    return render_template('dashboard.html', user_data=user_data)

if __name__ == '__main__':
    app.run()

