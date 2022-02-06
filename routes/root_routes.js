const { Router } = require('express');
const rootController = require('../controllers/root_controller');

const router = Router();

router.get('/', rootController.root_get);
router.get('/index.html', rootController.index_get);
router.get('/hackerboard.html', rootController.hackerboard_get);
router.get('/about.html', rootController.about_get);
router.get('/refreshQuestion', rootController.refresh);
module.exports = router;