const router = require('express').Router();
const auth = require('../middleware/auth');
const { summary } = require('../controllers/summary.controller');

router.use(auth);

router.get('/', summary);

module.exports = router;

