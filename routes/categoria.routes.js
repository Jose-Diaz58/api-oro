const express = require("express");
const CategoriaController = require("../controllers/categoria.controller");
const api = express.Router();

api.get("/categorias", CategoriaController.listar);
api.post("/categorias", CategoriaController.crear);
api.put("/categorias/orden", CategoriaController.ordenar); // antes que "/:id"
api.put("/categorias/:id", CategoriaController.actualizar);
api.delete("/categorias/:id", CategoriaController.eliminar);

module.exports = api;
