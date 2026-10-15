const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { 
    type: String, 
    required: true,
    enum: ['Cafés Calientes', 'Fríos', 'Jugos y Licuados', 'Nuevos Platillos', 'Desayunos Tec']
  },
  precio: { type: Number, required: true },
  porcion: { type: String },
  descripcion: { type: String },
  disponible: { type: Boolean, default: true }, // Control del Toggle en el admin
  imagen: { type: String },
  variantes: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);