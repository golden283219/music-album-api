import { getRepository } from "typeorm";
import { Category } from "../models";

export interface ICategoryPayload {
  name: String;
  slug: String;
}

export interface IResponse {
  message: String;
}

export const getCategories = async (): Promise<Array<Category>> => {
  const categoryRepository = getRepository(Category);
  return categoryRepository.find();
};

export const createCategory = async (payload: ICategoryPayload): Promise<Category> => {
  const categoryRepository = getRepository(Category);
  const category = new Category();
  return categoryRepository.save({
    ...category,
    ...payload,
  });
};

export const getCategory = async (id: number): Promise<Category | null> => {
  const categoryRepository = getRepository(Category);
  const user = await categoryRepository.findOne({ id: id });
  if (!user) return null;
  return user;
};

export const updateCategory = async (id: number, payload: ICategoryPayload): Promise<Category | null> => {
  const categoryRepository = getRepository(Category);
  const category = await categoryRepository.findOne({ id: id });
  if (!category) return null;
  category.name = payload.name;
  category.slug = payload.slug;
  await categoryRepository.update(
    { id: id },
    category,
  )
  if (!category) return null;
  return category;
};

export const deleteCategory = async (id: number): Promise<Category | null> => {
  const categoryRepository = getRepository(Category);
  const category = await categoryRepository.findOne({ id: id });
  if (!category) return null;
  await categoryRepository.delete({ id: id });
  return category;
};