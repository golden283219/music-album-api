import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Album } from "./album";
import { Track } from "./track";

@Entity('artists')
export class Artist {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: String;

  @Column()
  slug!: String;

  @Column()
  image!: String;

  @OneToMany((_type) => Album, (album: Album) => album.artist)
  albums!: Array<Album>;

  @OneToMany((_type) => Track, (track: Track) => track.artist)
  tracks!: Array<Track>;

}