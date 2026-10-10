const express = require("express");
const VentaController = require("../controllers/venta.controller");

const api = express.Router();

// Rutas para registrar y buscar ventas
api.post("/venta/create", VentaController.registrarVenta);
api.get("/venta/buscar", VentaController.obtenerVentasPorFecha);
api.delete("/venta/eliminarPorFecha/:fecha", VentaController.eliminarVentasPorFecha);

module.exports = api;