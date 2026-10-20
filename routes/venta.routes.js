const express = require("express");
const VentaController = require("../controllers/venta.controller");

const api = express.Router();

api.post("/ventas/crear", VentaController.registrarVenta);
api.get("/ventas/buscar", VentaController.listarVentas); // panel de administración (pedidos en vivo)
api.get("/ventas/buscar-por-fecha", VentaController.obtenerVentasPorFecha); // ?fecha=YYYY-MM-DD
api.put("/ventas/actualizar/:id", VentaController.actualizarEstado);
api.delete("/ventas/eliminar-por-fecha/:fecha", VentaController.eliminarVentasPorFecha);

module.exports = api;
