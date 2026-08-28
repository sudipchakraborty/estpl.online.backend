const express = require("express");
const { submitContact } = require("./contactController");

const router = express.Router();

router.post("/", submitContact);

module.exports = router;
