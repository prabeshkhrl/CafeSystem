import express from "express";
import { addMenuItem, deleteItem, getAllMenuItem, getById, updateItem } from "../controllers/MenuController.js";

const menuRouter = express.Router();


menuRouter.get("/items", getAllMenuItem);

menuRouter.post("/addItem",addMenuItem);

menuRouter.get("/item/:id", getById);

menuRouter.patch("/item/:id", updateItem);

menuRouter.delete('/item/:id', deleteItem);
export default menuRouter;
