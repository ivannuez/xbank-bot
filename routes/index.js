var router = require('express').Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('/');
  res.send('xBank Bot Listener!!!');
});

module.exports = router;