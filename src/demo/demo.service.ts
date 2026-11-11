import { Inject, Injectable } from '@nestjs/common';
import { UUID } from '../common/constants';

@Injectable()
export class DemoService {
    constructor(@Inject(UUID) private readonly uuid: () => string) { }
    generateId(): string {
        return this.uuid();
    }
}
