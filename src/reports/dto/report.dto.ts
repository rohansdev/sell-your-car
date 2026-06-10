import { Expose, Transform } from 'class-transformer';

export class ReportDto {
  @Expose()
  id!: number;

  @Expose()
  make!: string;

  @Expose()
  model!: string;

  @Expose()
  year!: number;

  @Expose()
  mileage!: number;

  @Expose()
  price!: number;

  @Expose()
  latitude!: number;

  @Expose()
  longitude!: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId!: number;
}
