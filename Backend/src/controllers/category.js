import {AsyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Category} from "../models/category.js"

const createCategory = AsyncHandler(async (req, res) => {

        const { name, parent_id } = req.body

        if(!name){
            throw new ApiError(400, "category name is required")
        }

        const category = await Category.create(
            {
                name,
                parent_id 
            }
        )

       const savedCategory =  await category.save({validateBeforeSave: false})

       if(!savedCategory){
        throw new ApiError(400, "category not creted")
       }

        res.status(201).json(
            new ApiResponse(201, category, 'Category created successfully')
            )

})

export{createCategory}

