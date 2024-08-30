const sequelize = require('../config/connection');
const { DataTypes } = require('sequelize');
const { UserObj } = require('./User')

const Project = sequelize.define('Project', {
    ID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    ownerId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        references: {
            model: "UserObj",
            key: "ID"
        }
    },
    projectName: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    lastUpdated: {
        type: 'TIMESTAMP',
        defaultValue: DataTypes.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    directory: {
        type: DataTypes.STRING(512),
        allowNull: true
    },
}, {
    tableName: 'Project',
    timestamps: false
});

module.exports = Project;