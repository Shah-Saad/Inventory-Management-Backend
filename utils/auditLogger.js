const { AuditLog } = require('../models');

async function logAudit({ userId, action, model, modelId, details }) {
  try {
    await AuditLog.create({
      userId,
      action,
      model,
      modelId,
      details
    });
  } catch (err) {
    console.error('Failed to log audit:', err.message);
  }
}

module.exports = logAudit;
