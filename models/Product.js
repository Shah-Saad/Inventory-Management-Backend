'use strict';

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Store = require('./Store');

const Product = sequelize.define(
  'products', 
  {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      barcode: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: true,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      is_global: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_by_store_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Store,
          key: 'id',
        }
      },
  },     
    {
      timestamps: true, // ✅ Let Sequelize add createdAt and updatedAt
    }
);


module.exports = Product;
