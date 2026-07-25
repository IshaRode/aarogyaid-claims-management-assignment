import { IsString, IsNumber, IsEmail, IsPositive, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateClaimDto {
  @IsString()
  patientName: string;

  @IsEmail()
  email: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  claimAmount: number;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  uploadedDocument?: string;
}

export class UpdateClaimDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  approvedAmount?: number;

  @IsOptional()
  @IsString()
  insurerComments?: string;
}
