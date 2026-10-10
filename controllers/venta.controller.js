const Venta = require("../models/venta.model");

class VentaController {
    static registrarVenta = async (req, res) => {
        try {
            const dVenta = req.body;
            const nuevaVenta = await Venta.create(dVenta);
            res.status(200).json(nuevaVenta);
        } catch (error) {
            res.status(400).send({ message: "Error al registrar la venta" });
        }
    }

    static obtenerVentasPorFecha = async (req, res) => {
        try {
            const { fecha } = req.query; // Ejemplo: 2026-05-08
            const inicio = new Date(fecha);
            const fin = new Date(fecha);
            fin.setDate(fin.getDate() + 1);

            const ventas = await Venta.find({
                fecha: { $gte: inicio, $lt: fin }
            });
            res.status(200).json(ventas);
        } catch (error) {
            res.status(400).send({ message: "Error al obtener las ventas" });
        }
    }

    static eliminarVentasPorFecha = async (req, res) => {
        try {
            const {fecha} = req.params
            const inicio = new Date(fecha)
            const fin = new Date(fecha)
            fin.setDate(fin.getDate() +1 )

            const resultado = await Venta.deleteMany({
                fecha: {$gte: inicio, $lt: fin}
            })
            res.status(200).json({message: "Ventas eliminadas correctamente", resultado} )
        } catch (error) {
            res.status(400).send({ message: "Error al eliminar las ventas" });
        }
    }
}

module.exports = VentaController;