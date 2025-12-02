const { entregaModels } = require("../models/entregaModels");

const entregaController = {

    // Método GET – Lista entregas
    listarEntregas: async (req, res) => {
        try {
            const { idEntrega } = req.query; 
        

            // Se o usuário enviou um ID específico, buscamos apenas uma entrega
            if (idEntrega) {

                // Validação básica do ID (tamanho)
                if (idEntrega.length != 36) {
                    return res.status(400).json({ erro: "ID da entrega inválido!" });
                }

                // Busca apenas uma entrega pelo ID
                const entrega = await entregaModels.buscarUm(idEntrega);
                return res.status(200).json(entrega);
            }

            // Caso o usuário não envie um ID, retorna todas as entregas
            const entregas = await entregaModels.buscarTodos();
            res.status(200).json(entregas);

        } catch (error) {
            console.error("Erro ao listar entregas", error);
            res.status(500).json({ messag: "Erro ao buscar as entregas" });
        }
    }
}

module.exports = { entregaController };
