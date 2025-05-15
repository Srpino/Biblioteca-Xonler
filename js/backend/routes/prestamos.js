const express = require('express');
const router = express.Router();
const {
  obtenerPrestamos,
  obtenerPrestamoPorId,
  crearPrestamo,
  actualizarPrestamo,
  eliminarPrestamo,
  obtenerPrestamosPorUsuario
} = require('../controllers/prestamosController');

// Rutas CRUD
router.get('/', obtenerPrestamos);
router.get('/:id', obtenerPrestamoPorId);
router.post('/', crearPrestamo);
router.put('/:id', actualizarPrestamo);
router.delete('/:id', eliminarPrestamo);

// Ruta para obtener préstamos por usuario
router.get('/usuario/:id', obtenerPrestamosPorUsuario);

module.exports = router; 