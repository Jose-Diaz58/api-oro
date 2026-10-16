const express = require("express");
const ExtraController = require("../controllers/extra.controller");
const api = express.Router();

api.get("/extras", ExtraController.listar);
api.post("/extras", ExtraController.crear);
api.put("/extras/:id", ExtraController.actualizar);
api.delete("/extras/:id", ExtraController.eliminar);

module.exports = api;
