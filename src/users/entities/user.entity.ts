import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Report } from '../../reports/entities/report.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100 })
  name!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  email!: string;

  @Column({ type: 'varchar', length: 200 })
  password!: string;

  @Column({ type: 'boolean', default: false })
  isAdmin!: boolean;

  @OneToMany(() => Report, (report) => report.user)
  reports: Report[];
}
