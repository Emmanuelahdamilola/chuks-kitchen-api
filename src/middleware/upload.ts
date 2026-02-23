 import multer, {FileFilterCallback} from "multer";
 import {CloudinaryStorage} from "multer-storage-cloudinary";
 import cloudinary from "../config/cloudinary";
 import path from "path";
 import {Request} from "express";


// Define where uploaded files will be stored
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        return {
            folder: "chuks-kitchen",
            allowed_formas: ["jpg", "jpeg", "png", "gif", "webp"],
            transformation: [{width: 500, height: 500, crop: "fill"}],
            public_id: `food-${Date.now()}`,  
        };
    },
});

const fileFilter = (
    req: Request,
    file: Express.Multer.File,
    cb: FileFilterCallback
) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMime = allowedTypes.test(file.mimetype);

    if (isValidExt && isValidMime){
        cb(null, true);
    }else{
        cb(new Error("Invalid file type. Only JPEG, PNG, GIF, and WEBP images are allowed."));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB limit
    },
});

export default upload;