import { Observable } from 'rxjs';

export type ApiHttpMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * Api Params Type
 * */
export type ApiParams = {
  url: string;
  method: ApiHttpMethods;
  data?: Record<string, string | boolean | number>;
  params?: Record<string, string | boolean | number>;
  config?: any;
};

/**
 * Type Conversion
 * ---------------
 * We can use this helper function to create a type conversion for the request params as we need to specify
 * our own return model type instead of their type declaration that we don't need after the conversion.
 * */
export function createRequest<T>(params: ApiParams): Observable<T> {
  return params as unknown as Observable<T>;
}
