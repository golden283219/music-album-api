import express from "express";
import AlbumController from "../controllers/album.controller";
import { Validator } from "../middleware"
import {
  create,
  getAll,
  getPickedAlbums,
  getGenreAlbums,
  getOne,
  getSlug,
  update,
  destroy,
  search,
} from "../schema/album.schema"

const router = express.Router();

router.get("/", Validator(getAll, "query"), async (req, res) => {
  console.log(req.query);
  const controller = new AlbumController();
  const response = await controller.getAlbums(req.query.skip.toString(), req.query.limit.toString(), req.query.publisher.toString(), req.query.artist.toString());
  //return res.status(201).send(response);
  return res.json({albums: response, albumCount: response.length});
});

router.get("/featured-albums", Validator(getAll, "query"), async (req, res) => {
  const controller = new AlbumController();
  const response = await controller.getFeaturedAlbums();
  //return res.status(201).send(response);
  return res.json({albums: response});
});

router.get("/top-albums", Validator(getAll, "query"), async (req, res) => {
  const controller = new AlbumController();
  const response = await controller.getTopAlbums();
  //return res.status(201).send(response);
  return res.json({albums: response});
});

router.get("/vinyl-albums", Validator(getAll, "query"), async (req, res) => {
  const controller = new AlbumController();
  const response = await controller.getVinylAlbums();
  return res.status(201).send(response);
});

router.get("/bandcamp-albums", Validator(getAll, "query"), async (req, res) => {
  const controller = new AlbumController();
  const response = await controller.getBandcampAlbums();
  return res.status(201).send(response);
});

router.get("/picked-albums", Validator(getPickedAlbums, "query"), async (req, res) => {
  console.log(req.query);
  const controller = new AlbumController();
  const response = await controller.getPickedAlbums(req.query.type.toString(), req.query.skip.toString(), req.query.limit.toString(), req.query.publisher.toString());
  //return res.status(201).send(response);
  return res.json({albums: response, albumCount: response.length});
});

router.get("/genre-albums/:slug", Validator(getGenreAlbums, "query"), async (req, res) => {
  console.log(req.query);
  const controller = new AlbumController();
  const response = await controller.getGenreAlbums(req.params.slug, req.query.skip.toString(), req.query.limit.toString());
  //return res.status(201).send(response);
  return res.json({albums: response, albumCount: response.length});
});

router.get("/search", Validator(search, "query"), async (req, res) => {

  const search_mode_value = "Albums matching with " + req.query.keyword.toString();
  const controller = new AlbumController();
  const response = await controller.getSearchAlbums(req.query.keyword.toString(), req.query.skip.toString(), req.query.limit.toString());
  //return res.status(201).send(response);
  return res.json({albums: response, albumCount: response.length, search_mode_value});
});

router.post("/", Validator(create, "body"), async (req, res) => {
  const controller = new AlbumController();
  const response = await controller.createAlbum(req.body);
  if (response.message) return res.status(502).send({ message: response.message });
  return res.status(200).send(response);
});

// router.get("/:id", Validator(getOne, "params"), async (req, res) => {
//   const controller = new AlbumController();
//   const response = await controller.getOneAlbum(req.params.id);
//   if (!response) return res.status(404).send({ message: "No post found" });
//   return res.send(response);
// });

router.get("/:slug", Validator(getSlug, "params"), async (req, res) => {
  const controller = new AlbumController();
  const response = await controller.getOneAlbum(req.params.slug);
  if (!response) return res.status(404).send({ message: "No album found" });
  //return res.send(response);
  return res.json({album: response});
});

router.put("/:id", Validator(update, "body"), async (req, res) => {
  const controller = new AlbumController();
  const response = await controller.updateAlbum(req.params.id, req.body);
  if (!response) return res.status(404).send({ message: "No album found" });
  return res.status(200).send({ message: "Updated" });
});

router.delete("/:id", Validator(destroy, "params"), async (req, res) => {
  const controller = new AlbumController();
  const response = await controller.deleteAlbum(req.params.id);
  if (!response) return res.status(404).send({ message: "No album found" });
  return res.status(200).send({ message: "Deleted" });
});

export default router;