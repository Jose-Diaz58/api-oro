const express = require("express");
const ProductoController = require("../controllers/producto.controller");
const upload = require("../middlewares/upload.middleware"); // Middleware de Multer y Cloudinary
const api = express.Router();

// Usamos 'crearProducto' que es el nombre correcto en tu controlador
api.post("/productos/crear", upload.single("imagen"), ProductoController.crearProducto);

// Ruta para buscar / obtener datos (si tu función en el controlador se llama diferente, ajústala aquí o agrégala)
api.get("/productos/buscar", ProductoController.obtenerDatos || ProductoController.listarProductos);

// Usamos 'actualizarProducto' que ya tienes en el controlador
api.put("/productos/actualizar/:id", upload.single("imagen"), ProductoController.actualizarProducto);

api.delete("/productos/eliminar/:id", ProductoController.eliminarProducto);

module.exports = api;