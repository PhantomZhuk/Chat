import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    login: String,
    email: String,
    password: String,
    filename: String,
    path: String,
    uploadDate: { type: Date, default: Date.now },
    chats: [String]
})

export const User = mongoose.model("User", userSchema);