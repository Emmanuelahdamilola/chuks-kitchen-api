import {Request, Response} from "express";
import Food from "../models/Food";

// GET /api/foods - Get all available food items
export const getAllFoods = async (req: Request, res: Response) => {
    try{
        const foods = await Food.find({ is_available: true});

        res.status(200).json({
            success: true,
            count: foods.length,
            data: foods,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error. Could not retrieve food items.",
        });
    }
};

// POST /api/foods - Add a new food item (Admin simulation)
export const addFood = async (req: Request, res: Response) => {
    try {
        const {name, description, price, category, is_available} = req.body;

        // Check required fields
        if (!name || !description || !price || !category || !is_available) {
            return res.status(400).json({
                success: false,
                message: "All fields are required.",
            });
        }

        // check if food already exists
        const existingFood = await Food.findOne({name: name.trim()});
        if(existingFood){
            return res.status(409).json({
                success: false,
                message: "A food item with this name already exists."
            });
        }

        const image_url = req.file ? req.file.path : undefined;

        // Create new food item
        const food = new Food({
            name,
            description,
            price,  
            image_url,
            category,
            is_available: is_available ?? true,
        });

        await food.save();

        res.status(201).json({
            success: true,
            message: "Food item added successfully.",
            data: food,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error. Could not add food item.",
        });
    }
}


// GET /api/foods/:id - Get a single food item by ID
export const getFoodById = async (req: Request, res: Response) => {
    try {
        const food = await Food.findById(req.params.id);

        if (!food) {
            return res.status(404).json({
                success: false,
                message: "Food item not found.",
            });
        }

        res.status(200).json({
            success: true,
            data: food,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error. Could not retrieve food item.",
        });
    }
};

// PATCH /api/foods/:id — Update food item including image
export const updateFood = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, description, price, category, is_available } = req.body;

    const food = await Food.findById(id);
    if (!food) {
      res.status(404).json({
        success: false,
        message: "Food item not found.",
      });
      return;
    }

    if (req.file) {
      if (food.image_url) {
        const publicId = food.image_url
          .split("/")
          .slice(-2)
          .join("/")
          .split(".")[0]; 

        const { default: cloudinary } = await import("../config/cloudinary");
        await cloudinary.uploader.destroy(publicId);
      }

      food.image_url = req.file.path; 
    }

    // Update other fields only if they were provided
    if (name) food.name = name;
    if (description) food.description = description;
    if (price) food.price = price;
    if (category) food.category = category;
    if (is_available !== undefined) food.is_available = is_available;

    await food.save();

    res.status(200).json({
      success: true,
      message: "Food item updated successfully.",
      data: food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not update food item.",
    });
  }
};

// DELETE /api/foods/:id — Delete food item and its image from Cloudinary
export const deleteFood = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;

    const food = await Food.findById(id);
    if (!food) {
      res.status(404).json({
        success: false,
        message: "Food item not found.",
      });
      return;
    }

    // Delete the image from Cloudinary before removing from DB
    if (food.image_url) {
      const publicId = food.image_url
        .split("/")
        .slice(-2)
        .join("/")
        .split(".")[0];

      const { default: cloudinary } = await import("../config/cloudinary");
      await cloudinary.uploader.destroy(publicId);
    }

    await food.deleteOne();

    res.status(200).json({
      success: true,
      message: "Food item and image deleted successfully.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error. Could not delete food item.",
    });
  }
};
