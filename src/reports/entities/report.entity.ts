import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Report {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'numeric' })
  price!: number;

  @Column({ type: 'varchar', length: 100 })
  make!: string;

  @Column({ type: 'varchar', length: 100 })
  model!: string;

  @Column({ type: 'numeric' })
  year!: number;

  @Column({ type: 'numeric' })
  mileage!: number;

  @Column({ type: 'numeric' })
  latitude!: number;

  @Column({ type: 'numeric' })
  longitude!: number;

  @ManyToOne(() => User, (user) => user.reports)
  user: User;
}
