import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export type HttpRequestOptions = {
  headers?: HttpHeaders | Record<string, string | string[]>;
  context?: HttpContext;
  observe?: 'body' | 'events' | 'response';
  params?: HttpParams | Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>;
  reportProgress?: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'text' | 'json';
  withCredentials?: boolean;
  transferCache?: { includeHeaders?: string[]; } | boolean;
}

export const DOMAIN = 'https://example.com/';

export function GET<R, T = any>(url: string) {
  APIClient.assertHttpClient();
  return (params?: T, options: HttpRequestOptions = {}) => {
    return APIClient.GET(DOMAIN + url, getHttpOptions(params, options)) as Observable<R>;
  };
}

export function POST<R, B = any, T = any>(url: string) {
  APIClient.assertHttpClient();
  return (body?: B, params?: T, options: HttpRequestOptions = {}) => {
    return APIClient.POST(DOMAIN + url, body || {}, getHttpOptions(params, options)) as Observable<R>;
  };
}

class APIClient {
  static #http: HttpClient;

  static GET: HttpClient['get'];
  static POST: HttpClient['post'];

  static assertHttpClient() {
    if (!APIClient.#http) {
      const httpClient = inject(HttpClient);
      APIClient.#http = httpClient;
      APIClient.GET = httpClient.get.bind(httpClient);
      APIClient.POST = httpClient.post.bind(httpClient);
    }
  }
}

function getHttpParams(params?: any) {
  if (!params) {
    return {};
  }
  return new HttpParams({ fromObject: params });
}

function getHttpOptions(params?: any, options: HttpRequestOptions = {}) {
  return { ...options, params: getHttpParams(params) } as any;
}
