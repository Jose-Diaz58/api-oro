const express = require("express")
const UsuarioController = require("../controllers/usuario.controller")

const api = express.Router();

api.post("/usuario/registro", UsuarioController.registrarUsuario)
api.post("/usuario/login", UsuarioController.loginUsuario);

module.exports = api;