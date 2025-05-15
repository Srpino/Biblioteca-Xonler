document.addEventListener('DOMContentLoaded', function() {
  // Detectar la página actual y si es admin
  const currentPath = window.location.pathname;
  const currentPage = currentPath.split('/').pop() || 'index.html';
  const isAdmin = currentPath.startsWith('/admin');

  console.log('Página actual:', currentPath, '| Es admin:', isAdmin);

  // Evitar desplazamiento en todos los posibles botones de Registrarse
  // Función para encontrar todos los enlaces que contienen el texto "Registrarse"
  const registrarseLinks = Array.from(document.querySelectorAll('a'))
    .filter(a => (a.href.includes('#') || a.href === '') && 
                a.textContent.trim() === 'Registrarse');
  
  // También buscamos por otros selectores específicos
  document.querySelectorAll('a[href="#"], a[href="#register"], a.registrarse').forEach(a => {
    if (!registrarseLinks.includes(a)) {
      registrarseLinks.push(a);
    }
  });
  
  // Agregamos el event listener a todos los enlaces encontrados
  registrarseLinks.forEach(btn => {
    btn.addEventListener('click', function(e) {
      console.log('Clic en botón registrarse interceptado');
      e.preventDefault();
      
      // Si este botón tiene asociado un comportamiento de tab, lo mantenemos
      if (this.getAttribute('data-bs-toggle') === 'tab') {
        const tabEl = document.querySelector(this.getAttribute('data-bs-target') || this.getAttribute('href'));
        if (tabEl) {
          const tab = new bootstrap.Tab(tabEl);
          tab.show();
        }
      }
    });
  });

  // Import único de admin.js si estamos en admin
  if (isAdmin) {
    import('../js/admin/modules/admin.js')
      .then(({ default: initAdminLogin }) => initAdminLogin())
      .catch(err => console.error('Error al cargar admin.js:', err));
  }

  // Import de utilidades comunes
  import('./common/utils.js')
    .then(({ default: initUtils }) => initUtils())
    .catch(err => console.error('Error al cargar utils.js:', err));

  // Import del módulo específico según la página
  switch (currentPage) {
    case 'index.html':
      if (!isAdmin) {
        import('./modules/home.js')
          .then(({ default: initHome }) => initHome())
          .catch(err => console.error('Error al cargar home.js:', err));
      }
      break;
    case 'bibliotecas.html':
      import('./modules/bibliotecas.js')
        .then(({ default: initBiblio }) => initBiblio())
        .catch(err => console.error('Error al cargar bibliotecas.js:', err));
      break;
    case 'libros.html':
      import('./modules/libros.js')
        .then(({ default: initLibros }) => initLibros())
        .catch(err => console.error('Error al cargar libros.js:', err));
      break;
    case 'contacto.html':
      import('./modules/contacto.js')
        .then(({ default: initContacto }) => initContacto())
        .catch(err => console.error('Error al cargar contacto.js:', err));
      break;
    case 'login.html':
      if (!isAdmin) {
        import('./modules/login.js')
          .then(({ default: initLogin }) => initLogin())
          .catch(err => console.error('Error al cargar login.js:', err));
      }
      break;
    // añade más casos si es necesario
  }

  // Configuración del modal de libro
  const modalEl = document.getElementById('bookDetailModal');
  if (modalEl) {
    modalEl.addEventListener('show.bs.modal', async (event) => {
      const trigger = event.relatedTarget;
      const bookId = trigger?.getAttribute('data-id');
      const titleEl = modalEl.querySelector('.modal-title');
      const authorEl = modalEl.querySelector('#modalBookAuthor');
      const isbnEl = modalEl.querySelector('#modalBookISBN');
      const imgEl = modalEl.querySelector('#modalBookImg');
      const descEl = modalEl.querySelector('#modalBookDescription');

      titleEl.textContent = 'Cargando...';
      authorEl.textContent = ''; isbnEl.textContent = '';
      imgEl.src = '/assets/images/libro-placeholder.jpg';
      imgEl.alt = 'Portada'; descEl.textContent = '';

      if (!bookId) return;

      try {
        const res = await fetch(`/api/libros/${bookId}`);
        if (!res.ok) throw new Error('No encontrado');
        const libro = await res.json();
        titleEl.textContent = libro.titulo || 'Sin título';
        authorEl.textContent = libro.autor || 'Desconocido';
        isbnEl.textContent = libro.isbn || 'N/A';
        imgEl.src = libro.imagen_url || imgEl.src;
        imgEl.alt = libro.titulo || 'Portada';
        descEl.textContent = libro.descripcion || 'Sin descripción.';
      } catch (err) {
        titleEl.textContent = 'Error';
        descEl.textContent = err.message;
      }
    });
  }
});
