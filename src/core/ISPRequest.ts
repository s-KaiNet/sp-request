import {OptionsWithUrl, CoreOptions} from 'request';
import {IncomingMessage} from 'http';
import './IncomingMessageWithBody';
import * as Promise from 'bluebird';

export interface ISPRequest {
  (opts: OptionsWithUrl): Promise<IncomingMessage>;
  (url: string): Promise<IncomingMessage>;
  (url: string, opts: CoreOptions): Promise<IncomingMessage>;

  get(opts: OptionsWithUrl): Promise<IncomingMessage>;
  get(url: string): Promise<IncomingMessage>;
  get(url: string, opts: CoreOptions): Promise<IncomingMessage>;

  post(opts: OptionsWithUrl): Promise<IncomingMessage>;
  post(url: string): Promise<IncomingMessage>;
  post(url: string, opts: CoreOptions): Promise<IncomingMessage>;

  requestDigest(url: string): Promise<string>;
}
