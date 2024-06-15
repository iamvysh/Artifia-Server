const mongoose = require("mongoose");

const subCategorySchema = mongoose.Schema({
    subCategory: {
        type: String,
        required: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required:true
    },
})

module.exports = mongoose.model('SubCategory', subCategorySchema);