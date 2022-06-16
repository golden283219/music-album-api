import { Get, Route, Tags, Post, Put, Delete, Body, Path, Security, Header } from "tsoa";
import { Artist } from "../models";
import {
  getArtists,
  createArtist,
  IArtistPayload,
  getArtist,
  updateArtist,
  deleteArtist,
} from "../repositories/artist.repository";

@Route("/api/v1/artists")
@Tags("Artist")
export default class ArtistController {
  @Security('jwt')
  @Get()
  public async getArtists(): Promise<Array<Artist>> {
    return getArtists();
  }

  @Security('jwt')
  @Post("/")
  public async createArtist(@Body() body: IArtistPayload): Promise<Artist> {
    return createArtist(body);
  }
  
  @Security('jwt')
  @Get("/:id")
  public async getArtist(@Path() id: string): Promise<Artist | null> {
    return getArtist(Number(id));
  }

  @Security('jwt')
  @Put("/:id")
  public async updateArtist(@Path() id: string, @Body() body: IArtistPayload): Promise<Artist | null> {
    return updateArtist(Number(id), body);
  }

  @Security('jwt')
  @Delete("/:id")
  public async deleteArtist(@Path() id: string): Promise<Artist | null> {
    return deleteArtist(Number(id));
  }
}