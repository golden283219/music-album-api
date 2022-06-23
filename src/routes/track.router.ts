import express from "express";

import TrackController from "../controllers/track.controller";
import { Validator } from "../middleware"
import {
  create,
  upload,
  getAll,
  getOne,
  update,
  destroy,
  search,
  getGenreTracks,
} from "../schema/track.schema"

const router = express.Router();

router.get("/", Validator(getAll, "query"), async (req, res) => {
  const controller = new TrackController();
  //console.log(req.query);
  const pickType = req.query.picktype.toString();
  const skip = req.query.skip.toString();
  const limit = req.query.limit.toString();
  const keyword = req.query.keyword.toString();
  const publisherSlug = req.query.publisherslug.toString();
  const artistSlug = req.query.artistslug.toString();
  const title = req.query.title.toString();
  const genre = req.query.genre.toString();
  const bpmlow = req.query.bpmlow.toString();
  const bpmhigh = req.query.bpmhigh.toString();
  const key = req.query.key.toString();
  const label = req.query.label.toString();
  const artist = req.query.artist.toString();

  const response = await controller.getTracks(pickType, skip, limit, keyword, publisherSlug, artistSlug, title, bpmlow, bpmhigh, key, genre, label, artist);
  //return res.status(200).send(response);
  return res.json({tracks: response.slice(Number(req.query.skip), Number(req.query.skip) + Number(req.query.limit)), trackCount: response.length});
});

router.get("/search", Validator(search, "query"), async (req, res) => {

  const search_mode_value = "Tracks matching with " + req.query.keyword.toString();
  const controller = new TrackController();
  const response = await controller.getSearchTracks(req.query.keyword.toString(), req.query.skip.toString(), req.query.limit.toString());
  //return res.status(201).send(response);
  return res.json({tracks: response.slice(Number(req.query.skip), Number(req.query.skip) + Number(req.query.limit)), trackCount: response.length, search_mode_value});
});

router.get("/genre-tracks/:slug", Validator(getGenreTracks, "query"), async (req, res) => {

  const controller = new TrackController();
  const response = await controller.getGenreTracks(req.params.slug, req.query.skip.toString(), req.query.limit.toString());
  //return res.status(201).send(response);
  return res.json({tracks: response.slice(Number(req.query.skip), Number(req.query.skip) + Number(req.query.limit)), trackCount: response.length});
});

router.post("/uploadBulk", Validator(upload, "body"), async (req, res) => {
  const controller = new TrackController();
  const response = await controller.uploadBulk(req.body);
  return res.status(201).send(response);
});

router.post("/", Validator(create, "body"), async (req, res) => {
  const controller = new TrackController();
  const response = await controller.createTrack(req.body);
  return res.status(201).send(response);
});

router.get("/:slug", Validator(getOne, "params"), async (req, res) => {
  const controller = new TrackController();
  const response = await controller.getTrack(req.params.slug);
  if (!response) return res.status(404).send({ message: "No Track found" });
  //return res.status(200).send(response);
  return res.json({album: response});
});

router.put("/:id", Validator(update, "body"), async (req, res) => {
  const controller = new TrackController();
  const response = await controller.updateTrack(req.params.id, req.body);
  if (!response) return res.status(404).send({ message: "No Track found" });
  return res.status(200).send({ message: "Updated" });
});

router.delete("/:id", Validator(destroy, "params"), async (req, res) => {
  const controller = new TrackController();
  const response = await controller.deleteTrack(req.params.id);
  if (!response) return res.status(404).send({ message: "No Track found" });
  return res.status(200).send({ message: "Deleted" });
});

export default router;