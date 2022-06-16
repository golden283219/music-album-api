import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
  } from "typeorm";
  import { Track } from "./track";
  
  @Entity('keys')
  export class Key {
    @PrimaryGeneratedColumn()
    id!: number;
  
    @Column()
    name!: String;
  
    @Column()
    slug!: String;
  
    @OneToMany((_type) => Track, (track: Track) => track.key)
    tracks!: Array<Track>;
  
  }