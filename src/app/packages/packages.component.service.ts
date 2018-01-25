import { Injectable, Inject } from '@angular/core';
import { HttpModule, Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class PackagesServices {
    private headers: Headers = new Headers({'Content-Type': 'application/json'});

    constructor(private http: Http) {}

    public getPackages(ecosystem: string): Observable<any> {
        if (ecosystem === 'node'){
            const url = 'https://gist.githubusercontent.com/ravsa/47f2c87eb7e3d005d7c32929677ce4b8/raw/80acb138e8f402a73907cb9ce497f294844c1c31/response_node.json';
            const body: any = {};
            return this    .http
            .get(url, body)
            .map(this.extractData)
            .catch(this.handleError);
        }else {
            const url = 'https://gist.githubusercontent.com/ravsa/72695271a0bc23eda07d3dab70d011ba/raw/01e6c89083aef34e1dc2912bcc82147a9d44271f/response.json';
            const body: any = {};
            return this    .http
            .get(url, body)
            .map(this.extractData)
            .catch(this.handleError);
        }
    }

    public getMasterTags(): Observable<any> {
        const url = 'API_URL';
        this.headers.set('Authorization', 'Bearer ' + '');
        const options = new RequestOptions({ headers: this.headers });
        return this .http
        .get(url, options)
        .map(this.extractData)
        .catch(this.handleError);
    }

    public getCompanionPackages(ecosystem: string): Observable<any> {

        if (ecosystem === 'node'){
            const url = 'https://gist.githubusercontent.com/ravsa/75e911b954ce15cd816161dbcf4849c4/raw/4488b8a3a0ee447bf7c8cfd8f351e9ac14c9cb6c/companion_packages_response.json';
            const body: any = {};
            return this    .http
            .get(url, body)
            .map(this.extractData)
            .catch(this.handleError);
        }else {
            const url = 'https://gist.githubusercontent.com/ravsa/75e911b954ce15cd816161dbcf4849c4/raw/4488b8a3a0ee447bf7c8cfd8f351e9ac14c9cb6c/companion_packages_response.json';
            const body: any = {};
            return this    .http
            .get(url, body)
            .map(this.extractData)
            .catch(this.handleError);
        }
    }

    private extractData(res: Response) {
        const body = res.json() || {};
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
