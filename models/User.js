const sequelize = require('../config/connection');
const { DataTypes } = require('sequelize');

const UserObj = sequelize.define('UserObj', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    email: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    }
}, {
    tableName: 'UserObj',
    timestamps: true
});

module.exports = UserObj;