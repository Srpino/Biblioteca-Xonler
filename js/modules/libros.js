// js/frontend/libros.js

// Módulo para la página de libros
export default function initLibrosPage() {
  console.log('Página de libros inicializada');

  // Verificar si hay un usuario logueado y actualizar menú
  verificarUsuarioLogueado();

  // Inicializar la visualización
  initLibrosVisualizacion();

  // Inicializar filtros y cargar bibliotecas
  initLibrosFiltros();

  // Cargar libros al iniciar la página
  cargarLibros();

  // Configurar eventos para préstamos
  configurarPrestamoEventos();
}

// Estado global para paginación
let allBooks = [];
const pageSize = 9;
let currentPage = 1;

// Función para verificar si hay un usuario logueado
function verificarUsuarioLogueado() {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
  const loginMenuItem = document.getElementById('loginMenuItem');
  const perfilMenuItem = document.getElementById('perfilMenuItem');
  const logoutMenuItem = document.getElementById('logoutMenuItem');

  if (usuarioActual) {
    // Usuario logueado: mostrar perfil y cerrar sesión, ocultar login
    loginMenuItem.classList.add('d-none');
    perfilMenuItem.classList.remove('d-none');
    logoutMenuItem.classList.remove('d-none');

    // Configurar evento de cerrar sesión
    document.getElementById('cerrarSesion').addEventListener('click', () => {
      localStorage.removeItem('usuarioActual');
      window.location.reload();
    });
  } else {
    // Sin usuario: mostrar login, ocultar perfil y cerrar sesión
    loginMenuItem.classList.remove('d-none');
    perfilMenuItem.classList.add('d-none');
    logoutMenuItem.classList.add('d-none');
  }
}

// Función principal para cargar libros desde el backend y mostrarlos (con filtros opcionales)
function cargarLibros(filtros = {}) {
  const librosGrid = document.getElementById('librosGrid');
  if (!librosGrid) return;

  // Construir URL con query params según filtros
  let url = '/api/libros';
  const params = [];
  if (filtros.titulo) params.push(`titulo=${encodeURIComponent(filtros.titulo)}`);
  if (filtros.autor) params.push(`autor=${encodeURIComponent(filtros.autor)}`);
  if (filtros.categorias?.length) params.push(`categorias=${filtros.categorias.join(',')}`);
  if (filtros.disponibilidad) params.push(`disponibilidad=${encodeURIComponent(filtros.disponibilidad)}`);
  if (filtros.biblioteca) params.push(`biblioteca=${encodeURIComponent(filtros.biblioteca)}`);
  if (params.length) url += '?' + params.join('&');

  // Mostrar loader
  librosGrid.innerHTML = '<div class="text-center my-5">Cargando libros...</div>';
  const resultCount = document.getElementById('resultCount');
  if (resultCount) resultCount.textContent = '';

  fetch(url)
    .then(res => res.json())
    .then(libros => {
      if (!Array.isArray(libros) || !libros.length) {
        librosGrid.innerHTML = '<div class="alert alert-warning">No se encontraron libros.</div>';
        if (resultCount) resultCount.textContent = 'Mostrando 0 libros';
        const pagination = document.getElementById('pagination');
        if (pagination) pagination.innerHTML = '';
        return;
      }
      allBooks = libros;
      currentPage = 1;
      renderBooksPage();
    })
    .catch(err => {
      console.error('Error al cargar libros:', err);
      librosGrid.innerHTML = '<div class="alert alert-danger">Error al cargar los libros.</div>';
      if (resultCount) resultCount.textContent = 'Mostrando 0 libros';
      const pagination = document.getElementById('pagination');
      if (pagination) pagination.innerHTML = '';
    });
}

// Renderiza una página de libros
function renderBooksPage() {
  const librosGrid = document.getElementById('librosGrid');
  const start = (currentPage - 1) * pageSize;
  const pageItems = allBooks.slice(start, start + pageSize);
  const isListView = librosGrid.className === 'list-view';

  librosGrid.innerHTML = '';
  pageItems.forEach(libro => {
    if (isListView) {
      // Modo de vista de lista compacta
      const item = document.createElement('div');
      item.className = 'book-list-item';
      item.setAttribute('data-bs-toggle', 'modal');
      item.setAttribute('data-bs-target', '#bookDetailModal');
      item.setAttribute('data-id', libro.id);
      item.innerHTML = `
        <div class="book-img-container">
          <img src="${libro.imagen_url || '/assets/images/libro-placeholder.jpg'}" 
               alt="${libro.titulo}">
        </div>
        <div class="book-info">
          <div>
            <div class="book-title">${libro.titulo}</div>
            <div class="book-author">${libro.autor}</div>
            <div class="book-isbn">ISBN: ${libro.isbn || 'N/A'}</div>
          </div>
        </div>
        <div class="book-status">
          <small class="text-${libro.disponibilidad ? 'success' : 'danger'}">
            ${libro.disponibilidad ? 'Disponible' : 'Prestado'}
          </small>
          <span class="badge bg-secondary book-category">${libro.categoria}</span>
        </div>
      `;
      librosGrid.appendChild(item);
    } else {
      // Modo de vista de cuadrícula (original)
      const col = document.createElement('div');
      col.className = 'col-md-4 mb-4';
      col.innerHTML = `
        <div class="card h-100 book-card"
             data-bs-toggle="modal"
             data-bs-target="#bookDetailModal"
             data-id="${libro.id}"
             style="cursor:pointer;">
          <img src="${libro.imagen_url || '/assets/images/libro-placeholder.jpg'}"
               class="card-img-top"
               alt="${libro.titulo}">
          <div class="card-body">
            <h5 class="card-title">${libro.titulo}</h5>
            <p class="card-text">Autor: ${libro.autor}</p>
            <p class="card-text"><small class="text-muted">ISBN: ${libro.isbn || 'N/A'}</small></p>
            <span class="badge bg-secondary">${libro.categoria}</span>
          </div>
          <div class="card-footer">
            <small class="text-${libro.disponibilidad ? 'success' : 'danger'}">
              ${libro.disponibilidad ? 'Disponible' : 'Prestado'}
            </small>
          </div>
        </div>
      `;
      librosGrid.appendChild(col);
    }
  });

  renderPagination();
  const resultCount = document.getElementById('resultCount');
  if (resultCount) resultCount.textContent = `Mostrando ${pageItems.length} de ${allBooks.length} libros`;
}

// Paginación simple
function renderPagination() {
  const totalPages = Math.ceil(allBooks.length / pageSize);
  const pagination = document.getElementById('pagination');
  if (!pagination) return;
  pagination.innerHTML = '';

  const makeLi = (label, disabled, onClick) => {
    const li = document.createElement('li');
    li.className = `page-item ${disabled ? 'disabled' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${label}</a>`;
    if (!disabled) li.onclick = onClick;
    return li;
  };

  // Anterior
  pagination.appendChild(makeLi('Anterior', currentPage === 1, e => {
    e.preventDefault(); currentPage--; renderBooksPage();
  }));

  // Números
  for (let p = 1; p <= totalPages; p++) {
    pagination.appendChild(makeLi(p, p === currentPage, e => {
      e.preventDefault(); currentPage = p; renderBooksPage();
    }));
  }

  // Siguiente
  pagination.appendChild(makeLi('Siguiente', currentPage === totalPages, e => {
    e.preventDefault(); currentPage++; renderBooksPage();
  }));
}

// Modo vista grid/list
function initLibrosVisualizacion() {
  const viewGridBtn = document.getElementById('viewGrid');
  const viewListBtn = document.getElementById('viewList');
  const librosGrid  = document.getElementById('librosGrid');
  if (!viewGridBtn || !viewListBtn || !librosGrid) return;

  viewGridBtn.onclick = () => {
    librosGrid.className = 'row';
    viewGridBtn.classList.add('active');
    viewListBtn.classList.remove('active');
    renderBooksPage();
  };
  viewListBtn.onclick = () => {
    librosGrid.className = 'list-view';
    viewListBtn.classList.add('active');
    viewGridBtn.classList.remove('active');
    renderBooksPage();
  };
}

// Carga bibliotecas dinámicamente
function cargarBibliotecasEnSelect() {
  const sel = document.getElementById('biblioteca');
  if (!sel) return;
  sel.innerHTML = '<option value="todas">Todas las bibliotecas</option>';
  fetch('/api/bibliotecas')
    .then(r => r.json())
    .then(bibs => bibs.forEach(b => {
      const o = document.createElement('option');
      o.value = b.id; o.textContent = b.nombre;
      sel.appendChild(o);
    }))
    .catch(err => console.error('Error libs:', err));
}

// Cargar bibliotecas en el modal
function cargarBibliotecasModal() {
  const modalBiblioteca = document.getElementById('modalBiblioteca');
  if (!modalBiblioteca) return;
  modalBiblioteca.innerHTML = '<option value="">Seleccione una biblioteca</option>';
  
  fetch('/api/bibliotecas')
    .then(r => r.json())
    .then(bibs => bibs.forEach(b => {
      const o = document.createElement('option');
      o.value = b.id; 
      o.textContent = b.nombre;
      modalBiblioteca.appendChild(o);
    }))
    .catch(err => console.error('Error al cargar bibliotecas:', err));
}

// Inicializar filtros y manejar envío
function initLibrosFiltros() {
  cargarBibliotecasEnSelect();
  const btn = document.getElementById('applyFiltersBtn');
  const titulo = document.getElementById('searchTitle');
  const autor  = document.getElementById('searchAuthor');
  const disp   = document.getElementById('disponibilidad');
  const bib    = document.getElementById('biblioteca');
  const cats   = ['catFiccion','catCiencia','catHistoria','catLiteratura','catOtro']
                    .map(id => document.getElementById(id));

  btn.onclick = () => {
    const filters = {};
    if (titulo.value) filters.titulo = titulo.value.trim();
    if (autor.value)  filters.autor  = autor.value.trim();
    const selCats = cats.filter(c=>c.checked).map(c=>c.value);
    if (selCats.length) filters.categorias = selCats;
    if (disp.value !== 'todos') filters.disponibilidad = disp.value;
    if (bib.value !== 'todas') filters.biblioteca = bib.value;
    cargarLibros(filters);
  };
}

// Configurar eventos relacionados con préstamos
function configurarPrestamoEventos() {
  // Al abrir el modal de detalle de libro
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

      // Cargar las bibliotecas disponibles
      cargarBibliotecasModal();

      titleEl.textContent = 'Cargando...';
      authorEl.textContent = ''; 
      isbnEl.textContent = '';
      imgEl.src = '/assets/images/libro-placeholder.jpg';
      imgEl.alt = 'Portada'; 
      descEl.textContent = '';

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
        
        // Guardar ID del libro para préstamo
        modalEl.setAttribute('data-libro-id', bookId);
      } catch (err) {
        titleEl.textContent = 'Error';
        descEl.textContent = err.message;
      }
    });
  }

  // Botón de solicitar préstamo
  const btnSolicitarPrestamo = document.getElementById('btnSolicitarPrestamo');
  if (btnSolicitarPrestamo) {
    btnSolicitarPrestamo.addEventListener('click', mostrarConfirmacionPrestamo);
  }

  // Botón de confirmar préstamo
  const btnConfirmarPrestamo = document.getElementById('btnConfirmarPrestamo');
  if (btnConfirmarPrestamo) {
    btnConfirmarPrestamo.addEventListener('click', realizarPrestamo);
  }
}

// Función para mostrar confirmación de préstamo
function mostrarConfirmacionPrestamo() {
  // Verificar si hay usuario logueado
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
  if (!usuarioActual) {
    // Mostrar modal de inicio de sesión requerido
    const loginModal = new bootstrap.Modal(document.getElementById('loginRequiredModal'));
    loginModal.show();
    return;
  }

  const modalDetalleLibro = document.getElementById('bookDetailModal');
  const libroId = modalDetalleLibro.getAttribute('data-libro-id');
  const libroTitulo = modalDetalleLibro.querySelector('.modal-title').textContent;
  const bibliotecaSelect = document.getElementById('modalBiblioteca');
  const bibliotecaId = bibliotecaSelect.value;
  const bibliotecaNombre = bibliotecaSelect.options[bibliotecaSelect.selectedIndex].text;

  // Validar que se haya seleccionado una biblioteca
  if (!bibliotecaId) {
    alert('Por favor selecciona una biblioteca');
    return;
  }

  // Establecer datos en el modal de confirmación
  document.getElementById('prestamoLibroTitulo').textContent = libroTitulo;
  document.getElementById('prestamoBiblioteca').textContent = bibliotecaNombre;
  document.getElementById('prestamoLibroId').value = libroId;
  document.getElementById('prestamoBibliotecaId').value = bibliotecaId;

  // Ocultar modal de detalle y mostrar modal de confirmación
  const modalDetalle = bootstrap.Modal.getInstance(modalDetalleLibro);
  modalDetalle.hide();
  
  const modalConfirmacion = new bootstrap.Modal(document.getElementById('confirmPrestamoModal'));
  modalConfirmacion.show();
}

// Función para realizar el préstamo
async function realizarPrestamo() {
  try {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const libroId = document.getElementById('prestamoLibroId').value;
    const bibliotecaId = document.getElementById('prestamoBibliotecaId').value;
    
    // Crear objeto para enviar al backend
    const fechaActual = new Date().toISOString().split('T')[0];
    const prestamo = {
      usuario_id: usuarioActual.id,
      biblioteca_libro_id: bibliotecaId, // Aquí debería ser el ID de la relación biblioteca_libro
      fecha_prestamo: fechaActual,
      fecha_devolucion: null
    };

    // Realizar la petición
    const response = await fetch('/api/prestamos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(prestamo)
    });

    if (!response.ok) {
      throw new Error('Error al realizar el préstamo');
    }

    // Cerrar modal de confirmación
    const modal = bootstrap.Modal.getInstance(document.getElementById('confirmPrestamoModal'));
    modal.hide();

    // Mostrar mensaje de éxito
    alert('Préstamo realizado correctamente');
    
    // Redirigir a la página de perfil
    window.location.href = 'perfil.html';
  } catch (error) {
    console.error('Error:', error);
    alert('No se pudo completar el préstamo. Por favor, inténtalo de nuevo.');
  }
}

// Modal detalles libro
document.addEventListener('DOMContentLoaded', () => {
  const modalEl = document.getElementById('bookDetailModal');
  if (!modalEl) return;

  modalEl.addEventListener('show.bs.modal', async e => {
    const id = e.relatedTarget.getAttribute('data-id');
    const fields = {
      title: modalEl.querySelector('.modal-title'),
      author: modalEl.querySelector('#modalBookAuthor'),
      isbn: modalEl.querySelector('#modalBookISBN'),
      img: modalEl.querySelector('#modalBookImg'),
      desc: modalEl.querySelector('#modalBookDescription'),
      cat: modalEl.querySelector('#modalBookCategory'),
      avail: modalEl.querySelector('#modalBookAvailability')
    };

    Object.values(fields).forEach(f => { if(f) f.textContent=''; });
    fields.img.src = '/assets/images/libro-placeholder.jpg';

    try {
      const r = await fetch(`/api/libros/${id}`);
      if(!r.ok) throw new Error(r.status);
      const libro = await r.json();
      
      fields.title.textContent = libro.titulo;
      fields.author.textContent = libro.autor;
      fields.isbn.textContent = libro.isbn || 'N/A';
      fields.desc.textContent = libro.descripcion || 'Sin descripción disponible.';
      if(libro.imagen_url) fields.img.src = libro.imagen_url;
      if(fields.cat) fields.cat.textContent = libro.categoria;
      if(fields.avail) {
        fields.avail.textContent = libro.disponibilidad ? 'Disponible' : 'No disponible';
        fields.avail.className = libro.disponibilidad ? 'text-success' : 'text-danger';
      }
    } catch(e) {
      console.error('Error al cargar detalle:', e);
      fields.title.textContent = 'Error al cargar libro';
    }
  });
});
