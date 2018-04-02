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
    TokenProvider
} from '../shared/token-provider';
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
    dependencyRemoved = new EventEmitter < EventDataModel > ();

    constructor(
        private http: Http,
        private tokenProvider: TokenProvider
    ) {}

    postStackAnalyses(githubUrl: string): Observable<any> {
        // const url = 'http://bayesian-api-rratnawa-fabric8-analytics.dev.rdu2c.fabric8.io/api/v1/stack-analyses';
        const url = 'https://recommender.api.prod-preview.openshift.io/api/v1/stack-analyses';
        return this.options.flatMap((option) => {
            const payload = 'github_url=' + githubUrl;
            return this.http.post(url, payload, option)
                .map(this.extractData)
                .map((data) => {
                    return data;
                })
                .catch(this.handleError);
        });
    }

    getStackAnalyses(url: string): Observable < any > {
        return this.options.flatMap((option) => {
            let stackReport: StackReportModel = null;
            return this.http.get(url, option)
                .map(this.extractData)
                .map((data) => {
                    stackReport = data;
                    return data;
                })
                .catch(this.handleError);
        });
    }

    getDependencies(url: string): Observable < any > {
        return this.options.flatMap((option) => {
            return this.http.get(url, option)
                .map(this.extractData)
                .map((data) => {
                    return data;
                })
                .catch(this.handleError);
        });
    }

    getDependencyData(url, payload): Observable < any > {
        return this.options.flatMap((option) => {
            return this.http.post(url, payload, option)
                .map(this.extractData)
                .map((data: StackReportModel | CveResponseModel | any) => {
                    return data;
                })
                .catch(this.handleError);
        });
    }

    getCategories(url: string): Observable < any > {
        return this.options.flatMap((option) => {
            return this.http.get(url, option)
                .map(this.extractData)
                .map((data) => {
                    return data;
                })
                .catch(this.handleError);
        });
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

    removeDependency(dependency: ComponentInformationModel) {
        const objToEmit: EventDataModel = {
            depFull: dependency,
            depSnapshot: null,
            action: 'remove'
        };
        this.dependencyRemoved.emit(objToEmit);
    }

    private get options(): Observable<RequestOptions> {
        let headers = new Headers();
        return Observable.fromPromise(this.tokenProvider.token.then((token) => {
            headers.append('Authorization', 'Bearer ' + token);
            return new RequestOptions({
                headers: headers
            });
        }));
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
