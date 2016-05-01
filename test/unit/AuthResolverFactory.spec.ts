import {expect} from 'chai';

import {AuthResolverFactory} from './../../src/core/auth/AuthResolverFactory';
import {IAuthOptions} from './../../src/core/auth/IAuthOptions';
import {IUserCredentials} from './../../src/core/interfaces/IUserCredentials';
import {IEnvironment} from './../../src/core/interfaces/IEnvironment';
import {IOAuthCredentials} from './../../src/core/interfaces/IOAuthCredentials';
import {OnPremResolver} from './../../src/core/auth/OnPremResolver';
import {OnlineResolver} from './../../src/core/auth/OnlineResolver';
import {OAuthResolver} from './../../src/core/auth/OAuthResolver';
import {IAuthResolver} from './../../src/core/auth/IAuthResolver';

let creds: IUserCredentials = {
  username: 'user',
  password: 'pass'
};

let oauthCreds: IOAuthCredentials = {
  clientId: 'clientId',
  clientSecret: 'clientSecret'
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

let oauthOptions: IAuthOptions = {
  credentials: oauthCreds,
  options: {
    url: 'https://sp2013dev.sharepoint.com/sites/dev/_api'
  },
  env: undefined
};

describe('sp-request: AuthResolverFactory tests', () => {
  it('should return on-premise resolver', () => {
    let resolver: IAuthResolver = AuthResolverFactory.Resolve(onpremOptions);

    expect(resolver instanceof OnPremResolver).is.true;
  });

  it('should return online resolver', () => {
    let resolver: IAuthResolver = AuthResolverFactory.Resolve(onlineOptions);

    expect(resolver instanceof OnlineResolver).is.true;
  });

  it('should return OAuth resolver', () => {
    let resolver: IAuthResolver = AuthResolverFactory.Resolve(oauthOptions);

    expect(resolver instanceof OAuthResolver).is.true;
  });
});
