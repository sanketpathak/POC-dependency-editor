import { Injectable, Inject } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class NaturalLanguageService {
    constructor(private http: Http) {}

    public getPackages(userInput: string): Observable<any> {
        let url: string = 'https://gist.githubusercontent.com/arunkumars08/cbabd0a40f177cb359c7315d428ebe01/raw/dd147bb24a1802368755fbe0f42312cdfd175c21/natural-language.mock.json';
        let body: any = {};
        // Change to POST once integrated with service
        return this    .http
                .get(url, body)
                .map(this.extractData)
                .catch(this.handleError);
    }

    private extractData(res: Response) {
        let body = res.json() || {};
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
