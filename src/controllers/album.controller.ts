import { Get, Route, Tags, Post as PostMethod, Put, Delete, Body, Path, Security, Query } from "tsoa";
import { Album } from "../models";
import {
  createAlbum,
  getAlbums,
  getFeaturedAlbums,
  getTopAlbums,
  getVinylAlbums,
  getBandcampAlbums,
  getPickedAlbums,
  getGenreAlbums,
  IAlbumPayload,
  //getAlbum,
  getOneAlbum,
  updateAlbum,
  deleteAlbum,
} from "../repositories/album.repository";

@Route("/api/v1/albums")
@Tags("Album")
export default class AlbumController {
  //@Security('jwt')
  @Get("")
  public async getAlbums(@Query() skip: string, @Query() limit: string, @Query() publisher: string): Promise<Array<Album>> {
    return getAlbums(Number(skip), Number(limit), publisher);
  }

  //@Security('jwt')
  @Get("featured-albums")
  public async getFeaturedAlbums(): Promise<Array<Album>> {
    return getFeaturedAlbums();
  }

  //@Security('jwt')
  @Get("top-albums")
  public async getTopAlbums(): Promise<Array<Album>> {
    return getTopAlbums();
  }

  //@Security('jwt')
  @Get("vinyl-albums")
  public async getVinylAlbums(): Promise<Array<Album>> {
    return getVinylAlbums();
  }

  //@Security('jwt')
  @Get("bandcamp-albums")
  public async getBandcampAlbums(): Promise<Array<Album>> {
    return getBandcampAlbums();
  }

  //@Security('jwt')
  @Get("picked-albums")
  public async getPickedAlbums(@Query() type: string, @Query() skip: string, @Query() limit: string, @Query() publisher: string): Promise<Array<Album>> {
    return getPickedAlbums(type, Number(skip), Number(limit), publisher);
  }

  //@Security('jwt')
  @Get("genre-albums/:slug")
  public async getGenreAlbums(@Path() slug: string, @Query() skip: string, @Query() limit: string): Promise<Array<Album>> {
    return getGenreAlbums(slug, Number(skip), Number(limit));
  }

  //@Security('jwt')
  @PostMethod("/")
  public async createAlbum(@Body() body: IAlbumPayload): Promise<Album> {
    return createAlbum(body);
  }

  // //@Security('jwt')
  // @Get("/:id")
  // public async getAlbum(@Path() id: string): Promise<Album | null> {
  //   return getAlbum(Number(id));
  // }

  //@Security('jwt')
  @Get("/:slug")
  public async getOneAlbum(@Path() slug: string): Promise<Album | null> {
    return getOneAlbum(String(slug));
  }
  

  //@Security('jwt')
  @Put("/:id")
  public async updateAlbum(@Path() id: string, @Body() body: IAlbumPayload): Promise<Album | null> {
    return updateAlbum(Number(id), body);
  }

  //@Security('jwt')
  @Delete("/:id")
  public async deleteAlbum(@Path() id: string): Promise<Album | null> {
    return deleteAlbum(Number(id));
  }
}