/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { PacienteEntity } from './paciente.entity';
import { PacienteService } from './paciente.service';
import { faker } from '@faker-js/faker';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { MedicoEntity } from '../medico/medico.entity';
import { DiagnosticoEntity } from '../diagnostico/diagnostico.entity';

describe('Test PacienteService', () => {
  let service: PacienteService;
  let repository: Repository<PacienteEntity>;
  let pacientesList: PacienteEntity[];
  let medicoRepository: Repository<MedicoEntity>;
  let diagnosticoRepository: Repository<DiagnosticoEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PacienteService],
    }).compile();

    service = module.get<PacienteService>(PacienteService);
    repository = module.get<Repository<PacienteEntity>>(getRepositoryToken(PacienteEntity));
    medicoRepository = module.get<Repository<MedicoEntity>>(getRepositoryToken(MedicoEntity));
    diagnosticoRepository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await seedDatabase();
  });

  const seedDatabase = async () => {
    repository.clear();
    pacientesList = [];
    for (let i = 0; i < 5; i++) {
      const paciente: PacienteEntity = await repository.save({
        nombre: faker.name.firstName(),
        genero: faker.name.gender(),
        medicos: [], 
        diagnosticos: [], 
      });
      pacientesList.push(paciente);
    }
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Nuevo paciente', async () => {
    
    const paciente: PacienteEntity = {
      id: "",
      nombre: faker.name.firstName(),
      genero: faker.name.gender(),
      medicos: [],  
      diagnosticos: [],  
    };

    const newPaciente: PacienteEntity = await service.create(paciente);
    expect(newPaciente).not.toBeNull();

    const storedPaciente: PacienteEntity = await repository.findOne({where:{id:newPaciente.id}});
    expect(storedPaciente).not.toBeNull();
    expect(storedPaciente.nombre).toEqual(newPaciente.nombre);
    expect(storedPaciente.genero).toEqual(newPaciente.genero);
  });

  it('Error de negocio < 3 caracteres', async () => {
    const paciente: PacienteEntity = {
      id: "",
      nombre: "Ju",  
      genero: faker.name.gender(),
      medicos: [],
      diagnosticos: [],
    };

    await expect(() => service.create(paciente)).rejects.toThrowError(
      new BusinessLogicException('El nombre debe tener al menos 3 caracteres', BusinessError.BAD_REQUEST)
    );
  });

});
