import {AsyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Product } from "../models/product.js"
import {User} from "../models/user.js"

const addToCart = AsyncHandler(async (req, res) => {

    const {userId, productId, quantity} = req.body

    const user = await User.findById(userId)

    if ( !user ) {
        throw new ApiError(404, "user not found")
    }

    const product = await Product.findById(productId)

    if(!product){
        throw new ApiError(404, "product not found")
    }

    const cartItem = user.cart.find(item => item.product.toString() === productId)

    if ( cartItem) {
        cartItem.quantity += quantity
    }else{
        user.cart.push(
            {
                product: productId,
                quantity
            }
        )
    }

   const added =  await user.save()

   if(!added){
    throw new ApiError(400, "product not added error")
   }

   res.status(200).json(
    new ApiResponse(200, cartItem, "item added successfully in card")
   )

})

export{addToCart}