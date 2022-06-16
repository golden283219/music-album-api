import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Album } from "./album";
import { Track } from "./track";

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: String;

  @Column()
  slug!: String;

  @OneToMany((_type) => Album, (album: Album) => album.category)
  albums!: Array<Album>;

  @OneToMany((_type) => Track, (track: Track) => track.category)
  tracks!: Array<Track>;

}