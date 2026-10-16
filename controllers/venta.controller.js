const Venta = require("../models/venta.model");

const ESTADOS = ['Nuevo', 'Preparando', 'Listo', 'Entregado'];

// Devuelve el rango [inicio, fin) de un día "YYYY-MM-DD"
const rangoDelDia = (fecha) => {
    const inicio = new Date(fecha);
    const fin = new Date(fecha);
    fin.setDate(fin.getDate() + 1);
    return { inicio, fin };
}

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

    // Lista para el panel de admin: ?fecha=2026-10-15 (opcional). Sin fecha: las 50 más recientes
    static listarVentas = async (req, res) => {
        try {
            const { fecha } = req.query;
            let ventas;
            if (fecha) {
                const { inicio, fin } = rangoDelDia(fecha);
                ventas = await Venta.find({ createdAt: { $gte: inicio, $lt: fin } }).sort({ createdAt: -1 });
            } else {
                ventas = await Venta.find().sort({ createdAt: -1 }).limit(50);
            }
            res.status(200).json(ventas);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al obtener los pedidos" });
        }
    }

    // El admin solo cambia el estado del pedido
    static actualizarEstado = async (req, res) => {
        try {
            const { estado } = req.body;
            if (!ESTADOS.includes(estado)) return res.status(400).send({ message: "Estado no válido" });

            const venta = await Venta.findByIdAndUpdate(req.params.id, { estado }, { returnDocument: 'after' });
            if (!venta) return res.status(404).send({ message: "El pedido no existe" });
            res.status(200).json(venta);
        } catch (error) {
            console.error(error);
            res.status(400).send({ message: "Error al actualizar el pedido" });
        }
    }

    static obtenerVentasPorFecha = async (req, res) => {
        try {
            const { inicio, fin } = rangoDelDia(req.query.fecha); // Ejemplo: 2026-05-08
            const ventas = await Venta.find({ createdAt: { $gte: inicio, $lt: fin } });
            res.status(200).json(ventas);
        } catch (error) {
            res.status(400).send({ message: "Error al obtener las ventas" });
        }
    }

    static eliminarVentasPorFecha = async (req, res) => {
        try {
            const { inicio, fin } = rangoDelDia(req.params.fecha);
            const resultado = await Venta.deleteMany({ createdAt: { $gte: inicio, $lt: fin } });
            res.status(200).json({ message: "Ventas eliminadas correctamente", resultado });
        } catch (error) {
            res.status(400).send({ message: "Error al eliminar las ventas" });
        }
    }
}

module.exports = VentaController;
