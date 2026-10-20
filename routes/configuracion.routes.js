const express = require("express");
const ConfiguracionController = require("../controllers/configuracion.controller");
const api = express.Router();

api.get("/configuracion/buscar", ConfiguracionController.obtener);
api.put("/configuracion/actualizar", ConfiguracionController.actualizar);

module.exports = api;
