const express = require("express");
const VentaController = require("../controllers/venta.controller");

const api = express.Router();

// Rutas para registrar y buscar ventas
api.post("/venta/create", VentaController.registrarVenta);
api.get("/venta/buscar", VentaController.obtenerVentasPorFecha);
api.delete("/venta/eliminarPorFecha/:fecha", VentaController.eliminarVentasPorFecha);

// Rutas que usa el panel de administración (pedidos en vivo)
api.get("/ventas", VentaController.listarVentas);
api.put("/ventas/:id", VentaController.actualizarEstado);

module.exports = api;
