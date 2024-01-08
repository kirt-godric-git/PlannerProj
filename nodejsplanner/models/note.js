// const Sequelize = require('sequelize');
const config = require('../config');

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:'); // npm install sqlite3

const Note = config.define('Note', {
// const Note = sequelize.define('Note', {       // <= Does not work in backend CRUD 
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }, 
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    header: {
        type: DataTypes.STRING,
        allowNull: false
    },
    details: {
        type: DataTypes.STRING,
        allowNull: false
    },
    importance: {
        type: DataTypes.CHAR,
        allowNull: true
    },
    task_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}
// tell Sequelize the name of the table directly 
// otherwise 'task.js' must be the same table name as 'task' 
, { tableName: 'note' } 

// Ok with or without since "timestamps: false" in config.js
// , {timestamps: false}     
)


module.exports = Note; // exporting the Task.

// `sequelize.define` also returns the model
console.log("Note === sequelize.models.Note: " + (Note === sequelize.models.Note)); // true