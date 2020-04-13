const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {

    userId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        unique: true,
        autoIncrement: true
    },
    userName: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    userEmail: {
        type: Sequelize.STRING,
        allowNull: false

    }

});

module.exports = User;
