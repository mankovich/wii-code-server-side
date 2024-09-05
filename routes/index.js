const router = require('express').Router();

const apiRoutes = require('./api');

const renderRoutes = require('./render')

router.use('/api', apiRoutes);
router.use('/render', renderRoutes);

module.exports = router;