import { Injectable, Inject } from '@angular/core';
import {
  HttpModule,
  Http,
  Headers,
  Response,
  RequestOptions
} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import { Observer } from 'rxjs/Observer';


@Injectable()
export class ApplicationServices {
  private headers: Headers = new Headers({
    'Content-Type': 'application/json'
  });
  
  constructor(private http: Http) {}
  
  private extractData(res: Response) {
    const body = res.json() || {};
    body['statusCode'] = res.status;
    body['statusText'] = res.statusText;
    return body;
  }
  
  public intialConfig(ecosystem: string) {
    let url = "https://forge.api.openshift.io/api/launchpad/commands/fabric8-new-project/validate";
    let body: any = {};
    return this.http
      .get(url, body)
      .map(this.extractData)
      .catch(this.handleError);
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