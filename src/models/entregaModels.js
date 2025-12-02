const {sql, getConnection } = require("../config/db");

const entregaModels = {


    /**
     * Busca todos os pedidos e seus repectivos itens no Banco de Dados.
     * 
     * @async
     *
     *  @function buscarTodos 
     * @returns {Promise<Array>} Retorna uma lista com todas as entregas.
     * 
     * @function buscarUm
     * @returns {Promise<Array>} Retorna uma lista com uma entrega.
     **/


    // Busca todas as entregas registradas no banco
    buscarTodos: async () => {
        try {
        
            const pool = await getConnection();

            // Comando SQL para trazer todas as entrega
            let sqlQuery = 'SELECT * FROM ENTREGAS';

        
            const result = await pool.request().query(sqlQuery);

        
            return result.recordset;

        } catch (error) {
            // Mostra o erro no console e repassa para o controller tratar
            console.error("Erro ao buscar entregas", error);
            throw error;
        }
    },

    // Busca uma entrega específica usando o idEntrega
    buscarUm: async (idEntrega) =>{
        try {
            const pool = await getConnection();

            
            const querySQL = 'SELECT * FROM ENTREGAS WHERE idEntrega = @idEntrega';

            const result = await pool
                .request()
        
                .input('idEntrega', sql.UniqueIdentifier, idEntrega)
                .query(querySQL);

        
            return result.recordset;

        } catch (error) {
            console.error("Erro ao buscar entrega específica", error);
            throw error;
        }
    }



}

module.exports = {entregaModels}
