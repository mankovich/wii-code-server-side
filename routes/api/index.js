const router = require("express").Router();

const authRoutes  = require("./authRoutes");
router.use("/user", authRoutes);

module.exports = router;