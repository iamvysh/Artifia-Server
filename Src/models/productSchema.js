const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    ram : {
        type: Number,
        default:4
    },
    price : {
        type: Number,
        default:0
    },
    subCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubCategory',
        required:true
    },
    description: {
        type: String,
        required: true
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    image:{
        type:String,
        require:true
    }
})


module.exports = mongoose.model('Product', productSchema);