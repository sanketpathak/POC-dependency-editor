import {Injectable} from '@angular/core';
import { DependencyEditorTokenProvider } from './depeditor-tokenprovider';
@Injectable()
export class MockAuthenticationService extends DependencyEditorTokenProvider {
    constructor() {
        super();
    }
    getToken(): string | Promise<string> {
        return process.env['OSIO_AUTH_TOKEN'] || '';
    }
}
