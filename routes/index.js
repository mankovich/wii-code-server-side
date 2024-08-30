const router = require('express').Router();
// const { User } = require("../models");


const authRoutes = require("../routes/api/authRoutes"); 
const apiRoutes = require('./api');

router.use('/api', apiRoutes);
router.use("/user", authRoutes );


module.exports = router;