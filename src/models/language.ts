import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Album } from "./album";

@Entity('languages')
export class Language {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: String;

  @Column()
  slug!: String;

  @OneToMany((_type) => Album, (album: Album) => album.language)
  albums!: Array<Album>;

}