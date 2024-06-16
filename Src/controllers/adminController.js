const admin = require("../models/adminSchema");
const categories = require("../models/categorySchema");
const subCategories = require("../models/subCategorySchema");
const product = require("../models/productSchema");
const cloudinary=require("../middleWares/cloudinary")
const fs = require("fs");

//----------------------admin register-------------------

const adminRegister = async (req, res) => {
  const { adminName, email, password } = req.body;
 
  const identifyAdmin = await admin.findOne({ email: email });

  if (identifyAdmin) {
    return res.json({
      status: "failure",

      message: "Admin Already Exist",
    });
  }

  const newAdmin = new admin({
    adminName: adminName,
    email: email,
    password: password,
  });

  await newAdmin.save();
  return res.json({
    status: "success",

    message: "Admin Registered Successfully",
  });
};

//--------------------------admin login-----------------------

const adminLogin = async (req, res) => {
  const { email, password } = req.body;

  if(email==process.env.admin_Email&&password==process.env.admin_password){

    res.status(200).json({
      status:"success",
      message:"admin login successfull"
    })
  }

  
};

//-----------------------add category-------------------

const createCategory = async (req, res) => {
  const { category } = req.body;
  const findCategory = await categories.findOne({ category: category });
  if (findCategory) {
    return res.status(400).json({
      status: "failure",

      message: "Category already exist",
    });
  }
  const newCategory = new categories({ category: category });
  await newCategory.save();
  return res.status(201).json({
    status: "success",

    message: "Category created successfully",
  });
};

//----------------------get category---------------------

const getCategory = async (req, res) => {
  const findCategory = await categories.find();

  if (findCategory.length === 0) {
    return res.status(400).json({
      status: "failure",

      message: "No category",
    });
  }
  return res.status(200).json({
    status: "success",

    message: "Category found successfully",

    data: findCategory,
  });
};

//-------------------------create subcategory------------------

const createSubCategory = async (req, res) => {
  const { subCategory } = req.body;
  const categoryId = req.params.id;
  // Check if the category exists
  const findCategory = await categories.findById(categoryId);

  if (!findCategory) {
    return res.status(400).json({
      status: "failure",
      message: "Invalid category ID",
    });
  }

  // Check if the subcategory already exists
  const findSubCategory = await subCategories.findOne({
    subCategory: subCategory,
    category: categoryId,
  });

  if (findSubCategory) {
    return res.status(400).json({
      status: "failure",
      message: "Subcategory already exists in this category",
    });
  }

  // Create a new subcategory
  const newSubCategory = new subCategories({
    subCategory: subCategory,
    category: categoryId,
  });
  await newSubCategory.save();

  return res.status(201).json({
    status: "success",
    message: "Subcategory created successfully",
    data: newSubCategory,
  });
};

//-------------------------get subCategory--------------------

const getSubCategory = async (req, res) => {
  const findSubCategory = await subCategories.find().populate("category");

  if (findSubCategory === 0) {
    return res.status(404).json({
      status: "failure",
      message: "Subcategory not found",
      data: findSubCategory,
    });
  }

  return res.status(200).json({
    status: "success",
    message: "Subcategory found",
    data: findSubCategory,
  });
};

//--------------------------create product---------------------

const createProduct = async (req, res) => {
  const { title, ram, price, description,category } = req.body;
  console.log(title,ram,price,description,category);
  
  let urls = [];

  const subCategoryId = req.params.subCategoryId;
  console.log(subCategoryId,"dged");

  // Check if the product exists
  const existingProduct = await product.findOne({
    title,
    ram,
    subCategory: subCategoryId,
  });

  if (existingProduct) {
    return res.status(400).json({
      status: "failure",
      message:
        "Product with the same title and ram already exists in this subcategory.",
    });
  }

  // Create a new product

  const uploader = async (path) => await cloudinary.uploads(path, "images");
  if (req.method == "POST") {
    const files = req.files;
    console.log("files",files);
    for (const file of files) {
      const { path } = file;

      const newPath = await uploader(path);

      urls.push(newPath);

      fs.unlinkSync(path);
    }

    
    const newProduct = new product({
      title,
      ram,
      price,
      subCategory: subCategoryId,
      description,
      category,
      image:urls
    });
  
    // Save the product
    await newProduct.save();
  
    return res.status(201).json({
      status: "success",
      message: "Product created successfully",
      data: newProduct,
    });

  
  }


  
};

//-----------------------------get products----------------------------------

const getProducts = async (req, res) => {
  const findProducts = await product.find();

  if (findProducts === 0) {
    return res.status(404).json({
      status: "success",
      message: "No products available",
      data: findProducts,
    });
  }
  return res.status(200).json({
    status: "success",
    message: "Product received successfully",
    data: findProducts,
  });
};

//-----------------------------update product-------------------------

const updateProduct = async (req, res) => {
  const productData = req.body;
  const productId = req.params.productId;
  const findProduct = await product.findByIdAndUpdate(productId, productData, {
    new: true,
  });
  return res.status(200).json({
    status: "success",
    message: "Product updated successfully",
    data: findProduct,
  });
};

const searchProduct=async(req,res)=>{
  const searchQuery = req.query.q; 
        const products = await product.find({ title: new RegExp(searchQuery, 'i') });
        res.status(200).json({
          data:products});
}

module.exports = {
  adminRegister,
  adminLogin,
  createCategory,
  getCategory,
  createSubCategory,
  getSubCategory,
  createProduct,
  getProducts,
  updateProduct,
  searchProduct
};
