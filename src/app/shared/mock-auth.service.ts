import { Injectable } from '@angular/core';

@Injectable()
export class MockAuthenticationService {
    getToken(): string {
        const token: string = process.env['STACK_API_TOKEN'];
        return token;
    }
}
