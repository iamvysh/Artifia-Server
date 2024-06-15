const express = require("express");
const router = express.Router();
const tryCatch = require("../middleWares/tryCatch");
const user = require("../controllers/userController");

router
  .post("/user/register", tryCatch(user.userRegister))
  .post("/user/login", tryCatch(user.userLogin))

  .post("/user/add/wishlist",tryCatch(user.addToWishlist))

module.exports = router;
