const Producto = require("../models/producto.model");
const Extra = require("../models/extra.model");

// Imágenes subidas como archivo se guardan como data URL; se limita su tamaño para no saturar la base de datos
const MAX_IMAGEN_BYTES = 300 * 1024;
const imagenDemasiadoGrande = (imagen) =>
    typeof imagen === 'string' && imagen.startsWith('data:') && imagen.length > MAX_IMAGEN_BYTES * 1.37;

class ProductoController {
    static createProducto = async(req, res) => {
        try {
            const datos = req.body;
            if (imagenDemasiadoGrande(datos.imagen)) return res.status(413).send({ message: "La imagen es demasiado grande" });
            const newProducto = await Producto.create(datos);
            res.status(200).json(newProducto);
        } catch (error) {
            console.error(error);
            return res.status(400).send({ message: "Error al crear el producto" });
        }
    }

    static obtenerDatos = async(req, res) => {
        try {
            const buscarProductos = await Producto.find();
            res.status(200).json(buscarProductos);
        } catch (error) {
            return res.status(400).send({ message: "Error de Conexión" });
        }
    }

    static actualizarProducto = async (req, res) => {
        try {
            const { id } = req.params;
            const modProducto = req.body;
            if (imagenDemasiadoGrande(modProducto.imagen)) return res.status(413).send({ message: "La imagen es demasiado grande" });
            const modificar = await Producto.findByIdAndUpdate(id, modProducto, { returnDocument: 'after' });
            res.status(200).json({ message: "Datos actualizados correctamente", modificar });
        } catch (error) {
            console.log(error);
            return res.status(400).send({ message: "Error al actualizar el producto" });
        }
    }

    static eliminarProducto = async (req, res) => {
        try {
            const { id } = req.params;
            const productoEliminado = await Producto.findByIdAndDelete(id);
            // Quita el producto de los extras que lo tenían asignado
            await Extra.updateMany({}, { $pull: { productos: id } });
            res.status(200).json(productoEliminado);
        } catch (error) {
            return res.status(400).send({ message: "Error al eliminar el producto" });
        }
    }
}

module.exports = ProductoController;