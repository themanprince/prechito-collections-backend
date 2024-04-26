const express = require('express');
const router = express.Router();

const { ProductController } = require('../controllers');
const { authenticationVerifier } = require('../middlewares/verifyToken');

router.get('/', ProductController.get_products);
router.get('/:id', ProductController.get_product);
router.post('/', authenticationVerifier, ProductController.create_product);
router.put('/:id', authenticationVerifier, ProductController.update_product);
router.delete('/:id', authenticationVerifier, ProductController.delete_product);

module.exports = router;