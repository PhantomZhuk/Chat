import mongoose from "mongoose";

const mainChatMessage = new mongoose.Schema({
    message: String,
    userId: String
})

export const meinChatMessages = mongoose.model("mainChatMessage", mainChatMessage);