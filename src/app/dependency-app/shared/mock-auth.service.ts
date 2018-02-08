import { Injectable } from '@angular/core';

@Injectable()
export class MockAuthenticationService {
    getToken(): string {
        const token: string = process.env['STACK_API_TOKEN'];
        console.log('token from local', token);
        return token;
    }
}
