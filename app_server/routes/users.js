var express = require('express');
var router = express.Router();
var ctrlUsers = require("../controllers/users");

/* GET user list */
router.get('/', ctrlUsers.List);

/* POST a new user */
router.post('/', ctrlUsers.newUser);

/* DELETE a user */
router.get('/delete/:id', ctrlUsers.deleteUser);

module.exports = router;
