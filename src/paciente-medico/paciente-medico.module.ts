import { Module } from '@nestjs/common';
import { PacienteMedicoService } from './paciente-medico.service';
import { PacienteEntity } from 'src/paciente/paciente.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicoEntity } from 'src/medico/medico.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicoEntity, PacienteEntity])],
  providers: [PacienteMedicoService]
})
export class PacienteMedicoModule {}
