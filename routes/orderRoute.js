const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authMiddlware');


router.get('/', verifyToken, orderController.orders_get_all);   // All orders
// router.get('/', auth.verifyToken, orderController.orders_get_all);   // All orders

router.get('/:_id', verifyToken, orderController.orders_get_order);  // get order

router.post('/', verifyToken, orderController.orders_create_order);  // create order

router.put('/:_id', verifyToken, orderController.orders_edit_order);   //edit order

router.delete('/:_id', verifyToken, (orderController.orders_delete_order));    //delete user


module.exports = router;