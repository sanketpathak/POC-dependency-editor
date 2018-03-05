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

    public STACK_API_TOKEN;
    public STACK_API_TOKEN_PROD;
    private headersProd: Headers = new Headers({
        'Content-Type': 'application/json'
    });
    private headersStage: Headers = new Headers({
        'Content-Type': 'application/json'
    });

    constructor(
        private http: Http,
        private auth: AuthenticationService
    ) {
        // if (this.auth.getToken()) {
            // pass your prod token here to run in local
            // this.headersProd.set('Authorization', 'Bearer ' + this.auth.getToken());
            this.headersProd.set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwbEwwdlhzOVlSVnFaTW93eXc4dU5MUl95cjBpRmFvemRRazlyenEyT1ZVIn0.eyJqdGkiOiJlMDQyMDYwZi04NzlkLTQyOTAtYjI4MS04OTEyYTA5ZTkzOWIiLCJleHAiOjE1MjI0OTg0MTQsIm5iZiI6MCwiaWF0IjoxNTE5OTA2NDE0LCJpc3MiOiJodHRwczovL3Nzby5vcGVuc2hpZnQuaW8vYXV0aC9yZWFsbXMvZmFicmljOCIsImF1ZCI6ImZhYnJpYzgtb25saW5lLXBsYXRmb3JtIiwic3ViIjoiMjA5MThhM2UtZjRjYS00NWI2LTg0MmEtNjMzMzk0ZTMwMjA0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZmFicmljOC1vbmxpbmUtcGxhdGZvcm0iLCJhdXRoX3RpbWUiOjE1MTkyMjM3MzEsInNlc3Npb25fc3RhdGUiOiI3M2NjZTY2MS1kYTZlLTRiMDQtYmEzMS1hOGQ1NzA5YTM1M2MiLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9hdXRoLm9wZW5zaGlmdC5pbyIsImh0dHA6Ly9hcGkub3BlbnNoaWZ0LmlvIiwiaHR0cHM6Ly9vcGVuc2hpZnQuaW8iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJodHRwczovL2F1dGgub3BlbnNoaWZ0LmlvIiwiaHR0cHM6Ly9hcGkub3BlbnNoaWZ0LmlvIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImJyb2tlciI6eyJyb2xlcyI6WyJyZWFkLXRva2VuIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJhcHByb3ZlZCI6dHJ1ZSwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJKeWFzdmVlciBHb3R0YSIsImNvbXBhbnkiOiJSZWRoYXQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqZ290dGEiLCJnaXZlbl9uYW1lIjoiSnlhc3ZlZXIiLCJmYW1pbHlfbmFtZSI6IkdvdHRhIiwiZW1haWwiOiJqZ290dGFAcmVkaGF0LmNvbSJ9.IMTTP-tyzkZbEJGkxwz9aXqkW-aNVyxQlj-y5SgLHRFZPPhH0YUyHb-6mK4bseWSX6YOUYspzjWzUiw0sWFSflgZkJJlAvwEKTfqsTYg0ygpsSUUrq24hZ_nAK74ZwtxHGby8Tkn7y1qomI85h_Fd1lUKCCTIU6jvcSl17Miqde8ELdzAFMnWb_aIfUDapkCGSLfyYPs5XQEBvF2makpGm88dy_PDrow0dkwlVTj3FdoYfAxouyk6tCH8yiBCIklpJSKXVB1dK78g57wSvT6BBQYwmq2DE0IHls4l3AtjFkFJVRmtLrreG3-SC7YFUSmO-ei_g4TVDN1HPCDGWohAw');
        // } else {
            // pass your stage token here to run in local
            this.headersStage.set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ6RC01N29CRklNVVpzQVdxVW5Jc1Z1X3g3MVZJamQxaXJHa0dVT2lUc0w4In0.eyJqdGkiOiIzY2MwMWQ0ZC0xMzM4LTQ2NjUtOGM0Yi0yNGFiZjBhYTlmNmIiLCJleHAiOjE1MjIzOTQ4NDcsIm5iZiI6MCwiaWF0IjoxNTE5ODAyODQ3LCJpc3MiOiJodHRwczovL3Nzby5wcm9kLXByZXZpZXcub3BlbnNoaWZ0LmlvL2F1dGgvcmVhbG1zL2ZhYnJpYzgiLCJhdWQiOiJmYWJyaWM4LW9ubGluZS1wbGF0Zm9ybSIsInN1YiI6IjVlMzhjMGUzLTU1YTctNGUzMi1hMjk1LWQwN2ZiNzliOTY2ZCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImZhYnJpYzgtb25saW5lLXBsYXRmb3JtIiwiYXV0aF90aW1lIjoxNTE5Nzk3MjgxLCJzZXNzaW9uX3N0YXRlIjoiYTNkYjc5MDctOTAzZi00MGUxLThkMWMtN2I2ZjAyNTA1ZWVlIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL2F1dGgucHJvZC1wcmV2aWV3Lm9wZW5zaGlmdC5pbyIsIioiLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJodHRwczovL2F1dGgtd2l0LjE5Mi4xNjguNDIuNjkubmlwLmlvIiwiaHR0cDovL2xvY2FsaG9zdDo4MDg5IiwiaHR0cHM6Ly9wcm9kLXByZXZpZXcub3BlbnNoaWZ0LmlvIiwiaHR0cDovL2NvcmUtd2l0LjE5Mi4xNjguNDIuNjkubmlwLmlvIiwiaHR0cDovL2xvY2FsaG9zdDo4MDgwIiwiaHR0cHM6Ly9kZXYucmR1MmMuZmFicmljOC5pbzo4NDQzIiwiaHR0cHM6Ly9iYWRnZXIuZmFicmljOC5pbzo4NDQzIiwiaHR0cHM6Ly9jb3JlLXdpdC4xOTIuMTY4LjQyLjY5Lm5pcC5pbyIsImh0dHBzOi8vYXBpLnByb2QtcHJldmlldy5vcGVuc2hpZnQuaW8iLCJodHRwOi8vYXV0aC13aXQuMTkyLjE2OC40Mi42OS5uaXAuaW8iXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYnJva2VyIjp7InJvbGVzIjpbInJlYWQtdG9rZW4iXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sImFwcHJvdmVkIjp0cnVlLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmFtZSI6Ikp5YXN2ZWVyIEdvdHRhIiwiY29tcGFueSI6IlJlZGhhdCIsInByZWZlcnJlZF91c2VybmFtZSI6Impnb3R0YSIsImdpdmVuX25hbWUiOiJKeWFzdmVlciIsImZhbWlseV9uYW1lIjoiR290dGEiLCJlbWFpbCI6Impnb3R0YUByZWRoYXQuY29tIn0.dCbvjpa7Vy7vp_eCKnh_ybBJgtVXzkwHuV79dqxPt_JTiPSAO_fr1WZ1IsoiWBYovGGSYa9CDARfBEgeI7oeOx30ST1_9Aw85YoRCTTqm81JTcx_zzmbmce8uMg_BG9X_L9lakNLvdWUuExeOgsviWoSUs1sqNADgBUIKCjjtHw94FG575Qv0sZuEzLtF8ePvBgqzqPQinrL_wenq3FGCcqpyuY1sfHPCc8JX9dX9GeczJDF2X08vBHr2sMr9eXt-DoNjqI1e7qHWXi4j3oTiWWtkwVcHRtJ05mg_Nb5_BVtppYp0S7uUPheR5zq18SKX4Ub81UuvJbI96e4pOXj6A');
        // }
    }

    getStackAnalyses(url: string): Observable < any > {
        console.log(this.headersStage);
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

    getDependencyData1(url, payload): Observable < any > {
        const options = new RequestOptions({
            headers: this.headersProd
        });
        return this.http.post(url, payload, options)
            .map(this.extractData)
            .map((data: StackReportModel | CveResponseModel | any) => {
                return data;
            })
            .catch(this.handleError);
    }

    getCategories(url: string): Observable < any > {
        const options = new RequestOptions({
            headers: this.headersStage
        });
        return this.http.get(url) // , options)
            .map(this.extractData)
            .map((data) => {
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
