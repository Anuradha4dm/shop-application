const Sequelize=require('sequelize');

const sequelize=require('..//util/database');

const Order=sequelize.define('order',{


    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:true,
        autoIncrement:true,

    }

});

module.exports=Order;

