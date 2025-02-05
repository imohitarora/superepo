import { Controller, Post, Body, UseGuards, Get, Request, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
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
  async login(@Request() req) {
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
  getProfile(@Request() req) {
    return {
      user: {
        id: req.user.userId,
        email: req.user.email,
      },
    };
  }
}
