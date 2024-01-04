/**
 * Api Types
 * */
import { Observable } from 'rxjs';
import { APIs } from './apis';

export type Api = Record<string, ApiEndpoint>;

export type ApiEndpoint = {
  baseUrl: string;
  requests: Record<string, ApiParamsBuilder>;
}

export type ApiParamsBuilder = (...args: any[]) => ApiParams | Observable<any>;

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

/**
 * Type Checking
 * -------------
 * We can't assign the type directly on the APIs object as we will lose the direct type inference
 * and all `keyof` will return the specified general type (ex: string) instead of the actual list of available keys
 * in the object.
 * */
export const typeCheck = (obj: Api) => obj;

/**
 * Angular Injection Token Type Inference
 * -------------------------------------
 * The use of @ts-ignore is necessary because TS is too damn naggy about its type inference although
 * these work fine. These errors are due to the split of the types into multiple parts for more
 * readability and convenience.
 * */
// @ts-ignore
type RequestType<Endpoint, Request> = typeof APIs[Endpoint]['requests'][Request];
// @ts-ignore
type RequestParams<Endpoint, Request> = Parameters<RequestType<Endpoint, Request>>;
// @ts-ignore
type RequestReturnType<Endpoint, Request> = ReturnType<RequestType<Endpoint, Request>>;
type RequestFunc<Endpoint, Request> = (...a: RequestParams<Endpoint, Request>) => RequestReturnType<Endpoint, Request>
export type ApiService = {
  [Endpoint in keyof typeof APIs]: {
    [Request in keyof typeof APIs[Endpoint]['requests']]: RequestFunc<Endpoint, Request>;
  };
}
