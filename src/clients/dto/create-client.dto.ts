import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';
import { ClientStatus } from '../entities/client.entity';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const trimLower = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

const trimOrNull = ({ value }: { value: unknown }) =>
  typeof value === 'string' && value.trim() !== '' ? value.trim() : null;

export class CreateClientDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre completo es requerido.' })
  @MaxLength(150)
  @Transform(trim)
  fullName: string;

  @IsEmail({}, { message: 'El email no tiene un formato válido.' })
  @IsNotEmpty({ message: 'El email es requerido.' })
  @Transform(trimLower)
  email: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Transform(trimOrNull)
  phone?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(trimOrNull)
  position?: string | null;

  @IsOptional()
  @IsEnum(ClientStatus, { message: 'El estado no es válido.' })
  status?: ClientStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  @Transform(trimOrNull)
  notes?: string | null;

  @IsUUID('4', { message: 'La empresa seleccionada no es válida.' })
  @IsNotEmpty({ message: 'La empresa es requerida.' })
  companyId: string;
}
