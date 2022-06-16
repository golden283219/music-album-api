import { getRepository } from "typeorm";
import { Key } from "../models";

export interface IKeyPayload {
  name: String;
  slug: String;
}

export interface IResponse {
  message: String;
}

export const getKeys = async (): Promise<Array<Key>> => {
  const keyRepository = getRepository(Key);
  return keyRepository.find();
};

export const createKey = async (payload: IKeyPayload): Promise<Key> => {
  const keyRepository = getRepository(Key);
  const key = new Key();
  return keyRepository.save({
    ...key,
    ...payload,
  });
};

export const getKey = async (id: number): Promise<Key | null> => {
  const keyRepository = getRepository(Key);
  const key = await keyRepository.findOne({ id: id });
  if (!key) return null;
  return key;
};

export const updateKey = async (id: number, payload: IKeyPayload): Promise<Key | null> => {
  const keyRepository = getRepository(Key);
  const key = await keyRepository.findOne({ id: id });
  if (!key) return null;
  key.name = payload.name;
  key.slug = payload.slug;
  await keyRepository.update(
    { id: id },
    key,
  )
  if (!key) return null;
  return key;
};

export const deleteKey = async (id: number): Promise<Key | null> => {
  const keyRepository = getRepository(Key);
  const key = await keyRepository.findOne({ id: id });
  if (!key) return null;
  await keyRepository.delete({ id: id });
  return key;
};