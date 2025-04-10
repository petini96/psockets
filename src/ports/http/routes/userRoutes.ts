import express from "express"
import * as UserController from "../controllers/UserController"
import multer from 'multer';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

export const userRoutes = express.Router()

userRoutes.get("/users", UserController.show)
userRoutes.get("/users/:id", UserController.show)
userRoutes.post("/users", upload.single('file'), UserController.store)
