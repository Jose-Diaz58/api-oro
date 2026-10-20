const express = require("express");
const ExtraController = require("../controllers/extra.controller");
const api = express.Router();

api.get("/extras/buscar", ExtraController.listar);
api.post("/extras/crear", ExtraController.crear);
api.put("/extras/actualizar/:id", ExtraController.actualizar);
api.delete("/extras/eliminar/:id", ExtraController.eliminar);

module.exports = api;
