import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

const trimOrNull = ({ value }: { value: unknown }) =>
  typeof value === 'string' && value.trim() !== '' ? value.trim() : null;

export class UpdateCompanyDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty({ message: 'El nombre de la empresa no puede estar vacío.' })
  @MaxLength(150)
  @Transform(trim)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(trimOrNull)
  industry?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  @Transform(trimOrNull)
  website?: string | null;
}
