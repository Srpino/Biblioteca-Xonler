// Módulo para la página de libros
export default function initLibrosPage() {
  console.log('Página de libros inicializada');
  
  // Inicializar la visualización
  initLibrosVisualizacion();
  
  // Inicializar filtros
  initLibrosFiltros();
}

// Función para manejar cambios en la visualización (cuadrícula vs lista)
function initLibrosVisualizacion() {
  const viewGridBtn = document.getElementById('viewGrid');
  const viewListBtn = document.getElementById('viewList');
  const librosGrid = document.getElementById('librosGrid');
  
  if (!viewGridBtn || !viewListBtn || !librosGrid) return;
  
  viewGridBtn.addEventListener('click', function() {
    librosGrid.className = 'row';
    viewGridBtn.classList.add('active');
    viewListBtn.classList.remove('active');
    
    // Cambiar la clase de los items para vista en cuadrícula
    const items = librosGrid.querySelectorAll('.col-md-4, .col-12');
    items.forEach(item => {
      item.className = 'col-md-4 mb-4';
      
      // Restaurar estilo de tarjetas
      const card = item.querySelector('.card');
      if (card) {
        card.className = 'card h-100';
        
        const img = card.querySelector('img');
        if (img) {
          img.className = 'card-img-top';
          img.style.width = '';
          img.style.height = '';
        }
      }
    });
  });
  
  viewListBtn.addEventListener('click', function() {
    librosGrid.className = 'list-view';
    viewListBtn.classList.add('active');
    viewGridBtn.classList.remove('active');
    
    // Cambiar la clase de los items para vista en lista
    const items = librosGrid.querySelectorAll('.col-md-4, .col-12');
    items.forEach(item => {
      item.className = 'col-12 mb-3';
      
      // Reorganizar elementos para vista de lista
      const card = item.querySelector('.card');
      if (card) {
        card.className = 'card flex-row';
        
        const img = card.querySelector('img');
        if (img) {
          img.style.width = '150px';
          img.style.height = 'auto';
        }
      }
    });
  });
}

// Función para inicializar los filtros de libros
function initLibrosFiltros() {
  const applyFiltersBtn = document.getElementById('applyFiltersBtn');
  if (!applyFiltersBtn) return;
  
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