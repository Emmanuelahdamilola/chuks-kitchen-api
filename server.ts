import express from "express";
import { config } from "@/config";

import app from "@/app";
import { connectDB } from "@/config/db";



// home route
app.get('/', (req, res) => {
    res.json({message: "Welcome to Chuks Kitchen API"});
})


const startServer = async(): Promise<void> => {
    try {
        await connectDB();
        app.listen(config.port, () => {
            console.log(`Server is running on http://localhost:${config.port}`);
        });
    } catch (error) {
        console.error("Server failed to start:", error);
        process.exit(1);
    }
}   

startServer();



