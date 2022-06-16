import express from "express";
import CategoryController from "../controllers/category.controller";
import { Validator } from "../middleware"
import {
  create,
  getAll,
  getOne,
  update,
  destroy,
} from "../schema/category.schema"

const router = express.Router();

router.get("/", Validator(getAll, "query"), async (_req, res) => {
  const controller = new CategoryController();
  const response = await controller.getCategories();
  //return res.status(200).send(response);
  return res.json({categories: response});
});

router.post("/", Validator(create, "body"), async (req, res) => {
  const controller = new CategoryController();
  const response = await controller.createCategory(req.body);
  return res.status(201).send(response);
});

router.get("/:id", Validator(getOne, "params"), async (req, res) => {
  const controller = new CategoryController();
  const response = await controller.getCategory(req.params.id);
  if (!response) return res.status(404).send({ message: "No user found" });
  return res.status(200).send(response);
});

router.put("/:id", Validator(update, "body"), async (req, res) => {
  const controller = new CategoryController();
  const response = await controller.updateCategory(req.params.id, req.body);
  if (!response) return res.status(404).send({ message: "No user found" });
  return res.status(200).send({ message: "Updated" });
});

router.delete("/:id", Validator(destroy, "params"), async (req, res) => {
  const controller = new CategoryController();
  const response = await controller.deleteCategory(req.params.id);
  if (!response) return res.status(404).send({ message: "No user found" });
  return res.status(200).send({ message: "Deleted" });
});

export default router;