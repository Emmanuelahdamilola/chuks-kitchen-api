import { Request, Response } from "express";
import User from "../models/User";
import { sendOTPEmail, sendResetPasswordEmail } from "@/utils/sendEmail";


const generateOTP = (): string => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};


const getOTPExpiry = (): Date => {
    const minutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "10");
    return new Date(Date.now() + minutes * 60 * 1000);
};

export const signup = async (req: Request, res: Response): Promise<void> => {
   try {
    const {name, email, phone, password, referral_code} = req.body;

    if (!name || (!email && !phone)){
        res.status(400).json({
            success: false,
            message: "Name and at least one contact method (email or phone) are required"
        });
        return;
    }

    if (!password){
        res.status(400).json({
            success: false,
            message: "Password is required"
        });
        return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
        res.status(400).json({
            success: false,
            message: "Invalid email address"
        });
        return;
    }

    if (email){
        const emailExists = await User.findOne({email});
        if (emailExists){
            res.status(400).json({
                success: false,
                message: "Email already exists"
            });
            return;
        }
    }

    if (phone){
        const phoneExists = await User.findOne({phone});
        if (phoneExists){
            res.status(400).json({
                success: false,
                message: "Phone number already exists"
            });
            return;
        }
    }

    // validate referral code if provided
    let referralWarning: string | null = null;
    if (referral_code){
        const referralExists = await User.findOne({referral_code});
        if (!referralExists){
            referralWarning = "Referral code is invalid. Signup will proceed without referral bonus"
        }
    }

    const otp = generateOTP();
    const otp_expires = getOTPExpiry();

    // create user
    const user = await User.create({
        name,
        email: email ? email.toLowerCase() : undefined,
        phone,
        password,
        referral_code: referral_code || undefined,
        otp,
        otp_expires_at: otp_expires,
        is_verified: false
    });

    if (email) {
      await sendOTPEmail(name, email, otp);
    };


    res.status(201).json({
        success: true,
        message: "User created successfully. Please verify your account with the OTP sent to your email.",
        ...referralWarning && {warning: referralWarning},
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            is_verified: user.is_verified,
        },

    });
    
   } catch (error) {
    console.log(error);
    res.status(500).json({
        success: false,
        message: "Internal server error. Could not create account."
    });
   }
}

// POST /api/verify-otp - verify user OTP   
export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, otp} = req.body;

        if (!otp){
            res.status(400).json({
                success: false,
                message: "OTP is required"
            });
            return;
        }

        if (!email){
            res.status(400).json({
                success: false,
                message: "Email is required"
            });
            return;
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user){
            res.status(404).json({
                success: false,
                message: "No account found with this email address."
            });
            return;
        }

        if (user.is_verified){
            res.status(400).json({
                success: false,
                message: "User is already verified"
            });
            return;
        }

        if (user.otp !== otp){
            res.status(400).json({
                success: false,
                message: "Invalid OTP. Please check and try again"
            });
            return;
        }

        if (!user.otp_expires_at || user.otp_expires_at < new Date()){
            res.status(400).json({
                success: false,
                message: "OTP has expired. Please request a new one."
            });
            return;
        }

        user.is_verified = true;
        user.otp = undefined;
        user.otp_expires_at = undefined;

        await user.save();

        res.status(200).json({
            success: true,
            message: "User verified successfully. Welcome to Chuks Kitchen!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                is_verified: user.is_verified,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error. Could not verify account."
        });
    }
}


//  POST /api/resend-otp - resend OTP to user
export const resendOTP = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email} = req.body;

        if (!email){
            res.status(400).json({
                success: false,
                message: "Email is required"
            });
            return;
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        });

        if (!user){
            res.status(404).json({
                success: false,
                message: "No account found with this email address."
            });
            return;
        }

        if (user.is_verified){
            res.status(400).json({
                success: false,
                message: "User is already verified"
            });
            return;
        }

        const otp = generateOTP();
        const otp_expires = getOTPExpiry();

        user.otp = otp;
        user.otp_expires_at = otp_expires;

        await user.save();

        if (email) {
            await sendResetPasswordEmail(user.name, email, otp);
        };

        res.status(200).json({
            success: true,
            message: "OTP resent successfully. Please check your email.",
            otp,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error. Could not resend OTP."
        });
    }
}


// POST /api/login - user login
export const signin = async (req: Request, res: Response): Promise<void> => {
    try {
        const {email, password} = req.body;

        if (!email || !password){
            res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
            return;
        }

        const user = await User.findOne({
            email: email.toLowerCase()
        }).select("+password");

        if (!user){
            res.status(404).json({
                success: false,
                message: "No account found with this email address."
            });
            return;
        }

        // checks if user is verified
        if (!user.is_verified){
            res.status(400).json({
                success: false,
                message: "User is not verified. Please verify your account."
            });
            return;
        }

        // checks if password is valid
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid){
            res.status(401).json({
                success: false,
                message: "Incorrect password. please try again"
            });
            return;
        }

        // signin successful
        res.status(200).json({
            success: true,
            message: "Signin successful. Welcome back!",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                is_verified: user.is_verified,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error. Could not login."
        });
    }
}


// GET /api/users/me - get current user profile
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const {id} = req.params;

        // exclude sensitive data from response
        const user = await User.findById(id).select("-password -otp -otp_expires_at");

        // checks if user exists
        if (!user){
            res.status(404).json({
                success: false,
                message: "User not found"
            });
            return;
        }
        
        res.status(200).json({
            success: true,
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Internal server error. Could not get user profile."
        });
    }
}

