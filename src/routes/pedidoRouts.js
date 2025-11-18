const express = require("express");
const router = express.Router();
const {pedidoController} = require("../controller/pedidoController");


router.get("/pedidos", pedidoController.listarPedidos);
router.post("/pedidos", pedidoController.criarPedido);


module.exports = {pedidoRoutes: router}

