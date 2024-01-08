const Sequelize = require('sequelize');

const config = new Sequelize("planner_live", "root", "manageri", 
{
    host: "localhost",      // or 127.0.0.1
    port: 3307,
    // one of 'mysql' | 'postgres' | 'sqlite' | 'mariadb' | 'mssql' | 'db2' | 'snowflake' | 'oracle' 
    dialect: 'mariadb',
    define: {
      timestamps: false
    }
});

module.exports = config;