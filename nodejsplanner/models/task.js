const Sequelize = require('sequelize');
const config = require('../config');

// const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:'); // npm install sql-dialect

const Task = config.define('Task', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }, 
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    date_of_start: {
        type: Sequelize.DATE,
        allowNull: true
    },
    date_of_end: {
        type: Sequelize.DATE,
        allowNull: true
    },
    status: {
        type: Sequelize.STRING,
        allowNull: false
    },
    task_type: {
        type: Sequelize.STRING,
        allowNull: false
    }
}
// tell Sequelize the name of the table directly 
// otherwise 'task.js' must be the same table name as 'task' 
, { tableName: 'task' } 

// Ok with or without since "timestamps: false" in config.js
// , {timestamps: false}     
)


module.exports = Task; // exporting the Task.

// `sequelize.define` also returns the model
console.log("Task === sequelize.models.Task: " + (Task === sequelize.models.Task)); // supposed to be true but false