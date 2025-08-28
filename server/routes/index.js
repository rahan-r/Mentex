const { Router } = require("express");
const base = require("./base");
const chat = require("./chat");

const router = Router();

router.use("/", base);
router.use("/", chat);

module.exports = router;
