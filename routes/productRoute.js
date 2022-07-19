const router = require('express').Router();
const productController = require('../controllers/productController');
const { verifyToken } = require('../middlewares/authMiddlware');


router.get('/', verifyToken, productController.products_get_all);   // All products

router.get('/:_id', verifyToken, productController.products_get_product);    // get product

router.post('/', verifyToken, productController.products_create_product);  // add product

router.put('/:_id', verifyToken, productController.products_edit_product);   //edit product

router.delete('/:_id', verifyToken, productController.products_delete_product);    //delete product


module.exports = router;