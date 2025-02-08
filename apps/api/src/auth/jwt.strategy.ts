import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'your-super-secret-key-that-should-be-in-env',
    });
  }

  async validate(payload: any) {
    try {
      // Get the full user to ensure we have the latest data
      const user = await this.usersService.findOne(payload.sub);
      
      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }

      // Log successful token validation
      console.log('JWT Strategy - Token validated successfully:', {
        userId: payload.sub,
        email: payload.email,
        timestamp: new Date().toISOString(),
      });

      return {
        userId: payload.sub,
        email: payload.email,
        tenantId: payload.tenantId,
        roles: payload.roles,
        name: user.name,
        bio: user.bio,
        avatarUrl: user.avatarUrl,
      };
    } catch (error) {
      console.error('JWT Strategy - Token validation failed:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
