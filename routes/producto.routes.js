const express = require("express");
const ProductoController = require("../controllers/producto.controller");
const api = express.Router();

// Cambiamos las rutas para que encajen perfectamente con las peticiones del frontend:
api.get("/productos", ProductoController.obtenerDatos); // o obtenerProductos según tu controlador
api.post("/productos", ProductoController.createProducto);
api.put("/productos/:id", ProductoController.actualizarProducto);
api.delete("/productos/:id", ProductoController.eliminarProducto);

module.exports = api;