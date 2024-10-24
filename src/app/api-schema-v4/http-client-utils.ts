import { HttpClient, HttpContext, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { catchError, map, Observable, of } from 'rxjs';

export type ClassInstance = new(...args: any[]) => any;

export type HttpUrlOptions = {
  /**
   * request endpoint
   * */
  url: string;
  /**
   * request base url
   * */
  baseUrl?: string;
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
  /**
   * pick what response field to extract
   * */
  pick?: string;
  /**
   * map response to a class instance.
   * */
  mapTo?: ClassInstance;
  /**
   * catch error & return a default value
   * */
  valueOnError?: any;
  /*
   * pipe operators to apply to the response
   * */
  pipe?: any[];
}

export type FullHttpOptions = HttpUrlOptions & HttpClientOptions & HttpResultOptions;

export function GET<T = any, R = any>(request: { params?: T, options: FullHttpOptions }) {
  APIClient.assertHttpClient();
  const { url, httpOptions, resultOptions } = separateHttpOptions(request.options);
  return APIClient.GET(url, getHttpOptions(request.params, httpOptions))
                  .pipe(...getRxjsOperators(resultOptions)) as Observable<R>;
}

export function POST<B = any, T = any, R = any>(request: { body?: B, params?: T, options: FullHttpOptions }) {
  APIClient.assertHttpClient();
  const { url, httpOptions, resultOptions } = separateHttpOptions(request.options);
  return APIClient.POST(url, request.body || {}, getHttpOptions(request.params, httpOptions))
                  .pipe(...getRxjsOperators(resultOptions)) as Observable<R>;
}

export function PUT<B = any, T = any, R = any>(request: { body?: B, params?: T, options: FullHttpOptions }) {
  APIClient.assertHttpClient();
  const { url, httpOptions, resultOptions } = separateHttpOptions(request.options);
  return APIClient.PUT(url, request.body || {}, getHttpOptions(request.params, httpOptions))
                  .pipe(...getRxjsOperators(resultOptions)) as Observable<R>;
}

export function DELETE<T = any, R = any>(request: { params?: T, options: FullHttpOptions }) {
  APIClient.assertHttpClient();
  const { url, httpOptions, resultOptions } = separateHttpOptions(request.options);
  return APIClient.DELETE(url, getHttpOptions(request.params, httpOptions))
                  .pipe(...getRxjsOperators(resultOptions)) as Observable<R>;
}

export function createHttpResource<T = any, R = any>(loader: (params: any) => Observable<any>) {
  return (request: () => any) => rxResource<T, R>({ request, loader });
}

/**
 * API Client class that provides a singleton instance of the http client.
 * */
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
  const { mapTo, valueOnError, url, baseUrl, ...httpOptions } = options;
  return { httpOptions, resultOptions: { mapTo, valueOnError }, url: `${baseUrl}${url}` };
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
  if (options.pick) {
    operators.push(map(res => res[options.pick]));
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
  if (options.pipe) {
    operators.push(...options.pipe);
  }
  return operators as []; // use as [] to fix spread operator (...) type issue in pipe
}


/**
 * Maps a value to a class instance that
 * works with both empty & data param class constructors
 * */
function mapToClass(classType: ClassInstance, value: any) {
  const newInstance = new classType();
  Object.assign(newInstance, value);
  return newInstance;
}
