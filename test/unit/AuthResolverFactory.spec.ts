import {expect} from 'chai';

import {AuthResolverFactory} from './../../src/core/auth/AuthResolverFactory';
import {IAuthOptions} from './../../src/core/auth/IAuthOptions';
import {IUserCredentials} from './../../src/core/auth/IUserCredentials';
import {IEnvironment} from './../../src/core/auth/IEnvironment';
import {OnPremResolver} from './../../src/core/auth/OnPremResolver';
import {OnlineResolver} from './../../src/core/auth/OnlineResolver';
import {IAuthResolver} from './../../src/core/auth/IAuthResolver';

let creds: IUserCredentials = {
  username: 'user',
  password: 'pass'
};

let env: IEnvironment = {
  domain: 'sp'
};

let onpremOptions: IAuthOptions = {
  credentials: creds,
  env: env,
  options: {
    url: 'https://sp2013dev/sites/dev/_api'
  }
};

let onlineOptions: IAuthOptions = {
  credentials: creds,
  options: {
    url: 'https://sp2013dev.sharepoint.com/sites/dev/_api'
  },
  env: undefined
};

describe('sp-request: AuthResolverFactory', () => {
  it('should return on-premise resolver', () => {
    let factory: AuthResolverFactory = new AuthResolverFactory();
    let resolver: IAuthResolver = factory.resolve(onpremOptions.options.url);

    expect(resolver instanceof OnPremResolver).is.true;
  });

  it('should return online resolver', () => {
    let factory: AuthResolverFactory = new AuthResolverFactory();
    let resolver: IAuthResolver = factory.resolve(onlineOptions.options.url);

    expect(resolver instanceof OnlineResolver).is.true;
  });
});
