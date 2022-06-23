import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
  } from "typeorm";

  import { User } from "./user";

  @Entity('subscribers')
  export class Subscriber {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne((_type) => User, (user: User) => user.subscribers)
    @JoinColumn({ name: 'user_id' })
    user!: User;
  
    @Column() 
    is_subscribed!: number;
  
    @Column()
    time_limit!: Date;
  
    @Column()
    download_limit!: number;
  
    @Column()
    downloaded_data!: number;
  
    @Column()
    special_download_limit!: number;
  
    @Column()
    special_downloaded_data!: number;
  
    @CreateDateColumn()
    created_at!: Date;
  
    @UpdateDateColumn()
    updated_at!: Date;
  
    message: String;
  }