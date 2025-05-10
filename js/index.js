// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  // Detectar la página actual basada en la URL
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Funcionalidades específicas para cada página
  switch(currentPage) {
    case 'index.html':
      initHomePage();
      break;
    case 'bibliotecas.html':
      initBibliotecasPage();
      break;
    case 'libros.html':
      initLibrosPage();
      break;
    case 'contacto.html':
      initContactoPage();
      break;
    case 'login.html':
      initLoginPage();
      break;
  }

  // Inicializar componentes comunes
  initCommonComponents();
});

// Funcionalidades para la página de inicio
function initHomePage() {
  console.log('Página de inicio inicializada');
  
  // Mostrar bibliotecas destacadas
  const bibliotecasDestacadasContainer = document.querySelector('.row.mt-3');
  if (bibliotecasDestacadasContainer) {
    // Aquí se podrían cargar datos desde una API
    console.log('Contenedor de bibliotecas destacadas encontrado');
  }
}

// Funcionalidades para la página de bibliotecas
function initBibliotecasPage() {
  console.log('Página de bibliotecas inicializada');
  
  // Manejar clic en elementos de la lista de bibliotecas
  const bibliotecasList = document.getElementById('bibliotecasList');
  if (bibliotecasList) {
    const bibliotecasItems = bibliotecasList.querySelectorAll('.list-group-item');
    
    bibliotecasItems.forEach(item => {
      item.addEventListener('click', function(e) {
        e.preventDefault();
        const bibliotecaId = this.getAttribute('data-id');
        
        // Marcar el elemento seleccionado
        bibliotecasItems.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        // Mostrar detalles de la biblioteca seleccionada
        document.getElementById('defaultMessage').style.display = 'none';
        document.getElementById('detailsContent').style.display = 'block';
        
        // Actualizar título con el nombre de la biblioteca
        const bibliotecaNombre = this.querySelector('h5').textContent;
        document.getElementById('bibliotecaTitle').textContent = bibliotecaNombre;
        
        // Aquí se cargarían datos reales de la biblioteca
        document.getElementById('detailName').textContent = bibliotecaNombre;
        document.getElementById('detailAddress').textContent = this.querySelector('p').textContent;
        
        // Simular carga de datos
        console.log(`Cargando datos para biblioteca ID: ${bibliotecaId}`);
      });
    });
    
    // Filtrar bibliotecas
    document.getElementById('searchBtn').addEventListener('click', function() {
      const nombreBusqueda = document.getElementById('searchName').value.toLowerCase();
      const ubicacionBusqueda = document.getElementById('searchLocation').value.toLowerCase();
      
      bibliotecasItems.forEach(item => {
        const nombre = item.querySelector('h5').textContent.toLowerCase();
        const ubicacion = item.querySelector('p').textContent.toLowerCase();
        
        const coincideNombre = nombre.includes(nombreBusqueda);
        const coincideUbicacion = ubicacion.includes(ubicacionBusqueda);
        
        if ((nombreBusqueda === '' || coincideNombre) && 
            (ubicacionBusqueda === '' || coincideUbicacion)) {
          item.style.display = 'block';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }
}

// Funcionalidades para la página de libros
function initLibrosPage() {
  console.log('Página de libros inicializada');
  
  // Manejar cambios en la visualización (cuadrícula vs lista)
  const viewGridBtn = document.getElementById('viewGrid');
  const viewListBtn = document.getElementById('viewList');
  const librosGrid = document.getElementById('librosGrid');
  
  if (viewGridBtn && viewListBtn && librosGrid) {
    viewGridBtn.addEventListener('click', function() {
      librosGrid.className = 'row';
      viewGridBtn.classList.add('active');
      viewListBtn.classList.remove('active');
      
      // Cambiar la clase de los items para vista en cuadrícula
      const items = librosGrid.querySelectorAll('.col-md-4');
      items.forEach(item => {
        item.className = 'col-md-4 mb-4';
      });
    });
    
    viewListBtn.addEventListener('click', function() {
      librosGrid.className = 'list-view';
      viewListBtn.classList.add('active');
      viewGridBtn.classList.remove('active');
      
      // Cambiar la clase de los items para vista en lista
      const items = librosGrid.querySelectorAll('.col-md-4');
      items.forEach(item => {
        item.className = 'col-12 mb-3';
        
        // Reorganizar elementos para vista de lista
        const card = item.querySelector('.card');
        if (card) {
          card.className = 'card flex-row';
          
          const img = card.querySelector('.card-img-top');
          if (img) {
            img.style.width = '150px';
            img.style.height = 'auto';
          }
        }
      });
    });
    
    // Aplicar filtros
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    if (applyFiltersBtn) {
      applyFiltersBtn.addEventListener('click', function() {
        const titulo = document.getElementById('searchTitle').value.toLowerCase();
        const autor = document.getElementById('searchAuthor').value.toLowerCase();
        const disponibilidad = document.getElementById('disponibilidad').value;
        const biblioteca = document.getElementById('biblioteca').value;
        
        // Categorías seleccionadas
        const categorias = [];
        document.querySelectorAll('input[type="checkbox"]:checked').forEach(checkbox => {
          categorias.push(checkbox.value);
        });
        
        console.log('Aplicando filtros:', {
          titulo,
          autor,
          categorias,
          disponibilidad,
          biblioteca
        });
        
        // Aquí se realizaría la solicitud al servidor con estos filtros
        // Por ahora simplemente actualizamos el contador de resultados
        document.getElementById('resultCount').textContent = 'Mostrando resultados filtrados';
      });
    }
  }
}

// Funcionalidades para la página de contacto
function initContactoPage() {
  console.log('Página de contacto inicializada');
  
  // Manejar envío del formulario de contacto
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Recoger datos del formulario
      const nombre = document.getElementById('nombre').value;
      const email = document.getElementById('email').value;
      const asunto = document.getElementById('asunto').value;
      const mensaje = document.getElementById('mensaje').value;
      
      console.log('Enviando formulario de contacto:', {
        nombre,
        email,
        asunto,
        mensaje
      });
      
      // Aquí se enviaría el formulario al servidor
      // Por ahora mostramos un mensaje de éxito
      alert('Mensaje enviado correctamente. Gracias por contactarnos.');
      
      // Limpiar el formulario
      contactForm.reset();
    });
  }
}

// Funcionalidades para la página de login
function initLoginPage() {
  console.log('Página de login inicializada');
  
  // Manejar envío del formulario de login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
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
  
  // Manejar envío del formulario de registro
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
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
}

// Componentes comunes a todas las páginas
function initCommonComponents() {
  // Comprobar si estamos en un área de administración
  const isAdmin = window.location.href.includes('/admin/');
  
  if (isAdmin) {
    initAdminArea();
  }
  
  // Añadir funcionalidad para scroll suave en enlaces de ancla
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    });
  });
}

// Funcionalidades específicas para el área de administración
function initAdminArea() {
  console.log('Área de administración inicializada');
  
  // Manejar formulario de login de administrador
  const adminLoginForm = document.getElementById('adminLoginForm');
  if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = document.getElementById('adminEmail').value;
      const password = document.getElementById('adminPassword').value;
      
      console.log('Intentando iniciar sesión como administrador:', { email });
      
      // Aquí se realizaría la autenticación del administrador
      alert('Inicio de sesión administrativo exitoso.');
      window.location.href = 'index.html';
    });
  }
  
  // Manejar formulario para agregar biblioteca
  const agregarBibliotecaForm = document.getElementById('agregarBibliotecaForm');
  if (agregarBibliotecaForm) {
    agregarBibliotecaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Recoger datos del formulario
      const nombre = document.getElementById('nuevaBibliotecaNombre').value;
      const colegio = document.getElementById('nuevaBibliotecaColegio').value;
      const direccion = document.getElementById('nuevaBibliotecaDireccion').value;
      
      console.log('Agregando nueva biblioteca:', {
        nombre,
        colegio,
        direccion
      });
      
      // Aquí se enviaría la información al servidor
      alert('Biblioteca agregada correctamente.');
      
      // Cerrar el modal y actualizar la tabla de bibliotecas
      const modal = bootstrap.Modal.getInstance(document.getElementById('agregarBibliotecaModal'));
      modal.hide();
      
      // Actualizar la tabla (en una aplicación real, se recargarian los datos)
      // Por simplicidad, aquí solo recargamos la página
      location.reload();
    });
  }
  
  // Manejar formulario para editar biblioteca
  const editarBibliotecaForm = document.getElementById('editarBibliotecaForm');
  if (editarBibliotecaForm) {
    editarBibliotecaForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Recoger datos del formulario
      const id = document.getElementById('editBibliotecaId').value;
      const nombre = document.getElementById('editBibliotecaNombre').value;
      const colegio = document.getElementById('editBibliotecaColegio').value;
      const direccion = document.getElementById('editBibliotecaDireccion').value;
      
      console.log('Actualizando biblioteca:', {
        id,
        nombre,
        colegio,
        direccion
      });
      
      // Aquí se enviaría la información al servidor
      alert('Biblioteca actualizada correctamente.');
      
      // Cerrar el modal y actualizar la tabla de bibliotecas
      const modal = bootstrap.Modal.getInstance(document.getElementById('editarBibliotecaModal'));
      modal.hide();
      
      // Actualizar la tabla (en una aplicación real, se recargarian los datos)
      // Por simplicidad, aquí solo recargamos la página
      location.reload();
    });
  }
}