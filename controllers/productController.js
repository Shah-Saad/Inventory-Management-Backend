const Product = require('../models/Product');

module.exports = {
    // ✅ Public: Get a specific product by ID
    get: async (req, res) => {
        try {
            const product_id = req.params.id;
            const product = await Product.findOne({ where: { id: product_id } });

            if (!product) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            return res.status(200).json({ success: true, product });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // ✅ Public: Get all products
    getAll: async (req, res) => {
        try {
            const products = await Product.findAll();
            return res.status(200).json({ success: true, products });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // 🔐 Admin only: Create a new product
    create: async (req, res) => {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Only admins can create products' });
            }

            const { name, sku, barcode, price, is_global, created_by_store_id } = req.body;

            const newProduct = await Product.create({
                name,
                sku,
                barcode,
                price,
                is_global,
                created_by_store_id,
                created_at: new Date()
            });

            return res.status(200).json({ success: true, product: newProduct });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // 🔐 Admin only: Update an existing product
    update: async (req, res) => {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Only admins can update products' });
            }

            const product_id = req.params.id;
            const { name, sku, barcode, price, is_global } = req.body;

            const updated = await Product.update(
                { name, sku, barcode, price, is_global },
                { where: { id: product_id } }
            );

            if (updated[0] === 0) {
                return res.status(404).json({ success: false, message: 'Product not found or no changes made' });
            }

            return res.status(200).json({ success: true, message: 'Product updated successfully' });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    },

    // 🔐 Admin only: Delete a product
    delete: async (req, res) => {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return res.status(403).json({ success: false, message: 'Only admins can delete products' });
            }

            const product_id = req.params.id;
            const deleted = await Product.destroy({ where: { id: product_id } });

            if (!deleted) {
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            return res.status(200).json({ success: true, message: 'Product deleted successfully' });
        } catch (error) {
            console.log(error.message);
            return res.status(500).json({ success: false, error: error.message });
        }
    }
};
