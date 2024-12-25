import controllers from "../controllers/chat";
import express from "express";
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage: storage });

const router = express
    .Router()
    .get(`/mainChatMessages`, controllers.mainChatMessages)
    .get(`/allChats`, controllers.Allchats)
    .post(`/createChat`, upload.single('file'), controllers.createChat)
    .post(`/addChatToUser`, controllers.addChatToUser)
    .delete(`/deleteChata`, controllers.deleteChats)
    .put(`/changeChat`, controllers.changeChat)
    .post(`/addChatToUser`, controllers.addChatToUser)
    .post(`/deleteMessages`, controllers.deleteMessages)
    .post(`/createUserChat`, controllers.createUserChat);

export default router;