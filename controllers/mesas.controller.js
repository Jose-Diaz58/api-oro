const Mesa = require("../models/mesas.model");

class MesaController {
    static createMesas = async (req, res) => {
        try {
            const datos = req.body
            const newMesas = await Mesa.create(datos);
            res.status(200).json(newMesas)
        } catch (error) {
            console.log(error)
            return res.status(400).send({ message: "Error de conexion" })
        }
    }
    //mostra
    static mostrarMesas = async (req, res) => {
        try {
            const datos = req.body
            const newMesas = await Mesa.find();
            res.status(200).json(newMesas)
        } catch (error) {
            return res.status(400).send({ message: "Error de conexion" })
        }
    };

    //atualizar
   static actualizarMesas = async (req, res) => {
    try {
        const mesa = await Mesa.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        res.status(200).json(mesa);
    } catch (error) {
        return res.status(400).send({ message: "Error de conexion" });
    }
};

    //eliminasao
    static eliminarMesa = async (req, res) => {
        try {
            const { id } = req.params;
            const deteleMesa = await Mesa.findByIdAndDelete(id)
            res.status(200).json(deteleMesa)
        } catch (error) {
            return res.status(400).send({ message: "Error de conexion" })
        }
    }

}
module.exports = MesaController;