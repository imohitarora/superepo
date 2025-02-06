import { Controller, Post, Body, UseGuards, Get, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RegisterResponse, LoginResponse, ProfileResponse } from './dto/auth.response';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    type: RegisterResponse,
  })
  @ApiResponse({ 
    status: 409, 
    description: 'Email already exists',
    schema: {
      example: {
        status: 409,
        message: 'Email already exists',
      },
    },
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input',
    schema: {
      example: {
        status: 400,
        message: 'Validation failed',
        errors: [
          'email must be a valid email',
          'password must be at least 6 characters long',
        ],
      },
    },
  })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    try {
      const user = await this.authService.register(registerDto.email, registerDto.password);
      return {
        message: 'Registration successful',
        user: {
          id: user.id,
          email: user.email,
        },
      };
    } catch (error) {
      if (error.message === 'Email already exists') {
        throw new HttpException({
          status: HttpStatus.CONFLICT,
          message: 'Email already exists',
        }, HttpStatus.CONFLICT);
      }
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Registration failed',
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged in',
    type: LoginResponse,
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Invalid credentials',
    schema: {
      example: {
        status: 401,
        message: 'Invalid credentials',
      },
    },
  })
  async login(@Request() req): Promise<LoginResponse> {
    try {
      const result = await this.authService.login(req.user);
      return {
        message: 'Login successful',
        user: {
          id: req.user.id,
          email: req.user.email,
        },
        access_token: result.access_token,
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.UNAUTHORIZED,
        message: 'Invalid credentials',
      }, HttpStatus.UNAUTHORIZED);
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: ProfileResponse,
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized',
    schema: {
      example: {
        status: 401,
        message: 'Unauthorized',
      },
    },
  })
  getProfile(@Request() req): ProfileResponse {
    return {
      user: {
        id: req.user.userId,
        email: req.user.email,
      },
    };
  }
}
