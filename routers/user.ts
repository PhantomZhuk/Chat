import controllers from "../controllers/user.ts";
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
    .post(`/changeName/:id`, controllers.changeName)
    .post(`/uploadUserIcon`, upload.single('file'), controllers.uploadUserIcon)

export default router;