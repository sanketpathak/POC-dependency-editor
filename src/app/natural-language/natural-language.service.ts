import { Injectable, Inject } from '@angular/core';
import { Http, Headers, Response, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observer } from 'rxjs/Observer';

@Injectable()
export class NaturalLanguageService {
  private headers: Headers = new Headers({'Content-Type': 'application/json'});

  constructor(private http: Http) {}

  public getPackages(userInput: string): Observable<any> {
    let url: string = 'https://gist.githubusercontent.com/ravsa/72695271a0bc23eda07d3dab70d011ba/raw/ed64af56c6fbddeb1b10f7d30debb172f5062bba/response.json';
    let body: any = {};
    // Change to POST once integrated with service
    return this    .http
    .get(url, body)
    .map(this.extractData)
    .catch(this.handleError);
  }

  public getMasterTags(): Observable<any> {
    let url: string = 'https://recommender.api.prod-preview.openshift.io/api/v1/master-tags/maven';
    this.headers.set('Authorization', 'Bearer ' + 'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJ6RC01N29CRklNVVpzQVdxVW5Jc1Z1X3g3MVZJamQxaXJHa0dVT2lUc0w4In0.eyJqdGkiOiI1NGMzZmVjZC1mMjNiLTQzYjUtYWE2YS1kY2I2MmUzNDNkNTMiLCJleHAiOjE1MTUzMjQ0MjgsIm5iZiI6MCwiaWF0IjoxNTEyNzMyNDI4LCJpc3MiOiJodHRwczovL3Nzby5wcm9kLXByZXZpZXcub3BlbnNoaWZ0LmlvL2F1dGgvcmVhbG1zL2ZhYnJpYzgiLCJhdWQiOiJmYWJyaWM4LW9ubGluZS1wbGF0Zm9ybSIsInN1YiI6ImM1NjA0MmIyLWE2MDItNDUxYi05MzY2LTcxNjVkZjRiOWEwOCIsInR5cCI6IkJlYXJlciIsImF6cCI6ImZhYnJpYzgtb25saW5lLXBsYXRmb3JtIiwiYXV0aF90aW1lIjoxNTEyNzA5NDU1LCJzZXNzaW9uX3N0YXRlIjoiY2U2MThiYWEtMTc1OS00Yzg4LTk5ZjktZDIyNWNkNTkzZWY2IiwiYWNyIjoiMCIsImFsbG93ZWQtb3JpZ2lucyI6WyJodHRwczovL3Byb2QtcHJldmlldy5vcGVuc2hpZnQuaW8iLCJodHRwczovL2F1dGgucHJvZC1wcmV2aWV3Lm9wZW5zaGlmdC5pbyIsImh0dHA6Ly9jb3JlLXdpdC4xOTIuMTY4LjQyLjY5Lm5pcC5pbyIsImh0dHA6Ly9sb2NhbGhvc3Q6ODA4MCIsIioiLCJodHRwczovL2NvcmUtd2l0LjE5Mi4xNjguNDIuNjkubmlwLmlvIiwiaHR0cHM6Ly9hcGkucHJvZC1wcmV2aWV3Lm9wZW5zaGlmdC5pbyIsImh0dHA6Ly9sb2NhbGhvc3Q6MzAwMCIsImh0dHA6Ly9hdXRoLXdpdC4xOTIuMTY4LjQyLjY5Lm5pcC5pbyIsImh0dHBzOi8vYXV0aC13aXQuMTkyLjE2OC40Mi42OS5uaXAuaW8iLCJodHRwOi8vbG9jYWxob3N0OjgwODkiXSwicmVhbG1fYWNjZXNzIjp7InJvbGVzIjpbInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYnJva2VyIjp7InJvbGVzIjpbInJlYWQtdG9rZW4iXX0sImFjY291bnQiOnsicm9sZXMiOlsibWFuYWdlLWFjY291bnQiLCJtYW5hZ2UtYWNjb3VudC1saW5rcyIsInZpZXctcHJvZmlsZSJdfX0sImFwcHJvdmVkIjp0cnVlLCJuYW1lIjoiQXJ1bmt1bWFyIFMiLCJjb21wYW55IjoiUmVkaGF0IiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2FpbGFydW5rdW1hciIsImdpdmVuX25hbWUiOiJBcnVua3VtYXIiLCJmYW1pbHlfbmFtZSI6IlMiLCJlbWFpbCI6InNhaWwuYXJ1bmt1bWFyQGdtYWlsLmNvbSJ9.BRJnoX9fjK1mukksD2KKwSihgsWrJUtpHbvxixIZ0ScLqkstl9uL_kubANapSG910Y56ifVcDezme9dvK2Pv6NPxaEli3Kt43iQdnZkwjNzkrD7RWe96ygh7Dzf_wLb0aaNAIsFl4FKgG5MiJLaq7BNsKMKAXguUGBLvdY5k0uN_GepRu3VhtZtBo0R-w4zVDuKYFX129q3Sjyn_ByBuCUnwGfoZtiRMWvjhGG06M7KPsB5UlMb3gJFznimMlmXiK9_0sDgbPTHXq4TXRRmevh1YrVFFwip1t82Wwbwx76pZfsVa_iZgN4m0ex8DJTEe3bssHYvVpBIXPkKpeL1zfg');
    let options = new RequestOptions({ headers: this.headers });
    return this .http
    .get(url, options)
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
