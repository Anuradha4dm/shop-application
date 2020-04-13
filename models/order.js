const mongoose=require('mongoose');


const Schema=mongoose.Schema;

const orderSchema=new Schema({


    userId:{
        type:Schema.Types.ObjectId,
        require:true,
        ref:"User"
    }
    ,
    products:[{


            productId:{
                type:Schema.Types.ObjectId,
                require:true,
                ref:"Product"
            },
            quantity:{
                type:Number,
                require:true
            }

        }]

    




});




module.exports=mongoose.model("Order",orderSchema);