import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { MedicoDto } from './medico.dto/medico.dto';
import { MedicoEntity } from './medico.entity';
import { MedicoService } from './medico.service';

@Controller('medicos')
@UseInterceptors(BusinessErrorsInterceptor)
export class MedicoController {
  constructor(private readonly medicoService: MedicoService) {}

  @Get()
  async findAll() {
    return await this.medicoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.medicoService.findOne(id);
  }

  @Post()
  async create(@Body() medicoDto: MedicoDto) {
    const medico: MedicoEntity = plainToInstance(MedicoEntity, medicoDto);
    return await this.medicoService.create(medico);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.medicoService.delete(id);
  }
}
