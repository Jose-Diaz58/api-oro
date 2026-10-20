const Extra = require("../models/extra.model");

class ExtraController {
    static listar = async (req, res) => {
        try {
            const extras = await Extra.find().sort({ createdAt: 1 });
            res.status(200).json(extras);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al obtener los extras" });
        }
    }

    static crear = async (req, res) => {
        try {
            const { nombre, precio, productos } = req.body;
            const nuevo = await Extra.create({ nombre, precio, productos: productos ?? [] });
            res.status(200).json(nuevo);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al crear el extra" });
        }
    }

    static actualizar = async (req, res) => {
        try {
            const { nombre, precio, productos } = req.body;
            const cambios = {};
            if (nombre !== undefined) cambios.nombre = nombre;
            if (precio !== undefined) cambios.precio = precio;
            if (productos !== undefined) cambios.productos = productos;

            const extra = await Extra.findByIdAndUpdate(req.params.id, cambios, { returnDocument: 'after' });
            if (!extra) return res.status(404).send({ message: "El extra no existe" });
            res.status(200).json(extra);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al actualizar el extra" });
        }
    }

    static eliminar = async (req, res) => {
        try {
            const eliminado = await Extra.findByIdAndDelete(req.params.id);
            res.status(200).json(eliminado);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al eliminar el extra" });
        }
    }
}

module.exports = ExtraController;
