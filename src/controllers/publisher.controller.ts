import { Get, Route, Tags, Post, Put, Delete, Body, Path, Security, Header, Query } from "tsoa";
import { Publisher } from "../models";
import {
  getPublishers,
  getSearchPublishers,
  createPublisher,
  IPublisherPayload,
  getPublisher,
  updatePublisher,
  deletePublisher,
} from "../repositories/publisher.repository";

@Route("/api/v1/publishers")
@Tags("Publisher")
export default class PublisherController {
  @Security('jwt')
  @Get()
  public async getPublishers(): Promise<Array<Publisher>> {
    return getPublishers();
  }

  //@Security('jwt')
  @Get("search")
  public async getSearchPublishers(@Query() keyword: string, @Query() skip: string, @Query() limit: string): Promise<Array<Publisher>> {
    return getSearchPublishers(keyword, Number(skip), Number(limit));
  }
  
  @Security('jwt')
  @Post("/")
  public async createPublisher(@Body() body: IPublisherPayload): Promise<Publisher> {
    return createPublisher(body);
  }
  
  @Security('jwt')
  @Get("/:id")
  public async getPublisher(@Path() id: string): Promise<Publisher | null> {
    return getPublisher(Number(id));
  }

  @Security('jwt')
  @Put("/:id")
  public async updatePublisher(@Path() id: string, @Body() body: IPublisherPayload): Promise<Publisher | null> {
    return updatePublisher(Number(id), body);
  }

  @Security('jwt')
  @Delete("/:id")
  public async deletePublisher(@Path() id: string): Promise<Publisher | null> {
    return deletePublisher(Number(id));
  }
}