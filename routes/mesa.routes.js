const express = require ("express");
const MesaController= require("../controllers/mesas.controller")

const api =express.Router();

api.post("/mesa/create", MesaController.createMesas);
api.get("/mesa/mostrar", MesaController.mostrarMesas);
api.put("/mesa/modificar/:id", MesaController.actualizarMesas);
api.delete("/mesa/eliminar/:id", MesaController.eliminarMesa);




module.exports = api;