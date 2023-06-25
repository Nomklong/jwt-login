import { Users } from '@module/users/users.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('auth_access_token')
export class AuthAccessToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'longtext' })
  access_token_id: string;

  @Column({ type: 'bigint' })
  user_id: number;

  @Column({ type: 'boolean', default: 0 })
  revoke: boolean;

  @Column({ type: 'datetime' })
  expired_at: Date;

  @ManyToOne(() => Users)
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user: Users;
}
