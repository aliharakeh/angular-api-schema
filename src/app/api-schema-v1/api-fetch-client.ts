import { typeCheck } from './api-types';
import { APIs, DOMAIN } from './apis';

/**
 * Proxy Handler
 */
const createHandler = (parentObj: any = null) => ({
  get(target: any, key: string, receiver: any) {
    if (key === 'constructor' || key.startsWith('ng')) {
      return target[key];
    }
    if (typeof target[key] === 'object' && target[key] !== null) {
      return new Proxy(target[key], createHandler(target));
    }
    if (typeof target[key] === 'function' && target[key] !== null) {
      return constructHttpRequest(parentObj, target, key);
    }
    else {
      return target[key];
    }
  }
});

/**
 * API Calls
 * */
function constructHttpRequest(parentObj: any, target: any, key: string) {
  let { url, method, params, data, config } = target[key]();
  url = new URL(url, DOMAIN + parentObj.baseUrl);
  url.search = new URLSearchParams(params).toString();
  method = method.toLowerCase();
  data = data || {};
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...config
    }
  };
  if (data) {
    options['body'] = JSON.stringify(data);
  }
  return () => {
    return fetch(url).then(res => res.json());
  };
}

/**
 *  API Client
 *  */
export const ApiClient = new Proxy(typeCheck(APIs), createHandler());
