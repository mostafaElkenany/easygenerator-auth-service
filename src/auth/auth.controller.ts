import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  Logger,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/Signup.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  private readonly logger: Logger;

  constructor(private readonly authService: AuthService) {
    this.logger = new Logger();
  }

  @Post('signup')
  async signup(@Body() data: SignupDto) {
    this.logger.log('Signing up endpoint has been invoked');

    return this.authService.signup(data);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Req() request, @Res({ passthrough: true }) response) {
    this.logger.log('Signing in endpoint has been invoked');

    const accessToken = await this.authService.login(request.user);

    response.cookie('accessToken', accessToken, {
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      sameSite: 'Strict',
    });

    return {
      statusCode: 200,
      message: 'Logged in successfully',
      accessToken,
    };
  }
}
