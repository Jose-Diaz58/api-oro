const express = require ("express");
const MesaController= require("../controllers/mesas.controller")

const api =express.Router();

api.post("/mesas/crear", MesaController.createMesas);
api.get("/mesas/buscar", MesaController.mostrarMesas);
api.put("/mesas/actualizar/:id", MesaController.actualizarMesas);
api.delete("/mesas/eliminar/:id", MesaController.eliminarMesa);




module.exports = api;