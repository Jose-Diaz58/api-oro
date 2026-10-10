const Usuario = require("../models/usuario.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "admintaco1234";

class UsuarioController {
    
    static registrarUsuario = async (req, res) => {
        try {
            const { nombre, correo, contraseña } = req.body;

            const salt = await bcrypt.genSalt(10);
            const contraseñaEncriptada = await bcrypt.hash(contraseña, salt);

            let rolDefinitivo = 'CLIENTE';
            const correoAdmin = 'jose@admintaco.com';

            if (correo === correoAdmin) {
                rolDefinitivo = 'ADMIN';
            }

            const nuevoUsuario = new Usuario({
                nombre, 
                correo, 
                contraseña: contraseñaEncriptada,
                rol: rolDefinitivo
            });

            await nuevoUsuario.save();

            res.status(200).json({
                message: "Usuario registrado correctamente",
                usuario: {
                    _id: nuevoUsuario._id,
                    nombre: nuevoUsuario.nombre,
                    correo: nuevoUsuario.correo,
                    rol: nuevoUsuario.rol
                }
            });
            
        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).send({message: "El correo ya está registrado"});
            }
            res.status(400).send({message: "Error al registrar usuario"});
        }
    }

    static loginUsuario = async (req, res) => {
        try {
            const { correo, contraseña } = req.body;

            const usuario = await Usuario.findOne({ correo });
            if (!usuario) {
                return res.status(400).json({ message: "Correo o contraseña incorrectos" });
            }

            const passCorrecta = await bcrypt.compare(contraseña, usuario.contraseña);
            if (!passCorrecta) {
                return res.status(400).json({ message: "Correo o contraseña incorrectos" });
            }

            const payload = {
                usuario: {
                    id: usuario._id,
                    rol: usuario.rol
                }
            };

            jwt.sign(
                payload,
                SECRET_KEY,
                { expiresIn: '8h' },
                (error, token) => {
                    if (error) throw error;
                    res.json({ token, message: "Login exitoso" });
                }
            );

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error en el servidor" });
        }
    }
}

module.exports = UsuarioController;