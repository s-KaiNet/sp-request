declare module 'request-promise' {
    import request = require('request');
    import http = require('http');
    namespace requestPromise {
        export interface RequestPromise extends request.Request {
            then<TResult>(onfulfilled?: (value: any) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => TResult | PromiseLike<TResult>): Promise<TResult>;
            then<TResult>(onfulfilled?: (value: any) => TResult | PromiseLike<TResult>, onrejected?: (reason: any) => void): Promise<TResult>;
            catch(onrejected?: (reason: any) => any | PromiseLike<any>): Promise<any>;
            catch(onrejected?: (reason: any) => void): Promise<any>;
            finally<TResult>(handler: () => PromiseLike<TResult>): Promise<any>;
            finally<TResult>(handler: () => TResult): Promise<any>;
            promise(): Promise<any>;
        }

        export interface RequestPromiseOptions extends request.CoreOptions {
            simple?: boolean;
            transform?: (body: any, response: http.IncomingMessage) => any;
            resolveWithFullResponse?: boolean;
        }
    }
    var requestPromise: request.RequestAPI<requestPromise.RequestPromise, requestPromise.RequestPromiseOptions, request.RequiredUriUrl>;
    export = requestPromise;
}