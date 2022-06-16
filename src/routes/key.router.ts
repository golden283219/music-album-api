import express from "express";
import KeyController from "../controllers/key.controller";
import { Validator } from "../middleware"
import {
  create,
  getAll,
  getOne,
  update,
  destroy,
} from "../schema/key.schema"

const router = express.Router();

router.get("/", Validator(getAll, "query"), async (_req, res) => {
  const controller = new KeyController();
  const response = await controller.getKeys();
  //return res.status(200).send(response);
  return res.json({keys: response});
});

router.post("/", Validator(create, "body"), async (req, res) => {
  const controller = new KeyController();
  const response = await controller.createKey(req.body);
  return res.status(201).send(response);
});

router.get("/:id", Validator(getOne, "params"), async (req, res) => {
  const controller = new KeyController();
  const response = await controller.getKey(req.params.id);
  if (!response) return res.status(404).send({ message: "No user found" });
  return res.status(200).send(response);
});

router.put("/:id", Validator(update, "body"), async (req, res) => {
  const controller = new KeyController();
  const response = await controller.updateKey(req.params.id, req.body);
  if (!response) return res.status(404).send({ message: "No user found" });
  return res.status(200).send({ message: "Updated" });
});

router.delete("/:id", Validator(destroy, "params"), async (req, res) => {
  const controller = new KeyController();
  const response = await controller.deleteKey(req.params.id);
  if (!response) return res.status(404).send({ message: "No user found" });
  return res.status(200).send({ message: "Deleted" });
});

export default router;