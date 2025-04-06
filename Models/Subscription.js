const mongoose=require('mongoose')

const subscriptionSchema=mongoose.Schema({
    subscriptionType:{
        type:String,
        enum:['weekly','monthly','yearly'],
        required:true
        
    },
    price:{
        type:Number,
        required:true

    },
    description:{
        type:[String],
        required:true
    },
    
})
   const User = mongoose.model('Subscription', subscriptionSchema);
    module.exports = User;