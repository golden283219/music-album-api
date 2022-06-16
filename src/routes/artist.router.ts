import express from "express";
import ArtistController from "../controllers/artist.controller";
import { Validator } from "../middleware"
import {
  create,
  getAll,
  getOne,
  update,
  destroy,
} from "../schema/artist.schema"

const router = express.Router();

router.get("/", Validator(getAll, "query"), async (_req, res) => {
  const controller = new ArtistController();
  const response = await controller.getArtists();
  return res.status(200).send(response);
});

router.post("/", Validator(create, "body"), async (req, res) => {
  const controller = new ArtistController();
  const response = await controller.createArtist(req.body);
  return res.status(201).send(response);
});

router.get("/:id", Validator(getOne, "params"), async (req, res) => {
  const controller = new ArtistController();
  const response = await controller.getArtist(req.params.id);
  if (!response) return res.status(404).send({ message: "No user found" });
  return res.status(200).send(response);
});

router.put("/:id", Validator(update, "body"), async (req, res) => {
  const controller = new ArtistController();
  const response = await controller.updateArtist(req.params.id, req.body);
  if (!response) return res.status(404).send({ message: "No user found" });
  return res.status(200).send({ message: "Updated" });
});

router.delete("/:id", Validator(destroy, "params"), async (req, res) => {
  const controller = new ArtistController();
  const response = await controller.deleteArtist(req.params.id);
  if (!response) return res.status(404).send({ message: "No user found" });
  return res.status(200).send({ message: "Deleted" });
});

export default router;