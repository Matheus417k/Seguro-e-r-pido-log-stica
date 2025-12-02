const {sql, getConnection } = require("../config/db");

/**
     * Controlador que lista os clientes do banco de dados 
     * 
     * @async
     * @function listar clietes
     * @param {object} req -Objeto da requisição (recebido do cliente HTTP);
     * @param {object} res -Objeto da resposta (enviado ao cliente HTTP);
     * @returns {Promise<void>} Retorna uma respostas JSON com A lista de clientes.
     * @throws Mostra no console e retorna o erro 500 se ocorrer falha ao buscar os clientes.
     */

const clienteModels = {
    // Buscar todos os clientes
    buscarTodos: async () => {
        try {
            const pool = await getConnection(); // Conecta ao banco de dados

            let sql = 'SELECT * FROM CLIENTES'           

            const result = await pool.request().query(sql); // Executa a query

            return result.recordset; 
            
        } catch (error) {
            console.error("Erro ao buscar os Clientes", error); //
            throw error;
        }
    },

    // Buscar um cliente pelo ID
    buscarUm: async (idCliente) =>{
        try {
            const pool = await getConnection(); 

            const querySQL = 'SELECT * FROM CLIENTES WHERE idCliente = @idCliente'; 

            const result = await pool
                .request()
                .input('idCliente', sql.UniqueIdentifier, idCliente) 
                .query(querySQL); // Executa a query

                return result.recordset; // Retorna o resultado
        } catch (error) {
            console.error("Erro ao buscar cliente", error);
            throw error;
        }

},

// Buscar cliente pelo CPF
buscarCpf: async (cpfCliente) => {
    try {
        const pool = await getConnection();

        const querySQL = 'SELECT * FROM CLIENTES WHERE cpfCliente = @cpfCliente;';

        const result = await pool.request()
        .input ('cpfCliente', sql.Char(11), cpfCliente) // Define o parâmetro CPF
        .query(querySQL); // Executa a query

        return result.recordset; 

    } catch (error) {
        console.error('Erro ao verificar o CPF', error);
        throw error;
    }
},

// Buscar cliente pelo e-mail
buscarEmail: async (emailCliente) => {
    try {
        const pool = await getConnection(); // Conecta ao banco

        const querySQL = 'SELECT * FROM CLIENTES WHERE emailCliente = @emailCliente;'; 

        const result = await pool.request()
        .input ('emailCliente', sql.VarChar(50), emailCliente) 
        .query(querySQL); // Executa a query

        return result.recordset; 

    } catch (error) {
        console.error('Erro ao verificar o email', error);
        throw error;
    }
},

// Inserir um novo cliente
inserirCliente: async (nomeCliente, cpfCliente, telefoneCliente, 
    emailCliente, enderecoCliente)=>{
    try {
        // Insere cliente através do método POST 

        const pool = await getConnection(); 

        let querySQL = 'INSERT INTO CLIENTES(nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente) VALUES(@nomeCliente, @cpfCliente, @telefoneCliente, @emailCliente, @enderecoCliente)'

        // Através dos dados abaixo temos o cadastro concluído
        await pool.request()
        .input('nomeCliente', sql.VarChar(100), nomeCliente) // Define nome
        .input('cpfCliente', sql.Char(11), cpfCliente) // Define CPF
        .input('telefoneCliente', sql.VarChar(12), telefoneCliente) // Define telefone
        .input('emailCliente', sql.VarChar(50), emailCliente) // Define e-mail
        .input('enderecoCliente', sql.VarChar(250), enderecoCliente) // Define endereço
        .query(querySQL); 
        // Caso algum dado esteja indefinido, passamos o erro para o controller tratar

    } catch (error) {
        console.error('Erro ao inserir o cliente', error);
        throw error; // Passa o erro para o controller tratar
    }
},

// Deletar um cliente pelo ID
deletarCliente: async (idCliente) => {
    const pool = await getConnection(); 
    const transaction = new sql.Transaction(pool); // Inicia transação
    await transaction.begin();
    try {

        const querySQL = 'DELETE FROM CLIENTES WHERE idCliente = @idCliente' 

        await transaction.request()
        .input('idCliente', sql.UniqueIdentifier, idCliente) // Define o ID
        .query(querySQL); // Executa a query

        await transaction.commit(); // Confirma exclusão
    } catch (error) {
        await transaction.rollback(); // Reverte se der erro
        console.error("Erro ao deletar cliente:", error);
        throw error;
    }
},

// Atualizar dados de um cliente
atualizarCliente: async (idCliente, nomeCliente, cpfCliente, telefoneCliente, emailCliente, enderecoCliente) => {
    try {
        const pool = await getConnection(); // Conecta ao banco

        const querySQL= `
            UPDATE CLIENTES
            SET nomeCliente = @nomeCliente, 
            cpfCliente = @cpfCliente, 
            telefoneCliente = @telefoneCliente, 
            emailCliente = @emailCliente, l
            enderecoCliente = @enderecoCliente 
        WHERE  idCliente = @idCliente
        `
        await pool.request()
            .input('idCliente', sql.UniqueIdentifier, idCliente) // Define ID
            .input('nomeCliente', sql.VarChar(100), nomeCliente)
            .input('cpfCliente', sql.Char(11), cpfCliente)
            .input('telefoneCliente', sql.VarChar(12), telefoneCliente)
            .input('emailCliente', sql.VarChar(50), emailCliente)
            .input('enderecoCliente', sql.VarChar(250), enderecoCliente)
            .query(querySQL); // Executa a query

    } catch (error) {
        console.error("Erro ao atualizar o cliente", error);
        throw error;

    }
}


}
module.exports = {clienteModels}; 
