const router = require('express').Router();
const userController = require('../controllers/userController');
const { verifyToken } = require('../middlewares/authMiddlware');


router.get('/', verifyToken, userController.users_get_all);   // All users

router.get('/:_id', verifyToken, userController.users_get_user);

router.post('/signup', userController.users_create_user);  // add user

router.post('/login', userController.users_login);  // add user

router.put('/:_id', verifyToken, userController.users_edit_user);   //edit user

router.delete('/:_id', verifyToken, (userController.users_delete_user));    //delete user

module.exports = router;