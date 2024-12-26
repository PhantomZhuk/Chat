import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    login: String,
    email: String,
    password: String,
    iconFilename: String,
    chats: [String]
})

export const Users = mongoose.model("Users", userSchema);