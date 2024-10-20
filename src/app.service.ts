import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(name: string) {
    return { statusCode: 200, message: `Hello ${name}!` };
  }
}
