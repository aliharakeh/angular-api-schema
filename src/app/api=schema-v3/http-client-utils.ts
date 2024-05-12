import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';

export type ClassInstance = new(...args: any[]) => any;

export type HttpUrlOptions = {
  url: string;
  baseUrl?: string;
  domain?: string;
}

export type HttpClientOptions = {
  headers?: HttpHeaders | Record<string, string | string[]>;
  context?: HttpContext;
  observe?: 'body' | 'events' | 'response';
  params?: HttpParams | Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>;
  reportProgress?: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'text' | 'json';
  withCredentials?: boolean;
  transferCache?: { includeHeaders?: string[]; } | boolean;
}

export type HttpResultOptions = {
  mapTo?: ClassInstance;
  valueOnError?: any;
}

export type FullHttpOptions = HttpUrlOptions & HttpClientOptions & HttpResultOptions;

export function GET<T = any>(options: FullHttpOptions) {
  APIClient.assertHttpClient();
  const { url, httpOptions, resultOptions } = separateHttpOptions(options);
  return <R>(params?: T) => {
    return APIClient.GET(url, getHttpOptions(params, httpOptions))
                    .pipe(...getRxjsOperators(resultOptions)) as Observable<R>;
  };
}

export function POST<B = any, T = any>(options: FullHttpOptions) {
  APIClient.assertHttpClient();
  const { url, httpOptions, resultOptions } = separateHttpOptions(options);
  return <R>(body?: B, params?: T) => {
    return APIClient.POST(url, body || {}, getHttpOptions(params, httpOptions))
                    .pipe(...getRxjsOperators(resultOptions)) as Observable<R>;
  };
}

export function PUT<B = any, T = any>(options: FullHttpOptions) {
  APIClient.assertHttpClient();
  const { url, httpOptions, resultOptions } = separateHttpOptions(options);
  return <R>(body?: B, params?: T) => {
    return APIClient.PUT(url, body || {}, getHttpOptions(params, httpOptions))
                    .pipe(...getRxjsOperators(resultOptions)) as Observable<R>;
  };
}

export function DELETE<T = any>(options: FullHttpOptions) {
  APIClient.assertHttpClient();
  const { url, httpOptions, resultOptions } = separateHttpOptions(options);
  return <R>(params?: T) => {
    return APIClient.DELETE(url, getHttpOptions(params, httpOptions))
                    .pipe(...getRxjsOperators(resultOptions)) as Observable<R>;
  };
}

class APIClient {
  static #http: HttpClient;

  static GET: HttpClient['get'];
  static POST: HttpClient['post'];
  static PUT: HttpClient['put'];
  static DELETE: HttpClient['delete'];

  static assertHttpClient() {
    if (!APIClient.#http) {
      const httpClient = inject(HttpClient);
      APIClient.#http = httpClient;
      APIClient.GET = httpClient.get.bind(httpClient);
      APIClient.POST = httpClient.post.bind(httpClient);
      APIClient.PUT = httpClient.put.bind(httpClient);
      APIClient.DELETE = httpClient.delete.bind(httpClient);
    }
  }
}

function separateHttpOptions(options: FullHttpOptions) {
  const { mapTo, valueOnError, url, baseUrl, domain, ...httpOptions } = options;
  return { httpOptions, resultOptions: { mapTo, valueOnError }, url: `${domain}${baseUrl}${url}` };
}

function getHttpOptions(params?: any, options: HttpClientOptions = {}) {
  return { ...options, params: getHttpParams(params) } as any;
}

function getHttpParams(params?: any) {
  return params ? new HttpParams({ fromObject: params }) : {};
}

function getRxjsOperators(options: HttpResultOptions = {}) {
  const operators: any[] = [];
  if (options.valueOnError) {
    operators.push(catchError(() => of(options.valueOnError)));
  }
  if (options.mapTo) {
    operators.push(
      map(
        res => Array.isArray(res) ?
               res.map(r => mapToClass(options.mapTo, r)) :
               mapToClass(options.mapTo, res)
      )
    );
  }
  return operators as []; // use as [] to fix spread operator (...) type issue in pipe
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
