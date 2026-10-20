const express = require("express");
const CategoriaController = require("../controllers/categoria.controller");
const api = express.Router();

api.get("/categorias/buscar", CategoriaController.listar);
api.post("/categorias/crear", CategoriaController.crear);
api.put("/categorias/ordenar", CategoriaController.ordenar); // antes que "/:id"
api.put("/categorias/actualizar/:id", CategoriaController.actualizar);
api.delete("/categorias/eliminar/:id", CategoriaController.eliminar);

module.exports = api;
