const mongoose = require ("mongoose");

const UsuarioSchema = mongoose.Schema({
    nombre: {type: String, required:true, uppercase: true},
    correo: {type: String, required: true, unique: true},
    contraseña: String,
    rol: {type: String, enum: ['ADMIN', 'CLIENTE'], default: 'CLIENTE'}
}, {timestamps:true})

module.exports = mongoose.model("Usuario", UsuarioSchema);