
const cloudinary = require('cloudinary')

const dotenv = require('dotenv')

dotenv.config()

cloudinary.v2.config({

    cloud_name  : process.env.cloud_name,
      api_key   :process.env.api_key,
      api_secret:process.env.api_secret,
      secure: true,
});
    

exports.uploads =(file,folder)=>{

    return new Promise(resolve =>{
        cloudinary.uploader.upload(file,(result)=>{
     
            resolve({
               url:result.url,
    
                })
            },{

            resourse_type : "auto",
            folder:folder
          })

     })
       
}
