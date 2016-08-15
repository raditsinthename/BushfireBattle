var express = require('express');
var router = express.Router();
var ctrlMain = require("../controllers/main");

/* GET home page. */
router.get('/', ctrlMain.index);

// get rules:
router.get('/rules/', ctrlMain.rules);

// get theme:
router.get('/theme/', ctrlMain.theme);

// get game:
router.get('/game/', ctrlMain.game);
router.get('/game/*', ctrlMain.gameID);

// post update:
router.post('/update', ctrlMain.update);

// get contact info:
router.get('/contact/', ctrlMain.contact);

// get comments:
router.get('/comments/', ctrlMain.comments);

// post comments
router.post('/comment', ctrlMain.post);

// get architecture info:
router.get('/architecture/', ctrlMain.architecture);

module.exports = router;
