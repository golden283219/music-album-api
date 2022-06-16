import { getRepository } from "typeorm";
import { Artist } from "../models";

export interface IArtistPayload {
  name: String;
  slug: String;
}

export interface IResponse {
  message: String;
}

export const getArtists = async (): Promise<Array<Artist>> => {
  const artistRepository = getRepository(Artist);
  return artistRepository.find();
};

export const createArtist = async (payload: IArtistPayload): Promise<Artist> => {
  const artistRepository = getRepository(Artist);
  const artist = new Artist();
  return artistRepository.save({
    ...artist,
    ...payload,
  });
};

export const getArtist = async (id: number): Promise<Artist | null> => {
  const artistRepository = getRepository(Artist);
  const artist = await artistRepository.findOne({ id: id });
  if (!artist) return null;
  return artist;
};

export const updateArtist = async (id: number, payload: IArtistPayload): Promise<Artist | null> => {
  const artistRepository = getRepository(Artist);
  const artist = await artistRepository.findOne({ id: id });
  if (!artist) return null;
  artist.name = payload.name;
  artist.slug = payload.slug;
  await artistRepository.update(
    { id: id },
    artist,
  )
  if (!artist) return null;
  return artist;
};

export const deleteArtist = async (id: number): Promise<Artist | null> => {
  const artistRepository = getRepository(Artist);
  const artist = await artistRepository.findOne({ id: id });
  if (!artist) return null;
  await artistRepository.delete({ id: id });
  return artist;
};