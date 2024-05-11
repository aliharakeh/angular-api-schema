export const DOMAIN = 'https://example.com/';

export function GET<T = any>(url: string) {
  return <R>(params?: T, options: any = {}) => {
    return constructHttpRequest({ url, method: 'GET', params, config: options, data: null }) as Promise<R>;
  };
}

export function POST<B = any, T = any>(url: string) {
  return <R>(body?: B, params?: T, options: any = {}) => {
    return constructHttpRequest({ url, method: 'POST', params, config: options, data: body }) as Promise<R>;
  };
}

export function PUT<B = any, T = any>(url: string) {
  return <R>(body?: B, params?: T, options: any = {}) => {
    return constructHttpRequest({ url, method: 'PUT', params, config: options, data: body }) as Promise<R>;
  };
}

export function DELETE<T = any>(url: string) {
  return <R>(params?: T, options: any = {}) => {
    return constructHttpRequest({ url, method: 'DELETE', params, config: options, data: null }) as Promise<R>;
  };
}

function constructHttpRequest({ url, method, params, data, config }) {
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
  return fetch(url, options);
}
