import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';

export const DOMAIN = 'https://example.com/';

export class APIClient {
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

export function GET<R, T = any>(url: string) {
  APIClient.assertHttpClient();
  return (params?: T) => {
    const httpParams = new HttpParams({ fromObject: params as any });
    return APIClient.GET<R>(DOMAIN + url, { params: httpParams });
  };
}

export function POST<R, B = any, T = any>(url: string) {
  APIClient.assertHttpClient();
  return (body?: B, params?: T) => {
    const httpParams = new HttpParams({ fromObject: params as any });
    return APIClient.POST<R>(DOMAIN + url, body, { params: httpParams });
  };
}
