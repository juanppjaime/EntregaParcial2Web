import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { DiagnosticoDto } from './diagnostico.dto/diagnostico.dto';
import { DiagnosticoEntity } from './diagnostico.entity';
import { DiagnosticoService } from './diagnostico.service';

@Controller('diagnosticos')
@UseInterceptors(BusinessErrorsInterceptor)
export class DiagnosticoController {
  constructor(private readonly diagnosticoService: DiagnosticoService) {}

  @Get()
  async findAll() {
    return await this.diagnosticoService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.diagnosticoService.findOne(id);
  }

  @Post()
  async create(@Body() diagnosticoDto: DiagnosticoDto) {
    const diagnostico: DiagnosticoEntity = plainToInstance(DiagnosticoEntity, diagnosticoDto);
    return await this.diagnosticoService.create(diagnostico);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    return await this.diagnosticoService.delete(id);
  }
}
