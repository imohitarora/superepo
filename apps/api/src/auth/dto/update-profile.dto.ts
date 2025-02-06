import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsUrl, MaxLength } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'User display name',
    example: 'John Doe',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiProperty({
    description: 'User bio',
    example: 'Software engineer passionate about...',
    required: false,
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  bio?: string;

  @ApiProperty({
    description: 'URL to user avatar',
    example: 'https://example.com/avatar.jpg',
    required: false,
  })
  @IsUrl()
  @IsOptional()
  @MaxLength(255)
  avatarUrl?: string;
}
