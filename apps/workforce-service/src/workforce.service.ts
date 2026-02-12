import { Injectable } from '@nestjs/common';

@Injectable()
export class WorkforceServiceService {
  getHello(): string {
    return 'Hello World!';
  }
}
