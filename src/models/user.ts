import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";

import { Subscriber } from "./subscriber";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  firstName!: String;

  @Column()
  lastName!: String;

  @Column()
  email!: String;

  @Column()
  password!: String;

  @Column()
  active!: number;

  @Column()
  admin!: number;
  
  @Column()
  banned!: number;

  @Column()
  avatar!: String;

  @Column()
  activation_token!: String;

  @Column()
  remember_token!: String;

  @OneToMany((_type) => Subscriber, (subscriber: Subscriber) => subscriber.user)
  subscribers!: Array<Subscriber>;

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;

  message: String;
}