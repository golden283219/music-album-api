import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Artist } from "./artist";
import { Category } from "./category";
import { Album } from "./album";
import { Key } from "./key";

@Entity('tracks')
export class Track {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: String;

  @Column()
  slug!: String;

  @Column()
  location!: String;

  @Column()
  duration!: number;

  @Column()
  bpm!: number;

  @Column()
  remixed!: string;

  @Column()
  filesize!: number;

  @Column()
  downloads!: number;

  @Column()
  search!: String;

  @ManyToOne((_type) => Artist, (artist: Artist) => artist.tracks)
  @JoinColumn({ name: 'artist_id' })
  artist!: Artist;

  @ManyToOne((_type) => Key, (key: Key) => key.tracks)
  @JoinColumn({ name: 'key_id' })
  key!: Key;

  @ManyToOne((_type) => Category, (category: Category) => category.tracks)
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  @ManyToOne((_type) => Album, (album: Album) => album.tracks)
  @JoinColumn({ name: 'album_id' })
  album!: Album;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  message: String;
}