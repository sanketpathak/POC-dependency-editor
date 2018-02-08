import { Injectable, Inject } from '@angular/core';
import { Http, Response, Headers, RequestOptions  } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/operators/map';

import { StackReportModel } from '../model/stack-response.model';

@Injectable()
export class DependencyEditorService {

  private headers: Headers = new Headers({'Content-Type': 'application/json'});
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
      if (this.auth.getToken() !== null) {
        this.headers.set('Authorization', 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICIwbEwwdlhzOVlSVnFaTW93eXc4dU5MUl95cjBpRmFvemRRazlyenEyT1ZVIn0.eyJqdGkiOiJmODdiM2JlZC0xZTcyLTRkYmItOWI1Yi1mYjkyOGU5YzMyYTUiLCJleHAiOjE1MjA2ODc1MjIsIm5iZiI6MCwiaWF0IjoxNTE4MDk1NTIyLCJpc3MiOiJodHRwczovL3Nzby5vcGVuc2hpZnQuaW8vYXV0aC9yZWFsbXMvZmFicmljOCIsImF1ZCI6ImZhYnJpYzgtb25saW5lLXBsYXRmb3JtIiwic3ViIjoiMjA5MThhM2UtZjRjYS00NWI2LTg0MmEtNjMzMzk0ZTMwMjA0IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZmFicmljOC1vbmxpbmUtcGxhdGZvcm0iLCJhdXRoX3RpbWUiOjE1MTc1Njk1NjIsInNlc3Npb25fc3RhdGUiOiI3OGQ1YTkzNi00MDcwLTRjZWMtYjBiOC00MDQ1YTRmNGQ1NTciLCJhY3IiOiIxIiwiYWxsb3dlZC1vcmlnaW5zIjpbImh0dHA6Ly9hdXRoLm9wZW5zaGlmdC5pbyIsImh0dHA6Ly9hcGkub3BlbnNoaWZ0LmlvIiwiaHR0cHM6Ly9vcGVuc2hpZnQuaW8iLCJodHRwOi8vbG9jYWxob3N0OjMwMDAiLCJodHRwczovL2F1dGgub3BlbnNoaWZ0LmlvIiwiaHR0cHM6Ly9hcGkub3BlbnNoaWZ0LmlvIl0sInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJ1bWFfYXV0aG9yaXphdGlvbiJdfSwicmVzb3VyY2VfYWNjZXNzIjp7ImJyb2tlciI6eyJyb2xlcyI6WyJyZWFkLXRva2VuIl19LCJhY2NvdW50Ijp7InJvbGVzIjpbIm1hbmFnZS1hY2NvdW50IiwibWFuYWdlLWFjY291bnQtbGlua3MiLCJ2aWV3LXByb2ZpbGUiXX19LCJhcHByb3ZlZCI6dHJ1ZSwiZW1haWxfdmVyaWZpZWQiOnRydWUsIm5hbWUiOiJKeWFzdmVlciBHb3R0YSIsImNvbXBhbnkiOiJSZWRoYXQiLCJwcmVmZXJyZWRfdXNlcm5hbWUiOiJqZ290dGEiLCJnaXZlbl9uYW1lIjoiSnlhc3ZlZXIiLCJmYW1pbHlfbmFtZSI6IkdvdHRhIiwiZW1haWwiOiJqZ290dGFAcmVkaGF0LmNvbSJ9.XV-xZVU8-vYfkjTgk0b9E-4vYnS0hL7NDrt6M6xD7Qo8sSJAo29fORS2tDj9-T_mHXqmxerhHkaT4Lpi59wKw6eA-UF-NnqRKg3zR8Q_YeeR1KCTwZwz4D9lGuiv_gqkBdrwbz-VOIP1Y-UYJaZkegjCIxDh0g0sDnt5aZAsX6kgQLKby3wuCbHrt3E6ohVziIIoJaXJZg7OgBxvo_nxy6X0hptSCe7lp0eIDQcA5X2RLoUbg1tYkfc7Q3o8mkZN8HC98pv-IGGcakDiZxs5k5ucWlvjQ_q8b8gMLmDv4fu9naZMO13_YWMrgE_vfxJ9oUzlHHig_v_h2MLw5qBxVw');
      }
  }

  getStackAnalyses(url: string, params?: any): Observable<any> {
    console.log('stack service', params);
    let options = new RequestOptions({ headers: this.headers });
    let stackReport: StackReportModel = null;
    if (params && params['access_token']) {
      this.headers.set('Authorization', 'Bearer ' + params['access_token']);
      options = new RequestOptions({ headers: this.headers });
    }
    return this.http.get(url, options)
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
