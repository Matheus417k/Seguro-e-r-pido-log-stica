const express = require("express");
const app = express();
const { produtosRoutes } = require("./src/routes/produtosRoutes");
const { clienteRoutes } = require("./src/routes/clientesRoutes");
const { pedidoRoutes } = require("./src/routes/pedidoRoutes");

const PORT = 8081;

app.use(express.json());

app.use('/', produtosRoutes);
app.use('/', clienteRoutes);
app.use('/', pedidoRoutes);

app.listen(PORT, () => {
    console.log(`servidor rodando em http://localhost:${PORT}`);
});