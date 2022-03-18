const mongoose = require('mongoose') ; 

const orderItemSchema = ({
    quantity : {
        type: Number,
        required : true 
    }, 
    product : {
        type : mongoose.Schema.Types.ObjectId , 
        ref : 'Product'
    }
}) ; 

exports.OrderItem = mongoose.model('OrderItem' , orderItemSchema) ; 