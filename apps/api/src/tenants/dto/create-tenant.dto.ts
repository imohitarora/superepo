import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class CreateTenantDto {
  @ApiProperty({
    description: 'The name of the tenant',
    example: 'Acme Corporation',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}
