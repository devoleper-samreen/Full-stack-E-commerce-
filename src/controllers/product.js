import {AsyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Product } from "../models/product.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const createProduct = AsyncHandler(async (req, res) => {
   try {
     const {name, price, description, photo, quantity} = req.body
 
     if ( !(name || price || description || photo || quantity
     )) {
         throw new ApiError(400, "All fields are required")
     }
 
     const photoLocalPath = req.file?.path
 
     if ( !photoLocalPath) {
         throw new ApiError(400, "local path nahi mila")
     }
     console.log(photoLocalPath)
 
     const image = await uploadOnCloudinary(photoLocalPath)
 
     if ( !image ) {
         throw new ApiError(400, "cloudinery pe file upload nahi hui")
     }
 
     const product = await Product.create({
         name,
         price,
         description,
         quantity,
         photo: image.url
     })
 
     if ( !product ) {
         throw new ApiError(400, "product create nahi hua")
     }
 
     res.status(200).json(
         new ApiResponse(200, product, "product create successfully")
     )
 
   } catch (error) {
    console.error("Error in createProduct:", error);
        res.status(500).json({
            status: "error",
            message: error.message,
            details: error})
    
   }
})

//******************************************//

const readLatestProduct = AsyncHandler(async (req, res) => {
    try {
        const latestProduct = await Product.find().sort({createdAt: -1}).limit(10)

        if ( !latestProduct){
            throw new ApiError(400, "latest product not found")
        }

        res.status(200).json(
            new ApiResponse(200, latestProduct, "found seccessfully")
        )
        
    } catch (error) {
        res.status(500).json(
            new ApiError(500, "server error")
        )
        
    }
    
})

const readSingleProduct = AsyncHandler(async (req, res) => {

        const { productId } = req.params;
    
        const product = await Product.findById(productId)
    
        if (!product) {
            throw new ApiError(404, "Product not found")
        }
    
        res.status(200).json(
            new ApiResponse(200, product, "Product retrieved successfully")
        )
    
})

//***********************************************/

const readAllProduct = AsyncHandler(async (req, res) => {
    
    const products = await Product.find();

    if (!products) {
        throw new ApiError(404, "No products found")
    }

    res.status(200).json(
        new ApiResponse(200, products, "Products retrieved successfully")
    )
    
})

//**********************************************/

const updateProduct = AsyncHandler(async (req, res) => {
    const {productId} = req.params
    const {name, description, price, quantity} = req.body

    if ( productId) {
        throw new ApiError(400, "please provide product id")
    }

    if ( name || description || price || quantity || photo) {
        throw new ApiError(400, "please provide update data")
    }

    const product = await Product.findById(productId)

    if ( !product) {
        throw new ApiError(400, "product nahi mila")
    }

    if (product.owner !== req.user ) {
        throw new ApiError(400, "you are not owner")
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            name,
            description,
            price,
            quantity
        }
     )

     if ( !updatedProduct) {
        throw new ApiError(400, "product not update")
     }

    const saved =  await updatedProduct.save({validateBeforeSave: false})

    if ( !saved) {
        throw new ApiError(400, "not saved")
    }

     res.status(200).json(
        new ApiResponse(200, updatedProduct, "product update successfully")
     )

})

//**********************************************/

const productPhotoUpdate = AsyncHandler(async (req, res) => {

    const {productId} = req.params
    const {photo} = req.body

    if ( productId) {
        throw new ApiError(400, "please provide product id")
    }

    if ( ! photo) {
        throw new ApiError(400, "please provide photo")
    }

    const product = await Product.findById(productId)

    if ( !product) {
        throw new ApiError(400, "product nahi mila")
    }

    if (product.owner !== req.user ) {
        throw new ApiError(400, "you are not owner")
    }

    const photoLocalPath = req.file?.path

    if ( !photoLocalPath) {
        throw new ApiError(400, "photo local path nahi mila")
    }

    const image = await uploadOnCloudinary(photoLocalPath)
    
    if ( !image) {
        throw new ApiError(400, "photo cloudinary pe upload nahi hua")
    }

    const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        {
            photo: image.url
        }
     )

     if ( !updatedProduct) {
        throw new ApiError(400, "product not update")
     }

    const saved =  await updatedProduct.save({validateBeforeSave: false})

    if ( !saved) {
        throw new ApiError(400, "not saved")
    }

     res.status(200).json(
        new ApiResponse(200, updatedProduct, "product photo update successfully")
     )

})

//************************************************/

const deleteProduct = AsyncHandler(async (req, res) => {

    const {productId} = req.params

    if ( productId) {
        throw new ApiError(400, "please provide product id")
    }

    const product = await Product.findById(productId)

    if ( !product) {
        throw new ApiError(400, "product nahi mila")
    }

    if (product.owner !== req.user ) {
        throw new ApiError(400, "you are not owner")
    }

    const deletedProduct = await Product.findByIdAndDelete(
        productId
     )

     if ( !deletedProduct) {
        throw new ApiError(400, "product not deleted")
     }


     res.status(200).json(
        new ApiResponse(200, deletedProduct, "product update successfully")
     )
   
})

export {
    createProduct,
    readLatestProduct,
    readSingleProduct,
    readAllProduct,
    updateProduct,
    productPhotoUpdate,
    deleteProduct
}