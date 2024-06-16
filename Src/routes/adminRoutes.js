const express = require("express");
const router = express.Router();
const tryCatch = require("../middleWares/tryCatch");
const admin = require("../controllers/adminController");
const upload=require("../middleWares/multer")

router
  .post("/admin/register", tryCatch(admin.adminRegister))
  .post("/admin/login", tryCatch(admin.adminLogin))

  .post("/admin/create/category",tryCatch(admin.createCategory))
  .get("/admin/get/category",tryCatch(admin.getCategory))
  .post("/admin/create/subcategory/:id",tryCatch(admin.createSubCategory))
  .get("/admin/get/subcategory",tryCatch(admin.getSubCategory))

  .post("/admin/create/product/:subCategoryId",upload.array("images",5),tryCatch(admin.createProduct))
  .get("/admin/get/products",tryCatch(admin.getProducts))
  .put("/admin/update/product/:productId",tryCatch(admin.updateProduct))
  .get("/search",tryCatch(admin.searchProduct))




module.exports = router;
