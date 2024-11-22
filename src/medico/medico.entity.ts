import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { PacienteEntity } from '../paciente/paciente.entity'

@Entity()
export class MedicoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  especialidad: string;

  @Column()
  telefono: string;

  @ManyToMany(() => PacienteEntity, (paciente) => paciente.medicos)
  @JoinTable() 
  pacientes: PacienteEntity[];
}
