import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DiagnosticoEntity } from './diagnostico.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class DiagnosticoService 
{
    constructor(
        @InjectRepository(DiagnosticoEntity)
        private readonly diagnosticoRepository: Repository<DiagnosticoEntity>
    ){}

    async create(diagnostico: DiagnosticoEntity): Promise<DiagnosticoEntity> {
        if (diagnostico.descripcion.length > 200) {
          throw new BadRequestException('Descripción con más de 200 caracteres');
        }
        return this.diagnosticoRepository.save(diagnostico);
      }
    
      async findOne(id: string): Promise<DiagnosticoEntity> {
        const diagnostico = await this.diagnosticoRepository.findOne({ where:{id}, relations:['pacientes'] });
        if (!diagnostico) {
          throw new NotFoundException('El diagnóstico asociado a ese id no existe');
        }
        return diagnostico;
      }
    
      async findAll(): Promise<DiagnosticoEntity[]> {
        return this.diagnosticoRepository.find({ relations:['pacientes'] });
      }
    
      async delete(id: string){
        const diagnostico: DiagnosticoEntity = await this.diagnosticoRepository.findOne({where:{id}})
        if(!diagnostico)
            throw new NotFoundException('El diagnóstico asociado a ese id no existe');
        await this.diagnosticoRepository.remove(diagnostico);
    }
}
