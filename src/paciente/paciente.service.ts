import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PacienteEntity } from './paciente.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PacienteService 
{
    constructor(
        @InjectRepository(PacienteEntity)
        private readonly pacienteRepository: Repository<PacienteEntity>
    ){}

    async create(paciente: PacienteEntity): Promise<PacienteEntity> {
        if (paciente.nombre.length < 3) {
          throw new BadRequestException('El nombre debe tener al menos 3 caracteres');
        }
        return this.pacienteRepository.save(paciente);
      }
    
      async findOne(id: string): Promise<PacienteEntity> {
        const paciente = await this.pacienteRepository.findOne({ where: {id}, relations: ['medicos', 'diagnosticos'] });
        if (!paciente) {
          throw new NotFoundException('Paciente no encontrado para el id asociado');
        }
        return paciente;
      }
    
      async findAll(): Promise<PacienteEntity[]> {
        return this.pacienteRepository.find({ relations: ['medicos', 'diagnosticos'] });
      }
    
      async delete(id: string){
        const paciente = await this.pacienteRepository.findOne({where:{id}});
        if (paciente.diagnosticos.length > 0) {
          throw new BadRequestException('No se puede eliminar un paciente con diagnósticos asociados.');
        }
        await this.pacienteRepository.remove(paciente);
      }
}
