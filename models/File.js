const sequelize = require('../config/connection');
const { DataTypes } = require('sequelize');
const { Project } = require('./Project');

const File = sequelize.define('File', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    content: {
        type: DataTypes.BLOB,
        allowNull: false
    },
    fileName: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    lastUpdated: {
        type: 'TIMESTAMP',
        defaultValue: DataTypes.NOW,
        allowNull: false
    },
    project: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: "Project",
            key: 'ID'
        }
    }
}, {
    tableName: 'File',
    timestamps: false
});

module.exports = File;