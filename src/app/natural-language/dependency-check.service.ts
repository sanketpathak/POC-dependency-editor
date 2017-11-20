import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class DependencyCheckService {

    private static inputs: Array<string> = [];

    constructor(private http: Http) {}

    public checkPackages(inputs: Array<string>): Observable<any> {
        let url: string = 'https://jsonplaceholder.typicode.com/posts';
        let body: any = {};
        DependencyCheckService.inputs = inputs;
        return this    .http
                .post(url, body)
                .map(this.extractData)
                .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json() || {};
        body = {};
        let newInput: Array<any> = [];
        DependencyCheckService.inputs.forEach((i) => {
            newInput.push({name: i});
        });
        body['validation'] = newInput;

        body['statusCode'] = res.status;
        body['statusText'] = res.statusText;
        return body;
    }

    private handleError(error: Response | any) {
        let body: any = {};
        if (error instanceof Response) {
            if (error && error.status && error.statusText) {
                body = {
                status: error.status,
                statusText: error.statusText
                };
            }
            } else {
            body = {
                statusText: error.message ? error.message : error.toString()
            };
        }
        return Observable.throw(body);
    }
}
