import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from 'class-validator';
import { ClientStatus } from '../entities/client.entity';

export class QueryClientDto {
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit: number = 10;

  @IsOptional()
  @IsString()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim() : value,
  )
  search?: string;

  @IsOptional()
  @IsEnum(ClientStatus, { message: 'El estado no es válido.' })
  status?: ClientStatus;

  @IsOptional()
  @IsUUID('4', { message: 'La empresa no es válida.' })
  companyId?: string;

  @IsOptional()
  @IsIn(['fullName', 'email', 'createdAt'])
  sortBy: 'fullName' | 'email' | 'createdAt' = 'createdAt';

  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.toUpperCase() : value,
  )
  @IsIn(['ASC', 'DESC'])
  order: 'ASC' | 'DESC' = 'DESC';
}
