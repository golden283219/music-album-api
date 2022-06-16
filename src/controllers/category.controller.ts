import { Get, Route, Tags, Post, Put, Delete, Body, Path, Security, Header } from "tsoa";
import { Category } from "../models";
import {
  getCategories,
  createCategory,
  ICategoryPayload,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../repositories/category.repository";

@Route("/api/v1/categories")
@Tags("Category")
export default class CategoryController {
  @Security('jwt')
  @Get()
  public async getCategories(): Promise<Array<Category>> {
    return getCategories();
  }

  @Security('jwt')
  @Post("/")
  public async createCategory(@Body() body: ICategoryPayload): Promise<Category> {
    return createCategory(body);
  }
  
  @Security('jwt')
  @Get("/:id")
  public async getCategory(@Path() id: string): Promise<Category | null> {
    return getCategory(Number(id));
  }

  @Security('jwt')
  @Put("/:id")
  public async updateCategory(@Path() id: string, @Body() body: ICategoryPayload): Promise<Category | null> {
    return updateCategory(Number(id), body);
  }

  @Security('jwt')
  @Delete("/:id")
  public async deleteCategory(@Path() id: string): Promise<Category | null> {
    return deleteCategory(Number(id));
  }
}