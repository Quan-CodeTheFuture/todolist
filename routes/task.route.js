const express = require('express');
const router = express.Router();
const controller = require('../controllers/task.controller');

router.get("/", controller.getTaskWeb);
router.get("/api",controller.getAPI);
router.post("/", controller.postTaskWeb);
module.exports = router