import express from "express";
import passport from "passport";
import PingController from "../controllers/ping";
import AuthRouter from "./auth.router";
import UserRouter  from "./user.router";
import ArtistRouter  from "./artist.router";
import AlbumRouter  from "./album.router";
import CategoryRouter from "./category.router";
import TrackRouter from "./track.router";
import KeyRouter from "./key.router";
import PublisherRouter from "./publisher.router";
import { Passport } from "../middleware";


const router = express.Router();

Passport(passport);

router.get("/ping", async (_req, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});

router.use("/auth", AuthRouter);
router.use("/users", UserRouter);
router.use("/artists", ArtistRouter);
router.use("/albums", AlbumRouter);
router.use("/categories", CategoryRouter);
router.use("/tracks", TrackRouter);
router.use("/keys", KeyRouter);
router.use("/publishers", PublisherRouter);
export default router;