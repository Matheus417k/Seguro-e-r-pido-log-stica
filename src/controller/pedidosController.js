const pedidoController ={
    listarPedidos: async (req, res) => {
        try {
            const pedidos = await pedidoModels.buscarTodos()


            res.status(200).json(pedidos);
        } catch (error) {
            console.error("Erro ao listar pedidos:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao listar pedidos!" });
        }
    },
    criarPedido: async (req, res) => {
        try {


            const { idCliente, dataPedido, tipoEntrega, distanciaKM, pesoCarga, valorBaseKM, valorBaseKg } = req.body;


            if (idCliente == undefined || dataPedido == undefined || tipoEntrega == undefined
                || distanciaKM == undefined ||pesoCarga == undefined || valorBaseKM == undefined || valorBaseKg == undefined) {
                return res.status(400).json({ erro: "Campos obrigatórios não preenchidos!" })
            }


            if (idCliente.length != 36) {
                return res.status(400).json({ erro: "Id do Cliente inválido" });
            }


            // Validação da data
            const data = new Date(dataPedido);
            if (isNaN(data.getTime())) {
                return res.status(400).json({ erro: "Data do pedido inválida!" });
            }


            const cliente = await clienteModels.buscarUm(idCliente);


            if (!cliente || cliente.length != 1) {
                return res.status(404).json({ erro: "Cliente não encontrado!" })
            }


    
            const idPedido = await pedidoModels.inserirPedido(idCliente, dataPedido, tipoEntrega,
            distanciaKM, pesoCarga, valorBaseKM, valorBaseKg);


            res.status(201).json({ message: "Pedido cadastrado com sucesso!", idPedido });


        } catch (error) {
            console.error("Erro ao cadastrar pedido:", error);
            res.status(500).json({ erro: "Erro interno no servidor ao cadastrar pedido!" });
        }
    },
    
    }
    
    module.exports = { pedidoController }






