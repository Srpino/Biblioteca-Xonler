// Módulo para la página de login
export default function initLoginPage() {
  console.log('Página de login inicializada');
  
  // Manejar envío del formulario de login
  initLoginForm();
  
  // Manejar envío del formulario de registro
  initRegisterForm();
}

// Función para manejar el formulario de login
function initLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;
  
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    console.log('Intentando iniciar sesión:', { email });
    
    // Aquí se realizaría la autenticación
    // Por ahora redireccionamos al usuario a la página principal
    alert('Inicio de sesión exitoso.');
    window.location.href = 'index.html';
  });
}

// Función para manejar el formulario de registro
function initRegisterForm() {
  const registerForm = document.getElementById('registerForm');
  if (!registerForm) return;
  
  registerForm.addEventListener('submit', function(e) {
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
    
    // Aquí se enviaría la información de registro al servidor
    alert('Registro exitoso. Ya puedes iniciar sesión.');
    
    // Limpiar formulario y cambiar a la pestaña de inicio de sesión
    registerForm.reset();
    document.getElementById('login-tab').click();
  });
}