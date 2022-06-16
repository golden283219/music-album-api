import { Get, Route, Tags, Post, Put, Delete, Body, Path, Security, Header } from "tsoa";
import { Key } from "../models";
import {
  getKeys,
  createKey,
  IKeyPayload,
  getKey,
  updateKey,
  deleteKey,
} from "../repositories/key.repository";

@Route("/api/v1/keys")
@Tags("Key")
export default class KeyController {
  @Security('jwt')
  @Get()
  public async getKeys(): Promise<Array<Key>> {
    return getKeys();
  }

  @Security('jwt')
  @Post("/")
  public async createKey(@Body() body: IKeyPayload): Promise<Key> {
    return createKey(body);
  }
  
  @Security('jwt')
  @Get("/:id")
  public async getKey(@Path() id: string): Promise<Key | null> {
    return getKey(Number(id));
  }

  @Security('jwt')
  @Put("/:id")
  public async updateKey(@Path() id: string, @Body() body: IKeyPayload): Promise<Key | null> {
    return updateKey(Number(id), body);
  }

  @Security('jwt')
  @Delete("/:id")
  public async deleteKey(@Path() id: string): Promise<Key | null> {
    return deleteKey(Number(id));
  }
}