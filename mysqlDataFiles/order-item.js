const Sequelize=require('sequelize');

const sequelize=require('../util/database');

const OrderItem=sequelize.define('orderItem',{


    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:true,
        autoIncrement:true,

    }

});

module.exports=OrderItem;

