const Inventory = require('../models/Inventory');
const Store = require('../models/Store');
const { Op } = require('sequelize');

module.exports = {
    // Admin: Get all inventory
    getAll: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
            }

            const inventory = await Inventory.findAll();
            return res.status(200).json({ success: true, inventory });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // Store_owner: Get inventory for their own store only
    getByStore: async (req, res) => {
        try {
            const { store_id } = req.params;

            if (req.user.role === 'store_owner') {
                const store = await Store.findByPk(store_id);
                if (!store || store.owner_id !== req.user.id) {
                    return res.status(403).json({ success: false, message: 'Access denied to this store\'s inventory' });
                }
            } else if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Access denied' });
            }

            const inventory = await Inventory.findAll({ where: { store_id } });
            return res.status(200).json({ success: true, inventory });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // Store_owner: Add inventory to their store
    create: async (req, res) => {
        try {
            if (req.user.role !== 'store_owner') {
                return res.status(403).json({ success: false, message: 'Only store owners can add inventory' });
            }

            const { store_id, product_id, quantity } = req.body;

            const store = await Store.findByPk(store_id);
            if (!store || store.owner_id !== req.user.id) {
                return res.status(403).json({ success: false, message: 'You don\'t own this store' });
            }

            const inventory = await Inventory.create({
                store_id,
                product_id,
                quantity,
                updated_at: new Date()
            });

            return res.status(201).json({ success: true, inventory });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // Store_owner: Update inventory of their store
    update: async (req, res) => {
        try {
            if (req.user.role !== 'store_owner') {
                return res.status(403).json({ success: false, message: 'Only store owners can update inventory' });
            }

            const { id } = req.params;
            const { quantity } = req.body;

            const inventory = await Inventory.findByPk(id);
            if (!inventory) {
                return res.status(404).json({ success: false, message: 'Inventory not found' });
            }

            const store = await Store.findByPk(inventory.store_id);
            if (!store || store.owner_id !== req.user.id) {
                return res.status(403).json({ success: false, message: 'You don\'t own this store' });
            }

            inventory.quantity = quantity;
            inventory.updated_at = new Date();
            await inventory.save();

            return res.status(200).json({ success: true, inventory });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    },

    // Store_owner: Delete inventory from their store
    delete: async (req, res) => {
        try {
            if (req.user.role !== 'store_owner') {
                return res.status(403).json({ success: false, message: 'Only store owners can delete inventory' });
            }

            const { id } = req.params;

            const inventory = await Inventory.findByPk(id);
            if (!inventory) {
                return res.status(404).json({ success: false, message: 'Inventory not found' });
            }

            const store = await Store.findByPk(inventory.store_id);
            if (!store || store.owner_id !== req.user.id) {
                return res.status(403).json({ success: false, message: 'You don\'t own this store' });
            }

            await inventory.destroy();

            return res.status(200).json({ success: true, message: 'Inventory deleted successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
};
