import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { MedicoEntity } from './medico.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class MedicoService 
{
    constructor(
        @InjectRepository(MedicoEntity)
        private readonly medicoRepository: Repository<MedicoEntity>
    ){}

    async create(medico: MedicoEntity): Promise<MedicoEntity> {
        if (!medico.nombre || !medico.especialidad) {
          throw new BadRequestException('Debe haber un nombre y una especialidad');
        }
        return this.medicoRepository.save(medico);
      }
    
      async findOne(id: string): Promise<MedicoEntity> {
        const medico = await this.medicoRepository.findOne({ where:{id}, relations:['pacientes'] });
        if (!medico) {
          throw new NotFoundException('El médico al id asociado no existe');
        }
        return medico;
      }
    
      async findAll(): Promise<MedicoEntity[]> {
        return this.medicoRepository.find({relations:['pacientes'] });
      }
    
      async delete(id: string){
        const medico: MedicoEntity = await this.medicoRepository.findOne({where:{id}, relations: ['pacientes']});
        if(!medico)
            throw new NotFoundException('El médico al id asociado no existe');
        else if (medico.pacientes.length > 0)
          throw new BadRequestException('No se puede eliminar un médico con pacientes asociados');
        await this.medicoRepository.remove(medico);
      }
}
