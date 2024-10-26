export const DOMAIN = 'https://jsonplaceholder.typicode.com/';

export type ClassInstance = new(...args: any[]) => any;

type FetchOptions = {
  url?: any;
  method?: any;
  params?: any;
  data?: any;
  config?: any;
}

export type FetchResultOptions = {
  mapTo?: ClassInstance;
  valueOnError?: any;
}


export function GET<T = any>(url: string, options: FetchResultOptions = {}) {
  return <R>(params?: T) => {
    return constructHttpRequest({ url, method: 'GET', params, config: options, data: null }) as Promise<R>;
  };
}

export function POST<B = any, T = any>(url: string, options: FetchResultOptions = {}) {
  return <R>(body?: B, params?: T) => {
    return constructHttpRequest({ url, method: 'POST', params, config: options, data: body }) as Promise<R>;
  };
}

export function PUT<B = any, T = any>(url: string, options: FetchResultOptions = {}) {
  return <R>(body?: B, params?: T) => {
    return constructHttpRequest({ url, method: 'PUT', params, config: options, data: body }) as Promise<R>;
  };
}

export function DELETE<T = any>(url: string, options: FetchResultOptions = {}) {
  return <R>(params?: T) => {
    return constructHttpRequest({ url, method: 'DELETE', params, config: options, data: null }) as Promise<R>;
  };
}

function constructHttpRequest(fetchOptions: FetchOptions & FetchResultOptions) {
  let { url, method, params, data, config, mapTo, valueOnError } = fetchOptions;
  url = new URL(url, DOMAIN);
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
  return addOperations(fetch(url, options), { mapTo, valueOnError });
}

function addOperations(fetch: Promise<any>, options: FetchResultOptions) {
  if (options.valueOnError) {
    fetch.catch(() => options.valueOnError);
  }
  if (options.mapTo) {
    fetch.then(
      res => Array.isArray(res) ?
             res.map(r => mapToClass(options.mapTo, r)) :
             mapToClass(options.mapTo, res)
    );
  }
  return fetch;
}

/*
 * Maps a value to a class instance that
 * works with both empty & data param class constructors
 * */
function mapToClass(classType: ClassInstance, value: any) {
  const newInstance = new classType();
  Object.assign(newInstance, value);
  return newInstance;
}
