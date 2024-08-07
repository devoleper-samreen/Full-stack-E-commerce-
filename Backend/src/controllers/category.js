import {AsyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Category} from "../models/category.js"

const createCategory = AsyncHandler(async (req, res) => {

        const { name, parent_id } = req.body

        if(!name){
            throw new ApiError(400, "category name is required")
        }

        const isExist = await Category.findOne({name})

        if ( isExist ){
            throw new ApiError(409, "category already exist" )
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

//***************************************/

const deleteCategory = AsyncHandler(async (req, res) => {

    const {categoryId} = req.body

    if ( !categoryId)
    {
        throw new ApiError(400, "please provide category id")
        
    }

    const category = await Category.findById(categoryId)

    if ( !category )
    {
        throw new ApiError(404, "category not found")
        
    }

    const deleted = await Category.findByIdAndDelete(categoryId)

    if ( !deleted){
        throw new ApiError(500, "category not deleeted its server error")
    }

    res.status(200).json(
        new ApiResponse(200, category, "category delete successfully")
    )

})

//********************************************************/

const getAllCategory = AsyncHandler(async (req, res) => {

    const allCategory = await Category.find()

    if ( !allCategory ){
        throw new ApiError(404, "categories not found")
    }

    res.status(200).json(
        new ApiResponse(200, allCategory, "all categories fetched")
    )

})

export{createCategory, deleteCategory, getAllCategory}

