const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const port =3000;

//--------------dot env section----------------

require('dotenv').config();
const url = process.env.MONGODB_URL  

//-------------------------------------------

app.use(express.json());
app.use(cors());

//---------------------user route---------------

const userRoutes = require("./Src/routes/userRoutes")
app.use("/",userRoutes)

//---------------------admin route----------------

const adminRoutes = require("./Src/routes/adminRoutes")
app.use("/",adminRoutes)






//-------------mongodb connection setup-----------

mongoose.connect(url)
// mongoose.connect("mongodb://127.0.0.1/artifia")
.then(()=>console.log("mongodb atlas connected"))
.catch((error)=>console.log("error found",error))

app.listen(port,()=>{
console.log(`port is listening on ${port}`)
})