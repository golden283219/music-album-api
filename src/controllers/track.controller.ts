import Ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import http from "http";
import path from "path";
import secretConfig from "../config/secret";
import { Get, Route, Tags, Post, Put, Delete, Body, Path, Security, Query, Header } from "tsoa";
import { Track } from "../models";
import {
  getTracks,
  createTrack,
  ITrackPayload,
  uploadBulk,
  IUploadBulkPayload,
  getTrack,
  updateTrack,
  deleteTrack,
  getSearchTracks,
  getGenreTracks,
  createBulk,
  createCategory,
  createArtist,
  downloadTrack,
  getFileSize,
  IResponse,
} from "../repositories/track.repository";
import {
  getUserInfo,
} from "../repositories/user.repository";
import { JwtPayload, verify } from "jsonwebtoken";



@Route("/api/v1/tracks")
@Tags("Track")
export default class TrackController {
  //@Security('jwt')
  @Get()
  public async getTracks(@Query() pickType: string, @Query() skip: string, @Query() limit: string, @Query() keyword: string, @Query() publisherSlug: string, @Query() artistSlug: string, @Query() title: string, @Query() bpmlow: string, @Query() bpmhigh: string, @Query() key: string, @Query() genre: string, @Query() label: string, @Query() artist: string): Promise<Array<Track>> {
    const result = getTracks(pickType, Number(skip), Number(limit), keyword, publisherSlug, artistSlug, title, Number(bpmlow), Number(bpmhigh), key, genre, label, artist);
    let newResult = result;
    newResult = Promise.all( (await result).map( async (track: Track) => {
      const aiffFilePath: string = path.resolve(secretConfig.upload_path + '/audios/' + track.location + '/org/' + track.slug + '.aiff');
      track.aiff_size = await getFileSize(aiffFilePath);
      const mp3FilePath: string = path.resolve(secretConfig.upload_path + '/audios/' + track.location + '/org/' + track.slug + '.mp3');
      track.mp3_size = await getFileSize(mp3FilePath);
      return track;

    }));

    return newResult;
  }

  //@Security('jwt')
  @Get("search")
  public async getSearchTracks(@Query() keyword: string, @Query() skip: string, @Query() limit: string): Promise<Array<Track>> {
    const result = getSearchTracks(keyword, Number(skip), Number(limit));
    let newResult = result;
    newResult = Promise.all( (await result).map( async (track: Track) => {
      const aiffFilePath: string = path.resolve(secretConfig.upload_path + '/audios/' + track.location + '/org/' + track.slug + '.aiff');
      track.aiff_size = await getFileSize(aiffFilePath);
      const mp3FilePath: string = path.resolve(secretConfig.upload_path + '/audios/' + track.location + '/org/' + track.slug + '.mp3');
      track.mp3_size = await getFileSize(mp3FilePath);
      return track;

    }));

    return newResult;
  }
  
  //@Security('jwt')
  @Get("genre-tracks/:slug")
  public async getGenreTracks(@Path() slug: string, @Query() skip: string, @Query() limit: string): Promise<Array<Track>> {
    const result =  getGenreTracks(slug, Number(skip), Number(limit));
    let newResult = result;
    newResult = Promise.all( (await result).map( async (track: Track) => {
      const aiffFilePath: string = path.resolve(secretConfig.upload_path + '/audios/' + track.location + '/org/' + track.slug + '.aiff');
      track.aiff_size = await getFileSize(aiffFilePath);
      const mp3FilePath: string = path.resolve(secretConfig.upload_path + '/audios/' + track.location + '/org/' + track.slug + '.mp3');
      track.mp3_size = await getFileSize(mp3FilePath);
      return track;

    }));

    return newResult;
  }

  //@Security('jwt')
  @Get("download-track/:slug/as/:ext/:check")
  public async downloadTrack(@Path() slug: string, @Path() ext: string, @Path() check: string, @Query() token: string): Promise<IResponse | null> {
    const track = await getTrack(slug);
    const title = track.album.artist + '-' + track.title;
    const fileName = path.resolve(secretConfig.upload_path + '/audios/' + track.location + '/org/' + track.slug + '.' + ext);
    const fileSize = Math.round(await getFileSize(fileName) / 1048576);
    const jwt_encryption = secretConfig.jwt_encryption;
    let email: string = '';
    verify(token, jwt_encryption, (err, user: JwtPayload) => {
      if (err)
        return null;

        email = user.email;
    });
    const user = await getUserInfo(email);
    if(!user){
      return {result: 1, message: 'Please sign in first.'};
    }
    const userId = user.id;
    if(!user.subscribers[0]){
      return {result: 2, message: 'Please subscribe first.'};
    }
    const timeLimit = user.subscribers?Date.parse(user.subscribers[0].time_limit.toString()):0;
    const currentTime = Date.now();
    const specialAlbum = track.album.vinyl_album;
    let downloadsLeft = 0;

    if (specialAlbum) {
      downloadsLeft = user.subscribers[0].special_download_limit - user.subscribers[0].special_downloaded_data;
    } else {
      downloadsLeft = user.subscribers[0].download_limit - user.subscribers[0].downloaded_data;
    }
    if (!(timeLimit >= currentTime && downloadsLeft >= fileSize)) {
      return {result: 3, message: 'You need to upgrade your subscription.'};
    }

    if (check == 'check') {
      return {result: 0, message: 'You can download this file.'};
    }

    //download the file
    const file = fs.createWriteStream(title + '.' + ext);
    const url = 'http://localhost:8000/' + secretConfig.upload_path + '/audios/' + track.location + '/org/' + track.slug + '.' + ext;
    const request = http.get(url, (response: { pipe: (arg0: fs.WriteStream) => void; }) => {
      response.pipe(file);
      file.on("finish", () => {
        file.close();
        console.log("Download Completed");
    });
    })

    
    
  }

  //@Security('jwt')
  @Post("/uploadBulk")
  public async uploadBulk(@Body() body: IUploadBulkPayload): Promise<Track> {
    const uploadpath: string = body.uploadpath.toString();
    let title_map: Map<string, number>;

    fs.readdir(uploadpath, (error, fileNames) => {
      if(error) throw error;
      fileNames.forEach((filename) => {
        // get current file name
        const name: string = path.parse(filename).name;
        // get current file extension
        const ext: string = path.parse(filename).ext;
        // get current file path
        const filepath: string = path.resolve(uploadpath, filename);
  
        // get information about the file
        fs.stat(filepath, function(error, stat) {
          if (error) throw error;
  
          // check if the current path is a file or a folder
          const isFile = stat.isFile();
  
          // exclude folders
          if (isFile && (ext == '.aiff')) {
            console.log(filepath, name, ext);
            let flag: boolean = false;
            let albumId: number;
            Ffmpeg(filepath).ffprobe(function(err, data){
              console.dir(data.format);
              // if(title_map.size == 0){
              //   flag = true;
              // }
              // else{
              //   for(const key of title_map.keys()){
              //     if(key == data.format.tags.album){
              //       flag = true;
              //     }
              //   }
              // }
              
              // if(flag == true){
              //   albumId = title_map.get(data.format.tags.album.toString());
              // }
              // else{
              //   let albumData:Map<string, string>;
              //   albumData.set("artist", data.format.tags.artist.toString());
              //   albumData.set("title", data.format.tags.title.toString());
              //   albumData.set("album", data.format.tags.album.toString());
              //   albumData.set("label", data.format.tags.publisher.toString());
              //   albumData.set("bpm", data.format.tags.TBPM.toString());
              //   albumData.set("key", data.format.tags.TKEY.toString());
              //   albumData.set("genre", data.format.tags.genre.toString());
              //   albumData.set("remixedBy", data.format.tags['Remixed by'].toString());
              //   albumData.set("track", data.format.tags.track.toString());
              //   albumData.set("catalog", data.format.tags['Ctatlog #'].toString());
              //   albumData.set("date", data.format.tags['Original release year'].toString());
              //   console.log(albumData);

              // }
              //let albumData:Map<string, string>;
              const albumData: Map<string, string> = new Map();
              albumData.set("artist", data.format.tags.artist.toString());
              albumData.set("title", data.format.tags.title.toString());
              albumData.set("album", data.format.tags.album.toString());
              albumData.set("label", data.format.tags.publisher.toString());
              albumData.set("bpm", data.format.tags.TBPM.toString());
              albumData.set("key", data.format.tags.TKEY.toString());
              albumData.set("genre", data.format.tags.genre.toString());
              albumData.set("remixedBy", data.format.tags['Remixed by'].toString());
              albumData.set("track", data.format.tags.track.toString());
              albumData.set("catalog", data.format.tags['Catalog #'].toString());
              albumData.set("date", data.format.tags['Original release year'].toString());
              albumData.set("language", '');
              albumData.set("filename", data.format.filename.toString());
              albumData.set("duration", data.format.duration.toString());
              albumData.set("filesize", data.format.size.toString());


              console.log(albumData);
              let artistId = createArtist(albumData);
              let categoryId = createCategory(albumData);
              let albumId = createBulk(albumData);
              albumData.set("artistId", artistId.toString());
              albumData.set("categoryId", categoryId.toString());
              albumData.set("albumId", albumId.toString());
              const newTrack: Promise<Track> = uploadBulk(albumData);
              console.log(albumId);

            })
          }
        });
      });

    })
    
    return null;
  }


  //@Security('jwt')
  @Post("/")
  public async createTrack(@Body() body: ITrackPayload): Promise<Track> {
    return createTrack(body);
  }
  
  //@Security('jwt')
  @Get("/:slug")
  public async getTrack(@Path() slug: string): Promise<Track | null> {
    return getTrack(slug);
  }

  //@Security('jwt')
  @Put("/:id")
  public async updateTrack(@Path() id: string, @Body() body: ITrackPayload): Promise<Track | null> {
    return updateTrack(Number(id), body);
  }

  //@Security('jwt')
  @Delete("/:id")
  public async deleteTrack(@Path() id: string): Promise<Track | null> {
    return deleteTrack(Number(id));
  }
}