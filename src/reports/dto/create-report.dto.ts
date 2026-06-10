import { IsInt } from 'class-validator';

export class CreateReportDto {
  @IsInt()
  price!: number;
}
