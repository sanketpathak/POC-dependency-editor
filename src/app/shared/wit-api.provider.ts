import { ApiLocatorService } from './api-locator.service';
import { WIT_API_URL } from 'ngx-fabric8-wit';

export function witApiUrlFactory (api: ApiLocatorService) {
  return api.witApiUrl;
}

export let witApiUrlProvider: any = {
  provide: WIT_API_URL,
  useFactory: witApiUrlFactory,
  deps: [ApiLocatorService]
};
