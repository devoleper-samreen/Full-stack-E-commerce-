import { v2 as cloudinary } from "cloudinary";

// Configuration
    cloudinary.config({ 
        cloud_name: 'dezv22onr', 
        api_key: '617329785424122', 
        api_secret: 'ydYl5TpVhsiqLLGlvjNZ88Z2P1U'
    });


const uploadOnCloudinary = async (localFilePath) => {
    try {
        
        if(!localFilePath){
            return null
        }

        //upload file on cloudinay
      const result =  await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })

        //file uploaded seccessfully
        console.log("file upload on cloudinary")
        //fs.unlinkSync(localFilePath)
        return result

    } catch (error) {
        //fs.unlinkSync(localFilePath)
        console.error("Error uploading to Cloudinary:", error)
        return null
    }
}

//***********************************************/

const deleteOnCloudinary = async (publicId) => {

    try {
        console.log("i am in delete cloudenary")
        if(!publicId){
            return null
        }

        console.log(publicId)

        const result = await cloudinary.uploader.destroy(publicId, {resource_type: "video"});

        console.log("file delete on cloudinary")

        return result

      } catch (error) {
        throw new Error(`Failed to delete file: ${error.message}`)
      }
}


export {uploadOnCloudinary, deleteOnCloudinary}