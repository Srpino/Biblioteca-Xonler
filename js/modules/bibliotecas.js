export default function initBibliotecasPage() {
  console.log('Página de bibliotecas inicializada');
  cargaBibliotecas();
  initBibliotecasSearch();
}

export async function cargaBibliotecas() {
    const bibliotecasList = document.getElementById('bibliotecasList');
    if (!bibliotecasList) {
        console.error('Elemento bibliotecasList no encontrado en el DOM');
        return;
    }
    
    bibliotecasList.innerHTML = '<div class="text-center my-3">Cargando bibliotecas...</div>';
    
    try {
        console.log('Solicitando datos de bibliotecas...');
        const response = await fetch('/api/bibliotecas');
        
        if (!response.ok) {
            throw new Error(`Error de servidor: ${response.status} ${response.statusText}`);
        }
        
        const bibliotecas = await response.json();
        console.log('Datos de bibliotecas recibidos:', bibliotecas);
        
        if (!Array.isArray(bibliotecas) || bibliotecas.length === 0) {
            bibliotecasList.innerHTML = '<div class="alert alert-warning">No se encontraron bibliotecas.</div>';
            return;
        }
        
        // Renderizar las bibliotecas
        bibliotecasList.innerHTML = bibliotecas.map(b => `
          <li class="list-group-item" data-id="${b.id}">
            <h5>${b.nombre}</h5>
            <p>${b.direccion}</p>
            <small class="text-muted">${b.colegio}</small>
          </li>
        `).join('');
        
        console.log('Bibliotecas renderizadas, iniciando lista...');
        initBibliotecasList();
    } catch (error) {
        console.error('Error al cargar bibliotecas:', error);
        bibliotecasList.innerHTML = `<div class="alert alert-danger">Error al cargar las bibliotecas: ${error.message}</div>`;
    }
}

function initBibliotecasList() {
  const bibliotecasList = document.getElementById('bibliotecasList');
  const container = document.getElementById('bibliotecaLibros');
  if (!bibliotecasList || !container) {
    console.error('Elementos necesarios no encontrados:', {
      bibliotecasList: !!bibliotecasList,
      container: !!container
    });
    return;
  }

  const items = bibliotecasList.querySelectorAll('.list-group-item');
  console.log('📋 bibliotecasItems count:', items.length);

  // Asignar manejador de clic a cada item
  items.forEach(item => {
    console.log('🔗 Adjuntar listener a biblioteca:', item.dataset.id, '->', item.querySelector('h5').textContent);
    item.addEventListener('click', () => {
      // Eliminar 'active' de todos los items antes de asignar al seleccionado
      items.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      cargarLibros(item, container);
    });
  });

  // Confirmar que la inicialización terminó
  console.log('↪ initBibliotecasList completa, items count:', items.length);

  // Auto-cargar la primera biblioteca
  if (items.length > 0) {
    console.log('↪ Auto-cargando primera biblioteca ID:', items[0].dataset.id);
    
    const defaultMessage = document.getElementById('defaultMessage');
    const detailsContent = document.getElementById('detailsContent');
    
    if (defaultMessage && detailsContent) {
      defaultMessage.style.display = 'none';
      detailsContent.style.display = 'block';
    } else {
      console.warn('Elementos defaultMessage o detailsContent no encontrados');
    }
    
    items[0].classList.add('active');
    cargarLibros(items[0], container);
  } else {
    console.warn('No hay elementos de biblioteca para auto-cargar');
  }
}

async function cargarLibros(item, container) {
  const bibliotecaId = item.dataset.id;
  console.log('↪ Cargando libros para biblioteca ID:', bibliotecaId);

  // Mostrar detalles
  const nombre    = item.querySelector('h5').textContent;
  const direccion = item.querySelector('p').textContent.toLowerCase(); // 1. lee la dirección del DOM

  try {
    const bibliotecaTitle = document.getElementById('bibliotecaTitle');
    const detailName = document.getElementById('detailName');
    const detailAddress = document.getElementById('detailAddress');
    
    if (bibliotecaTitle) bibliotecaTitle.textContent = nombre;
    if (detailName) detailName.textContent = nombre;
    if (detailAddress) detailAddress.textContent = direccion;
    
    showLibraryMap(direccion); // 2. pasa la dirección al mapa
  
    // Mostrar mensaje de carga…
    container.innerHTML = '<div class="text-center my-3">Cargando libros…</div>';
  
    const response = await fetch(`/api/bibliotecas/${bibliotecaId}/libros`);
    console.log('📥 Status respuesta:', response.status);
    
    if (!response.ok) {
      throw new Error(`Error del servidor: ${response.status}`);
    }
    
    const libros = await response.json();
    console.log('📚 Libros recibidos:', libros);
  
    if (!Array.isArray(libros) || libros.length === 0) {
      container.innerHTML = '<div class="alert alert-warning">No hay libros para esta biblioteca.</div>';
    } else {
      container.innerHTML = libros.map(l => `
        <div class="col-md-4 mb-3">
          <div class="card h-100">
            <img src="${l.imagen_url || '/assets/images/libro-placeholder.jpg'}" class="card-img-top" alt="${l.titulo}">
            <div class="card-body">
              <h6 class="card-title">${l.titulo}</h6>
              <p class="card-text small">${l.autor}</p>
            </div>
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    console.error('Error cargando libros de la biblioteca:', err);
    container.innerHTML = `<div class="alert alert-danger">Error al cargar libros: ${err.message}</div>`;
  }
}

function initBibliotecasSearch() {
  const searchBtn = document.getElementById('searchBtn');
  if (!searchBtn) return;

  searchBtn.addEventListener('click', () => {
    const nombreBusqueda = document.getElementById('searchName').value.toLowerCase();
    const ubicacionBusqueda = document.getElementById('searchLocation').value.toLowerCase();
    const bibliotecasItems = document.querySelectorAll('#bibliotecasList .list-group-item');

    bibliotecasItems.forEach(item => {
      const nombre = item.querySelector('h5').textContent.toLowerCase();
      const ubicacion = item.querySelector('p').textContent.toLowerCase();
      const visible = (nombreBusqueda === '' || nombre.includes(nombreBusqueda))
                    && (ubicacionBusqueda === '' || ubicacion.includes(ubicacionBusqueda));
      item.style.display = visible ? 'block' : 'none';
    });
  });
}

function showLibraryMap(address) {
  try {
    const mapIframe = document.getElementById('mapIframe');
    if (!mapIframe) {
      console.error('Elemento mapIframe no encontrado');
      return;
    }
    
    const apiKey = 'AIzaSyAOVYRIgupAurZup5y1PRh8Ismb1A3lLao';
    const base   = 'https://www.google.com/maps/embed/v1/place';
    const url    = `${base}?key=${apiKey}&q=${encodeURIComponent(address)}`;
    
    console.log('Cargando mapa para dirección:', address);
    mapIframe.src = url;
  } catch (error) {
    console.error('Error al mostrar el mapa:', error);
  }
}
