import express from "express";
import passport from "passport";
import PingController from "../controllers/ping";
import AuthRouter from "./auth.router";
import UserRouter  from "./user.router";
import PostRouter  from "./post.router";
import CommentRouter  from "./comment.router";
import ArtistRouter  from "./artist.router";
import AlbumRouter  from "./album.router";
import CategoryRouter from "./category.router"
import TrackRouter from "./track.router"
import KeyRouter from "./key.router"
import { Passport } from "../middleware";


const router = express.Router();

Passport(passport);

router.get("/ping", async (_req, res) => {
  const controller = new PingController();
  const response = await controller.getMessage();
  return res.send(response);
});

router.use("/auth", AuthRouter);
router.use("/users", passport.authenticate('jwt', {session:false}), UserRouter);
router.use("/posts", passport.authenticate('jwt', {session:false}), PostRouter);
router.use("/comments", passport.authenticate('jwt', {session:false}), CommentRouter);
router.use("/artists", passport.authenticate('jwt', {session:false}), ArtistRouter);
router.use("/albums", AlbumRouter);
router.use("/categories", CategoryRouter);
router.use("/tracks", TrackRouter);
router.use("/keys", KeyRouter);

export default router;