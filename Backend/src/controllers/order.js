import {AsyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Product } from "../models/product.js"
import {User} from "../models/user.js"
import {Order} from "../models/order.js"

const createOrder = AsyncHandler(async (req, res) => {

    const {userId, items} = req.body

    const user = await User.findById(userId)

    if(!user){
        throw new ApiError(404, "user not found")
    }

    let totalAmount = 0

    for(const item of items){

        const product = await Product.findById(item.product)

        if (!product) {
            throw new ApiError(404, `Product with id ${item.product} not found`)
        }

        totalAmount += item.quantity * item.price
    }

    //create order
    const order = new Order(
        {
            user: userId,
            items: items.map(item => (
                {
                    product: item.product,
                    quantity: item.quantity,
                    price: item.price
                })),
                totalAmount
        })

    await order.save({validateBeforeSave: false})

    res.status(201).json(
        new ApiResponse(201, "order create successfully")
    )
})

export { createOrder }