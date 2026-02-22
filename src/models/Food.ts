import mongoose, {Document, Schema} from "mongoose";

export interface IFoodDocument extends Document {
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isAvailable: boolean;
}

const FoodSchema: Schema = new Schema({
    name: { 
        type: String, 
        required: [true, "Food name is required"],
        trim: true,
        minlength: [3, "Food name must be at least 3 characters long"],
        maxlength: [100, "Food name must be at most 100 characters long"],
        unique: true,

    },
    description: { 
        type: String, 
        required: [true, "Food description is required"],
        trim: true,
        minlength: [10, "Food description must be at least 10 characters long"],
        maxlength: [1000, "Food description must be at most 1000 characters long"],
         
    },
    price: { 
        type: Number, 
        required: [true, "Food price is required"],
        trim: true,
        min: [0, "Food price cannot be negative"],
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        trim: true,
    },
    image: {
        type: String,
        required: [true, "Image is required"],
        trim: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });


export default mongoose.model<IFoodDocument>("Food", FoodSchema);