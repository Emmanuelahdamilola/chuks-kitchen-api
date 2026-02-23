import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUserDocumnet extends Document {
    name: string;
    email: string;
    phone: string;
    password: string;
    referral_code: string;
    otp?: string;
    otp_expires_at?: Date;
    is_verified: boolean;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    name:{
        type: String,
        required: [true, "Name is required"],
        trim: true,

    },
    email:{
        type: String,
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true
    },
    phone:{
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    password:{
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    referral_code:{
        type: String,
        trim: true,
    },
    otp:{
        type: String,
    },
    otp_expires_at:{
        type: Date,
    },
    is_verified:{
        type: Boolean,
        default: false  
    }
}, {
    timestamps: true
});

UserSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password as string, salt);
});

UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUserDocumnet>("User", UserSchema);   