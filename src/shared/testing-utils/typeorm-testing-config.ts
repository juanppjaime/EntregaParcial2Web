import { TypeOrmModule } from '@nestjs/typeorm';
import { PacienteEntity } from '../../paciente/paciente.entity'; 
import { MedicoEntity } from '../../medico/medico.entity';
import { DiagnosticoEntity } from '../../diagnostico/diagnostico.entity';

export const TypeOrmTestingConfig = () => [
 TypeOrmModule.forRoot({
   type: 'sqlite',
   database: ':memory:',
   dropSchema: true,
   entities: [MedicoEntity, PacienteEntity, DiagnosticoEntity],
   synchronize: true,
   keepConnectionAlive: true
 }),
 TypeOrmModule.forFeature([MedicoEntity, PacienteEntity, DiagnosticoEntity]),
];