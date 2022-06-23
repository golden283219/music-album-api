import express from "express";
import PublisherController from "../controllers/publisher.controller";
import { Validator } from "../middleware"
import {
  create,
  getAll,
  getOne,
  update,
  destroy,
  search,
} from "../schema/publisher.schema"

const router = express.Router();

router.get("/", Validator(getAll, "query"), async (req, res) => {
  const controller = new PublisherController();
  const response = await controller.getPublishers();
  //return res.status(200).send(response);
  return res.json({labels: response.slice(Number(req.query.skip), Number(req.query.skip) + Number(req.query.limit)), labelCount: response.length});
});

router.get("/search", Validator(search, "query"), async (req, res) => {

  const search_mode_value = "Publishers matching with " + req.query.keyword.toString();
  const controller = new PublisherController();
  const response = await controller.getSearchPublishers(req.query.keyword.toString(), req.query.skip.toString(), req.query.limit.toString());
  //return res.status(201).send(response);
  return res.json({labels: response.slice(Number(req.query.skip), Number(req.query.skip) + Number(req.query.limit)), labelCount: response.length, search_mode_value});
});

router.post("/", Validator(create, "body"), async (req, res) => {
  const controller = new PublisherController();
  const response = await controller.createPublisher(req.body);
  return res.status(201).send(response);
});

router.get("/:id", Validator(getOne, "params"), async (req, res) => {
  const controller = new PublisherController();
  const response = await controller.getPublisher(req.params.id);
  if (!response) return res.status(404).send({ message: "No user found" });
  return res.status(200).send(response);
});

router.put("/:id", Validator(update, "body"), async (req, res) => {
  const controller = new PublisherController();
  const response = await controller.updatePublisher(req.params.id, req.body);
  if (!response) return res.status(404).send({ message: "No user found" });
  return res.status(200).send({ message: "Updated" });
});

router.delete("/:id", Validator(destroy, "params"), async (req, res) => {
  const controller = new PublisherController();
  const response = await controller.deletePublisher(req.params.id);
  if (!response) return res.status(404).send({ message: "No user found" });
  return res.status(200).send({ message: "Deleted" });
});

export default router;