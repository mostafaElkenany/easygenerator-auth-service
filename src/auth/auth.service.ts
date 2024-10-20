import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { SignupDto } from './dto/Signup.dto';
import { User } from './schema/user.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger: Logger;

  constructor(
    @InjectModel(User.name) private readonly UserModel: Model<User>,
    private jwtService: JwtService,
  ) {
    this.logger = new Logger(AuthService.name);
  }
  async signup(data: SignupDto) {
    const { name, email, password } = data;

    const emailExists = await this.UserModel.findOne({ email: email });
    if (emailExists) {
      this.logger.error(
        "Can't create User, Email already in use",
        {},
        { username: email },
      );

      throw new BadRequestException('Email has already been taken.');
    }

    const newUser = await this.UserModel.create({
      name,
      email,
      password,
    });

    const newUserData = newUser.toObject();
    delete newUserData.password;

    this.logger.log('Signing up process completed successfully');

    return newUserData;
  }

  async validateUser(username: string, password: string) {
    const user = await this.UserModel.findOne({ email: username });
    if (user) {
      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (isPasswordMatch) {
        const { password, ...userData } = user.toObject();
        return userData;
      }
    }
    return null;
  }

  async login(user: User) {
    const payload = {
      username: user.email,
      name: user.name,
      sub: user._id,
    };

    return this.jwtService.sign(payload);
  }
}
