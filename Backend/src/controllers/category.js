import {AsyncHandler} from "../utils/AsyncHandler.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {Category} from "../models/category.js"

const createCategory = AsyncHandler(async (req, res) => {

    try {
        const { name, parent_id } = req.body

        const category = new Category({ name, parent_id })

        await category.save({validateBeforeSave: false})

        res.status(201).json(
            new ApiResponse(201, category, 'Category created successfully')
            )

      } catch (error)
      {
        res.status(400).json(
            new ApiError(400, "Error creating category")
        )
      }

})

export{createCategory}

