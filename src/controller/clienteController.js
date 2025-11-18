const {clienteModel} = require ("../models/clienteModel");

const clienteController = {
    //-----------------------
    //cadastrar todos os clientes
    //GET/Clientes?
    //------------------------

    listarClientes: async(req, res) =>{
        try {
            const clientes = await clienteModel.buscarTodos();

            res.status(200).json(clientes)
        } catch (error) {
            console.error('ERRO AO LISTAR CLIENTE', error);
            res.status(500).json({message:'ERRO AO BUSCAR CLIENTE.'});
            
        }
    },
    
    //-----------------------
    //Cadastar um novo cliente
    //POST/clientes
    /* 
    {
        "nome cliente": "matheus",
        "id cliente": xxxxx
        "cpf cliente": 112.344.987-11 (exemplo)
        "telefone cliente": 19992876545
        "email Cliente": matheus@gmail.com
        "endereço cliente": rua anapoles de freitas numeros 3494 bairro: rebouças cidade: sumaré estado:
        SP  CEP: 12345678
    }
    */
    //------------------------

    cadastarClienets: async (req, res)=>{
        try {
            
    const {nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente,} = req.body;

    if(nomeCliente == undefined || cpfCliente == undefined ||isNaN(cpfCliente) || telefoneCliente == undefined || isNaN(telefoneCliente) || emailCliente == undefined || enderecoCliente == undefined){
        return res.status(400).json ({erro: 'Campos obrigatorios não preenchidos'});
    }





    await clienteModel.insertCliente(nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente);

    res.status(201).json ({message:'Cliente cadastrado com sucesso!'})

        } catch (error) {
            console.error('Erro ao cadastrar Cliente', error);
            res.status(500).json({erro: 'ERRO no servidor ao cadastrar Cliente!'});
            
        }
    },

    atualizarProduto: async (req, res) => {

        try {
            const { idCliente } = req.params;
            const { nomeCliente, cpfCliente,telefoneCliente, emailCliente, enderecoCliente } = req.body;

            if (idCliente.length != 36) {
                return res.status(400).json({erro: 'id do Cliente inválido!'});
            }

            const cliente = await clienteModelModel.buscarUm(idCliente);

            if (!cliente || cliente.length !== 1) {
                return res.status(404).json({ erro: 'cliente não encontrado!' });
            }
            const clienteAtual = cliente[0];

            const nomeAtualizado = nomeCliente ?? clienteAtual.nomeCliente;
            const cpfClienteAtualizado = cpfCliente ?? cpfClienteAtualizado.cpfCliente;
            const telefoneClienteAtualizado = telefoneCliente ?? telefoneClienteAtualizado.telefoneCliente;
            const emailClienteAtualizado = emailCliente ?? emailClienteAtualizado.emailCliente;
            const enderecoClienteAtualizado = enderecoCliente ?? enderecoClienteAtualizado.enderecoCliente


            await clienteModel.atualizarCleinte(idCliente, nomeAtualizado, cpfCliente, telefoneCliente,
            emailCliente,enderecoCliente);

            res.status(200).json({ message: 'Cliente atualizado com sucesso' })

        } catch (error) {
            console.error('erro ao atualizar Cliente:',error)
            res.status(500).json({ erro: "Erro no servidor ao atualizar Cliente." });
        }
    },

    deletarCliente: async (req, res) =>{

        try {
            const { idCliente } = req.params;
            

            if (idCliente.length != 36) {
                return res.status(400).json({erro: 'id do Cliente inválido!'});
            }

            const cliente = await cliente.buscarUm(idCliente);

            if (!cliente || cliente.length !== 1) {
                return res.status(404).json({ erro: 'cliente não encontrado!' });
            }

            await clienteModel.deletarCliente(idCliente)
            
            res.status(200).json({message: "Cliente deletado com sucesso!"})
        } catch (error) {
            console.error('erro ao deletar Cliente', error);
            res.status(500).json ({erro: "erro no servidor ao deletar Cliente"});
        }
    },


}

module.exports = {clienteController};

