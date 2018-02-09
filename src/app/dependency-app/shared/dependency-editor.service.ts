import {
    Injectable,
    Inject
} from '@angular/core';
import {
    Http,
    Response,
    Headers,
    RequestOptions
} from '@angular/http';
import {
    AuthenticationService
} from 'ngx-login-client';
import {
    Observable
} from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/operators/map';

import {
    StackReportModel
} from '../model/data.model';

@Injectable()
export class DependencyEditorService {

    private headersProd: Headers = new Headers({
        'Content-Type': 'application/json'
    });
    private headersStage: Headers = new Headers({
        'Content-Type': 'application/json'
    });
    private stackAnalysesUrl = '';
    private cvssScale: any = {
        low: {
            start: 0.0,
            end: 3.9,
            iconClass: 'pficon pficon-warning-triangle-o',
            displayClass: 'progress-bar-warning'
        },
        medium: {
            start: 4.0,
            end: 6.9,
            iconClass: 'pficon pficon-warning-triangle-o',
            displayClass: 'progress-bar-warning'
        },
        high: {
            start: 7.0,
            end: 10.0,
            iconClass: 'pficon pficon-warning-triangle-o warning-red-color',
            displayClass: 'progress-bar-danger'
        }
    };

    constructor(
        private http: Http,
        private auth: AuthenticationService,
    ) {
        if (this.auth.getToken()) {
            // pass your token here to run in local
            this.headersProd.set('Authorization', 'Bearer ' + this.auth.getToken());
        } else {
            this.headersProd.set('Authorization', 'Bearer ');
            this.headersStage.set('Authorization', 'Bearer ');
        }
    }

    getStackAnalyses(url: string, params ?: any): Observable < any > {
        const options = new RequestOptions({
            headers: this.headersProd
        });
        let stackReport: StackReportModel = null;
        return this.http.get(url, options)
            .map(this.extractData)
            .map((data) => {
                stackReport = data;
                return stackReport;
            })
            .catch(this.handleError);
    }

    getDepData(url, payload) {
        const options = new RequestOptions({
            headers: this.headersStage
        });
        let stackReport: StackReportModel = null;
        return this.http.post(url, payload, options)
            .map(this.extractData)
            .map((data) => {
                stackReport = data;
                return stackReport;
            })
            .catch(this.handleError);
    }

    getCvssObj(score: number): any {
        if (score) {
            let iconClass: string = this.cvssScale.medium.iconClass;
            let displayClass: string = this.cvssScale.medium.displayClass;
            if (score >= this.cvssScale.high.start) {
                iconClass = this.cvssScale.high.iconClass;
                displayClass = this.cvssScale.high.displayClass;
            }
            return {
                iconClass: iconClass,
                displayClass: displayClass,
                value: score,
                percentScore: (score / 10 * 100)
            };
        }
    }

    private extractData(res: Response) {
        const body = res.json() || {};
        body['statusCode'] = res.status;
        body['statusText'] = res.statusText;
        return body as StackReportModel;
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
