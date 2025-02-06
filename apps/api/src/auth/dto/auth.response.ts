import { ApiProperty } from '@nestjs/swagger';

export class UserResponse {
  @ApiProperty({
    description: 'User ID',
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: 'User email',
    example: 'user@example.com',
  })
  email: string;
}

export class RegisterResponse {
  @ApiProperty({
    description: 'Success message',
    example: 'Registration successful',
  })
  message: string;

  @ApiProperty({
    description: 'User information',
    type: UserResponse,
  })
  user: UserResponse;
}

export class LoginResponse {
  @ApiProperty({
    description: 'Success message',
    example: 'Login successful',
  })
  message: string;

  @ApiProperty({
    description: 'User information',
    type: UserResponse,
  })
  user: UserResponse;

  @ApiProperty({
    description: 'JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access_token: string;
}

export class ProfileResponse {
  @ApiProperty({
    description: 'User information',
    type: UserResponse,
  })
  user: UserResponse;
}
