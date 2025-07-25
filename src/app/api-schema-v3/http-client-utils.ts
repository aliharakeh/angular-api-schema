import {
  HttpClient,
  HttpContext,
  HttpHeaders,
  HttpParams,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export type ClassInstance = new (...args: any[]) => any;

export type HttpUrlOptions = {
  /**
   * request endpoint
   * */
  url: string | ((...pathParams: string[]) => string);
  /**
   * request base url
   * */
  baseUrl?: () => string;
  /**
   * url path param keys in the order they appear in the url
   * <br>
   * * required if url is a function
   * */
  pathParams?: string[];
};

export type HttpClientOptions = {
  headers?: HttpHeaders | Record<string, string | string[]>;
  context?: HttpContext;
  observe?: 'body' | 'events' | 'response';
  fixedParams?: Record<
    string,
    string | number | boolean | ReadonlyArray<string | number | boolean>
  >;
  reportProgress?: boolean;
  responseType?: 'arraybuffer' | 'blob' | 'text' | 'json';
  withCredentials?: boolean;
  transferCache?: { includeHeaders?: string[] } | boolean;
};

export type HttpResultOptions = {
  /**
   * pick what response field to extract
   * */
  pick?: string;
  /**
   * catch error & return a default value
   * */
  valueOnError?: any;
  /*
   * pipe operators to apply to the response
   * */
  pipe?: any[];
};

export type FullHttpOptions = HttpUrlOptions &
  HttpClientOptions &
  HttpResultOptions;
export type ExtendedFullHttpOptions = FullHttpOptions & {
  bodyType?: 'json' | 'form-data';
};

export function injectHttpHelpers() {
  const httpClient = inject(HttpClient);

  function GET<T = void>(options: FullHttpOptions) {
    return <R = any>(params: T) =>
      httpRequest(
        httpClient.get.bind(httpClient),
        options,
        params
      ) as Observable<R>;
  }

  function POST<B = void, T = void>(options: ExtendedFullHttpOptions) {
    return <R = any>(body: B, params: T) =>
      httpBodyRequest(
        httpClient.post.bind(httpClient),
        options,
        params,
        body
      ) as Observable<R>;
  }

  function PUT<B = void, T = void>(options: ExtendedFullHttpOptions) {
    return <R = any>(body: B, params: T) =>
      httpBodyRequest(
        httpClient.put.bind(httpClient),
        options,
        params,
        body
      ) as Observable<R>;
  }

  function DELETE<T = void>(options: FullHttpOptions) {
    return <R = any>(params: T) =>
      httpRequest(
        httpClient.delete.bind(httpClient),
        options,
        params
      ) as Observable<R>;
  }

  return {
    GET,
    POST,
    PUT,
    DELETE,
  };
}

function httpRequest(
  httpMethod: (...args: any) => Observable<any>,
  options: FullHttpOptions,
  params: any
) {
  params = params ?? {};
  const { url, baseUrl, pathParams, httpOptions, resultOptions } =
    separateHttpOptions(options);
  const request_url = getUrl(url, baseUrl(), params, pathParams);
  const request_options = getHttpOptions(params, pathParams, httpOptions);
  const rxOperators = getRxjsOperators(resultOptions);
  return httpMethod(request_url, request_options).pipe(...rxOperators);
}

function httpBodyRequest(
  httpRequest: (...args: any) => Observable<any>,
  options: ExtendedFullHttpOptions,
  params: any,
  body: any
) {
  params = params ?? {};
  const { url, baseUrl, pathParams, httpOptions, resultOptions } =
    separateHttpOptions(options);
  const request_url = getUrl(url, baseUrl(), params, pathParams);
  const request_body = getBodyData(body, options.bodyType);
  const request_options = getHttpOptions(params, pathParams, httpOptions);
  const rxOperators = getRxjsOperators(resultOptions);
  return httpRequest(request_url, request_body, request_options).pipe(
    ...rxOperators
  );
}

function separateHttpOptions(options: FullHttpOptions) {
  const { valueOnError, pipe, pick, url, baseUrl, pathParams, ...httpOptions } =
    options;
  return {
    httpOptions,
    resultOptions: { valueOnError, pipe, pick },
    url: url,
    baseUrl: baseUrl || (() => ''),
    pathParams: pathParams || [],
  };
}

function getUrl(
  url: string | Function,
  baseUrl: string,
  params: any,
  pathParams: string[]
) {
  return (
    baseUrl +
    (typeof url === 'string' ? url : url(...pathParams.map((p) => params[p])))
  );
}

function getHttpOptions(
  params: any,
  pathParams: string[],
  options: HttpClientOptions = {}
) {
  return {
    ...options,
    params: getHttpParams(params, pathParams, options.fixedParams),
  } as any;
}

function getHttpParams(params: any, pathParams: string[], fixedParams: any) {
  if (params) {
    params = Object.fromEntries(
      Object.entries(params).filter(([k, _]) => !pathParams.includes(k))
    );
  }
  const paramsObj = { ...params, ...fixedParams };
  let httpParams = new HttpParams();
  Object.keys(paramsObj).forEach((key) => {
    const value = paramsObj[key];
    httpParams = httpParams.set(key, value.toString());
  });
  return httpParams;
}

function getBodyData(data: any, type: 'json' | 'form-data') {
  type = type || 'json';
  if (!data) {
    return type === 'json' ? {} : new FormData();
  }
  if (type === 'json') {
    return data;
  }
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    formData.append(key, data[key]);
  });
  return formData;
}

function getRxjsOperators(options: HttpResultOptions = {}) {
  const operators: any[] = [];
  const { valueOnError, pick, pipe } = options;

  if (pick) {
    operators.push(
      map((res: any) => {
        if (!res || !Object.hasOwn(res, pick)) {
          throw new Error(
            `'${pick}' is not a valid property of the response result`
          );
        }
        return res[pick];
      })
    );
  }

  if (valueOnError) {
    const errorValue = pick ? { [pick]: valueOnError } : valueOnError;
    operators.push(
      catchError((err) => {
        console.error(err);
        return of(errorValue);
      })
    );
  }

  if (pipe) {
    operators.push(...pipe);
  }

  return operators as []; // use as [] to fix spread operator (...) type issue in pipe
}
