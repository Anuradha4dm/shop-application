const mongoose=require('mongoose');

const Schema=mongoose.Schema;

const User= new Schema({

    username:{
        type:String,
        require:true
    }
    ,
    initialSignUpValid:{
        type:Boolean,
        default:false
    },

    resetTocken: {
        type:String
    },
    password :{
        type:String,
        require:true

    }
    
    ,
    resetExpire:{
        type:Date,
    }
    ,
    email:{

        type:String,
        require:true
    },
   
    cart:{
        item:[ { productId: {type: Schema.Types.ObjectId , require:true ,ref :'Product'} ,quantity :{type:Number , require:true}  }  ]
    }

});

User.methods.removeItemFromCart=function (productId){

   const updatedCartItem=this.cart.item.filter(m=>{

    return m.productId.toString() !== productId.toString();   
   });

   this.cart.item=updatedCartItem;
   return this.save();
} 

User.methods.removeCart=function(){

    this.cart={ item : [] };

    this.save();

}

module.exports=mongoose.model("User",User);