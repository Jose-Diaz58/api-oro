const express = require("express");
const ProductoController = require("../controllers/producto.controller");
const api = express.Router();

api.post("/producto/create", ProductoController.createProducto);
api.get("/producto/buscar", ProductoController.obtenerDatos);
api.put("/producto/actualizar/:id", ProductoController.actualizarProducto);
api.delete("/producto/eliminar/:id", ProductoController.eliminarProducto);

module.exports = api;