const {sql, getConnection } = require("../config/db");

const entregaModels = {
buscarTodos: async () => {
        try {
            const pool = await getConnection();


            let sql = 'SELECT * FROM ENTREGA'          


            const result = await pool.request().query(sql);


            return result.recordset;
        
        } catch (error) {
            console.error(`Erro ao encontrar o tipo de entrega`, error);
            throw error;
        }
    },

    buscarUm: async (idEntrega) =>{
        try {
            const pool = await getConnection();


            const querySQL = 'SELECT* FROM CLIENTES WHERE idEntrega = @idEntrega';


            const result = await pool
                .request()
                .input('idEntrega', sql.UniqueIdentifier, idEntrega)
                .query(querySQL);


                return result.recordset;
        } catch (error) {
            console.error(`Erro ao encontrar tipo de Encomenda`, error);
            throw error;
        }


},
cancelarEntrega: async (idEntrega) => {
    try {
        const pool = await getConnection();


        const querySQL = 'DELETE FROM ENTREGAS WHERE idEntrega = @idEntrega'


        await pool.request()
        .input('idEntrega', sql.UniqueIdentifier, idEntrega)
        .query(querySQL);
    } catch (error) {
        console.error(`Erro ao cancelar entrega`, error);
        throw error;
    }
},

inserirEntrega: async (valorDistancia, valorPeso, acreEntrega, descEntrega, taxaExtra, valorFinal, statusEntrega)=>{
    try {


        const pool = await getConnection();


        let querySQL = 'INSERT INTO Entregas (valorDistancia, valorPeso, acreEntrega, descEntrega, taxaExtra, valorFinal, statusEntrega)'


        await pool.request()
        .input('valorDistancia', sql.Decimal(10, 2), valorDistancia)
        .input('valorPeso', sql.Decimal(10, 2), valorPeso)
        .input('acreEntrega', sql.Decimal(10, 2), acreEntrega)
        .input('descEntrega', sql.Decimal(10, 2), descEntrega)
        .input('taxaEntrega', sql.Decimal(10, 2), taxaExtra)
        .input('valorFinal', sql.Decimal(10, 2), valorFinal)
        .input('statusEntrega', sql.VarChar(11), statusEntrega)
        .query(querySQL);



    } catch (error) {
        console.error('Erro ao inserir Entrega', error);
        throw error; // Passa o erro para o controler tratar
    }
},
atualizarEntrega: async (idPedido, valorDistancia, valorPeso, acreEntrega, descEntrega, taxaExtra, valorFinal, statusEntrega) => {
        try {
            const pool = await getConnection();
            const querySQL = `
            UPDATE PEDIDOS
            valorDistancia = @valorDistancia,
            valorPeso = @valorPeso,
            acreEntrega = @acreEntrega,
            descEntrega = @descEntrega,
            taxaExtra = @taxaExtra,
            valorFinal = @valorFinal,
            statusEntrega = @statusEntrega
            WHERE idEntrega = @idEntrega
            `
            await pool.request()
                .input("idEntrega", sql.UniqueIdentifier, idEntrega)
                .input("idPedido", sql.UniqueIdentifier, idPedido)
                .input("valorDistancia", sql.Decimal (10, 2), valorDistancia)
                .input("valorPeso", sql.Decimal(10, 2), valorPeso )
                .input("acreEntrega", sql.Decimal(10, 2), acreEntrega)
                .input("descEntrega", sql.Decimal(10, 2),descEntrega )
                .input("taxaExtra", sql.Decimal(10, 2), taxaExtra)
                .input("valorFinal", sql.Decimal(10, 2), valorFinal)
                .input("statusEntrega", sql.VarChar(11), statusEntrega)
                .query(querySQL)


        } catch (error) {
            console.error("Erro ao atualizar Entrega:", error);
            throw error;


        }
    },

}

