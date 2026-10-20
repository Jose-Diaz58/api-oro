const express = require("express");
const ProductoController = require("../controllers/producto.controller");
const api = express.Router();

api.post("/productos/crear", ProductoController.createProducto);
api.get("/productos/buscar", ProductoController.obtenerDatos);
api.put("/productos/actualizar/:id", ProductoController.actualizarProducto);
api.delete("/productos/eliminar/:id", ProductoController.eliminarProducto);

module.exports = api;