const Store = require('../models/Store');

module.exports = {
    // 🔒 Only the store_owner can access their own store
    get: async (req, res) => {
        try {
            const store = await Store.findByPk(req.params.id);

            if (!store) {
                return res.status(404).json({ success: false, message: 'Store not found' });
            }

            if (req.user.role !== 'store_owner' || req.user.id !== store.owner_id) {
                return res.status(403).json({ success: false, message: 'Access denied. Only the store owner can view this store.' });
            }

            return res.status(200).json({ success: true, store });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // 🔒 Only admin can get all stores
    getAllStores: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
            }

            const stores = await Store.findAll();
            return res.status(200).json({ success: true, stores });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // 🔒 Only admin can create store
    create: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
            }

            const { name, owner_id, location } = req.body;
            const newStore = await Store.create({ name, owner_id, location });

            return res.status(200).json({ success: true, store: newStore });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // 🔒 Only admin can update store
    update: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
            }

            const { name, owner_id, location } = req.body;
            const updated = await Store.update(
                { name, owner_id, location },
                { where: { id: req.params.id } }
            );

            if (updated[0] === 0) {
                return res.status(404).json({ success: false, message: 'Store not found or no changes made' });
            }

            return res.status(200).json({ success: true, message: 'Store updated successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // 🔒 Only admin can delete store
    delete: async (req, res) => {
        try {
            if (req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Access denied. Admins only.' });
            }

            const deleted = await Store.destroy({ where: { id: req.params.id } });

            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Store not found' });
            }

            return res.status(200).json({ success: true, message: 'Store deleted successfully' });
        } catch (error) {
            return res.status(500).json({ success: false, error: error.message });
        }
    }
};
