const mongoose = require('mongoose');

const extraSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  precio: { type: Number, required: true, min: 0 },
  productos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Producto' }]
}, { timestamps: true });

module.exports = mongoose.model('Extra', extraSchema);
