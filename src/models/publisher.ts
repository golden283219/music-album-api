import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from "typeorm";
import { Album } from "./album";

@Entity('publishers')
export class Publisher {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: String;

  @Column()
  slug!: String;

  @OneToMany((_type) => Album, (album: Album) => album.publisher)
  albums!: Array<Album>;

}