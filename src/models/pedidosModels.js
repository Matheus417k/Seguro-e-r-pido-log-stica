const { DescribeParameterEncryptionResultSet2 } = require("tedious/lib/always-encrypted/types");
const { sql, getConnection } = require("../config/db");

const pedidoModel = {
    /**
     * Busca todos os pedidos e seus respectivos itens no banco de dados.
     * 
     * @async
     * @function buscarTodos
     * @returns {Promise<Array>} Retorna uma lista com todos os pedidos e seus respectivos itens.
     * @throws Mostra no console e propaga o erro caso a busca falhe.
     */
    buscarTodos: async () => {
        try {

            const pool = await getConnection();

            const querySQL = `
                SELECT 
                    CL.nomeCliente, 
                    PD.dataPedido, 
                    PD.tipoEntrega,
                    PR.distanciaKm,
                    PR.pesoCargo,
                    PR.valorBaseKm,
                    PR.valorBaseKg

                    IT.qtdItem
                FROM Pedidos PD 
                    INNER JOIN Clientes CL 
                    ON CL.idCliente = PD.idCliente
                    INNER JOIN ItemPedido IT
                    ON IT.idPedido = PD.idPedido
                    INNER JOIN Produtos PR
                    ON PR.idProduto = IT.idProduto
            `;

            const result = await pool.request().query(querySQL);

            return result.recordset;
        } catch (error) {
            console.error("Erro ao buscar pedidos:", error);
            throw error;
        }
    },

    buscarUm: async (idPedido) => {
try {
    
const pool = await getConnection();

const querySQL =  " SELECT * from  pedidos where idPedido = @idPedido";


const  result = await pool.request()
.input ("idPedido", sql.UniqueIdentifier, idPedido)
.querySQL(querySQL);
return result.recordset;
} catch (error) {
    console.error("Erro ao buscar o pedido", error);
    throw error;
}
    },

    inserirPedido: async (idCliente, dataPedido, tipoEntrega, distanciaKm, pesoCarga, valorBaseKm, valorBaseKg) => {
        // {itens} realiza a desestruturação do objeto itens

        const pool = await getConnection();

        const transaction = new sql.Transaction(pool);
        await transaction.begin(); //Inicia a transação

        try {
            let querySQL = `
                INSERT INTO Pedidos (idCliente, dataPedido, tipoEntrega, distanciaKm, pesoCarga, valorBaseKm, valorBaseKg)
                OUTPUT INSERTED.idPedido
                VALUES (@idCliente, @dataPedido, @tipoEntrega, @distanciaKm, @pesoCarga, @valorBaseKm, @valorBaseKg)
            `

            const result = await transaction.request().input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("tipoEntrega", sql.VarChar(7), tipoEntrega )
                .input("distanciaKm", sql.Decimal(10, 2), distanciaKm)
                .input("pesoCarga", sql.Decimal(10, 2),pesoCarga )
                .input("valorBaseKm", sql.Decimal(10, 2), valorBaseKm)
                .input("valorBaseKg", sql.Decimal(10, 2), valorBaseKg)
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .query(querySQL)

            const idPedido = result.recordset[0].idPedido;

        

            await transaction.commit(); // Confirma a transação após inserções bem-sucedidas

            return idPedido; // Retorna o ID do pedido inserido

        } catch (error) {
            await transaction.rollback(); // Desfaz tudo caso dê erro
            console.error("Erro ao inserir pedido:", error);
            throw error;
        }
    },

     atualizarPedido: async (idPedido,idCliente,dataPedido, tipoEntrega, distanciaKM, pesoCarga, valorBaseKM, valorBaseKg) => {
        try {
            const pool = await getConnection();
            const querySQL = `
            UPDATE PEDIDOS
            SET dataPedido = @dataPedido,
            idCliente = @idCliente,
            tipoEntrega = @tipoEntrega,
            distanciaKM = @distanciaKM,
            pesoCarga = @pesoCarga,
            valorBaseKM = @valorBaseKM,
            valorBaseKg = @valorBaseKg
            WHERE idPedido = @idPedido
            `
            await pool.request()
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .input("idCliente", sql.UniqueIdentifier, idCliente)
                .input("dataPedido", sql.Date, dataPedido)
                .input("tipoEntrega", sql.VarChar(7), tipoEntrega )
                .input("distanciaKM", sql.Decimal(10, 2), distanciaKM)
                .input("pesoCarga", sql.Decimal(10, 2),pesoCarga )
                .input("valorBaseKM", sql.Decimal(10, 2), valorBaseKM)
                .input("valorBaseKg", sql.Decimal(10, 2), valorBaseKg)
                .query(querySQL)


        } catch (error) {
            console.error("Erro ao atualizar pedido:", error);
            throw error;


        }
    },


    deletarPedido: async (idPedido) => {
        try {
            const pool = await getConnection();
   
            const querySQL = 'DELETE FROM PEDIDOS WHERE idPedido = @idPedido'
   
            await pool.request()
            .input('idPedido', sql.UniqueIdentifier, idPedido)
            .query(querySQL);
        } catch (error) {
            console.error(`Erro ao deletar o pedido`, error);
            throw error;
        }
        }





};

module.exports = { pedidoModel }