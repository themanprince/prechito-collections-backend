const express = require('express');
const router = express.Router();

const { OrderController } = require('../controllers');
const { authenticationVerifier} = require('../middlewares/verifyToken');

//router.get('/', authenticationVerifier, OrderController.get_orders);
//router.get('/:userId', authenticationVerifier, OrderController.get_order);
router.post('/', OrderController.create_order);
//router.put('/:id', authenticationVerifier, OrderController.update_order);
//router.delete('/:id', authenticationVerifier, OrderController.delete_order);

module.exports = router;