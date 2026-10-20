const express = require("express")
const UsuarioController = require("../controllers/usuario.controller")

const api = express.Router();

api.post("/usuarios/registrar", UsuarioController.registrarUsuario)
api.post("/usuarios/iniciar-sesion", UsuarioController.loginUsuario);

module.exports = api;