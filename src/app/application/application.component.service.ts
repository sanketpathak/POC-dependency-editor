import { Injectable, Inject } from '@angular/core';
import { HttpModule, Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class ApplicationServices {
    private headers: Headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {}

    public getPackages(ecosystem: string): Observable<any> {
        if (ecosystem === "node"){
            // TODO: node ecosystem;
        }else {
            let url: string = 'https://gist.githubusercontent.com/ravsa/dc3445708fc519795d093d9ce44b6698/raw/87fc96631f6a5e5c6237d1f68a94a6bb4c2c7df6/springboot_response.json';
            let body: any = {};
            return this    .http
            .get(url, body)
            .map(this.extractData)
            .catch(this.handleError);
        }
        
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
