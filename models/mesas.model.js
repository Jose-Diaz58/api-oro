const mongoose = require ("mongoose");

const MesaSchema = mongoose.Schema({
    numero: {type:Number, require: true},
    capacidad: {type: Number, require: true},
    estado: {type: String,
        enum:["Libre","Ocupado"],
        default:"Libre"
    },
    pedido:{type:Array,default:[]},
    total:{type:Number,default:0}
}, {timestamps:true})

module.exports = mongoose.model("Mesa",MesaSchema); 