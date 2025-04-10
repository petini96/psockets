import express from "express";
import * as ChoiceController from "../controllers/ChoiceController";

export const choiceRoutes = express.Router();

choiceRoutes.get("/" , ChoiceController.index);
choiceRoutes.post("/" , ChoiceController.store);
choiceRoutes.post("/:id/vote", ChoiceController.vote);