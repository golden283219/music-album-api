import Ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import md5 from "md5";
import path from "path";
import {exec} from "child_process";
import { Between, getRepository, In, Like } from "typeorm";
import secretConfig from "../config/secret";
import { Category, Track, Publisher, Language, Album, Artist } from "../models";
import { slugify } from "../utils/custom";
export interface ITrackPayload {
  title: String;
  slug: String;
}

export interface IUploadBulkPayload {
  uploadpath: String;
}

export interface IResponse {
  message: String;
}

export const getTracks = async (pickType: string, skip: number, limit: number, publisherSlug: string, artistSlug:string, title: string, bpmlow: number, bpmhigh: number, key: string, genre: string, label: string, artist: string): Promise<Array<Track>> => {
  const trackRepository = getRepository(Track);
  if(publisherSlug === ''){
    if(label !== ''){
      label = slugify(label);
    }
  }
  if(artistSlug === ''){
    if(artist !== ''){
      artist = slugify(artist);
    }
  }
  let pickTypeLow = 0, pickTypeHigh = 10;
  if(pickType === 'vinyl'){
    pickTypeLow = 1;
    pickTypeHigh = 1;
  }
  if(pickType === 'bandcamp'){
    pickTypeLow = 2;
    pickTypeHigh = 2;
  }
  if(pickType === 'master'){
    pickTypeLow = 2;
    pickTypeHigh = 4;
  }
  if(pickType === 'rip'){
    pickTypeLow = 3;
    pickTypeHigh = 5;
  }
  let findOptions;
  if(genre == ''){
    if(key == ''){
      findOptions = {
        album: { publisher: { slug: Like('%' + label + '%') }, vinyl_album: Between(pickTypeLow, pickTypeHigh) }, 
        title: Like('%' + title + '%'),
        artist: { slug: Like('%' + artist + '%'),} ,
        bpm: Between(bpmlow, bpmhigh),
      };
    }else{
      findOptions = {
        album: { publisher: { slug: Like('%' + label + '%') }, vinyl_album: Between(pickTypeLow, pickTypeHigh)  }, 
        title: Like('%' + title + '%'),
        artist: { slug: Like('%' + artist + '%'),} ,
        bpm: Between(bpmlow, bpmhigh),
        key: {id: In(key.split(','))},

      };
    }
  }
  else{
    if(key == ''){
      findOptions = {
        album: { publisher: { slug: Like('%' + label + '%') }, vinyl_album: Between(pickTypeLow, pickTypeHigh)  }, 
        title: Like('%' + title + '%'),
        artist: { slug: Like('%' + artist + '%'),} ,
        category: {id: In(genre.split(','))},
        bpm: Between(bpmlow, bpmhigh),

      };
    }else{
      findOptions = {
        album: { publisher: { slug: Like('%' + label + '%') }, vinyl_album: Between(pickTypeLow, pickTypeHigh)  }, 
        title: Like('%' + title + '%'),
        artist: { slug: Like('%' + artist + '%'),} ,
        bpm: Between(bpmlow, bpmhigh),
        category: {id: In(genre.split(','))},
        key: {id: In(key.split(','))},

      };
    }
  }
  return trackRepository.find( { 
    where: findOptions, 
    relations: ['artist', 'category', 'album', 'album.publisher', 'key'],
    order: { created_at: 'DESC'},
    skip: skip,
    take: limit,
  } );

};

export const getSearchTracks = async (keyword: string, skip: number, limit: number): Promise<Array<Track>> => {

  const trackRepository = getRepository(Track);

  return trackRepository.find( { 
    where: {search: Like('%' + keyword + '%')}, 
    relations: ['artist', 'category', 'album', 'album.publisher'],
    order: { created_at: 'DESC'},
    skip: skip,
    take: limit,
  } );

};

export const getGenreTracks = async (slug: string, skip: number, limit: number): Promise<Array<Track>> => {
  const trackRepository = getRepository(Track);
  const categoryRepository = getRepository(Category);
  const category = await categoryRepository.findOne({slug: slug});

  return trackRepository.find( { 
    where: {category: category}, 
    relations: ['artist', 'category', 'album', 'album.publisher'],
    order: { created_at: 'DESC'},
    skip: skip,
    take: limit,
  } );

};

export const uploadBulk = async (albumData: Map<string, string>): Promise<Track> => {
  const artistId = albumData.get("artistId");
  const albumId = albumData.get("albumId");
  const categoryId = albumData.get("categoryId");

  const trackRepository = getRepository(Track);
  let savedTrack = await trackRepository.findOne({
    where: { title: albumData.get("title")}
  });
  let slug = slugify('', 10);
  while(await trackRepository.findOne({
    where: { slug: slug}
  })){
    slug = slugify('', 10);
  }
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const d = new Date();
  let date = month[d.getMonth()] + d.getFullYear();
  let dir: string = md5(date);
  const mainDir = secretConfig.upload_path + '/audios/' + dir + '/';
  const waveFileDir = secretConfig.upload_path + '/audios/' + dir + '/wavefiles/';
  const orgFileDir = secretConfig.upload_path + '/audios/' + dir + '/org/';

  if(!fs.existsSync(path.resolve(mainDir))){
    fs.mkdirSync(mainDir)
  }

  if(!fs.existsSync(path.resolve(waveFileDir))){
    fs.mkdirSync(waveFileDir)
  }

  if(!fs.existsSync(path.resolve(orgFileDir))){
    fs.mkdirSync(orgFileDir)
  }

  const mp3copyTo = mainDir + slug + '.mp3';
  const srcFile = albumData.get('filename');
  // Ffmpeg(srcFile)
  //   .audioBitrate(96)
  //   .addInputOption('-map_metadata 0')
  //   .addInputOption('-threads 8')
  //   .addInputOption('-id3v2_version 3')
  //   .addInputOption('-write_id3v1 1')
  //   .addInput('copy')
  //   .output(mp3copyTo)
  //   .on('error', function (err, stdout, stderr) {
  //     console.log('Cannot create mp3 file: ' + srcFile + err.message);
  //   })
  //   .run();

  exec('ffmpeg -i ' + srcFile + ' -b:a 96k   -map_metadata 0 -threads 8 -id3v2_version 3 -write_id3v1 1 -c:v copy ' + mp3copyTo, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.log(err);
      return;
    }
  
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
  const pngCopyTo = waveFileDir + slug + '.png';
  // Ffmpeg(srcFile)
  //   .addInputOption('-filter_complex showwavespic=s=970x50:colors=#E3E3E3')
  //   .addInputOption('-vframes 1')
  //   .addInput('copy')
  //   .output(pngCopyTo)
  //   .on('error', function (err, stdout, stderr) {
  //     console.log('Cannot create wavefile: ' + srcFile + err.message);
  //   })
  //   .run();
  exec('ffmpeg -i ' + srcFile + ' -filter_complex showwavespic=s=970x50:colors=#E3E3E3 -frames:v 1 ' + pngCopyTo, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.log(err);
      return;
    }
  
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
  const ext: string = path.parse(srcFile).ext;
  if(ext == '.aiff'){
    const mp3copyTo = orgFileDir + slug + '.mp3';
    // Ffmpeg(srcFile)
    //   .audioBitrate(320)
    //   .addInputOption('-map_metadata 0')
    //   .addInputOption('-threads 8')
    //   .addInputOption('-id3v2_version 3')
    //   .addInputOption('-write_id3v1 1')
    //   .addInput('copy')
    //   .output(mp3copyTo)
    //   .on('error', function (err, stdout, stderr) {
    //     console.log('Cannot create orgFile: ' + srcFile + err.message);
    //   })
    //   .run();
    exec('ffmpeg -i ' + srcFile + ' -b:a 320k   -map_metadata 0 -threads 8 -id3v2_version 3 -write_id3v1 1 -c:v copy ' + mp3copyTo, (err, stdout, stderr) => {
      if (err) {
        // node couldn't execute the command
        console.log(err);
        return;
      }
    
      // the *entire* stdout and stderr (buffered)
      console.log(`stdout: ${stdout}`);
      console.log(`stderr: ${stderr}`);
    });
  }
  fs.copyFileSync(srcFile, orgFileDir + slug + ext)
  
  if(!savedTrack){
    return trackRepository.save({
      title: albumData.get("title"),
      slug: slug,
      location: dir,
      //duration: albumData.get("catalog"),
      //filesize: albumData.get("filesize"),
      album_id: Number.parseInt(albumId),
      category_id: Number.parseInt(categoryId),
      artist_id: Number.parseInt(artistId),
    });

  }
  return savedTrack;
};

export const createCategory = async (albumData: Map<string, string>): Promise<number> => {
  //Save Category
  const category = albumData.get("genre");
  const slugCategory = slugify(category);
  const categoryRepository = getRepository(Publisher);
  let categoryId: number = 0;
  let savedCategory = await categoryRepository.findOne({
    where: { slug: slugCategory },

  });
  if (!savedCategory){
    
    const newCategory = await categoryRepository.save({name: category, slug: slugCategory});
    categoryId = newCategory.id
  }
  else{
    categoryId = savedCategory.id;
  }
  return categoryId;
}

export const createArtist = async (albumData: Map<string, string>): Promise<number> => {
  //Save Artist
  const artist = albumData.get("artist");
  const artists = artist.split(',');
  let firstArtistId: number = 0;
  for(const artistName of artists){
    const artistSlug = slugify(artistName);
    const artistRepository = getRepository(Artist);
    let savedArtist = await artistRepository.findOne({
      where: { slug: artistSlug },

    });
    if (!savedArtist){
      
      const newArtist = await artistRepository.save({name: artistName, slug: artistSlug});
      if(firstArtistId == 0){
        firstArtistId = newArtist.id;
      }
    }
    else{
      if(firstArtistId == 0){
        firstArtistId = savedArtist.id;
      }
    }
  }
  return firstArtistId;
}

export const createBulk = async (albumData: Map<string, string>): Promise<number> => {
    
  //Save Language
  const language = albumData.get("language");
  const slugLang = slugify(language);
  const languageRepository = getRepository(Language);
  let languageId: number = 0;
  let savedLanguage = await languageRepository.findOne({
    where: { slug: slugLang },

  });
  if (!savedLanguage){
    
    const newLanguage = await languageRepository.save({name: language, slug: slugLang});
    languageId = newLanguage.id
  }
  else{
    languageId = savedLanguage.id;
  }

  //Save Publisher
  const publisher = albumData.get("label");
  const slugPub = slugify(publisher);
  const publisherRepository = getRepository(Publisher);
  let publisherId: number = 0;
  let savedPublisher = await publisherRepository.findOne({
    where: { slug: slugPub },

  });
  if (!savedPublisher){
    
    const newPublisher = await publisherRepository.save({name: publisher, slug: slugPub});
    publisherId = newPublisher.id
  }
  else{
    publisherId = savedPublisher.id;
  }

  

  //Save Album
  const artistId = albumData.get("artistId");
  const albumRepository = getRepository(Album);
  let savedAlbum = await albumRepository.findOne({
    where: { title: albumData.get("album")}
  });
  let slug = slugify('', 10);
  while(await albumRepository.findOne({
    where: { slug: slug}
  })){
    slug = slugify('', 10);
  }
    //Upload Thumbnail of Album
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const d = new Date();
  let date = month[d.getMonth()] + d.getFullYear();
  let dir: string = md5(date);
  const mainDir = secretConfig.upload_path + '/albums/' + dir + '/';
  console.log(mainDir);
  if(!fs.existsSync(path.resolve(mainDir))){
    fs.mkdirSync(mainDir);
  }
  const name = slug + '.jpg';
  let srcFile = albumData.get('filename');
  srcFile = path.resolve(srcFile);
  // Ffmpeg(srcFile)
  //   .addInputOption('-an')
  //   .addInputOption('-vcodec')
  //   .addInput('copy')
  //   .output(mainDir + name)
  //   .on('error', function (err, stdout, stderr) {
  //     console.log('Cannot upload preview file: ' + srcFile + ' ' + err.message);
  //   })
  //   .run();
  exec('ffmpeg -i ' + srcFile + ' -an -c copy ' + mainDir + name, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.log(err);
      return;
    }
  
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
  // Ffmpeg(srcFile)
  //   .addInputOption('-an')
  //   .addInputOption('-vcodec')
  //   .addInput('copy')
  //   .output(mainDir + 'thumb/' + name)
  //   .size('500x500')
  //   .on('error', function (err, stdout, stderr) {
  //     console.log('Cannot upload thumbnail file: ' + srcFile + ' ' + err.message);
  //   })
  //   .run();


  exec('ffmpeg -i ' + srcFile + ' -an -c copy ' + mainDir + 'thumb/' + name, (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.log(err);
      return;
    }
  
    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
  if(!savedAlbum){
    const newAlbum = await albumRepository.save({
      title: albumData.get('album'),
      slug: slug,
      location: dir,
      catalog: albumData.get('catalog'),
      category_id: 0,
      language_id: languageId,
      publisher_id: publisherId,
      artist_id: Number.parseInt(artistId),
    });
    return newAlbum.id;
  }
  return savedAlbum.id;
};

export const createTrack = async (payload: ITrackPayload): Promise<Track> => {
  const trackRepository = getRepository(Track);
  const track = new Track();
  return trackRepository.save({
    ...track,
    ...payload,
  });
};

export const getTrack = async (slug: string): Promise<Track | null> => {
  const trackRepository = getRepository(Track);
  let track = await trackRepository.findOne({
    where: { slug: slug },
    relations: ['artist', 'category', 'album', 'album.publisher'],

  });

  if (!track) return null;
  return track;
};

export const updateTrack = async (id: number, payload: ITrackPayload): Promise<Track | null> => {
  const trackRepository = getRepository(Track);
  const track = await trackRepository.findOne({ id: id });
  if (!track) return null;
  track.title = payload.title;
  track.slug = payload.slug;
  await trackRepository.update(
    { id: id },
    track,
  )
  if (!track) return null;
  return track;
};

export const deleteTrack = async (id: number): Promise<Track | null> => {
  const trackRepository = getRepository(Track);
  const track = await trackRepository.findOne({ id: id });
  if (!track) return null;
  await trackRepository.delete({ id: id });
  return track;
};

