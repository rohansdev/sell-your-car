import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { GetEstimateDto } from './dto/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private readonly reportsRepository: Repository<Report>,
  ) {}

  create(createReportDto: CreateReportDto, user: User) {
    const report = this.reportsRepository.create(createReportDto);
    report.user = user;

    return this.reportsRepository.save(report);
  }

  findAll() {
    return this.reportsRepository.find();
  }

  findOne(id: number) {
    return this.reportsRepository.findOneBy({ id });
  }

  getEstimate({
    make,
    model,
    year,
    mileage,
    latitude,
    longitude,
  }: GetEstimateDto) {
    return this.reportsRepository
      .createQueryBuilder()
      .select('make, model, year, mileage, latitude, longitude, approved')
      .where('make LIKE :make', { make })
      .andWhere('model LIKE :model', { model })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .andWhere('latitude - :latitude BETWEEN -5 AND 5', { latitude })
      .andWhere('longitude - :longitude BETWEEN -5 AND 5', { longitude })
      .andWhere('approved IS TRUE')
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawMany();
  }

  async update(id: number, updateReportDto: UpdateReportDto) {
    const result = await this.reportsRepository.update(id, updateReportDto);

    if (result.affected === 0) {
      throw new NotFoundException(`Report with ID ${id} not found.`);
    }

    return this.reportsRepository.findOneBy({ id });
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.reportsRepository.findOneBy({ id });

    if (!report) {
      throw new NotFoundException('Report not found.');
    }

    report.approved = approved;

    return this.reportsRepository.save(report);
  }

  async remove(id: number) {
    const result = await this.reportsRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Report with ID ${id} not found.`);
    }
  }
}
