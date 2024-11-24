import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { PacienteDto } from './paciente.dto/paciente.dto';
import { PacienteEntity } from './paciente.entity';
import { PacienteService } from './paciente.service';

@Controller('pacientes')
@UseInterceptors(BusinessErrorsInterceptor)
export class PacienteController {
  constructor(private readonly pacienteService: PacienteService) {}

  @Get()
  async findAll() {
    return await this.pacienteService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.pacienteService.findOne(id);
  }

  @Post()
  async create(@Body() pacienteDto: PacienteDto) {
    const paciente: PacienteEntity = plainToInstance(PacienteEntity, pacienteDto);
    return await this.pacienteService.create(paciente);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.pacienteService.delete(id);
  }
}
