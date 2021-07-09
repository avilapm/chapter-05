import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { v4 as uuid } from 'uuid';
import { Statement } from "../../statements/entities/Statement";

@Entity('transfers')
class Transfer {

  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('uuid')
  sender_id: string;

  @Column('uuid')
  receiver_id: string;

  @OneToMany(() => Statement, statement => statement.transfer)
  transfers: Statement[];

  @CreateDateColumn()
  created_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }

}

export { Transfer }