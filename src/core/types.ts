import { HTTPAlias } from 'got/dist/source/create';
import { CancelableRequest, Response, Options } from 'got/dist/source';
import { ProxyStream } from 'got/dist/source/as-stream';

type Except<ObjectType, KeysType extends keyof ObjectType> = Pick<ObjectType, Exclude<keyof ObjectType, KeysType>>;
type Merge<FirstType, SecondType> = Except<FirstType, Extract<keyof FirstType, keyof SecondType>> & SecondType;

declare type OptionsOfTextResponseBody = Merge<ISPRequestOptions, {
  isStream?: false;
  resolveBodyOnly?: false;
  responseType: 'text';
}>;
declare type OptionsOfJSONResponseBody = Merge<ISPRequestOptions, {
  isStream?: false;
  resolveBodyOnly?: false;
  responseType: 'json';
}>;
declare type OptionsOfBufferResponseBody = Merge<ISPRequestOptions, {
  isStream?: false;
  resolveBodyOnly?: false;
  responseType: 'buffer';
}>;
declare type ResponseBodyOnly = {
  resolveBodyOnly: true;
};

export interface GotRequestMethod {
  <T = any>(url: string | OptionsOfJSONResponseBody, options?: OptionsOfJSONResponseBody): CancelableRequest<Response<T>>;
  (url: string | OptionsOfTextResponseBody, options?: OptionsOfTextResponseBody): CancelableRequest<Response<string>>;
  (url: string | OptionsOfBufferResponseBody, options?: OptionsOfBufferResponseBody): CancelableRequest<Response<Buffer>>;
  <T = any>(url: string | Merge<OptionsOfJSONResponseBody, ResponseBodyOnly>, options?: Merge<OptionsOfJSONResponseBody, ResponseBodyOnly>): CancelableRequest<T>;
  (url: string | Merge<OptionsOfTextResponseBody, ResponseBodyOnly>, options?: Merge<OptionsOfTextResponseBody, ResponseBodyOnly>): CancelableRequest<string>;
  (url: string | Merge<OptionsOfBufferResponseBody, ResponseBodyOnly>, options?: Merge<OptionsOfBufferResponseBody, ResponseBodyOnly>): CancelableRequest<Buffer>;
  <T>(url: string | Merge<ISPRequestOptions, {
    isStream: true;
  }>, options?: Merge<ISPRequestOptions, {
    isStream: true;
  }>): ProxyStream<T>;
  <T = any>(url: string | Merge<ISPRequestOptions, { body?: any; resolveBodyOnly: true }>, options?: Merge<ISPRequestOptions, { body?: any; resolveBodyOnly: true }>): CancelableRequest<T>;
  <T = any>(url: string | Merge<ISPRequestOptions, { body?: any }>, options?: Merge<ISPRequestOptions, { body?: any }>): CancelableRequest<Response<T>>;
}

export interface ISPRequest extends Record<HTTPAlias, GotRequestMethod>, GotRequestMethod {
  requestDigest: (url: string) => Promise<string>;
}

export interface ISPRequestOptions extends Omit<Options, 'body'> {
  body?: any;
}
