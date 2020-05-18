const express = require('express');
const router = express.Router();
const controller = require('../controllers/session-storage.controller');

router.get("/", controller.getSession);
router.post("/", controller.postSession);
module.exports = router