import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { Role } from "@module/auth/enum/roles.enum";

@Entity('users')
@Index(['name', 'email'])
export class Users {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'longtext', nullable: true })
  password: string;

  @Column({ type: 'varchar', nullable: true })
  mobile: string;

  @Column({ type: 'longtext', nullable: true })
  address: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 255, default: Role.User })
  roles: Role[];

  @Column({ type: 'boolean', default: 1 })
  is_active: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
