import { ApiLocatorService } from './api-locator.service';
import { REALM } from 'ngx-login-client';

let realmFactory = (api: ApiLocatorService) => {
  return api.realm;
};

export let realmProvider: any = {
  provide: REALM,
  useFactory: realmFactory,
  deps: [ApiLocatorService]
};
