// Verificar si hay un usuario logueado
document.addEventListener('DOMContentLoaded', () => {
    // Comprobar si existe un usuario en localStorage
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    
    if (!usuarioActual) {
        // Redirigir al login si no hay usuario
        window.location.href = 'login.html';
        return;
    }
    
    // Cargar datos del usuario en la página
    cargarDatosUsuario(usuarioActual);
    
    // Cargar préstamos del usuario
    cargarPrestamosPorUsuario(usuarioActual.id);
    
    // Configurar evento de cerrar sesión
    document.getElementById('cerrarSesion').addEventListener('click', cerrarSesion);
    
    // Configurar evento para guardar cambios del perfil
    document.getElementById('guardarPerfilBtn').addEventListener('click', guardarCambiosPerfil);
    
    // Configurar evento para confirmar devolución
    document.getElementById('confirmarDevolucionBtn').addEventListener('click', confirmarDevolucion);
});

// Función para cargar datos del usuario en la interfaz
function cargarDatosUsuario(usuario) {
    document.getElementById('nombreUsuario').textContent = usuario.nombre;
    document.getElementById('emailUsuario').textContent = usuario.email;
    document.getElementById('rolUsuario').textContent = usuario.rol;
    
    // Cargar también los datos en el formulario de edición
    document.getElementById('editNombre').value = usuario.nombre;
    document.getElementById('editEmail').value = usuario.email;
}

// Función para cargar préstamos del usuario
async function cargarPrestamosPorUsuario(usuarioId) {
    try {
        const response = await fetch(`/api/prestamos/usuario/${usuarioId}`);
        if (!response.ok) {
            throw new Error('Error al obtener préstamos');
        }
        
        const prestamos = await response.json();
        mostrarPrestamos(prestamos);
    } catch (error) {
        console.error('Error:', error);
        mostrarMensajeError('No se pudieron cargar los préstamos');
    }
}

// Función para mostrar préstamos en la interfaz
function mostrarPrestamos(prestamos) {
    const prestamosList = document.getElementById('prestamosList');
    const noPrestamos = document.getElementById('noPrestamos');
    const historialPrestamos = document.getElementById('historialPrestamos');
    
    // Limpiar contenidos
    prestamosList.innerHTML = '';
    historialPrestamos.innerHTML = '';
    
    // Contadores para estadísticas
    let prestamosActivos = 0;
    let totalPrestamos = prestamos.length;
    
    // Filtrar préstamos activos e historial
    const prestamosActivosArray = prestamos.filter(p => p.estado === 'Activo');
    
    if (prestamosActivosArray.length > 0) {
        // Ocultar mensaje de "no préstamos"
        noPrestamos.style.display = 'none';
        
        // Mostrar préstamos activos
        prestamosActivosArray.forEach(prestamo => {
            const prestamoEl = crearElementoPrestamo(prestamo);
            prestamosList.appendChild(prestamoEl);
            prestamosActivos++;
        });
    } else {
        noPrestamos.style.display = 'block';
    }
    
    // Mostrar historial completo (orden cronológico inverso)
    prestamos.forEach(prestamo => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${prestamo.libro}</td>
            <td>${prestamo.biblioteca}</td>
            <td>${formatearFecha(prestamo.fecha_prestamo)}</td>
            <td>${prestamo.fecha_devolucion ? formatearFecha(prestamo.fecha_devolucion) : '-'}</td>
            <td><span class="badge ${prestamo.estado === 'Activo' ? 'bg-success' : 'bg-secondary'}">${prestamo.estado}</span></td>
        `;
        historialPrestamos.appendChild(fila);
    });
    
    // Actualizar contadores
    document.getElementById('prestamosActivos').textContent = prestamosActivos;
    document.getElementById('totalPrestamos').textContent = totalPrestamos;
}

// Función para crear elemento de préstamo
function crearElementoPrestamo(prestamo) {
    const col = document.createElement('div');
    col.className = 'col-md-6';
    
    // Crear tarjeta de préstamo
    col.innerHTML = `
        <div class="card h-100">
            <div class="row g-0">
                <div class="col-md-4">
                    <img src="${prestamo.imagen_url || '../assets/images/portada-default.jpg'}" 
                         class="img-fluid rounded-start h-100 object-fit-cover" 
                         alt="${prestamo.libro}">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <h5 class="card-title">${prestamo.libro}</h5>
                        <p class="card-text text-muted">${prestamo.autor}</p>
                        <p class="card-text">
                            <small class="text-muted">
                                Biblioteca: ${prestamo.biblioteca}
                            </small>
                        </p>
                        <p class="card-text">
                            <small class="text-muted">
                                Fecha préstamo: ${formatearFecha(prestamo.fecha_prestamo)}
                            </small>
                        </p>
                        <button class="btn btn-sm btn-outline-primary devolver-btn" 
                                data-id="${prestamo.id}" 
                                data-libro="${prestamo.libro}">
                            Devolver libro
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Configurar evento para el botón de devolución
    col.querySelector('.devolver-btn').addEventListener('click', prepararDevolucion);
    
    return col;
}

// Función para preparar datos para la devolución
function prepararDevolucion(event) {
    const prestamoId = event.target.getAttribute('data-id');
    const nombreLibro = event.target.getAttribute('data-libro');
    
    // Establecer datos en el modal
    document.getElementById('prestamoIdDevolver').value = prestamoId;
    document.getElementById('nombreLibroDevolver').textContent = nombreLibro;
    
    // Mostrar modal
    const modal = new bootstrap.Modal(document.getElementById('devolverLibroModal'));
    modal.show();
}

// Función para confirmar la devolución
async function confirmarDevolucion() {
    const prestamoId = document.getElementById('prestamoIdDevolver').value;
    
    try {
        // Obtener fecha actual para la devolución
        const fechaActual = new Date().toISOString().split('T')[0];
        
        const response = await fetch(`/api/prestamos/${prestamoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                fecha_devolucion: fechaActual
            })
        });
        
        if (!response.ok) {
            throw new Error('Error al devolver el libro');
        }
        
        // Cerrar el modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('devolverLibroModal'));
        modal.hide();
        
        // Recargar datos del usuario para actualizar la lista de préstamos
        const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
        cargarPrestamosPorUsuario(usuarioActual.id);
        
        // Mostrar mensaje de éxito
        mostrarMensajeExito('Libro devuelto correctamente');
    } catch (error) {
        console.error('Error:', error);
        mostrarMensajeError('No se pudo completar la devolución');
    }
}

// Función para guardar cambios del perfil
async function guardarCambiosPerfil() {
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const nombre = document.getElementById('editNombre').value;
    const email = document.getElementById('editEmail').value;
    
    // Verificar campos obligatorios
    if (!nombre || !email) {
        mostrarMensajeError('Nombre y email son campos obligatorios');
        return;
    }
    
    try {
        const response = await fetch(`/api/usuarios/${usuarioActual.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                email,
                rol_id: usuarioActual.rol_id
            })
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar el perfil');
        }
        
        const datosActualizados = await response.json();
        
        // Actualizar datos en localStorage
        const nuevoUsuario = {
            ...usuarioActual,
            nombre: datosActualizados.nombre,
            email: datosActualizados.email
        };
        
        localStorage.setItem('usuarioActual', JSON.stringify(nuevoUsuario));
        
        // Actualizar interfaz
        cargarDatosUsuario(nuevoUsuario);
        
        // Cerrar modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('editarPerfilModal'));
        modal.hide();
        
        // Mostrar mensaje de éxito
        mostrarMensajeExito('Perfil actualizado correctamente');
    } catch (error) {
        console.error('Error:', error);
        mostrarMensajeError('No se pudo actualizar el perfil');
    }
}

// Función para mostrar mensajes de error
function mostrarMensajeError(mensaje) {
    // Aquí puedes implementar tu lógica de mostrar mensajes
    alert(`Error: ${mensaje}`);
}

// Función para mostrar mensajes de éxito
function mostrarMensajeExito(mensaje) {
    // Aquí puedes implementar tu lógica de mostrar mensajes
    alert(`Éxito: ${mensaje}`);
}

// Función para formatear fechas
function formatearFecha(fechaStr) {
    const fecha = new Date(fechaStr);
    return fecha.toLocaleDateString('es-ES');
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('usuarioActual');
    window.location.href = 'login.html';
} 