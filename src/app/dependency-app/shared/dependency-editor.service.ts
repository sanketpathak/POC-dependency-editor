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
            this.headersProd.set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwbEwwdlhzOVlSVnFaTW93eXc4dU5MUl95cjBpRmFvemRRazlyenEyT1ZVIn0.eyJqdGkiOiIxOTAyMDM5ZC0zNDc2LTQ4YWQtODMxYy05YmFhYTNlZTdiOWIiLCJleHAiOjE1MjA2OTY5MDYsIm5iZiI6MCwiaWF0IjoxNTE4MTA0OTA2LCJpc3MiOiJodHRwczovL3Nzby5vcGVuc2hpZnQuaW8vYXV0aC9yZWFsbXMvZmFicmljOCIsImF1ZCI6ImZhYnJpYzgtb25saW5lLXBsYXRmb3JtIiwic3ViIjoiMjA5MThhM2UtZjRjYS00NWI2LTg0MmEtNjMzMzk0ZTMwMjA0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZmFicmljOC1vbmxpbmUtcGxhdGZvcm0iLCJhdXRoX3RpbWUiOjE1MTc1Njk1NjIsInNlc3Npb25fc3RhdGUiOiI3OGQ1YTkzNi00MDcwLTRjZWMtYjBiOC00MDQ1YTRmNGQ1NTciLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9hdXRoLm9wZW5zaGlmdC5pbyIsImh0dHA6Ly9hcGkub3BlbnNoaWZ0LmlvIiwiaHR0cHM6Ly9vcGVuc2hpZnQuaW8iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJodHRwczovL2F1dGgub3BlbnNoaWZ0LmlvIiwiaHR0cHM6Ly9hcGkub3BlbnNoaWZ0LmlvIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImJyb2tlciI6eyJyb2xlcyI6WyJyZWFkLXRva2VuIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJhcHByb3ZlZCI6dHJ1ZSwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJKeWFzdmVlciBHb3R0YSIsImNvbXBhbnkiOiJSZWRoYXQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqZ290dGEiLCJnaXZlbl9uYW1lIjoiSnlhc3ZlZXIiLCJmYW1pbHlfbmFtZSI6IkdvdHRhIiwiZW1haWwiOiJqZ290dGFAcmVkaGF0LmNvbSJ9.bL-XY6NUYJTvouc0JE54k34SXzqlZUPM_cXjUO4FVuGkv2_3a1MBrO_Qld6ERTpJpqbtCT8NgAwlmDFCFZh-AbOCrLMalXhyNtZZAkZcMA7rzQNgKEsjV2ToskUdc0gVLZQRbwrBG7nm6OSXcUGKtbVEbcQ05rzPLNQrop46EC7AHv5VIlcS_sLQaFVpe1ZM-5t4KECIp1Ao0zBldanfyTtUJvoMiVp6l_SJo_WNzRB4roCl0GiVzu-mT_9-4wwCo5i8W1fZgYg5yb2kYj5U3REkmuUV89ercwxoz2MZJLw0hi_qBwitVVbg_MMH-hnWnSBu5_ToIE13PvhnX9mb7g');
            this.headersStage.set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ6RC01N29CRklNVVpzQVdxVW5Jc1Z1X3g3MVZJamQxaXJHa0dVT2lUc0w4In0.eyJqdGkiOiI5YWIwYjAyZS0yNDFhLTQ3NGYtOTBkYi1jOThkNGU2ZGQ2MzgiLCJleHAiOjE1MzMwMzE4OTIsIm5iZiI6MCwiaWF0IjoxNTAxNDk1ODkyLCJpc3MiOiJodHRwczovL3Nzby5wcm9kLXByZXZpZXcub3BlbnNoaWZ0LmlvL2F1dGgvcmVhbG1zL2ZhYnJpYzgiLCJhdWQiOiJmYWJyaWM4LW9ubGluZS1wbGF0Zm9ybSIsInN1YiI6IjA2MDhjNTY3LTYyYWQtNGQwNC1iZjRjLTEzOWYyNDlmYmE1YyIsInR5cCI6IkJlYXJlciIsImF6cCI6ImZhYnJpYzgtb25saW5lLXBsYXRmb3JtIiwiYXV0aF90aW1lIjowLCJzZXNzaW9uX3N0YXRlIjoiMDI5NTViOGQtYzhmZC00NDg5LWJmOWItODFlNmQ1NGUxMWZmIiwiYWNyIjoiMSIsImFsbG93ZWQtb3JpZ2lucyI6WyIqIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYnJva2VyIjp7InJvbGVzIjpbInJlYWQtdG9rZW4iXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sImNvbXBhbnkiOiJSZWQgSGF0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYmF5ZXNpYW4iLCJlbWFpbCI6ImJheWVzaWFuLWFwaUBvcGVuc2hpZnQuaW8ifQ.ErOyQAIr2_KTA6cU7vT-L7uEnvWV46PjXuCQQLFRUEM2WdIzfRFJmw3AoHdsCsxr9SYh04BZAnR4AG5v3Bwl_TLMgpu8l2f0LCcVDESh3mdVXYJtkLJ6yQqWxGPLx9w0LKhlC8c6QtPHhqFnDLd-WzT1XoiDy-9NKF8sL97SuQiaTcn1su4xxbamVGurAC1JD-BCXNv6q2Gm7B228zqHGCd0AykiePwpo3PSZGXb-LR2bsgb0SM02oEAcy1CZaL8iBlRNY28muGo72qKlhQKZi2S18zheKSWOHCbJ8uCbFM3dmzV33umChSG1FocHsvJkcaB42H_VbqFs6NupMco3g');
        }
    }

    getStackAnalyses(url: string): Observable < any > {
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

    getDependencies(url: string): Observable < any > {
        const options = new RequestOptions({
            headers: this.headersProd
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
        console.log(DependencySnapshot.DEP_SNAPSHOT_ADDED);
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
}