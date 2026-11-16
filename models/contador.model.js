const mongoose = require('mongoose');

const contadorSchema = new mongoose.Schema({
  _id: { type: String }, // ej. 'folio-2026-11-16'
  seq: { type: Number, default: 0 },
});

module.exports = mongoose.model('Contador', contadorSchema);