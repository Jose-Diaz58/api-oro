const Categoria = require("../models/categoria.model");
const Producto = require("../models/producto.model");

// Categorías con las que arranca el menú si la colección está vacía
const INICIALES = ['Cafés Calientes', 'Fríos', 'Jugos y Licuados', 'Nuevos Platillos', 'Desayunos Tec'];

class CategoriaController {
    static listar = async (req, res) => {
        try {
            if ((await Categoria.countDocuments()) === 0) {
                await Categoria.insertMany(INICIALES.map((nombre, i) => ({ nombre, orden: i })));
            }
            const categorias = await Categoria.find().sort({ orden: 1, createdAt: 1 });
            res.status(200).json(categorias);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al obtener las categorías" });
        }
    }

    static crear = async (req, res) => {
        try {
            const nombre = req.body.nombre?.trim();
            if (!nombre) return res.status(400).send({ message: "El nombre es obligatorio" });

            const ultima = await Categoria.findOne().sort({ orden: -1 });
            const nueva = await Categoria.create({
                nombre,
                visible: req.body.visible ?? true,
                orden: (ultima?.orden ?? -1) + 1
            });
            res.status(200).json(nueva);
        } catch (error) {
            if (error.code === 11000) return res.status(400).send({ message: "Ya existe una categoría con ese nombre" });
            console.error(error);
            res.status(400).send({ message: "Error al crear la categoría" });
        }
    }

    static actualizar = async (req, res) => {
        try {
            const { id } = req.params;
            const cambios = {};
            if (req.body.nombre !== undefined) cambios.nombre = String(req.body.nombre).trim();
            if (req.body.visible !== undefined) cambios.visible = req.body.visible;

            const anterior = await Categoria.findById(id);
            if (!anterior) return res.status(404).send({ message: "La categoría no existe" });

            const actualizada = await Categoria.findByIdAndUpdate(id, cambios, { returnDocument: 'after' });

            // Los productos guardan el nombre de su categoría: si se renombra, se actualizan también
            if (cambios.nombre && cambios.nombre !== anterior.nombre) {
                await Producto.updateMany({ categoria: anterior.nombre }, { categoria: cambios.nombre });
            }
            res.status(200).json(actualizada);
        } catch (error) {
            if (error.code === 11000) return res.status(400).send({ message: "Ya existe una categoría con ese nombre" });
            console.error(error);
            res.status(400).send({ message: "Error al actualizar la categoría" });
        }
    }

    // Guarda el orden en que se arrastraron las categorías: { ids: [id1, id2, ...] }
    static ordenar = async (req, res) => {
        try {
            const { ids } = req.body;
            if (!Array.isArray(ids)) return res.status(400).send({ message: "Se esperaba una lista de ids" });
            await Categoria.bulkWrite(ids.map((id, i) => ({
                updateOne: { filter: { _id: id }, update: { orden: i } }
            })));
            res.status(200).json({ message: "Orden guardado" });
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al guardar el orden" });
        }
    }

    static eliminar = async (req, res) => {
        try {
            const { id } = req.params;
            const categoria = await Categoria.findById(id);
            if (!categoria) return res.status(404).send({ message: "La categoría no existe" });

            const enUso = await Producto.countDocuments({ categoria: categoria.nombre });
            if (enUso > 0) {
                return res.status(400).send({ message: `La categoría tiene ${enUso} productos. Muévelos o elimínalos primero` });
            }
            await Categoria.findByIdAndDelete(id);
            res.status(200).json(categoria);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al eliminar la categoría" });
        }
    }
}

module.exports = CategoriaController;
