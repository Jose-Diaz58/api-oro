const mongoose = require("mongoose");

const MesaSchema = new mongoose.Schema({
    numero: { type: Number, required: true },
    capacidad: { type: Number, required: true },
    estado: { 
        type: String, 
        enum: ["Libre", "Ocupado"], 
        default: "Libre" 
    },
    pedido: { type: Array, default: [] },
    total: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Mesa", MesaSchema);