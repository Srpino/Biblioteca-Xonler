// Módulo para funciones de utilidad comunes
export default function initUtils() {
  // Añadir funcionalidad para scroll suave en enlaces de ancla
  setupSmoothScroll();
  
  // Inicializar otros componentes comunes aquí
  setupResponsiveFeatures();
  
  console.log('Módulo de utilidades inicializado');
}

// Función para configurar el scroll suave en enlaces de ancla
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      
      // Verificar que el href no sea solo "#"
      if (href && href !== '#') {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
}

// Función para configurar características responsivas
function setupResponsiveFeatures() {
  // Ajustar elementos según el tamaño de la pantalla
  const handleResize = () => {
    const isMobile = window.innerWidth < 768;
    
    // Ajustes específicos para dispositivos móviles
    if (isMobile) {
      document.querySelectorAll('.desktop-only').forEach(el => {
        el.style.display = 'none';
      });
    } else {
      document.querySelectorAll('.desktop-only').forEach(el => {
        el.style.display = 'block';
      });
    }
  };
  
  // Ejecutar al inicio y cuando cambie el tamaño de la ventana
  handleResize();
  window.addEventListener('resize', handleResize);
}