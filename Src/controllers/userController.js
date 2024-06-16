const user = require("../models/userSchema");
const wishlist = require("../models/wishlistSchema");
const bcrypt=require("bcrypt")
const jwt=require("jsonwebtoken")


//------------------user register section------------------

const userRegister = async (req, res) => {
  const { name, email, password } = req.body;
  const identifyUser = await user.findOne({ email: email });

  if (identifyUser) {
    return res.json({
      status: "failure",

      message: "User Already Exist",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new user({
    name: name,
    email: email,
    password: hashedPassword,
  });

  await newUser.save();
  return res.json({
    status: "success",

    message: "User Registered Successfully",
  });
};

//----------------------------user login section-------------------------

const userLogin = async (req, res) => {
  const { email, password } = req.body;
   console.log(email,password);

  if(email===process.env.admin_Email&&password===process.env.admin_password){
    return res.status(200).json({
      status: "success",
      message: "admin logged in successfully",
      type:"admin"
    })
  }

  const identifyUser = await user.findOne({ email: email });
  console.log(identifyUser);
  if (!identifyUser) {
    return res.json({
      status: "failure",

      message: "User not found",
    });
  } 

  const existingUser=await bcrypt.compare(password,identifyUser.password,)
  console.log(existingUser);
  if(!existingUser){
    return res.status(404).json({
      status:"failure",
      message:"Incorrect Password"
    })
  }

  const secret = process.env.SECRET_KEY_USER || "";
  const token = jwt.sign({ user:email }, secret, { expiresIn: "72h" });
  
    return res.status(200).json({
      status: "success",
      message: "User logged in successfully",
      type:"user",
      id:identifyUser._id,
      data:token
    });
  }


//---------------------------add to wishlist-------------------------

const addToWishlist = async(req,res)=>{
         const {userId,productId}  = req.body;
        //  console.log(req.body);
         let Wishlist = await wishlist.findOne({ user: userId });
        // console.log(Wishlist);
        if (!Wishlist) {
          Wishlist = new wishlist({ user: userId, products: [] });
        }
         // Check if the product is already in the wishlist
         if (!Wishlist.products.includes(productId)) {
           // Add the product to the wishlist
           Wishlist.products.push(productId);
           await Wishlist.save();
           return res.status(200).json({ message: 'Product added to wishlist successfully' });
         } else {
           return res.status(400).json({ message: 'Product is already in the wishlist' });
         }
}
module.exports = { userRegister,userLogin ,addToWishlist};
