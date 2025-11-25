const { pedidoModels } = require("../models/pedidoModels");
const { clienteModels } = require("../models/clienteModels");

const pedidoController = {
    listarPedidos: async (req, res) => {
        try {
            const pedidos = await pedidoModels.buscarTodos();
            res.status(200).json(pedidos);
        } catch (error) {
            console.error("Erro ao listar pedidos:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao listar pedidos!" });
        }
    },

    criarPedido: async (req, res) => {
        try {
            const {
                idCliente,
                dataPedido,
                tipoEntrega,
                distanciaKM,
                pesoCarga,
                valorBaseKM,
                valorBaseKg,
                statusEntrega
            } = req.body;

            
            if (!idCliente || !dataPedido || !tipoEntrega ||
                distanciaKM == undefined || pesoCarga == undefined ||
                valorBaseKM == undefined || valorBaseKg == undefined) {
                return res.status(400).json({ erro: "Campos obrigatórios não preenchidos!" });
            }

            if (idCliente.length !== 36) {
                return res.status(400).json({ erro: "Id do Cliente inválido!" });
            }

            const data = new Date(dataPedido);
            if (isNaN(data.getTime())) {
                return res.status(400).json({ erro: "Data do pedido inválida!" });
            }

            const cliente = await clienteModels.buscarUm(idCliente);
            if (!cliente || cliente.length !== 1) {
                return res.status(404).json({ erro: "Cliente não encontrado!" });
            }

            
            let valorDistancia = distanciaKM * valorBaseKM;
            let valorPeso = pesoCarga * valorBaseKg;
            let valorFinal = valorPeso + valorDistancia;

            let acrescimoEntrega = 0;
            let descontoEntrega = 0;
            let taxaEntregaFinal = 0;


            if (tipoEntrega.toLowerCase() === "urgente") {
                acrescimoEntrega = valorFinal * 0.2;
                valorFinal += acrescimoEntrega;
            }

            
            if (valorFinal > 500) {
                descontoEntrega = valorFinal * 0.1;
                valorFinal -= descontoEntrega;
            }

            
            if (pesoCarga > 50) {
                taxaEntregaFinal = 15;
                valorFinal += taxaEntregaFinal;
            }

            
            const idPedido = await pedidoModels.criarPedido(
                idCliente,
                dataPedido,
                tipoEntrega,
                distanciaKM,
                pesoCarga,
                valorBaseKM,
                valorBaseKg,
                acrescimoEntrega,
                descontoEntrega,
                taxaEntregaFinal,
                statusEntrega,
                valorFinal
            );

            res.status(201).json({
                message: "Pedido solicitado com sucesso!",
                idPedido
            });

        } catch (error) {
            console.error("Erro ao cadastrar pedido:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao cadastrar pedido!" });
        }
    },

    atualizarPedido: async (req, res) => {
        try {
            const { idPedido } = req.params;
            const {
                idCliente,
                dataPedido,
                tipoEntrega,
                distanciaKM,
                pesoCarga,
                valorBaseKM,
                valorBaseKg
            } = req.body;

            if (idPedido.length !== 36) {
                return res.status(400).json({ erro: "ID do pedido inválido!" });
            }

            const pedido = await pedidoModels.buscarUm(idPedido);
            if (!pedido || pedido.length !== 1) {
                return res.status(404).json({ erro: "Pedido não encontrado!" });
            }

            if (idCliente && idCliente.length !== 36) {
                return res.status(400).json({ erro: "ID do cliente inválido!" });
            }

            const cliente = await clienteModels.buscarUm(idCliente);
            if (!cliente || cliente.length !== 1) {
                return res.status(404).json({ erro: "Cliente não encontrado!" });
            }

            const atual = pedido[0];

            await pedidoModels.atualizarPedido(
                idPedido,
                idCliente ?? atual.idCliente,
                dataPedido ?? atual.dataPedido,
                tipoEntrega ?? atual.tipoEntrega,
                distanciaKM ?? atual.distanciaKm,
                pesoCarga ?? atual.pesoCarga,
                valorBaseKM ?? atual.valorBaseKm,
                valorBaseKg ?? atual.valorBaseKg
            );

            res.status(200).json({ mensagem: "Pedido atualizado com sucesso!" });

        } catch (error) {
            console.error("Erro ao atualizar pedido:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao atualizar pedido!" });
        }
    },

    deletarPedidoEntrega: async (req, res) => {
        try {
            const { idPedido, idEntrega } = req.params;

            if (idPedido.length !== 36) {
                return res.status(400).json({ erro: "ID do pedido inválido!" });
            }
            
            if (idEntrega.length !== 36) {
                return res.status(400).json({ erro: "ID da entrega inválido!" });
            }
            const pedido = await pedidoModels.buscarUm(idPedido);
            if (!pedido || pedido.length !== 1) {
                return res.status(404).json({ erro: "Pedido não encontrado!" });
            }

            const entrega = await entregaModels.buscarUm(idEntrega);
            if (!entrega || entrega.length !== 1) {
                return res.status(404).json({ erro: "Entrega não encontrada!" });
            }

            await pedidoModels.deletarPedido(idPedido);
            await entregaModels.deletarEntrega(idEntrega);

            res.status(200).json({ message: "Pedido e entrega cancelado com cancelado com sucesso!" });

        } catch (error) {
            console.error("Erro ao cancelar pedido e entrega:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao cancelar pedido e entrega!" });
        }
    }
};

module.exports = { pedidoController };
