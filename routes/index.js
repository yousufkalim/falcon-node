// Init
const router = require("express").Router();

// All Routes
router.use("/auth", require("./auth"));
router.use("/blog", require("./blog"));
router.use("/project", require("./project"));

// Export
module.exports = router;
