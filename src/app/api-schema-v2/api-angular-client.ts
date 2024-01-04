import { HttpClient } from '@angular/common/http';
import { inject, InjectionToken } from '@angular/core';
import { APIs, DOMAIN } from './apis';

/**
 * Proxy Handler
 */
const createHandler = (httpClient: HttpClient, parentObj: any) => ({
  get(target: any, key: string, receiver: any) {
    if (key === 'constructor' || key.startsWith('ng')) {
      return target[key];
    }
    if (typeof target[key] === 'object' && target[key] !== null) {
      return new Proxy(target[key], createHandler(httpClient, target));
    }
    if (typeof target[key] === 'function' && target[key] !== null) {
      return constructHttpRequest(httpClient, parentObj, target, key);
    }
    else {
      return target[key];
    }
  }
});

/**
 * API Calls
 * */
function constructHttpRequest(httpClient: HttpClient, parentObj: any, target: any, key: string) {
  let { url, method, params, data, config } = target[key]();
  url = DOMAIN + parentObj.baseUrl + url;
  data = data || {};
  params = { params };
  return () => {
    switch (method.toLowerCase()) {
      case 'get':
        return httpClient.get(url, params);
      case 'post':
        return httpClient.post(url, data, config);
      case 'put':
        return httpClient.put(url, data, config);
      case 'delete':
        return httpClient.delete(url, params);
      default:
        return httpClient.get(url, params);
    }
  };
}

/**
 *  API Client
 *  */
export const ApiClient = new InjectionToken<typeof APIs>('APIS', {
  providedIn: 'root',
  factory: () => {
    const http = inject(HttpClient);
    return new Proxy(APIs, createHandler(http, null));
  }
});
