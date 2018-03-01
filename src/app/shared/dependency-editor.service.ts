import {
    Injectable,
    Inject,
    EventEmitter,
    Output
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
import * as _ from 'lodash';

import {
    StackReportModel,
    DependencySnapshotItem,
    ComponentInformationModel,
    CveResponseModel,
    DependencySearchItem,
    EventDataModel
} from '../model/data.model';
import {
    DependencySnapshot
} from '../utils/dependency-snapshot';

@Injectable()
export class DependencyEditorService {
    @Output() dependencySelected = new EventEmitter < DependencySearchItem > ();
    @Output() dependencyRemoved = new EventEmitter < EventDataModel > ();

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

    getStackAnalyses(url: string): Observable < any > {
        const options = new RequestOptions({
            headers: this.headersStage
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

    getDependencies(url: string): Observable < any > {
        const options = new RequestOptions({
            headers: this.headersStage
        });
        return this.http.get(url, options)
            .map(this.extractData)
            .map((data) => {
                return data;
            })
            .catch(this.handleError);
    }

    getDependencyData(url, payload): Observable < any > {
        const options = new RequestOptions({
            headers: this.headersStage
        });
        return this.http.post(url, payload, options)
            .map(this.extractData)
            .map((data: StackReportModel | CveResponseModel | any) => {
                return data;
            })
            .catch(this.handleError);
    }

    updateDependencyAddedSnapshot(depObj: EventDataModel) {
        let depToAdd;
        if (depObj.depFull) {
            depToAdd = {
                package: depObj.depFull.name,
                version: depObj.depFull.version
            };
            if (depObj.action === 'add') {
                DependencySnapshot.DEP_FULL_ADDED.push(depObj.depFull);
            }
        } else if (depObj.depSnapshot) {
            depToAdd = depObj.depSnapshot;
        }
        if (depObj.action === 'add') {
            DependencySnapshot.DEP_SNAPSHOT_ADDED.push(depToAdd);
        } else {
            _.remove(DependencySnapshot.DEP_SNAPSHOT_ADDED, (dep) => {
                return dep.package === depToAdd.package;
            });
            _.remove(DependencySnapshot.DEP_FULL_ADDED, (dep) => {
                return dep.name === depToAdd.package;
            });
        }
    }

    getPayload() {
        const payload = {};
        const deps = DependencySnapshot.DEP_SNAPSHOT.concat(DependencySnapshot.DEP_SNAPSHOT_ADDED);
        payload['_resolved'] = deps;
        payload['ecosystem'] = DependencySnapshot.ECOSYSTEM;
        payload['request_id'] = DependencySnapshot.REQUEST_ID;
        return payload;
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

    removeDependency(dependency: ComponentInformationModel) {
        const objToEmit: EventDataModel = {
            depFull: dependency,
            depSnapshot: null,
            action: 'remove'
        };
        this.dependencyRemoved.emit(objToEmit);
    }
}
