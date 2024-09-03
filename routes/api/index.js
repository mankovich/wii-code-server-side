const router = require("express").Router();

const authRoutes = require("./authRoutes");
const fileRoutes = require("./fileRoutes");
const projectRoutes = require("./projectRoutes");
router.use("/user", authRoutes);
router.use("/project", projectRoutes);
router.use("/file", fileRoutes);

module.exports = router;