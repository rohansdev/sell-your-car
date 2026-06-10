import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Report } from './entities/report.entity';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

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

  async update(id: number, updateReportDto: UpdateReportDto) {
    const result = await this.reportsRepository.update(id, updateReportDto);

    if (result.affected === 0) {
      throw new NotFoundException(`Report with ID ${id} not found.`);
    }

    return this.reportsRepository.findOneBy({ id });
  }

  async remove(id: number) {
    const result = await this.reportsRepository.delete({ id });

    if (result.affected === 0) {
      throw new NotFoundException(`Report with ID ${id} not found.`);
    }
  }
}
