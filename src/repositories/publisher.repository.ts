import { getRepository, Like } from "typeorm";
import { Publisher } from "../models";

export interface IPublisherPayload {
  name: String;
  slug: String;
}

export interface IResponse {
  message: String;
}

export const getPublishers = async (): Promise<Array<Publisher>> => {
  const publisherRepository = getRepository(Publisher);
  return publisherRepository.find();
};

export const getSearchPublishers = async (keyword: string, skip: number, limit: number): Promise<Array<Publisher>> => {

  const publisherRepository = getRepository(Publisher);

  return publisherRepository.find( { 
    where: {name: Like('%' + keyword + '%')}, 

  } );

};

export const createPublisher = async (payload: IPublisherPayload): Promise<Publisher> => {
  const publisherRepository = getRepository(Publisher);
  const publisher = new Publisher();
  return publisherRepository.save({
    ...publisher,
    ...payload,
  });
};

export const getPublisher = async (id: number): Promise<Publisher | null> => {
  const publisherRepository = getRepository(Publisher);
  const publisher = await publisherRepository.findOne({ id: id });
  if (!publisher) return null;
  return publisher;
};

export const updatePublisher = async (id: number, payload: IPublisherPayload): Promise<Publisher | null> => {
  const publisherRepository = getRepository(Publisher);
  const publisher = await publisherRepository.findOne({ id: id });
  if (!publisher) return null;
  publisher.name = payload.name;
  publisher.slug = payload.slug;
  await publisherRepository.update(
    { id: id },
    publisher,
  )
  if (!publisher) return null;
  return publisher;
};

export const deletePublisher = async (id: number): Promise<Publisher | null> => {
  const publisherRepository = getRepository(Publisher);
  const publisher = await publisherRepository.findOne({ id: id });
  if (!publisher) return null;
  await publisherRepository.delete({ id: id });
  return publisher;
};