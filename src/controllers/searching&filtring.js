import {AsyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import { Product } from "../models/product.js"

const searchProduct = AsyncHandler(async (req, res) => {

const { name } = req.body;

if (!name) {
    throw new ApiError(400, "name is required")
}

try {
    // Name ke basis pe products ko search karna
    const products = await Product.find(
        { 
            name: { 
                $regex: name,
                $options: 'i' 
            } 
        }
    )

    if ( !products ) {
        throw new ApiError(400, "product not found")
    }

    res.status(200).json(
        new ApiResponse(200, products, "product search successfully")
    )

} catch (error) {
    res.status(500).json({ error: 'Something went wrong' });
}

})

//************************************************/

const sortProduct = AsyncHandler(async (req, res) => {
    const { sortby, maxprice, category } = req.body;

    let filter = {};
    let sort = {};

    // Filter by max price
    if (maxprice) {
        filter.price = { $lte: Number(maxprice) };
    }

    // Filter by category
    if (category) {
        filter.category = category;
    }

    // Sorting logic
    if (sortby === 'lowtohigh') {
        sort.price = 1;
    } else if (sortby === 'hightolow') {
        sort.price = -1;
    }

    try {
        // Apply filter and sorting
        const products = await Product.find(filter).sort(sort);

        if ( !products ) {
            throw new ApiError(401, "product not found" )
        }

        res.status(200).json(
            new ApiResponse(200, products, "product sort successfully")
        )
    } catch (error) {
        res.status(500).json({ error: 'Something went wrong' });
    }
});

export {searchProduct, sortProduct}

