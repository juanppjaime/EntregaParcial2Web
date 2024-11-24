/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PacienteMedicoService } from './paciente-medico.service';
import { PacienteEntity } from '../paciente/paciente.entity';
import { MedicoEntity } from '../medico/medico.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { BusinessError } from '../shared/errors/business-errors';

describe('PacienteMedicoService', () => {
  let service: PacienteMedicoService;
  let pacienteRepository: Repository<PacienteEntity>;
  let medicoRepository: Repository<MedicoEntity>;
  let paciente: PacienteEntity;
  let medicosList: MedicoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteMedicoService],
    }).compile();

    service = module.get<PacienteMedicoService>(PacienteMedicoService);
    pacienteRepository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    pacienteRepository.clear();
    medicoRepository.clear();

    medicosList = [];
    for (let i = 0; i < 3; i++) {
      const medico = await medicoRepository.save({
        nombre: faker.name.firstName(),
        especialidad: faker.company.catchPhrase(),
        telefono: faker.phone.number()
      });
      medicosList.push(medico);
    }

    paciente = await pacienteRepository.save({
      nombre: faker.name.firstName(),
      genero: faker.name.gender(),
      medicos: medicosList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addMedicoToPaciente funcionamiento normal', async () => {
    const newMedico = await medicoRepository.save({
      nombre: faker.name.firstName(),
      especialidad: faker.company.catchPhrase(),
      telefono: faker.phone.number(),
    });

    const updatedPaciente = await service.addMedicoToPaciente(paciente.id, newMedico.id);

    expect(updatedPaciente.medicos.length).toBe(medicosList.length + 1);
    expect(updatedPaciente.medicos.find(m => m.id === newMedico.id)).not.toBeNull();
  });

  it('addMedicoToPaciente con un médico inválido', async () => {
    await expect(service.addMedicoToPaciente(paciente.id, '0')).rejects.toHaveProperty(
      'message',
      'El médico con el id dado no existe',
    );
  });

  it('addMedicoToPaciente con un paciente inválido', async () => {
    const newMedico = await medicoRepository.save({
      nombre: faker.name.firstName(),
      especialidad: faker.company.catchPhrase(),
      telefono: faker.phone.number(),
    });

    await expect(service.addMedicoToPaciente('0', newMedico.id)).rejects.toHaveProperty(
      'message',
      'El paciente con el id dado no existe',
    );
  });

  it('Excepción cuando hay 5 médicos', async () => {
    const newMedico1 = await medicoRepository.save({
      nombre: faker.name.firstName(),
      especialidad: faker.company.catchPhrase(),
      telefono: faker.phone.number(),
    });

    const newMedico2 = await medicoRepository.save({
      nombre: faker.name.firstName(),
      especialidad: faker.company.catchPhrase(),
      telefono: faker.phone.number(),
    });

    paciente.medicos.push(newMedico1, newMedico2);
    await pacienteRepository.save(paciente);

    const newMedico = await medicoRepository.save({
      nombre: faker.name.firstName(),
      especialidad: faker.company.catchPhrase(),
      telefono: faker.phone.number(),
    });

    await expect(service.addMedicoToPaciente(paciente.id, newMedico.id)).rejects.toHaveProperty(
      'message',
      'Ya hay 5 medicos asignados',
    );
  });
});
