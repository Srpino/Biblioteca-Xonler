// Módulo para la página de login
export default function initLoginPage() {
  console.log('Página de login inicializada');
  
  // Prevenir desplazamiento al hacer clic en el botón "Registrarse"
  const registrarseTab = document.getElementById('register-tab');
  if (registrarseTab) {
    registrarseTab.addEventListener('click', (e) => {
      console.log('Clic en pestaña registrarse');
      e.preventDefault();
      const tab = new bootstrap.Tab(registrarseTab);
      tab.show();
    });
  }
  
  // Encontrar y prevenir el desplazamiento en el botón de registrarse en la barra de navegación
  const registrarseBtns = Array.from(document.querySelectorAll('a'))
    .filter(a => a.textContent.trim() === 'Registrarse');
  
  registrarseBtns.forEach(btn => {
    btn.addEventListener('click', function(e) {
      console.log('Botón registrarse clicado:', this.textContent);
      if (this.getAttribute('href') === '#') {
        e.preventDefault();
      }
    });
  });
  
  // Verificar si ya hay usuario logueado
  verificarSesionActiva();
  
  // Manejar envío del formulario de login
  initLoginForm();
  
  // Manejar envío del formulario de registro
  initRegisterForm();
}

// Función para verificar si ya hay una sesión activa
function verificarSesionActiva() {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
  if (usuarioActual) {
    // Si ya hay un usuario logueado, redirigir a la página de perfil
    window.location.href = 'perfil.html';
  }
}

// Función para manejar el formulario de login
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    console.log('Intentando iniciar sesión:', { email });

    try {
      const response = await fetch('/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (data.success) {
        // Guardar datos del usuario en localStorage
        localStorage.setItem('usuarioActual', JSON.stringify(data.usuario));
        
        // Mostrar mensaje de éxito
        alert('Inicio de sesión exitoso.');
        
        // Redirigir a la página de perfil
        window.location.href = 'perfil.html';
      } else {
        alert(data.error || 'Credenciales incorrectas');
      }
    } catch (error) {
      alert('Error al conectar con el servidor.');
    }
  });
}

// Función para manejar el formulario de registro
function initRegisterForm() {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;

  registerForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const nombre = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Comprobar que las contraseñas coinciden
    if (password !== confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log('Registrando nuevo usuario:', { nombre, email });

    try {
      const response = await fetch('/api/usuarios/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        alert('Registro exitoso. Ya puedes iniciar sesión.');
        registerForm.reset();
        document.getElementById('login-tab').click();
      } else {
        alert(data.error || 'Error al registrar usuario');
      }
    } catch (error) {
      alert('Error al conectar con el servidor.');
    }
  });
}