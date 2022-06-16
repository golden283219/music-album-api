import { getRepository } from "typeorm";
import { Album, Category, Publisher } from "../models";

export interface IAlbumPayload {
  title: string;
  slug: string;
  artist_id: number;
}

export const getAlbums = async (skip: number, limit: number, publisher_slug: string): Promise<Array<Album>> => {
  const albumRepository = getRepository(Album);
  if(publisher_slug == ''){
    return albumRepository.find( { 
      relations: ['artist', 'category', 'publisher'],
      order: { created_at: 'DESC'},
      skip: skip,
      take: limit,
    } );
  }
  else{
    const publisherRepository = getRepository(Publisher);
    const publisher = await publisherRepository.findOne({slug: publisher_slug});
    return albumRepository.find( { 
      where: {publisher: publisher}, 
      relations: ['artist', 'category', 'publisher'],
      order: { created_at: 'DESC'},
      skip: skip,
      take: limit,
    } );
  }
};

export const getFeaturedAlbums = async (): Promise<Array<Album>> => {
  const albumRepository = getRepository(Album);
  return albumRepository.find( { 
    where: {featured: 1}, 
    relations: ['artist', 'category', 'publisher'],
    order: { id: 'DESC'},
    take: 20,
  } );
};

export const getTopAlbums = async (): Promise<Array<Album>> => {
  const albumRepository = getRepository(Album);
  return albumRepository.find( { 
    where: {top_album: 1}, 
    relations: ['artist', 'category', 'publisher'],
    order: { id: 'DESC'},
    take: 10,
  } );
};

export const getVinylAlbums = async (): Promise<Array<Album>> => {
  const albumRepository = getRepository(Album);
  return albumRepository.find( { 
    where: {vinyl_album: 1}, 
    relations: ['artist', 'category', 'publisher'],
    order: { id: 'DESC'},
    take: 10,
  } );
};

export const getBandcampAlbums = async (): Promise<Array<Album>> => {
  const albumRepository = getRepository(Album);
  return albumRepository.find( { 
    where: {bandcamp_album: 1}, 
    relations: ['artist', 'category', 'publisher'],
    order: { id: 'DESC'},
    take: 10,
  } );
};

export const getPickedAlbums = async (type: string, skip: number, limit: number, publisher: string): Promise<Array<Album>> => {
  console.log (type, skip, limit, publisher);
  const album_type = type == 'vinyl' ? 'vinyl_album' : 'bandcamp_album';
  const albumRepository = getRepository(Album);
  if(type == 'vinyl'){
    return albumRepository.find( { 
      where: {vinyl_album: 1}, 
      relations: ['artist', 'category', 'publisher', 'tracks'],
      order: { created_at: 'DESC'},
      skip: skip,
      take: limit,
    } );
  }
  else{
    return albumRepository.find( { 
      where: {bandcamp_album: 1}, 
      relations: ['artist', 'category', 'publisher', 'tracks'],
      order: { created_at: 'DESC'},
      skip: skip,
      take: limit,
    } );
  }
};

export const getGenreAlbums = async (slug: string, skip: number, limit: number): Promise<Array<Album>> => {
  const albumRepository = getRepository(Album);
  const categoryRepository = getRepository(Category);
  const category = await categoryRepository.findOne({slug: slug});
  if(slug == ''){
    return albumRepository.find( { 
      relations: ['artist', 'category', 'publisher'],
      order: { created_at: 'DESC'},
      skip: skip,
      take: limit,
    } );
  }
  else{
    return albumRepository.find( { 
      where: {category: category}, 
      relations: ['artist', 'category', 'publisher'],
      order: { created_at: 'DESC'},
      skip: skip,
      take: limit,
    } );
  }
};

export const createAlbum = async (payload: IAlbumPayload): Promise<Album> => {
  const albumRepository = getRepository(Album);
  const album = new Album();
  try {
    return await albumRepository.save({
      ...album,
      ...payload,
    });
  } catch (e) {
    console.log(e.message);
    album.message = e.message;
    return album;
  }
};

// export const getAlbum = async (id: number): Promise<Album | null> => {
//   const albumRepository = getRepository(Album);
//   const album = await albumRepository.findOne({ id: id });
//   if (!album) return null;
//   return album;
// };

export const getOneAlbum = async (slug: string): Promise<Album | null> => {
  const albumRepository = getRepository(Album);
  const album = await albumRepository.findOne({ 
    where: { slug: slug },
    relations: ['artist', 'category', 'publisher', 'tracks', 'tracks.artist', 'tracks.category'],
  });
  if (!album) return null;
  return album;
};

export const updateAlbum = async (id: number, payload: IAlbumPayload): Promise<Album | null> => {
  const albumRepository = getRepository(Album);
  const album = await albumRepository.findOne({ id: id });
  if (!album) return null;
  album.title = payload.title;
  album.slug = payload.slug;
  await albumRepository.update(
    { id: id },
    album,
  )
  if (!album) return null;
  return album;
};

export const deleteAlbum = async (id: number): Promise<Album | null> => {
  const albumRepository = getRepository(Album);
  const album = await albumRepository.findOne({ id: id });
  if (!album) return null;
  await albumRepository.delete({ id: id });
  return album;
};