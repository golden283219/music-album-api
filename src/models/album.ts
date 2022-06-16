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
import { Publisher } from "./publisher";
import { Language } from "./language";
import { Track } from "./track";

@Entity('albums')
export class Album {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: String;

  @Column()
  slug!: String;

  @Column()
  location!: String;

  @Column()
  views!: number;

  @Column()
  downloads!: number;

  @Column()
  release_date!: Date;

  @Column()
  featured!: number;

  @Column()
  catalog!: String;

  @Column()
  top_album!: number;

  @Column()
  vinyl_album!: number;

  @Column()
  bandcamp_album!: number;

  // @Column({ nullable: true })
  // artistId!: number;
  @ManyToOne((_type) => Artist, (artist: Artist) => artist.albums)
  @JoinColumn({ name: 'artist_id' })
  artist!: Artist;

  // @Column({ nullable: true })
  // categoryId!: number;
  @ManyToOne((_type) => Category, (category: Category) => category.albums)
  @JoinColumn({ name: 'category_id' })
  category!: Category;

  // @Column({ nullable: true })
  // publisherId!: number;
  @ManyToOne((_type) => Publisher, (publisher: Publisher) => publisher.albums)
  @JoinColumn({ name: 'publisher_id' })
  publisher!: Publisher;

  // @Column({ nullable: true })
  // languageId!: number;
  @ManyToOne((_type) => Language, (language: Language) => language.albums)
  @JoinColumn({ name: 'language_id' })
  language!: Language;

  @OneToMany((_type) => Track, (track: Track) => track.album)
  tracks!: Array<Track>;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  message: String;
}