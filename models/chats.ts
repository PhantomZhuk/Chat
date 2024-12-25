import mongoose from "mongoose";

const chatShema = new mongoose.Schema({
    nameChat: String,
    filename: String,
    path: String,
    uploadDate: { type: Date, default: Date.now },
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