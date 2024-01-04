import { Observable } from 'rxjs';

/**
 * Api Params Type
 * */
export type ApiParams = {
  url: string;
  method: string;
  data?: any;
  params?: any;
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
