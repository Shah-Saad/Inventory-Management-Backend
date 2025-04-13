require('dotenv').config();

const express = require('express');
const app = express(); 
const port = 3000;
const sequelize = require('./config/database.js');
const cors = require('cors');
const rateLimiter = require('./middlewares/ratelimiter.js');


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const storeRoutes = require('./routes/storeRoutes');
const productRoutes = require('./routes/productRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const stockMovementRoutes = require('./routes/stock_movementRoutes.js');
const auditLogsRoutes = require('./routes/auditLogsRoutes');

// Mount routes
app.use('/auth', rateLimiter, authRoutes);
app.use('/users', userRoutes); 
app.use('/stores', storeRoutes);
app.use('/products', productRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/stock-movements', rateLimiter, stockMovementRoutes);
app.use('/audit-logs', auditLogsRoutes);


// Test DB connection
sequelize.authenticate()
    .then(() => {
        console.log('Database connected successfully');
        return sequelize.sync(); // You can pass { force: true } to drop and recreate tables for testing
    })
    .then(() => {
        app.listen(port, () => {
            console.log(`The server is running on port ${port}`);
        });
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = app;
