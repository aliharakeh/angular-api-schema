import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, InjectionToken } from '@angular/core';
import { ApiService, typeCheck } from './api-types';
import { APIs, DOMAIN } from './apis';

/**
 * Proxy Handler
 */
const createHandler = (httpClient: HttpClient, parentObj: any = null) => ({
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
  params = new HttpParams({ fromObject: params });
  const options = { params, ...config };
  return () => {
    switch (method.toLowerCase()) {
      case 'get':
        return httpClient.get(url, options);
      case 'post':
        return httpClient.post(url, data, options);
      case 'put':
        return httpClient.put(url, data, options);
      case 'delete':
        return httpClient.delete(url, options);
      default:
        return httpClient.get(url, options);
    }
  };
}

/**
 *  API Injection Token
 *  */
export const ApiClient = new InjectionToken<ApiService>('APIS', {
  providedIn: 'root',
  factory: () => {
    const http = inject(HttpClient);
    return new Proxy(typeCheck(APIs), createHandler(http));
  }
});
