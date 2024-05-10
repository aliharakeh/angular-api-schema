import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';

export class APIClient {
  static #http: HttpClient;

  static readonly GET = APIClient.#http.get;
  static readonly POST = APIClient.#http.post;

  static assertHttpClient() {
    if (!APIClient.#http) {
      APIClient.#http = inject(HttpClient);
    }
  }
}

export function GET<R, T = any>(url: string) {
  APIClient.assertHttpClient();
  return (params: T) => {
    const httpParams = new HttpParams({ fromObject: params as any });
    return APIClient.GET<R>(url, { params: httpParams });
  };
}

export function POST<R, B = any, T = any>(url: string) {
  APIClient.assertHttpClient();
  return (body: B, params?: T) => {
    const httpParams = new HttpParams({ fromObject: params as any });
    return APIClient.POST<R>(url, body, { params: httpParams });
  };
}
