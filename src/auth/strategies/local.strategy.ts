import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger: Logger;

  constructor(private authService: AuthService) {
    super();
    this.logger = new Logger(LocalStrategy.name);
  }

  async validate(username: string, password: string) {
    const user = await this.authService.validateUser(username, password);

    if (!user) {
      this.logger.error('Login failed, invalid credentials');
      throw new UnauthorizedException(
        'Invalid credentials. Please check your email and password.',
      );
    }

    return user;
  }
}
