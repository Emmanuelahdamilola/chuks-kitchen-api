// user types
export interface IUser{
    name: string;
    email?: string;
    phone?: string;
    referral_code?: string;
    otp?: string;
    otp_expires_at?: Date;
    is_verified?: boolean;
}

// food types
export interface IFoodItem{
    name: string;
    description: string;
    price: number;
    category: string;
    is_available: boolean;
    image_url?: string;
    date_added: Date;
    date_updated: Date;
}

// cart Item types
export interface ICartItem{
    food_id: string;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;

}

// cart types
export interface ICart{
    user_id: string;
    items: ICartItem[];
}

// order types
export interface IOrder{
    user_id: string;
    items: ICartItem[];
    total_amount: number;
    status: "Pending" | "Confirmed" | "Preparing" | "Out for Delivery" | "Completed" | "Cancelled";
    date_created: Date;
    date_updated: Date;
}

