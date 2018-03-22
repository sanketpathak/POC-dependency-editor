import { ApiLocatorService } from './api-locator.service';
import { AUTH_API_URL } from 'ngx-login-client';

export let authApiUrlFactory = function (api: ApiLocatorService) {
  return api.witApiUrl;
};

export let authApiUrlProvider: any = {
  provide: AUTH_API_URL,
  useFactory: authApiUrlFactory,
  deps: [ApiLocatorService]
};
