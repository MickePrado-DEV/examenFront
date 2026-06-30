import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompaniesService } from '../companies/companies.service';
import { CreateClientDto } from './dto/create-client.dto';
import { QueryClientDto } from './dto/query-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { Client } from './entities/client.entity';

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable()
export class ClientsService {
  constructor(
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
    private readonly companiesService: CompaniesService,
  ) {}

  async create(dto: CreateClientDto): Promise<Client> {
    await this.ensureEmailIsUnique(dto.email);
    await this.companiesService.findOne(dto.companyId);
    const client = this.clientRepository.create(dto);
    const saved = await this.clientRepository.save(client);
    return this.findOne(saved.id!);
  }

  async findAll(query: QueryClientDto): Promise<PaginatedResult<Client>> {
    const { page, limit, search, status, companyId, sortBy, order } = query;

    const qb = this.clientRepository
      .createQueryBuilder('client')
      .leftJoinAndSelect('client.company', 'company');

    if (search) {
      qb.andWhere(
        '(client.full_name LIKE :search OR client.email LIKE :search OR company.name LIKE :search)',
        { search: `%${search}%` },
      );
    }
    if (status) {
      qb.andWhere('client.status = :status', { status });
    }
    if (companyId) {
      qb.andWhere('client.company_id = :companyId', { companyId });
    }

    qb.orderBy(`client.${sortBy}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
  }

  async findOne(id: string): Promise<Client> {
    const client = await this.clientRepository.findOne({ where: { id } });
    if (!client) {
      throw new NotFoundException(`No se encontró el cliente con id ${id}.`);
    }
    return client;
  }

  async update(id: string, dto: UpdateClientDto): Promise<Client> {
    const client = await this.findOne(id);

    if (dto.email && dto.email !== client.email) {
      await this.ensureEmailIsUnique(dto.email);
    }
    if (dto.companyId && dto.companyId !== client.companyId) {
      await this.companiesService.findOne(dto.companyId);
    }

    Object.assign(client, dto);
    await this.clientRepository.save(client);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const client = await this.findOne(id);
    await this.clientRepository.remove(client);
  }

  private async ensureEmailIsUnique(email: string): Promise<void> {
    const existing = await this.clientRepository.findOne({ where: { email } });
    if (existing) {
      throw new ConflictException(
        `Ya existe un cliente registrado con el email ${email}.`,
      );
    }
  }
}
