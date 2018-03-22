import { ApiLocatorService } from './api-locator.service';
import { SSO_API_URL } from 'ngx-login-client';

export let ssoApiUrlFactory = function (api: ApiLocatorService) {
  return api.witApiUrl;
};

export let ssoApiUrlProvider: any = {
  provide: SSO_API_URL,
  useFactory: ssoApiUrlFactory,
  deps: [ApiLocatorService]
};
