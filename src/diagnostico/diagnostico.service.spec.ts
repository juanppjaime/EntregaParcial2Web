import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import { DiagnosticoEntity } from './diagnostico.entity';
import { DiagnosticoService } from './diagnostico.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('DiagnosticoService', () => {
  let service: DiagnosticoService;
  let repository: Repository<DiagnosticoEntity>;
  let diagnosticosList: DiagnosticoEntity[];

  const seedDatabase = async () => {
    await repository.clear();
    diagnosticosList = [];
    for (let i = 0; i < 5; i++) {
      const diagnostico: DiagnosticoEntity = await repository.save({
        nombre: faker.word.sample(),
        descripcion: faker.lorem.sentence(),
        pacientes: [],
      });
      diagnosticosList.push(diagnostico);
    }
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [DiagnosticoService],
    }).compile();

    service = module.get<DiagnosticoService>(DiagnosticoService);
    repository = module.get<Repository<DiagnosticoEntity>>(getRepositoryToken(DiagnosticoEntity));
    await seedDatabase();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll should return all diagnosticos', async () => {
    const diagnosticos: DiagnosticoEntity[] = await service.findAll();
    expect(diagnosticos).not.toBeNull();
    expect(diagnosticos).toHaveLength(diagnosticosList.length);
  });

  it('findOne should return a diagnostico by id', async () => {
    const storedDiagnostico: DiagnosticoEntity = diagnosticosList[0];
    const diagnostico: DiagnosticoEntity = await service.findOne(storedDiagnostico.id);
    expect(diagnostico).not.toBeNull();
    expect(diagnostico.nombre).toEqual(storedDiagnostico.nombre);
    expect(diagnostico.descripcion).toEqual(storedDiagnostico.descripcion);
  });

  it('findOne should throw an exception for an invalid diagnostico', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'El diagnóstico asociado a ese id no existe',
    );
  });

  it('create should return a new diagnostico', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: '',
      nombre: faker.word.sample(),
      descripcion: faker.lorem.sentence(),
      pacientes: [],
    };

    const newDiagnostico: DiagnosticoEntity = await service.create(diagnostico);
    expect(newDiagnostico).not.toBeNull();

    const storedDiagnostico: DiagnosticoEntity = await repository.findOne({ where: { id: newDiagnostico.id } });
    expect(storedDiagnostico).not.toBeNull();
    expect(storedDiagnostico.nombre).toEqual(newDiagnostico.nombre);
    expect(storedDiagnostico.descripcion).toEqual(newDiagnostico.descripcion);
  });

  it('create should throw an exception if descripcion is too long', async () => {
    const diagnostico: DiagnosticoEntity = {
      id: '',
      nombre: faker.word.sample(),
      descripcion: faker.lorem.paragraphs(5), 
      pacientes: [],
    };

    await expect(() => service.create(diagnostico)).rejects.toThrow(BadRequestException);
  });

  it('delete should remove a diagnostico', async () => {
    const diagnostico: DiagnosticoEntity = diagnosticosList[0];
    await service.delete(diagnostico.id);

    const deletedDiagnostico: DiagnosticoEntity = await repository.findOne({ where: { id: diagnostico.id } });
    expect(deletedDiagnostico).toBeNull();
  });

  it('delete should throw an exception for an invalid diagnostico', async () => {
    await expect(() => service.delete('0')).rejects.toHaveProperty(
      'message',
      'El diagnóstico asociado a ese id no existe',
    );
  });
});
