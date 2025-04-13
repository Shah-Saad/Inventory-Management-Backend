const express = require('express');
const router = express.Router();
const { getAllLogs } = require('../controllers/auditLogsController');

router.get('/get', getAllLogs); // GET /audit-logs

module.exports = router;
