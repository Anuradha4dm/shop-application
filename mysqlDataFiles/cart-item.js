const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const cartItem=sequelize.define('cartItem',{

    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        allowNull:false,
        autoIncrement:true,
        unique:true
      },
      quantity: {
          
        type:Sequelize.INTEGER
      }

});

module.exports=cartItem;