const express = require("express");
const ConfiguracionController = require("../controllers/configuracion.controller");
const api = express.Router();

api.get("/configuracion", ConfiguracionController.obtener);
api.put("/configuracion", ConfiguracionController.actualizar);

module.exports = api;
