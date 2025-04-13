const { Op } = require('sequelize');
const StockMovement = require('../models/Stock_Movement');
const Inventory = require('../models/Inventory');
const AuditLog = require('../models/AuditLogs');

async function logAuditAction({ userId, action, model, modelId, details }) {
    await AuditLog.create({
        userId,
        action,
        model,
        modelId,
        details,
        timestamp: new Date()
    });
}

module.exports = {
    create: async (req, res) => {
        try {
            const { product_id, store_id, user_id, movement_type, quantity, reason } = req.body;

            if (!['stock-in', 'sale', 'manual-removal'].includes(movement_type)) {
                return res.status(400).json({ success: false, message: 'Invalid movement type' });
            }

            const qty = parseInt(quantity);
            if (isNaN(qty) || qty <= 0) {
                return res.status(400).json({ success: false, message: 'Quantity must be a positive number' });
            }

            const movement = await StockMovement.create({
                product_id,
                store_id,
                user_id,
                movement_type,
                quantity: qty,
                reason,
                created_at: new Date()
            });

            const inventory = await Inventory.findOne({ where: { store_id, product_id } });
            const updatedQty = (movement_type === 'sale') ? -qty : qty;

            if (inventory) {
                const newQty = inventory.quantity + updatedQty;

                if (newQty < 0) {
                    return res.status(400).json({ success: false, message: 'Insufficient stock for sale or removal' });
                }

                inventory.quantity = newQty;
                await inventory.save();

                await logAuditAction({
                    userId: user_id,
                    action: 'UPDATE',
                    model: 'Inventory',
                    modelId: inventory.id,
                    details: { newQty, movement_type }
                });

            } else {
                if (movement_type === 'sale') {
                    return res.status(400).json({ success: false, message: 'No inventory found to process sale' });
                }

                const newInventory = await Inventory.create({
                    product_id,
                    store_id,
                    quantity: updatedQty,
                    updated_at: new Date()
                });

                await logAuditAction({
                    userId: user_id,
                    action: 'CREATE',
                    model: 'Inventory',
                    modelId: newInventory.id,
                    details: { quantity: updatedQty }
                });
            }

            await logAuditAction({
                userId: user_id,
                action: 'CREATE',
                model: 'StockMovement',
                modelId: movement.id,
                details: {
                    product_id,
                    store_id,
                    movement_type,
                    quantity: qty,
                    reason
                }
            });

            return res.status(201).json({ success: true, message: 'Stock movement recorded', movement });

        } catch (error) {
            console.error('Stock Movement Error:', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // no changes below
    getByStore: async (req, res) => {
        try {
            const store_id = req.params.store_id;
            const movements = await StockMovement.findAll({
                where: { store_id },
                order: [['created_at', 'DESC']]
            });

            if (!movements || movements.length === 0) {
                return res.status(404).json({ success: false, message: 'No stock movements found for this store' });
            }

            return res.status(200).json({ success: true, store_id, movements });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getFiltered: async (req, res) => {
        try {
            const { store_id, start, end } = req.query;

            const whereClause = {};
            if (store_id) whereClause.store_id = store_id;
            if (start && end) {
                whereClause.created_at = {
                    [Op.between]: [new Date(start), new Date(end)]
                };
            }

            const movements = await StockMovement.findAll({
                where: whereClause,
                order: [['created_at', 'DESC']]
            });

            return res.status(200).json({ success: true, movements });
        } catch (error) {
            console.error(error.message);
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    getAll: async (req, res) => {
        try {
            const movements = await StockMovement.findAll();
            return res.status(200).json({ success: true, movements });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
