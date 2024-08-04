import {AsyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Product } from "../models/product.js"
import {User} from "../models/user.js"
import {Cart} from "../models/cart.js"

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

    const cart = await Cart.findOne({user: userId})

    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }

    const cartItem = cart.items.find(item => item.product.toString() === productId)

    if ( cartItem) {
        cartItem.quantity += quantity
    }else{
        cart.items.push(
            {
                product: productId,
                quantity
            }
        )
    }

   const added =  await user.save({validateBeforeSave: false})

   if(!added){
    throw new ApiError(400, "product not added error")
   }

   res.status(200).json(
    new ApiResponse(200, cartItem, "item added successfully in card")
   )

})

//*******************************************/

const removeFromCart = AsyncHandler(async (req, res) => {

    const  {userId, productId} = req.body

    const cart = await Cart.findOne({user: userId})

    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }

    const productIndex = cart.items.findIndex(item => item.product.toString() === productId)

    if (productIndex === -1) {
        throw new ApiError(404, "Product not found in cart");
    }

    cart.items = await cart.items.filter(item => item.product.toString() !== productId)

    await cart.save({validateBeforeSave: false})

    res.status(200).json(
        new ApiResponse(200, cart, "Item removed successfully from cart")
    )

})

export{addToCart, removeFromCart}