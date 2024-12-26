import mongoose from "mongoose";

const chatShema = new mongoose.Schema({
    nameChat: String,
    iconFilename: String,
    admin: String,
    chatType: String,
    users: [String],
    messages: [
        {
            message: String,
            userId: mongoose.Schema.Types.ObjectId
        }
    ]
})

export const Chats = mongoose.model("Chat", chatShema);