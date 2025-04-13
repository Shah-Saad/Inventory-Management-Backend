const { AuditLog } = require('../models');

const getAllLogs = async (req, res) => {
  try {
    const logs = await AuditLog.findAll({ order: [['timestamp', 'DESC']] });
    res.json(logs);
  } catch (error) {
    console.error('Error fetching audit logs:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getAllLogs,
};
