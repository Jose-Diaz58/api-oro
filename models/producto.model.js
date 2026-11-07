const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  categoria: { type: String, required: true, index: true }, // Indexado para mejorar rendimiento
  precio: { type: Number, required: true },
  porcion: { type: String },
  descripcion: { type: String },
  disponible: { type: Boolean, default: true },
  imagen: { type: String },
  variantes: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model('Producto', productoSchema);